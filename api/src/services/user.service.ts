import {
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import crypto from 'crypto';
import { verify, sign } from 'jsonwebtoken';
import { Request } from 'express';

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
import {
  isPasswordOutdated,
  isPasswordValid,
  passwordToHash,
} from '../utilities/password-helpers';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { EmailAndAppUrl } from '../dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../dtos/users/confirmation-request.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { EmailService } from './email.service';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { UserViews } from '../enums/user/view-enum';
import { buildWhereClause } from '../utilities/build-user-where';
import { getPublicEmailURL } from '../utilities/get-public-email-url';
import { UserRole } from '../dtos/users/user-role.dto';
import { RequestSingleUseCode } from '../dtos/single-use-code/request-single-use-code.dto';
import { getSingleUseCode } from '../utilities/get-single-use-code';
import { UserFavoriteListing } from '../dtos/users/user-favorite-listing.dto';
import { ModificationEnum } from '../enums/shared/modification-enum';
import { CronJobService } from './cron-job.service';
import { ApplicationService } from './application.service';
import { PublicUserUpdate } from '../dtos/users/public-user-update.dto';
import { PartnerUserUpdate } from '../dtos/users/partner-user-update.dto';
import { AdvocateUserUpdate } from '../dtos/users/advocate-user-update.dto';
import { PublicUserCreate } from '../dtos/users/public-user-create.dto';
import { PartnerUserCreate } from '../dtos/users/partner-user-create.dto';
import { AdvocateUserCreate } from '../dtos/users/advocate-user-create.dto';
import { SnapshotCreateService } from './snapshot-create.service';
import { toAddHelper, toRemoveHelper } from '../utilities/snapshot-helpers';

/*
  this is the service for users
  it handles all the backend's business logic for reading/writing/deleting user data
*/

const views: Partial<Record<UserViews, Prisma.UserAccountsInclude>> = {
  base: {
    jurisdictions: true,
    userRoles: true,
  },
};

views.favorites = {
  favoriteListings: {
    select: {
      id: true,
      name: true,
    },
  },
};

views.full = {
  ...views.base,
  ...views.favorites,
  listings: true,
};

type findByOptions = {
  userId?: string;
  email?: string;
  resetToken?: string;
};

const USER_DELETION_CRON_JOB_NAME = 'USER_DELETION_CRON_STRING';
const USER_DELETION_WARN_CRON_JOB_NAME = 'USER_DELETION_WARN_CRON_JOB';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private readonly configService: ConfigService,
    private permissionService: PermissionService,
    private applicationService: ApplicationService,
    @Inject(Logger)
    private logger = new Logger(UserService.name),
    private cronJobService: CronJobService,
    private snapshotCreateService: SnapshotCreateService,
  ) {
    dayjs.extend(advancedFormat);
  }
  onModuleInit() {
    this.cronJobService.startCronJob(
      USER_DELETION_CRON_JOB_NAME,
      process.env.USER_DELETION_CRON_STRING,
      this.deleteAfterInactivity.bind(this),
    );
    this.cronJobService.startCronJob(
      USER_DELETION_WARN_CRON_JOB_NAME,
      process.env.USER_DELETION_WARN_CRON_STRING,
      this.warnUserOfDeletionCronJob.bind(this),
    );
  }

  /*
    this will get a set of users given the params passed in
    Only users with a user role of admin or jurisdictional admin can get the list of available users.
    This means we don't need to account for a user with only the partner role when it comes to accessing this function
  */
  async list(params: UserQueryParams, user: User): Promise<PaginatedUserDto> {
    const whereClause = buildWhereClause(params, user);
    const count = await this.prisma.userAccounts.count({
      where: whereClause,
    });

    // if passed in page and limit would result in no results because there aren't that many listings
    // revert back to the first page
    let page = params.page;
    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

    const rawUsers = await this.prisma.userAccounts.findMany({
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy(
        ['firstName', 'lastName'],
        [OrderByEnum.ASC, OrderByEnum.ASC],
      ),
      include: views.full,
      where: whereClause,
    });

    const users = mapTo(User, rawUsers);

    const paginationInfo = buildPaginationMetaInfo(params, count, users.length);

    return {
      items: users,
      meta: paginationInfo,
    };
  }

  /*
    this will return 1 user or error
  */
  async findOne(userId: string): Promise<User> {
    const rawUser = await this.findUserOrError(
      { userId: userId },
      UserViews.full,
    );
    return mapTo(User, rawUser);
  }

  /*
    this will update a user or error if no user is found with the Id
  */
  async update(
    dto: PublicUserUpdate | PartnerUserUpdate | AdvocateUserUpdate,
    req: Request,
  ): Promise<User> {
    const jurisdictionName = (req.headers['jurisdictionname'] as string) || '';
    const requestingUser = mapTo(User, req['user']);

    const storedUser = await this.findUserOrError(
      { userId: dto.id },
      UserViews.full,
    );

    if (dto.jurisdictions?.length) {
      // if the incoming dto has jurisdictions make sure the user has access to update users in that jurisdiction
      await Promise.all(
        dto.jurisdictions.map(async (jurisdiction) => {
          await this.permissionService.canOrThrow(
            requestingUser,
            'user',
            permissionActions.update,
            {
              id: dto.id,
              jurisdictionId: jurisdiction.id,
            },
          );
        }),
      );
    } else {
      // if the incoming dto has no jurisdictions make sure the user has access to update the user
      await this.permissionService.canOrThrow(
        requestingUser,
        'userProfile',
        permissionActions.update,
        {
          id: dto.id,
        },
      );
    }

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
          `userID ${dto.id}: incoming password doesn't match stored password`,
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

      const confirmationUrl = this.getPublicConfirmationUrl(
        dto.appUrl,
        confirmationToken,
      );

      await this.emailService.changeEmail(
        dto.jurisdictions && dto.jurisdictions[0]
          ? dto.jurisdictions[0].name
          : jurisdictionName,
        mapTo(User, storedUser),
        dto.appUrl,
        confirmationUrl,
        dto.newEmail,
      );
    }

    const transactions = [];
    await this.snapshotCreateService.createUserSnapshot(dto.id);

    // only update userRoles if something has changed
    if (dto?.userRoles && storedUser.userRoles) {
      if (
        this.isUserRoleChangeAllowed(requestingUser, dto.userRoles) &&
        !(
          dto.userRoles.isAdmin === storedUser.userRoles.isAdmin &&
          dto.userRoles.isJurisdictionalAdmin ===
            storedUser.userRoles.isJurisdictionalAdmin &&
          dto.userRoles.isPartner === storedUser.userRoles.isPartner
        )
      ) {
        transactions.push(async (transaction: PrismaClient) => {
          return transaction.userRoles.update({
            data: {
              ...dto.userRoles,
            },
            where: {
              userId: storedUser.id,
            },
          });
        });
      }
    }

    if (dto.listings?.length || storedUser.listings?.length) {
      // if the listing is stored in the db but not on the incoming dto, mark as to be removed
      const toRemove = toRemoveHelper(storedUser.listings, dto.listings);
      // if listing is on dto but not in db, we need to store it
      const toAdd = toAddHelper(storedUser.listings, dto.listings);

      if (toAdd?.length || toRemove?.length) {
        transactions.push(async (transaction: PrismaClient) => {
          return transaction.userAccounts.update({
            where: {
              id: dto.id,
            },
            data: {
              listings: {
                disconnect: toRemove?.length ? toRemove : undefined,
                connect: toAdd?.length ? toAdd : undefined,
              },
            },
          });
        });
      }
    }

    //handle address for advocated users
    let newAddressId: string | undefined;
    if (dto?.address) {
      if (dto.address?.id) {
        transactions.push(async (transactions: PrismaClient) => {
          return transactions.address.update({
            data: {
              ...dto.address,
            },
            where: {
              id: dto.address.id,
            },
          });
        });
      } else {
        transactions.push(async (transactions: PrismaClient) => {
          const newAddress = await transactions.address.create({
            data: {
              ...dto.address,
            },
          });
          newAddressId = newAddress.id;
          return newAddress;
        });
      }
    }

    // handle jurisdictions
    if (dto.jurisdictions?.length || storedUser.jurisdictions?.length) {
      // if the jurisdiction is stored in the db but not on the incoming dto, mark as to be removed
      const toRemove = toRemoveHelper(
        storedUser.jurisdictions,
        dto.jurisdictions,
      );
      // if jurisdiction is on dto but not in db, we need to store it
      const toAdd = toAddHelper(storedUser.jurisdictions, dto.jurisdictions);

      if (toAdd?.length || toRemove?.length) {
        transactions.push(async (transaction: PrismaClient) => {
          return transaction.userAccounts.update({
            where: {
              id: dto.id,
            },
            data: {
              jurisdictions: {
                connect: toAdd,
                disconnect: toRemove,
              },
            },
          });
        });
      }
    }

    transactions.push(async (transaction: PrismaClient) => {
      return transaction.userAccounts.update({
        include: views.full,
        data: {
          email: dto.email,
          agreedToTermsOfService: dto.agreedToTermsOfService,
          passwordHash: passwordHash ?? undefined,
          passwordUpdatedAt: passwordUpdatedAt ?? undefined,
          confirmationToken: confirmationToken ?? undefined,
          firstName: dto.firstName,
          middleName: dto.middleName,
          lastName: dto.lastName,
          dob: dto.dob,
          phoneNumber: dto.phoneNumber,
          title: dto.title,
          phoneType: dto.phoneType,
          phoneExtension: dto.phoneExtension,
          additionalPhoneNumber: dto.additionalPhoneNumber,
          additionalPhoneNumberType: dto.additionalPhoneNumberType,
          additionalPhoneExtension: dto.additionalPhoneExtension,
          language: dto.language,
          agency: dto?.agency?.id
            ? {
                connect: {
                  id: dto.agency.id,
                },
              }
            : undefined,
          address: newAddressId
            ? {
                connect: {
                  id: newAddressId,
                },
              }
            : undefined,
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
        },
        where: {
          id: dto.id,
        },
      });
    });

    const prismaTransactions = await this.prisma.$transaction(
      async (transaction) =>
        await Promise.all(
          transactions.map((asyncCall) => asyncCall(transaction)),
        ),
    );

    const rawUser = prismaTransactions[prismaTransactions.length - 1];

    return mapTo(User, rawUser);
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
    const storedUser = await this.findUserOrError(
      { email: dto.email },
      UserViews.full,
    );

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

      if (forPublic) {
        const confirmationUrl = this.getPublicConfirmationUrl(
          dto.appUrl,
          confirmationToken,
        );
        await this.emailService.welcome(
          storedUser.jurisdictions && storedUser.jurisdictions.length
            ? storedUser.jurisdictions[0].name
            : null,
          storedUser as unknown as User,
          dto.appUrl,
          confirmationUrl,
        );
      } else {
        const confirmationUrl = this.getPartnersConfirmationUrl(
          dto.appUrl,
          confirmationToken,
        );
        await this.emailService.invitePartnerUser(
          storedUser.jurisdictions,
          storedUser as unknown as User,
          dto.appUrl,
          confirmationUrl,
        );
      }
    }

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    sets a reset token so a user can recover their account if they forgot the password
  */
  async forgotPassword(dto: EmailAndAppUrl): Promise<SuccessDTO> {
    const storedUser = await this.findUserOrError(
      { email: dto.email },
      UserViews.full,
    );

    const isPartnerPortalUser =
      storedUser.userRoles?.isAdmin ||
      storedUser.userRoles?.isJurisdictionalAdmin ||
      storedUser.userRoles?.isLimitedJurisdictionalAdmin ||
      storedUser.userRoles?.isPartner ||
      storedUser.userRoles?.isSupportAdmin;
    const isUserSiteMatch = async () => {
      if (isPartnerPortalUser) {
        return dto.appUrl === process.env.PARTNERS_PORTAL_URL;
      } else {
        //temporary solution since users can currently log into other jurisdictions' public site
        const juris = await this.prisma.jurisdictions.findFirst({
          select: {
            id: true,
          },
          where: {
            publicUrl: dto.appUrl,
          },
        });
        return !!juris;
      }
    };
    // user on wrong site, return neutral message and don't send email
    if (!(await isUserSiteMatch())) return { success: true };

    const payload = {
      id: storedUser.id,
      exp: Number.parseInt(dayjs().add(1, 'hour').format('X')),
    };
    const resetToken = sign(payload, process.env.APP_SECRET);
    await this.prisma.userAccounts.update({
      data: {
        resetToken: resetToken,
      },
      where: {
        id: storedUser.id,
      },
    });
    await this.emailService.forgotPassword(
      storedUser.jurisdictions,
      mapTo(User, storedUser),
      dto.appUrl,
      resetToken,
    );
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
    Checks if creation should update an existing user to a new role instead of creating a new entry
  */
  async handleExistingUser(
    dto: PublicUserCreate | PartnerUserCreate | AdvocateUserCreate,
  ): Promise<User | null> {
    const existingUser = await this.prisma.userAccounts.findUnique({
      include: views.full,
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      // if attempting to recreate an existing user
      if (!existingUser.userRoles && 'userRoles' in dto) {
        // existing user && public user && user will get roles -> trying to grant partner access to a public user
        await this.snapshotCreateService.createUserSnapshot(existingUser.id);
        const res = await this.prisma.userAccounts.update({
          include: views.full,
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

        await this.snapshotCreateService.createUserSnapshot(existingUser.id);
        const res = await this.prisma.userAccounts.update({
          include: views.full,
          data: {
            jurisdictions: {
              connect: jursidictions.map((juris) => ({ id: juris.id })),
            },
            listings: {
              connect: listings.map((listing) => ({ id: listing.id })),
            },
          },
          where: {
            id: existingUser.id,
          },
        });

        return mapTo(User, res);
      } else {
        // existing user && ((partner user -> trying to recreate user) || (public user -> trying to recreate a public user))
        throw new ConflictException('emailInUse');
      }
    }

    return null;
  }

  /*
    creates a public user, and sends a welcome email with a confirmation link
  */
  async createPublicUser(
    dto: PublicUserCreate,
    sendWelcomeEmail = false,
    req: Request,
  ): Promise<User> {
    const jurisdictionName = (req.headers['jurisdictionname'] as string) || '';

    if (
      this.containsInvalidCharacters(dto.firstName) ||
      (dto.middleName && this.containsInvalidCharacters(dto.middleName)) ||
      this.containsInvalidCharacters(dto.lastName)
    ) {
      throw new ForbiddenException(
        `${dto.firstName}${dto.middleName ? ` ${dto.middleName} ` : ' '}${
          dto.lastName
        } was found to be invalid`,
      );
    }

    const recreatedUser = await this.handleExistingUser(dto);
    if (recreatedUser !== null) {
      return recreatedUser;
    }

    const passwordHash = await passwordToHash(dto.password);

    const jurisdictions:
      | {
          jurisdictions: Prisma.JurisdictionsCreateNestedManyWithoutUser_accountsInput;
        }
      | Record<string, never> = dto.jurisdictions
      ? {
          jurisdictions: {
            connect: dto.jurisdictions.map((juris) => ({
              id: juris.id,
            })),
          },
        }
      : {};

    let newUser = await this.prisma.userAccounts.create({
      data: {
        passwordHash: passwordHash,
        email: dto.email,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        dob: dto.dob,
        ...jurisdictions,
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
      include: views.full,
      data: {
        confirmationToken: confirmationToken,
      },
      where: {
        id: newUser.id,
      },
    });

    if (sendWelcomeEmail) {
      const fullJurisdiction = await this.prisma.jurisdictions.findFirst({
        where: {
          name: jurisdictionName as string,
        },
      });

      if (fullJurisdiction?.allowSingleUseCodeLogin) {
        this.requestSingleUseCode(dto, req);
      } else {
        const confirmationUrl = this.getPublicConfirmationUrl(
          dto.appUrl,
          confirmationToken,
        );
        await this.emailService.welcome(
          jurisdictionName,
          mapTo(User, newUser),
          dto.appUrl,
          confirmationUrl,
        );
      }
    }

    await this.connectUserWithExistingApplications(newUser.email, newUser.id);

    return mapTo(User, newUser);
  }

  /* 
    creates a partner user
  */
  async createPartnerUser(dto: PartnerUserCreate, req: Request) {
    const requestingUser = mapTo(User, req['user']);

    if (
      this.containsInvalidCharacters(dto.firstName) ||
      this.containsInvalidCharacters(dto.lastName)
    ) {
      throw new ForbiddenException(
        `${dto.firstName} ${dto.lastName} was found to be invalid`,
      );
    }

    await this.authorizeAction(
      requestingUser,
      mapTo(User, dto),
      permissionActions.confirm,
    );

    const recreatedUser = await this.handleExistingUser(dto);
    if (recreatedUser !== null) {
      return recreatedUser;
    }

    const passwordHash = await passwordToHash(
      crypto.randomBytes(8).toString('hex'),
    );

    const jurisdictions:
      | {
          jurisdictions: Prisma.JurisdictionsCreateNestedManyWithoutUser_accountsInput;
        }
      | Record<string, never> = dto.jurisdictions
      ? {
          jurisdictions: {
            connect: dto.jurisdictions.map((juris) => ({
              id: juris.id,
            })),
          },
        }
      : {};

    let newUser = await this.prisma.userAccounts.create({
      data: {
        passwordHash: passwordHash,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        mfaEnabled: true,
        ...jurisdictions,
        userRoles: {
          create: {
            ...dto.userRoles,
          },
        },
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
      include: views.full,
      data: {
        confirmationToken: confirmationToken,
      },
      where: {
        id: newUser.id,
      },
    });

    const confirmationUrl = this.getPartnersConfirmationUrl(
      this.configService.get('PARTNERS_PORTAL_URL'),
      confirmationToken,
    );

    await this.emailService.invitePartnerUser(
      dto.jurisdictions,
      mapTo(User, newUser),
      this.configService.get('PARTNERS_PORTAL_URL'),
      confirmationUrl,
    );

    return mapTo(User, newUser);
  }

  /*
    creates an advocate user, and sends a welcome email with a confirmation link
   */
  async createAdvocateUser(
    dto: AdvocateUserCreate,
    sendWelcomeEmail = false,
    req: Request,
  ) {
    const jurisdictionName = (req.headers['jurisdictionname'] as string) || '';

    if (
      this.containsInvalidCharacters(dto.firstName) ||
      (dto.middleName && this.containsInvalidCharacters(dto.middleName)) ||
      this.containsInvalidCharacters(dto.lastName)
    ) {
      throw new ForbiddenException(
        `${dto.firstName}${dto.middleName ? ` ${dto.middleName} ` : ' '}${
          dto.lastName
        } was found to be invalid`,
      );
    }

    const recreatedUser = await this.handleExistingUser(dto);
    if (recreatedUser !== null) {
      return recreatedUser;
    }

    const passwordHash = await passwordToHash(
      crypto.randomBytes(8).toString('hex'),
    );

    const jurisdictions:
      | {
          jurisdictions: Prisma.JurisdictionsCreateNestedManyWithoutUser_accountsInput;
        }
      | Record<string, never> = dto.jurisdictions
      ? {
          jurisdictions: {
            connect: dto.jurisdictions.map((juris) => ({
              id: juris.id,
            })),
          },
        }
      : {};

    let newUser = await this.prisma.userAccounts.create({
      data: {
        passwordHash: passwordHash,
        email: dto.email,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        agency: {
          connect: {
            id: dto.agency.id,
          },
        },
        isAdvocate: true,
        ...jurisdictions,
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
      include: views.full,
      data: {
        confirmationToken: confirmationToken,
      },
      where: {
        id: newUser.id,
      },
    });

    if (sendWelcomeEmail) {
      const fullJurisdiction = await this.prisma.jurisdictions.findFirst({
        where: {
          name: jurisdictionName as string,
        },
      });

      if (fullJurisdiction?.allowSingleUseCodeLogin) {
        this.requestSingleUseCode(dto, req);
      } else {
        const confirmationUrl = this.getPublicConfirmationUrl(
          dto.appUrl,
          confirmationToken,
        );
        await this.emailService.welcome(
          jurisdictionName,
          mapTo(User, newUser),
          dto.appUrl,
          confirmationUrl,
        );
      }
    }

    await this.connectUserWithExistingApplications(newUser.email, newUser.id);

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
  async findUserOrError(findBy: findByOptions, view?: UserViews) {
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
      include: view ? views[view] : undefined,
      where,
    });

    if (!rawUser) {
      let str = '';
      if (findBy.userId) {
        str = `id: ${findBy.userId}`;
      } else if (findBy.email) {
        str = `email: ${findBy.email}`;
      }
      throw new NotFoundException(`user ${str} was requested but not found`);
    }

    return rawUser;
  }

  async authorizeAction(
    requestingUser: User,
    targetUser: User,
    action: permissionActions,
  ): Promise<void> {
    if (!requestingUser) {
      throw new UnauthorizedException(
        `User attempted ${action} wihtout being signed in`,
      );
    }

    if (!requestingUser.userRoles?.isJurisdictionalAdmin) {
      // if its an admin, partner, or a user without roles
      await this.permissionService.canOrThrow(requestingUser, 'user', action, {
        id: targetUser.id,
      });
    } else if (targetUser.userRoles?.isAdmin) {
      // if its a jurisdictional admin trying to perform an action on an admin user
      throw new ForbiddenException(
        `a jurisdictional admin is attempting to ${action} an admin user`,
      );
    } else {
      // jurisdictional admins should only be allowed to perform an action on a user if they share a jurisdiction
      const requesterJurisdictions = requestingUser.jurisdictions?.map(
        (juris) => juris.id,
      );
      const targetJurisdictions = targetUser.jurisdictions?.map(
        (juris) => juris.id,
      );

      if (
        !requesterJurisdictions.some((juris) =>
          targetJurisdictions.includes(juris),
        )
      ) {
        throw new ForbiddenException(
          `a jurisdictional admin is attempting to ${action} a user they do not share a jurisdiction with`,
        );
      }
    }
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
    return getPublicEmailURL(appUrl, confirmationToken);
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
    return (
      incomingJurisdictions.reduce((misMatched, jurisdiction) => {
        if (
          !existingJurisdictions?.some(
            (existingJuris) => existingJuris.id === jurisdiction.id,
          )
        ) {
          misMatched.push(jurisdiction.id);
        }
        return misMatched;
      }, []).length > 0
    );
  }

  containsInvalidCharacters(value: string): boolean {
    return value.includes('.') || value.includes('http');
  }

  isUserRoleChangeAllowed(
    requestingUser: User,
    userRoleChange: UserRole,
  ): boolean {
    if (requestingUser?.userRoles?.isAdmin) {
      return true;
    } else if (requestingUser?.userRoles?.isJurisdictionalAdmin) {
      if (userRoleChange?.isAdmin) {
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   *
   * @param dto the incoming request with the email
   * @returns a SuccessDTO always, and if the user exists it will send a code to the requester
   */
  async requestSingleUseCode(
    dto: RequestSingleUseCode,
    req: Request,
  ): Promise<SuccessDTO> {
    const user = await this.prisma.userAccounts.findFirst({
      where: { email: dto.email },
      include: {
        jurisdictions: true,
      },
    });
    if (!user) {
      return { success: true };
    }
    if (isPasswordOutdated(user.passwordValidForDays, user.passwordUpdatedAt)) {
      // if password TTL is expired
      throw new UnauthorizedException(
        `user ${user.id} attempted to login, but password is no longer valid`,
      );
    }

    const jurisdictionName = req?.headers?.jurisdictionname;
    if (!jurisdictionName) {
      throw new BadRequestException(
        'jurisdictionname is missing from the request headers',
      );
    }

    const juris = await this.prisma.jurisdictions.findFirst({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
        name: true,
      },
      where: {
        name: jurisdictionName as string,
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });

    if (!juris) {
      throw new BadRequestException(
        `Jurisidiction ${jurisdictionName} does not exists`,
      );
    }

    const singleUseCode = getSingleUseCode(
      Number(process.env.MFA_CODE_LENGTH),
      user.singleUseCode,
      user.singleUseCodeUpdatedAt,
      Number(process.env.MFA_CODE_VALID),
    );
    await this.prisma.userAccounts.update({
      data: {
        singleUseCode,
        singleUseCodeUpdatedAt: new Date(),
      },
      where: {
        id: user.id,
      },
    });

    await this.emailService.sendSingleUseCode(
      mapTo(User, user),
      singleUseCode,
      juris.name,
    );

    return { success: true };
  }

  /**
   * Returns the names & ids of any listings a user has favorited
   * @param userId - typically the user who is logged in
   * @returns an array of Id DTOs
   */
  async favoriteListings(userId: string): Promise<IdDTO[]> {
    const rawUser = await this.findUserOrError(
      { userId: userId },
      UserViews.favorites,
    );

    return mapTo(IdDTO, rawUser.favoriteListings);
  }

  async modifyFavoriteListings(dto: UserFavoriteListing, requestingUser: User) {
    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!listing) {
      throw new NotFoundException(
        `listingId ${dto.id} was requested but not found`,
      );
    }

    let dataClause;
    switch (dto.action) {
      case ModificationEnum.add:
        dataClause = {
          connect: { id: dto.id },
        };
        break;
      case ModificationEnum.remove:
        dataClause = {
          disconnect: { id: dto.id },
        };
        break;
    }

    const rawResults = await this.prisma.userAccounts.update({
      data: {
        favoriteListings: dataClause,
      },
      include: views.full,
      where: {
        id: requestingUser.id,
      },
    });

    return mapTo(User, rawResults);
  }

  private async deleteUserAndRelatedInfo(
    user: User,
    removePIIFromApplications?: boolean,
  ) {
    if (removePIIFromApplications) {
      const applications = await this.prisma.applications.findMany({
        select: { id: true },
        where: { userId: user.id },
      });
      for (const application of applications) {
        await this.applicationService.removePII(application.id);
      }
    }

    if (user.userRoles) {
      await this.prisma.userRoles.delete({
        where: {
          userId: user.id,
        },
      });
    }

    await this.prisma.userAccounts.delete({
      where: {
        id: user.id,
      },
    });
  }

  /*
    this will delete a user or error if no user is found with the Id
  */
  async delete(
    userId: string,
    requestingUser: User,
    shouldDeleteApplications?: boolean,
  ): Promise<SuccessDTO> {
    const targetUser = await this.findUserOrError(
      { userId: userId },
      UserViews.base,
    );

    this.authorizeAction(
      requestingUser,
      mapTo(User, targetUser),
      permissionActions.delete,
    );

    await this.deleteUserAndRelatedInfo(
      mapTo(User, targetUser),
      shouldDeleteApplications,
    );

    return {
      success: true,
    } as SuccessDTO;
  }

  async deleteAfterInactivity(): Promise<SuccessDTO> {
    if (
      !this.configService.get('USERS_DAYS_TILL_EXPIRY') ||
      isNaN(Number(this.configService.get('USERS_DAYS_TILL_EXPIRY')))
    ) {
      this.logger.warn(
        'USERS_DAYS_TILL_EXPIRY variable is not set so deleteAfterInactivity will not run',
      );
      return { success: false } as SuccessDTO;
    }
    const deleteBeforeDate = dayjs(new Date())
      .subtract(
        Number(this.configService.get('USERS_DAYS_TILL_EXPIRY')),
        'days',
      )
      .toDate();
    const usersToBeDeleted = await this.prisma.userAccounts.findMany({
      select: { id: true, wasWarnedOfDeletion: true },
      where: { lastLoginAt: { lt: deleteBeforeDate }, userRoles: null },
    });

    for (const user of usersToBeDeleted) {
      if (!user.wasWarnedOfDeletion) {
        this.logger.warn(
          `Unable to delete user ${user.id} because they have not been warned by email`,
        );
      } else {
        await this.deleteUserAndRelatedInfo(mapTo(User, user), true);
      }
    }

    return { success: true } as SuccessDTO;
  }

  /**
   * Cron job for sending emails to users that have not logged in to the system in USERS_DAYS_TILL_EXPIRY
   * informing them their account will be deleted in 30 days
   */
  async warnUserOfDeletionCronJob(): Promise<SuccessDTO> {
    if (
      this.configService.get('USERS_DAYS_TILL_EXPIRY') &&
      !isNaN(Number(this.configService.get('USERS_DAYS_TILL_EXPIRY')))
    ) {
      await this.cronJobService.markCronJobAsStarted(
        USER_DELETION_WARN_CRON_JOB_NAME,
      );
      // warning the user 30 days before the user account will be deleted
      const warnDateNumber =
        Number(this.configService.get('USERS_DAYS_TILL_EXPIRY')) - 30;
      const warnDate = dayjs(new Date())
        .subtract(warnDateNumber, 'days')
        .toDate();
      const users = await this.prisma.userAccounts.findMany({
        include: {
          jurisdictions: true,
        },
        where: {
          lastLoginAt: { lte: warnDate },
          userRoles: null,
          wasWarnedOfDeletion: false,
        },
      });
      this.logger.warn(`warning ${users.length} users of account deletion`);
      for (const user of users) {
        try {
          await this.emailService.warnOfAccountRemoval(mapTo(User, user));
          await this.snapshotCreateService.createUserSnapshot(user.id);
          await this.prisma.userAccounts.update({
            data: { wasWarnedOfDeletion: true },
            where: { id: user.id },
          });
        } catch (e) {
          this.logger.error(e);
          this.logger.error(
            `warnUserOfDeletion email failed for user ${user.id}`,
          );
        }
      }
    } else {
      this.logger.warn(
        'USERS_DAYS_TILL_EXPIRY not set so warnUserOfDeletion cron job not run',
      );
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }
}
