import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';
import { PrismaService } from './prisma.service';
import { Application } from '../dtos/applications/application.dto';
import { mapTo } from '../utilities/mapTo';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { Prisma, YesNoEnum } from '@prisma/client';
import { buildOrderBy } from '../utilities/build-order-by';
import { buildPaginationInfo } from '../utilities/build-pagination-meta';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationViews } from '../enums/applications/view-enum';
import { ApplicationUpdate } from '../dtos/applications/application-update.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { EmailService } from './email.service';
import Listing from '../dtos/listings/listing.dto';
import { User } from '../dtos/users/user.dto';

const view: Partial<Record<ApplicationViews, Prisma.ApplicationsInclude>> = {
  partnerList: {
    applicant: {
      include: {
        applicantAddress: true,
        applicantWorkAddress: true,
      },
    },
    householdMember: true,
    accessibility: true,
    applicationsMailingAddress: true,
    applicationsAlternateAddress: true,
    alternateContact: {
      include: {
        address: true,
      },
    },
  },
};

view.base = {
  ...view.partnerList,
  demographics: true,
  preferredUnitTypes: true,
  householdMember: {
    include: {
      householdMemberAddress: true,
      householdMemberWorkAddress: true,
    },
  },
};

view.details = {
  ...view.base,
  userAccounts: true,
};

/*
  this is the service for applicationss
  it handles all the backend's business logic for reading/writing/deleting application data
*/
@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /*
    this will get a set of applications given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of applications, and some meta information to help with pagination
  */
  async list(params: ApplicationQueryParams): Promise<PaginatedApplicationDto> {
    const whereClause = this.buildWhereClause(params);

    const count = await this.prisma.applications.count({
      where: whereClause,
    });

    const rawApplications = await this.prisma.applications.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy([params.orderBy], [params.order]),
      include: view[params.listingId ? 'partnerList' : 'base'],
      where: whereClause,
    });

    const applications = mapTo(Application, rawApplications);

    const promiseArray = applications.map((application) =>
      this.getDuplicateFlagsForApplication(application.id),
    );

    const flags = await Promise.all(promiseArray);
    applications.forEach((application, index) => {
      application.flagged = !!flags[index]?.id;
    });

    return {
      items: applications,
      meta: buildPaginationInfo(
        params.limit,
        params.page,
        count,
        applications.length,
      ),
    };
  }

  /*
    this builds the where clause for list()
  */
  buildWhereClause(
    params: ApplicationQueryParams,
  ): Prisma.ApplicationsWhereInput {
    const toReturn: Prisma.ApplicationsWhereInput[] = [];

    if (params.userId) {
      toReturn.push({
        userAccounts: {
          id: params.userId,
        },
      });
    }
    if (params.listingId) {
      toReturn.push({
        listingId: params.listingId,
      });
    }
    if (params.search) {
      const searchFilter: Prisma.StringFilter = {
        contains: params.search,
        mode: 'insensitive',
      };
      toReturn.push({
        OR: [
          {
            confirmationCode: searchFilter,
          },
          {
            applicant: {
              firstName: searchFilter,
            },
          },
          {
            applicant: {
              lastName: searchFilter,
            },
          },
          {
            applicant: {
              emailAddress: searchFilter,
            },
          },
          {
            applicant: {
              phoneNumber: searchFilter,
            },
          },
          {
            alternateContact: {
              firstName: searchFilter,
            },
          },
          {
            alternateContact: {
              lastName: searchFilter,
            },
          },
          {
            alternateContact: {
              emailAddress: searchFilter,
            },
          },
          {
            alternateContact: {
              phoneNumber: searchFilter,
            },
          },
        ],
      });
    }
    if (params.markedAsDuplicate !== undefined) {
      toReturn.push({
        markedAsDuplicate: params.markedAsDuplicate,
      });
    }
    return {
      AND: toReturn,
    };
  }

  /*
    this is to calculate the `flagged` property of an application
    ideally in the future we save this data on the application so we don't have to keep
    recalculating it
  */
  async getDuplicateFlagsForApplication(applicationId: string): Promise<IdDTO> {
    return this.prisma.applications.findFirst({
      select: {
        id: true,
      },
      where: {
        id: applicationId,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
  }

  /*
    this will return 1 application or error
  */
  async findOne(applicationId: string): Promise<Application> {
    const rawApplication = await this.findOrThrow(
      applicationId,
      ApplicationViews.details,
    );

    return mapTo(Application, rawApplication);
  }

  /*
    this will create an application
  */
  async create(
    dto: ApplicationCreate,
    forPublic: boolean,
    user?: User,
  ): Promise<Application> {
    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.listings.id,
      },
      include: {
        jurisdictions: true,
      },
    });
    if (forPublic) {
      // if its a public submission
      if (
        listing?.applicationDueDate &&
        dto.submissionDate > listing.applicationDueDate
      ) {
        // if the submission is after the application due date
        throw new BadRequestException(
          `Listing is not open for application submission`,
        );
      }
    }

    const rawApplication = this.prisma.applications.create({
      data: {
        ...dto,
        confirmationCode: this.generateConfirmationCode(),
        applicant: dto.applicant
          ? {
              create: {
                ...dto.applicant,
                applicantAddress: {
                  create: {
                    ...dto.applicant.applicantAddress,
                  },
                },
                applicantWorkAddress: {
                  create: {
                    ...dto.applicant.applicantWorkAddress,
                  },
                },
              },
            }
          : undefined,
        accessibility: dto.accessibility
          ? {
              create: {
                ...dto.accessibility,
              },
            }
          : undefined,
        alternateContact: dto.alternateContact
          ? {
              create: {
                ...dto.alternateContact,
                address: {
                  create: {
                    ...dto.alternateContact.address,
                  },
                },
              },
            }
          : undefined,
        applicationsAlternateAddress: dto.applicationsAlternateAddress
          ? {
              create: {
                ...dto.applicationsAlternateAddress,
              },
            }
          : undefined,
        applicationsMailingAddress: dto.applicationsMailingAddress
          ? {
              create: {
                ...dto.applicationsMailingAddress,
              },
            }
          : undefined,
        listings: dto.listings
          ? {
              connect: {
                id: dto.listings.id,
              },
            }
          : undefined,
        demographics: dto.demographics
          ? {
              create: {
                ...dto.demographics,
              },
            }
          : undefined,
        preferredUnitTypes: dto.preferredUnitTypes
          ? {
              connect: dto.preferredUnitTypes.map((unitType) => ({
                id: unitType.id,
              })),
            }
          : undefined,
        householdMember: dto.householdMember
          ? {
              create: dto.householdMember.map((member) => ({
                ...member,
                sameAddress: member.sameAddress || YesNoEnum.no,
                workInRegion: member.workInRegion || YesNoEnum.no,
                householdMemberAddress: {
                  create: {
                    ...member.householdMemberAddress,
                  },
                },
                householdMemberWorkAddress: {
                  create: {
                    ...member.householdMemberWorkAddress,
                  },
                },
              })),
            }
          : undefined,
        programs: JSON.stringify(dto.programs),
        preferences: JSON.stringify(dto.preferences),
        userAccounts: user
          ? {
              connect: {
                id: user.id,
              },
            }
          : undefined,
      },
      include: view.details,
    });

    if (dto.applicant.emailAddress && forPublic) {
      this.emailService.applicationConfirmation(
        mapTo(Listing, listing),
        dto,
        listing.jurisdictions?.publicUrl,
      );
    }

    return mapTo(Application, rawApplication);
  }

  /*
    this will update an application
    if no application has the id of the incoming argument an error is thrown
  */
  async update(dto: ApplicationUpdate): Promise<Application> {
    const rawApplication = await this.findOrThrow(dto.id);

    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    const res = await this.prisma.applications.update({
      where: {
        id: dto.id,
      },
      include: view.details,
      data: {
        ...dto,
        id: undefined,
        applicant: dto.applicant
          ? {
              create: {
                ...dto.applicant,
                applicantAddress: {
                  create: {
                    ...dto.applicant.applicantAddress,
                  },
                },
                applicantWorkAddress: {
                  create: {
                    ...dto.applicant.applicantWorkAddress,
                  },
                },
              },
            }
          : undefined,
        accessibility: dto.accessibility
          ? {
              create: {
                ...dto.accessibility,
              },
            }
          : undefined,
        alternateContact: dto.alternateContact
          ? {
              create: {
                ...dto.alternateContact,
                address: {
                  create: {
                    ...dto.alternateContact.address,
                  },
                },
              },
            }
          : undefined,
        applicationsAlternateAddress: dto.applicationsAlternateAddress
          ? {
              create: {
                ...dto.applicationsAlternateAddress,
              },
            }
          : undefined,
        applicationsMailingAddress: dto.applicationsMailingAddress
          ? {
              create: {
                ...dto.applicationsMailingAddress,
              },
            }
          : undefined,
        listings: dto.listings
          ? {
              connect: {
                id: dto.listings.id,
              },
            }
          : undefined,
        demographics: dto.demographics
          ? {
              create: {
                ...dto.demographics,
              },
            }
          : undefined,
        preferredUnitTypes: dto.preferredUnitTypes
          ? {
              connect: dto.preferredUnitTypes.map((unitType) => ({
                id: unitType.id,
              })),
            }
          : undefined,
        householdMember: dto.householdMember
          ? {
              create: dto.householdMember.map((member) => ({
                ...member,
                sameAddress: member.sameAddress || YesNoEnum.no,
                workInRegion: member.workInRegion || YesNoEnum.no,
                householdMemberAddress: {
                  create: {
                    ...member.householdMemberAddress,
                  },
                },
                householdMemberWorkAddress: {
                  create: {
                    ...member.householdMemberWorkAddress,
                  },
                },
              })),
            }
          : undefined,
        programs: JSON.stringify(dto.programs),
        preferences: JSON.stringify(dto.preferences),
      },
    });

    await this.updateListingApplicationEditTimestamp(res.listingId);
    return mapTo(Application, res);
  }

  /*
    this will mark an application as deleted by setting the deletedAt column for the application
  */
  async delete(applicationId: string): Promise<SuccessDTO> {
    const application = await this.findOrThrow(applicationId);

    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    await this.updateListingApplicationEditTimestamp(application.listingId);
    await this.prisma.applications.update({
      where: {
        id: applicationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }

  /*
    finds the requested listing or throws an error
  */
  async findOrThrow(applicationId: string, includeView?: ApplicationViews) {
    const res = await this.prisma.applications.findUnique({
      where: {
        id: applicationId,
      },
      include: view[includeView] ?? undefined,
    });

    if (!res) {
      throw new NotFoundException(
        `applicationId ${applicationId} was requested but not found`,
      );
    }

    // convert the programs and preferences back to json
    if (res.programs) {
      res.programs = JSON.parse(res.programs as string);
    }
    if (res.preferences) {
      res.preferences = JSON.parse(res.preferences as string);
    }

    return res;
  }

  /*
    updates a listing's lastApplicationUpdateAt date
  */
  async updateListingApplicationEditTimestamp(
    listingId: string,
  ): Promise<void> {
    await this.prisma.listings.update({
      where: {
        id: listingId,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });
  }

  /*
    generates a random confirmation code
  */
  generateConfirmationCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
}
