import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import crypto from 'crypto';
import { verify, sign } from 'jsonwebtoken';
import { PrismaService } from './prisma.service';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { buildOrderBy } from '../utilities/build-order-by';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { PaginatedUserDto } from '../dtos/users/paginated-user.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { UserUpdate } from '../dtos/users/user-update.dto';
import { isPasswordValid, passwordToHash } from '../utilities/password-helpers';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { EmailAndAppUrl } from '../dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../dtos/users/confirmation-request.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { UserInvite } from '../dtos/users/user-invite.dto';
import { UserCreate } from '../dtos/users/user-create.dto';

/*
  this is the service for users
  it handles all the backend's business logic for reading/writing/deleting user data
*/

const view: Prisma.UserAccountsInclude = {
  listings: true,
  jurisdictions: true,
  userRoles: true,
};

type findByOptions = {
  userId?: string;
  email?: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
    dayjs.extend(advancedFormat);
  }

  /*
    this will get a set of users given the params passed in
    Only users with a user role of admin or jurisdictional admin can get the list of available users. 
    This means we don't need to account for a user with only the partner role when it comes to accessing this function
  */
  async list(params: UserQueryParams, user: User): Promise<PaginatedUserDto> {
    const whereClause = this.buildWhereClause(params, user);
    const countQuery = this.prisma.userAccounts.count({
      where: whereClause,
    });

    const rawUsersQuery = this.prisma.userAccounts.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy(
        ['firstName', 'lastName'],
        [OrderByEnum.ASC, OrderByEnum.ASC],
      ),
      include: view,
      where: whereClause,
    });

    const [count, rawUsers] = await Promise.all([countQuery, rawUsersQuery]);

    const users = mapTo(User, rawUsers);

    const paginationInfo = buildPaginationMetaInfo(params, count, users.length);

    return {
      items: users,
      meta: paginationInfo,
    };
  }

  /*
    this helps build the where clause for the list()
  */
  buildWhereClause(
    params: UserQueryParams,
    user: User,
  ): Prisma.UserAccountsWhereInput {
    const filters: Prisma.UserAccountsWhereInput[] = [];

    if (params.search) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            email: {
              contains: params.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            listings: {
              some: {
                name: {
                  contains: params.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          },
        ],
      });
    }

    if (!params.filter?.length) {
      return {
        AND: filters,
      };
    }

    params.filter.forEach((filter) => {
      if ('isPortalUser' in filter && filter['isPortalUser']) {
        if (user?.userRoles?.isAdmin) {
          filters.push({
            OR: [
              {
                userRoles: {
                  isPartner: true,
                },
              },
              {
                userRoles: {
                  isAdmin: true,
                },
              },
              {
                userRoles: {
                  isJurisdictionalAdmin: true,
                },
              },
            ],
          });
        } else if (user?.userRoles?.isJurisdictionalAdmin) {
          filters.push({
            OR: [
              {
                userRoles: {
                  isPartner: true,
                },
              },
              {
                userRoles: {
                  isJurisdictionalAdmin: true,
                },
              },
            ],
          });
          filters.push({
            jurisdictions: {
              some: {
                id: {
                  in: user?.jurisdictions?.map((juris) => juris.id),
                },
              },
            },
          });
        }
      } else if ('isPortalUser' in filter) {
        filters.push({
          AND: [
            {
              OR: [
                {
                  userRoles: {
                    isPartner: null,
                  },
                },
                {
                  userRoles: {
                    isPartner: false,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  userRoles: {
                    isJurisdictionalAdmin: null,
                  },
                },
                {
                  userRoles: {
                    isJurisdictionalAdmin: false,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  userRoles: {
                    isAdmin: null,
                  },
                },
                {
                  userRoles: {
                    isAdmin: false,
                  },
                },
              ],
            },
          ],
        });
      }
    });
    return {
      AND: filters,
    };
  }

  /*
    this will return 1 user or error
  */
  async findOne(userId: string): Promise<User> {
    const rawUser = await this.findUserOrError({ userId: userId }, true);
    return mapTo(User, rawUser);
  }

  /*
    this will update a user or error if no user is found with the Id
  */
  async update(dto: UserUpdate): Promise<User> {
    const storedUser = await this.findUserOrError({ userId: dto.id }, false);

    /*
      TODO: perm check
    */

    let passwordHash: string;
    let passwordUpdatedAt: Date;
    if (dto.password) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          `userID ${dto.id}: request missing currentPassword`,
        );
      }
      if (
        !(await isPasswordValid(storedUser.passwordHash, dto.currentPassword))
      ) {
        throw new UnauthorizedException(
          `userID ${dto.id}: incoming current password doesn't match stored password`,
        );
      }

      passwordHash = await passwordToHash(dto.password);
      passwordUpdatedAt = new Date();
      delete dto.password;
    }

    let confirmationToken: string;
    if (dto.newEmail && dto.appUrl) {
      confirmationToken = this.createConfirmationToken(
        storedUser.id,
        dto.newEmail,
      );
      // TODO: should we be resetting confirmedAt ?
      const confirmationUrl = this.getPublicConfirmationUrl(
        dto.appUrl,
        confirmationToken,
      );
      // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)
    }

    const res = this.prisma.userAccounts.update({
      include: view,
      data: {
        passwordHash: passwordHash ?? undefined,
        passwordUpdatedAt: passwordUpdatedAt ?? undefined,
        confirmationToken: confirmationToken ?? undefined,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        dob: dto.dob,
        phoneNumber: dto.phoneNumber,
        language: dto.language,
        listings: dto.listings
          ? {
              connect: dto.listings.map((listing) => ({ id: listing.id })),
            }
          : undefined,
        jurisdictions: dto.jurisdictions
          ? {
              connect: dto.jurisdictions.map((jurisdiction) => ({
                id: jurisdiction.id,
              })),
            }
          : undefined,
        userRoles: dto.userRoles
          ? {
              create: {
                ...dto.userRoles,
              },
            }
          : undefined,
      },
      where: {
        id: dto.id,
      },
    });

    return mapTo(User, res);
  }

  /*
    this will delete a user or error if no user is found with the Id
  */
  async delete(userId: string): Promise<SuccessDTO> {
    await this.findUserOrError({ userId: userId }, false);

    // TODO: perms

    await this.prisma.userRoles.delete({
      where: {
        userId: userId,
      },
    });

    await this.prisma.userAccounts.delete({
      where: {
        id: userId,
      },
    });

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    resends a confirmation email or errors if no user matches the incoming email
    if forPublic is true then we resend a confirmation for a public site user
    if forPublic is false then we resend a confirmation for a partner site user
  */
  async resendConfirmation(
    dto: EmailAndAppUrl,
    forPublic: boolean,
  ): Promise<SuccessDTO> {
    const storedUser = await this.findUserOrError({ email: dto.email }, false);

    if (!storedUser.confirmedAt) {
      const confirmationToken = this.createConfirmationToken(
        storedUser.id,
        storedUser.email,
      );
      await this.prisma.userAccounts.update({
        data: {
          confirmationToken: confirmationToken,
        },
        where: {
          id: storedUser.id,
        },
      });

      const confirmationUrl = forPublic
        ? this.getPublicConfirmationUrl(dto.appUrl, confirmationToken)
        : this.getPartnersConfirmationUrl(dto.appUrl, confirmationToken);
      // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)
    }

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    sets a reset token so a user can recover their account if they forgot the password
  */
  async forgotPassword(dto: EmailAndAppUrl): Promise<SuccessDTO> {
    const storedUser = await this.findUserOrError({ email: dto.email }, false);

    const payload = {
      id: storedUser.id,
      exp: Number.parseInt(dayjs().add(1, 'hour').format('X')),
    };
    await this.prisma.userAccounts.update({
      data: {
        resetToken: sign(payload, process.env.APP_SECRET),
      },
      where: {
        id: storedUser.id,
      },
    });
    // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    checks to see if the confirmation token is valid
    sets the hitConfirmationUrl field on the user if the user exists
  */
  async isUserConfirmationTokenValid(
    dto: ConfirmationRequest,
  ): Promise<SuccessDTO> {
    try {
      const token = verify(dto.token, process.env.APP_SECRET) as IdDTO;

      const storedUser = await this.prisma.userAccounts.findUnique({
        where: {
          id: token.id,
        },
      });

      await this.setHitConfirmationUrl(
        storedUser?.id,
        storedUser?.confirmationToken,
        dto.token,
      );

      return {
        success: true,
      } as SuccessDTO;
    } catch (_) {
      try {
        const storedUser = await this.prisma.userAccounts.findFirst({
          where: {
            confirmationToken: dto.token,
          },
        });
        await this.setHitConfirmationUrl(
          storedUser?.id,
          storedUser?.confirmationToken,
          dto.token,
        );
      } catch (e) {
        console.error('isUserConfirmationTokenValid error = ', e);
      }
    }
  }

  /*
    Updates the hitConfirmationUrl for the user
    this is so we can tell if a user attempted to confirm their account
  */
  async setHitConfirmationUrl(
    userId: string,
    confirmationToken: string,
    token: string,
  ): Promise<void> {
    if (!userId) {
      throw new NotFoundException(
        `user confirmation token ${token} was requested but not found`,
      );
    }
    if (confirmationToken !== token) {
      throw new BadRequestException('tokenMissing');
    }
    await this.prisma.userAccounts.update({
      data: {
        hitConfirmationUrl: new Date(),
      },
      where: {
        id: userId,
      },
    });
  }

  /*
    creates a new user
    takes in either the dto for creating a public user or the dto for creating a partner user
    if forPartners is true then we are creating a partner, otherwise we are creating a public user
    if sendWelcomeEmail is true then we are sending a public user a welcome email
  */
  async create(
    dto: UserCreate | UserInvite,
    forPartners: boolean,
    sendWelcomeEmail = false,
  ): Promise<User> {
    // TODO: perms

    const existingUser = await this.prisma.userAccounts.findUnique({
      include: view,
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      // if attempting to recreate an existing user
      if (!existingUser.userRoles && 'userRoles' in dto) {
        // existing user && public user && user will get roles -> trying to grant partner access to a public user
        const res = await this.prisma.userAccounts.update({
          include: view,
          data: {
            userRoles: {
              create: {
                ...dto.userRoles,
              },
            },
            listings: {
              connect: dto.listings.map((listing) => ({ id: listing.id })),
            },
            confirmationToken:
              existingUser.confirmationToken ||
              this.createConfirmationToken(existingUser.id, existingUser.email),
            confirmedAt: null,
          },
          where: {
            id: existingUser.id,
          },
        });
        return mapTo(User, res);
      } else if (
        existingUser?.userRoles?.isPartner &&
        'userRoles' in dto &&
        dto?.userRoles?.isPartner &&
        this.jurisdictionMismatch(dto.jurisdictions, existingUser.jurisdictions)
      ) {
        // recreating a partner with jurisdiction mismatch -> giving partner a new jurisdiction
        const jursidictions = existingUser.jurisdictions
          .map((juris) => ({ id: juris.id }))
          .concat(dto.jurisdictions);

        const listings = existingUser.listings
          .map((juris) => ({ id: juris.id }))
          .concat(dto.listings);

        const res = this.prisma.userAccounts.update({
          include: view,
          data: {
            jurisdictions: {
              connect: jursidictions.map((juris) => ({ id: juris.id })),
            },
            listings: {
              connect: listings.map((listing) => ({ id: listing.id })),
            },
            userRoles: {
              create: {
                ...dto.userRoles,
              },
            },
          },
          where: {
            id: existingUser.id,
          },
        });

        return mapTo(User, res);
      } else {
        // existing user && ((partner user -> trying to recreate user) || (public user -> trying to recreate a public user))
        throw new BadRequestException('emailInUse');
      }
    }

    let passwordHash = '';
    if (forPartners) {
      passwordHash = await passwordToHash(
        crypto.randomBytes(8).toString('hex'),
      );
    } else if (dto instanceof UserCreate) {
      passwordHash = await passwordToHash(dto.password);
    }

    let newUser = await this.prisma.userAccounts.create({
      data: {
        passwordHash: passwordHash,
        email: dto.email,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        dob: dto.dob,
        phoneNumber: dto.phoneNumber,
        language: dto.language,
        mfaEnabled: forPartners,
        jurisdictions: {
          connect: dto.jurisdictions.map((juris) => ({
            id: juris.id,
          })),
        },
        userRoles:
          'userRoles' in dto
            ? {
                create: {
                  ...dto.userRoles,
                },
              }
            : undefined,
        listings: dto.listings
          ? {
              connect: dto.listings.map((listing) => ({
                id: listing.id,
              })),
            }
          : undefined,
      },
    });

    const confirmationToken = this.createConfirmationToken(
      newUser.id,
      newUser.email,
    );
    newUser = await this.prisma.userAccounts.update({
      include: view,
      data: {
        confirmationToken: confirmationToken,
      },
      where: {
        id: newUser.id,
      },
    });

    if (!forPartners && sendWelcomeEmail) {
      const confirmationUrl = this.getPublicConfirmationUrl(
        dto.appUrl,
        confirmationToken,
      );
      // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)
    } else if (
      forPartners &&
      existingUser &&
      'userRoles' in dto &&
      existingUser?.userRoles?.isPartner &&
      dto?.userRoles?.isPartner &&
      this.jurisdictionMismatch(dto.jurisdictions, existingUser.jurisdictions)
    ) {
      // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)
    } else if (forPartners) {
      // TODO: email service (https://github.com/bloom-housing/bloom/issues/3503)
    }

    if (!forPartners) {
      await this.connectUserWithExistingApplications(newUser.email, newUser.id);
    }

    return mapTo(User, newUser);
  }

  /*
    connects a newly created public user with any applications they may have already submitted
  */
  async connectUserWithExistingApplications(
    newUserEmail: string,
    newUserId: string,
  ): Promise<void> {
    const applications = await this.prisma.applications.findMany({
      where: {
        applicant: {
          emailAddress: newUserEmail,
        },
        userAccounts: null,
      },
    });

    for (const app of applications) {
      await this.prisma.applications.update({
        data: {
          userAccounts: {
            connect: {
              id: newUserId,
            },
          },
        },
        where: {
          id: app.id,
        },
      });
    }
  }

  /*
    this will return 1 user or error
    takes in a userId or email to find by, and a boolean to indicate if joins should be included
  */
  async findUserOrError(findBy: findByOptions, includeJoins: boolean) {
    const where: Prisma.UserAccountsWhereUniqueInput = {
      id: undefined,
      email: undefined,
    };
    if (findBy.userId) {
      where.id = findBy.userId;
    } else if (findBy.email) {
      where.email = findBy.email;
    }
    const rawUser = await this.prisma.userAccounts.findUnique({
      include: includeJoins ? view : undefined,
      where,
    });

    if (!rawUser) {
      throw new NotFoundException(
        `user ${findBy.userId || findBy.email} was requested but not found`,
      );
    }

    return rawUser;
  }

  /*
    encodes a confirmation token given a userId and email
  */
  createConfirmationToken(userId: string, email: string) {
    const payload = {
      id: userId,
      email,
      exp: Number.parseInt(dayjs().add(24, 'hours').format('X')),
    };
    return sign(payload, process.env.APP_SECRET);
  }

  /*
    constructs the url to confirm a public site user
  */
  getPublicConfirmationUrl(appUrl: string, confirmationToken: string) {
    return `${appUrl}?token=${confirmationToken}`;
  }

  /*
    constructs the url to confirm the partner site user
  */
  getPartnersConfirmationUrl(appUrl: string, confirmationToken: string) {
    return `${appUrl}/users/confirm?token=${confirmationToken}`;
  }

  /*
    verify that there is a jurisdictional difference between the incoming user and the existing user
  */
  jurisdictionMismatch(
    incomingJurisdictions: IdDTO[],
    existingJurisdictions: IdDTO[],
  ): boolean {
    return incomingJurisdictions?.some(
      (incomingJuris) =>
        !existingJurisdictions?.some(
          (existingJuris) => existingJuris.id === incomingJuris.id,
        ),
    );
  }
}
