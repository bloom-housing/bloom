import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';
import { Prisma, YesNoEnum } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Application } from '../dtos/applications/application.dto';
import { mapTo } from '../utilities/mapTo';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { buildOrderByForApplications } from '../utilities/build-order-by';
import { buildPaginationInfo } from '../utilities/build-pagination-meta';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationViews } from '../enums/applications/view-enum';
import { ApplicationUpdate } from '../dtos/applications/application-update.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { EmailService } from './email.service';
import { PermissionService } from './permission.service';
import Listing from '../dtos/listings/listing.dto';
import { User } from '../dtos/users/user.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { GeocodingService } from './geocoding.service';

export const view: Partial<
  Record<ApplicationViews, Prisma.ApplicationsInclude>
> = {
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
  listings: true,
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
    private permissionService: PermissionService,
    private geocodingService: GeocodingService,
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
      orderBy: buildOrderByForApplications([params.orderBy], [params.order]),
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
    // We only should display non-deleted applications
    toReturn.push({
      deletedAt: null,
    });
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
    requestingUser: User,
  ): Promise<Application> {
    if (!forPublic) {
      await this.authorizeAction(
        requestingUser,
        dto as Application,
        dto.listings.id,
        permissionActions.create,
      );
    }

    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.listings.id,
      },
      include: {
        jurisdictions: true,
        // multiselect questions and address is needed for geocoding
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: true,
          },
        },
        listingsBuildingAddress: true,
      },
    });
    // if its a public submission
    if (forPublic) {
      // SubmissionDate is time the application was created for public
      dto.submissionDate = new Date();
      // if the submission is after the application due date
      if (
        listing?.applicationDueDate &&
        dto.submissionDate > listing.applicationDueDate
      ) {
        throw new BadRequestException(
          `Listing is not open for application submission`,
        );
      }
    }

    const rawApplication = await this.prisma.applications.create({
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
        programs: dto.programs as unknown as Prisma.JsonArray,
        preferences: dto.preferences as unknown as Prisma.JsonArray,
        userAccounts: requestingUser
          ? {
              connect: {
                id: requestingUser.id,
              },
            }
          : undefined,
      },
      include: view.details,
    });

    const mappedApplication = mapTo(Application, rawApplication);
    if (dto.applicant.emailAddress && forPublic) {
      this.emailService.applicationConfirmation(
        mapTo(Listing, listing),
        dto,
        listing.jurisdictions?.publicUrl,
      );
    }
    // Update the lastApplicationUpdateAt to now after every submission
    await this.updateListingApplicationEditTimestamp(listing.id);

    // Calculate geocoding preferences after save and email sent
    if (listing.jurisdictions?.enableGeocodingPreferences) {
      try {
        void this.geocodingService.validateGeocodingPreferences(
          mappedApplication,
          mapTo(Listing, listing),
        );
      } catch (e) {
        // If the geocoding fails it should not prevent the request from completing so
        // catching all errors here
        console.warn('error while validating geocoding preferences');
      }
    }

    return mappedApplication;
  }

  /*
    this will update an application
    if no application has the id of the incoming argument an error is thrown
  */
  async update(
    dto: ApplicationUpdate,
    requestingUser: User,
  ): Promise<Application> {
    const rawApplication = await this.findOrThrow(dto.id);

    await this.authorizeAction(
      requestingUser,
      mapTo(Application, rawApplication),
      rawApplication.listingId,
      permissionActions.update,
    );

    // All connected household members should be deleted so they can be recreated in the update below.
    // This solves for all cases of deleted members, updated members, and new members
    await this.prisma.householdMember.deleteMany({
      where: {
        applicationId: dto.id,
      },
    });

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
        programs: dto.programs as unknown as Prisma.JsonArray,
        preferences: dto.preferences as unknown as Prisma.JsonArray,
      },
    });

    const listing = await this.prisma.listings.findFirst({
      where: { id: dto.id },
      include: { jurisdictions: true },
    });
    const application = mapTo(Application, res);

    // Calculate geocoding preferences after save and email sent
    if (listing.jurisdictions?.enableGeocodingPreferences) {
      try {
        void this.geocodingService.validateGeocodingPreferences(
          application,
          mapTo(Listing, listing),
        );
      } catch (e) {
        // If the geocoding fails it should not prevent the request from completing so
        // catching all errors here
        console.warn('error while validating geocoding preferences');
      }
    }

    await this.updateListingApplicationEditTimestamp(res.listingId);
    return application;
  }

  /*
    this will mark an application as deleted by setting the deletedAt column for the application
  */
  async delete(
    applicationId: string,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const application = await this.findOrThrow(applicationId);

    await this.authorizeAction(
      requestingUser,
      mapTo(Application, application),
      application.listingId,
      permissionActions.delete,
    );

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

  async authorizeAction(
    user: User,
    application: Application,
    listingId: string,
    action: permissionActions,
  ): Promise<void> {
    const listingJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: {
        listings: {
          some: {
            id: listingId,
          },
        },
      },
    });
    await this.permissionService.canOrThrow(user, 'application', action, {
      listingId,
      jurisdictionId: listingJurisdiction.id,
    });
  }

  /*
    generates a random confirmation code
  */
  generateConfirmationCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
}
