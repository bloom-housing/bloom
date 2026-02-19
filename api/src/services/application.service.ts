import crypto from 'crypto';
import dayjs from 'dayjs';
import { Request as ExpressRequest } from 'express';
import {
  ApplicationSelections,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  Prisma,
  YesNoEnum,
} from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  Inject,
  HttpException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { GeocodingService } from './geocoding.service';
import { PermissionService } from './permission.service';
import { PrismaService } from './prisma.service';
import { Application } from '../dtos/applications/application.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { ApplicationSelectionCreate } from '../dtos/applications/application-selection-create.dto';
import { ApplicationUpdate } from '../dtos/applications/application-update.dto';
import { ApplicationUpdateEmailDto } from '../dtos/applications/application-update-email.dto';
import { MostRecentApplicationQueryParams } from '../dtos/applications/most-recent-application-query-params.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { PublicAppsViewQueryParams } from '../dtos/applications/public-apps-view-params.dto';
import { PublicAppsViewResponse } from '../dtos/applications/public-apps-view-response.dto';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import Listing from '../dtos/listings/listing.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { ApplicationsFilterEnum } from '../enums/applications/filter-enum';
import { CronJobService } from './cron-job.service';
import { ApplicationViews } from '../enums/applications/view-enum';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { buildOrderByForApplications } from '../utilities/build-order-by';
import { buildPaginationInfo } from '../utilities/build-pagination-meta';
import { doJurisdictionHaveFeatureFlagSet } from '../utilities/feature-flag-utilities';
import { mapTo } from '../utilities/mapTo';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { buildApplicationStatusChanges } from '../utilities/applicationStatusChanges';

export const view: Partial<
  Record<ApplicationViews, Prisma.ApplicationsInclude>
> = {
  partnerList: {
    applicant: {
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        birthMonth: true,
        birthDay: true,
        birthYear: true,
        emailAddress: true,
        noEmail: true,
        phoneNumber: true,
        phoneNumberType: true,
        noPhone: true,
        workInRegion: true,
        fullTimeStudent: true,
        applicantAddress: {
          select: {
            id: true,
            placeName: true,
            city: true,
            county: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
            latitude: true,
            longitude: true,
          },
        },
        applicantWorkAddress: {
          select: {
            id: true,
            placeName: true,
            city: true,
            county: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    },
    householdMember: {
      select: {
        id: true,
        orderId: true,
        firstName: true,
        middleName: true,
        lastName: true,
        birthMonth: true,
        birthDay: true,
        birthYear: true,
        sameAddress: true,
        relationship: true,
        workInRegion: true,
        fullTimeStudent: true,
      },
    },
    accessibility: {
      select: {
        id: true,
        mobility: true,
        vision: true,
        hearing: true,
        other: true,
      },
    },
    applicationsMailingAddress: {
      select: {
        id: true,
        placeName: true,
        city: true,
        county: true,
        state: true,
        street: true,
        street2: true,
        zipCode: true,
        latitude: true,
        longitude: true,
      },
    },
    applicationsAlternateAddress: {
      select: {
        id: true,
        placeName: true,
        city: true,
        county: true,
        state: true,
        street: true,
        street2: true,
        zipCode: true,
        latitude: true,
        longitude: true,
      },
    },
    alternateContact: {
      select: {
        id: true,
        type: true,
        otherType: true,
        firstName: true,
        lastName: true,
        agency: true,
        phoneNumber: true,
        emailAddress: true,
        address: {
          select: {
            id: true,
            placeName: true,
            city: true,
            county: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    },
    listings: {
      select: {
        id: true,
      },
    },
    preferredUnitTypes: {
      select: {
        id: true,
        name: true,
        numBedrooms: true,
      },
    },
  },
};

view.base = {
  ...view.partnerList,
  applicationSelections: {
    include: {
      multiselectQuestion: true,
      selections: {
        include: {
          addressHolderAddress: {
            select: {
              id: true,
              placeName: true,
              city: true,
              county: true,
              state: true,
              street: true,
              street2: true,
              zipCode: true,
              latitude: true,
              longitude: true,
            },
          },
          multiselectOption: true,
        },
      },
    },
  },
  demographics: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      ethnicity: true,
      gender: true,
      sexualOrientation: true,
      howDidYouHear: true,
      race: true,
    },
  },
  listings: {
    select: {
      id: true,
      name: true,
      jurisdictions: {
        select: {
          id: true,
          name: true,
        },
      },
      listingMultiselectQuestions: true,
    },
  },
  householdMember: {
    select: {
      id: true,
      orderId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      birthMonth: true,
      birthDay: true,
      birthYear: true,
      sameAddress: true,
      relationship: true,
      workInRegion: true,
      fullTimeStudent: true,
      householdMemberAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
      householdMemberWorkAddress: {
        select: {
          id: true,
          placeName: true,
          city: true,
          county: true,
          state: true,
          street: true,
          street2: true,
          zipCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  },
};

view.details = {
  ...view.base,
  userAccounts: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
};

const PII_DELETION_CRON_JOB_NAME = 'PII_DELETION_CRON_STRING';

/*
  this is the service for applications
  it handles all the backend's business logic for reading/writing/deleting application data
*/
@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private permissionService: PermissionService,
    private geocodingService: GeocodingService,
    @Inject(Logger)
    private logger = new Logger(ApplicationService.name),
    private cronJobService: CronJobService,
  ) {}
  onModuleInit() {
    this.cronJobService.startCronJob(
      PII_DELETION_CRON_JOB_NAME,
      process.env.PII_DELETION_CRON_STRING,
      this.removePIICronJob.bind(this),
    );
  }

  /*
    this will get a set of applications given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of applications, and some meta information to help with pagination
  */
  async list(
    params: ApplicationQueryParams,
    req: ExpressRequest,
  ): Promise<PaginatedApplicationDto> {
    const user = mapTo(User, req['user']);
    if (!user) {
      throw new ForbiddenException();
    }
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

    await Promise.all(
      rawApplications.map(async (application) => {
        await this.authorizeAction(
          user,
          application.listings?.id,
          permissionActions.read,
          application.userId,
        );
      }),
    );

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
    this will the most recent application the user has submitted
  */
  async mostRecentlyCreated(
    params: MostRecentApplicationQueryParams,
    req: ExpressRequest,
  ): Promise<Application> {
    const rawApplication = await this.prisma.applications.findFirst({
      select: {
        id: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        userId: params.userId,
      },
    });

    if (!rawApplication) {
      return null;
    }

    return await this.findOne(rawApplication.id, req);
  }

  /*
    this will get the required app/associated listing information for the public account display
    it will only show applications matching the status passed in via params
  */
  async publicAppsView(
    params: PublicAppsViewQueryParams,
    req: ExpressRequest,
  ): Promise<PublicAppsViewResponse> {
    const user = mapTo(User, req['user']);
    if (!user) {
      throw new ForbiddenException();
    }
    const whereClause = this.buildWhereClause(params);

    const buildCountWhereClause = (filterType: ApplicationsFilterEnum) =>
      this.buildPublicAppsViewWhereClause(
        {
          ...params,
          filterType,
        },
        whereClause,
      );

    const [openCount, closedCount, lotteryCount] = await Promise.all([
      this.prisma.applications.count({
        where: buildCountWhereClause(ApplicationsFilterEnum.open),
      }),
      this.prisma.applications.count({
        where: buildCountWhereClause(ApplicationsFilterEnum.closed),
      }),
      params.includeLotteryApps
        ? this.prisma.applications.count({
            where: buildCountWhereClause(ApplicationsFilterEnum.lottery),
          })
        : Promise.resolve(0),
    ]);

    const totalCount = openCount + closedCount + lotteryCount;

    const displayWhereClause = this.buildPublicAppsViewWhereClause(
      params,
      whereClause,
    );

    let displayCount = totalCount;
    switch (params.filterType) {
      case ApplicationsFilterEnum.open:
        displayCount = openCount;
        break;
      case ApplicationsFilterEnum.closed:
        displayCount = closedCount;
        break;
      case ApplicationsFilterEnum.lottery:
        displayCount = lotteryCount;
        break;
      default:
        displayCount = totalCount;
        break;
    }

    const limit = params.limit ?? 10;
    let page = params.page ?? 1;

    if (displayCount && limit && page > 1) {
      if (Math.ceil(displayCount / limit) < page) {
        page = 1;
      }
    }

    const rawApps = await this.prisma.applications.findMany({
      select: {
        id: true,
        userId: true,
        confirmationCode: true,
        accessibleUnitWaitlistNumber: true,
        conventionalUnitWaitlistNumber: true,
        updatedAt: true,
        status: true,
        markedAsDuplicate: true,
        listings: {
          select: {
            id: true,
            name: true,
            status: true,
            lotteryLastPublishedAt: true,
            lotteryStatus: true,
            applicationDueDate: true,
            listingEvents: {
              select: {
                startDate: true,
              },
              where: { type: ListingEventsTypeEnum.publicLottery },
            },
          },
        },
        applicationLotteryPositions: {
          select: {
            id: true,
          },
        },
      },
      where: displayWhereClause,
      skip: calculateSkip(limit, page),
      take: calculateTake(limit),
      orderBy: {
        updatedAt: 'desc',
      },
    });

    await Promise.all(
      rawApps.map(async (application) => {
        await this.authorizeAction(
          user,
          application.listings?.id,
          permissionActions.read,
          application.userId,
        );
      }),
    );

    return mapTo(PublicAppsViewResponse, {
      items: rawApps,
      meta: buildPaginationInfo(limit, page, displayCount, rawApps.length),
      applicationsCount: {
        total: totalCount,
        lottery: lotteryCount,
        closed: closedCount,
        open: openCount,
      },
    });
  }

  buildPublicAppsViewWhereClause(
    params: PublicAppsViewQueryParams,
    baseWhereClause: Prisma.ApplicationsWhereInput,
  ): Prisma.ApplicationsWhereInput {
    const conditions: Prisma.ApplicationsWhereInput[] = Array.isArray(
      baseWhereClause.AND,
    )
      ? baseWhereClause.AND.flatMap((condition) =>
          Array.isArray(condition.AND) ? condition.AND : [condition],
        )
      : [baseWhereClause];

    if (params.filterType === ApplicationsFilterEnum.open) {
      conditions.push({
        listings: {
          is: {
            status: ListingsStatusEnum.active,
          },
        },
      });
    }

    if (params.filterType === ApplicationsFilterEnum.lottery) {
      conditions.push({
        listings: {
          is: {
            status: { not: ListingsStatusEnum.active },
            lotteryStatus: LotteryStatusEnum.publishedToPublic,
          },
        },
      });
    }

    if (params.filterType === ApplicationsFilterEnum.closed) {
      if (params.includeLotteryApps) {
        conditions.push({
          listings: {
            is: {
              status: { not: ListingsStatusEnum.active },
              OR: [
                {
                  lotteryStatus: { not: LotteryStatusEnum.publishedToPublic },
                },
                {
                  lotteryStatus: null,
                },
              ],
            },
          },
        });
      } else {
        conditions.push({
          listings: {
            is: {
              status: { not: ListingsStatusEnum.active },
            },
          },
        });
      }
    }

    return {
      AND: conditions,
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
  async findOne(
    applicationId: string,
    req: ExpressRequest,
  ): Promise<Application> {
    const user = mapTo(User, req['user']);
    if (!user) {
      throw new ForbiddenException();
    }

    const rawApplication = await this.findOrThrow(
      applicationId,
      ApplicationViews.details,
    );

    const application = mapTo(Application, rawApplication);

    await this.authorizeAction(
      user,
      application.listings?.id,
      permissionActions.read,
      rawApplication.userId,
    );

    return application;
  }

  /*
    this will create an application
  */
  async create(
    dto: ApplicationCreate,
    forPublic: boolean,
    requestingUser?: User,
  ): Promise<Application> {
    if (!forPublic) {
      await this.authorizeAction(
        requestingUser,
        dto.listings.id,
        permissionActions.create,
      );
    }

    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.listings.id,
      },
      include: {
        jurisdictions: { include: { featureFlags: true } },
        // address is needed for geocoding
        listingsBuildingAddress: true,
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: { include: { multiselectOptions: true } },
          },
        },
        // support unit group availability logic in email
        unitGroups: true,
      },
    });

    const enableV2MSQ = doJurisdictionHaveFeatureFlagSet(
      listing?.jurisdictions as unknown as Jurisdiction,
      FeatureFlagEnum.enableV2MSQ,
    );

    if (enableV2MSQ) {
      const listingMultiselectIds = listing.listingMultiselectQuestions.map(
        (msq) => {
          return msq.multiselectQuestionId;
        },
      );
      if (
        !dto.applicationSelections.every(({ multiselectQuestion }) => {
          return listingMultiselectIds.includes(multiselectQuestion.id);
        })
      ) {
        throw new BadRequestException(
          'Application selections contain multiselect question ids not present on the listing',
        );
      }
    }

    // if its a public submission
    if (forPublic) {
      // SubmissionDate is time the application was created for public
      dto.submissionDate = new Date();
      // if there is no common app or submission is after the application due date
      if (
        !(listing.digitalApplication && listing.commonDigitalApplication) ||
        (listing?.applicationDueDate &&
          dto.submissionDate > listing.applicationDueDate)
      ) {
        throw new BadRequestException(
          `Listing is not open for application submission`,
        );
      }
    }

    // If a new application comes in after close and PII needs to be deleted
    let expireAfterDate = undefined;
    if (
      listing.status === ListingsStatusEnum.closed &&
      process.env.APPLICATION_DAYS_TILL_EXPIRY &&
      !isNaN(Number(process.env.APPLICATION_DAYS_TILL_EXPIRY))
    ) {
      expireAfterDate = dayjs(listing.closedAt)
        .add(Number(process.env.APPLICATION_DAYS_TILL_EXPIRY), 'days')
        .toDate();
    }

    const transactions = [];
    // Set all previous applications for the user to not be the newest
    if (requestingUser?.id) {
      transactions.push(
        this.prisma.applications.updateMany({
          data: { isNewest: false },
          where: { userId: requestingUser.id, isNewest: true },
        }),
      );
    }
    transactions.push(
      this.prisma.applications.create({
        data: {
          ...dto,
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
                  firstName: dto.applicant.firstName?.trim(),
                  lastName: dto.applicant.lastName?.trim(),
                  birthDay: dto.applicant.birthDay
                    ? Number(dto.applicant.birthDay)
                    : undefined,
                  birthMonth: dto.applicant.birthMonth
                    ? Number(dto.applicant.birthMonth)
                    : undefined,
                  birthYear: dto.applicant.birthYear
                    ? Number(dto.applicant.birthYear)
                    : undefined,
                  fullTimeStudent: dto.applicant.fullTimeStudent,
                },
              }
            : undefined,
          applicationSelections: undefined,
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
          confirmationCode: this.generateConfirmationCode(),
          demographics: dto.demographics
            ? {
                create: {
                  ...dto.demographics,
                },
              }
            : undefined,
          expireAfter: expireAfterDate,
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
                  firstName: member.firstName?.trim(),
                  lastName: member.lastName?.trim(),
                  birthDay: member.birthDay
                    ? Number(member.birthDay)
                    : undefined,
                  birthMonth: member.birthMonth
                    ? Number(member.birthMonth)
                    : undefined,
                  birthYear: member.birthYear
                    ? Number(member.birthYear)
                    : undefined,
                  fullTimeStudent: member.fullTimeStudent,
                })),
              }
            : undefined,
          isNewest: !!requestingUser?.id && forPublic,
          listings: dto.listings
            ? {
                connect: {
                  id: dto.listings.id,
                },
              }
            : undefined,
          preferences: dto.preferences as unknown as Prisma.JsonArray,
          preferredUnitTypes: dto.preferredUnitTypes
            ? {
                connect: dto.preferredUnitTypes.map((unitType) => ({
                  id: unitType.id,
                })),
              }
            : undefined,
          programs: dto.programs as unknown as Prisma.JsonArray,
          userAccounts: requestingUser
            ? {
                connect: {
                  id: requestingUser.id,
                },
              }
            : undefined,
        },
        include: view.details,
      }),
    );

    const prismaTransactions = await this.prisma.$transaction(transactions);
    const rawApplication = prismaTransactions[prismaTransactions.length - 1];

    if (!rawApplication) {
      throw new HttpException('Application failed to save', 500);
    }

    const rawSelections = [];
    if (enableV2MSQ) {
      // Nested CreateManys are not supported by Prisma,
      // thus we must create the subobjects after creating the application
      try {
        for (const selection of dto.applicationSelections) {
          const rawSelection = await this.createApplicationSelection(
            selection,
            rawApplication.id,
          );
          rawSelections.push(rawSelection);
        }
      } catch (error) {
        // On error, all associated records should be delete.
        // Deleting the application will cascade delete the other records
        await this.prisma.applications.delete({
          where: { id: rawApplication.id },
        });
        throw new BadRequestException(error);
      }
    }
    rawApplication.applicationSelections = rawSelections;

    const mappedApplication = mapTo(Application, rawApplication);
    const mappedListing = mapTo(Listing, listing);
    if (dto.applicant.emailAddress && forPublic) {
      this.emailService.applicationConfirmation(
        mappedListing,
        mappedApplication,
        listing.jurisdictions?.publicUrl,
      );
    }
    // Update the lastApplicationUpdateAt to now after every submission
    await this.updateListingApplicationEditTimestamp(listing.id);

    // Calculate geocoding preferences after save and email sent
    if (listing.jurisdictions?.enableGeocodingPreferences) {
      try {
        if (enableV2MSQ) {
          const multiselectOptions =
            mappedListing.listingMultiselectQuestions.flatMap(
              (multiselectQuestion) =>
                multiselectQuestion.multiselectQuestions.multiselectOptions,
            );

          void this.geocodingService.validateGeocodingPreferencesV2(
            mappedApplication.applicationSelections,
            mappedListing.listingsBuildingAddress,
            multiselectOptions,
          );
        } else {
          void this.geocodingService.validateGeocodingPreferences(
            mappedApplication,
            mappedListing,
          );
        }
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
    const rawExistingApplication = await this.findOrThrow(
      dto.id,
      ApplicationViews.base,
    );

    await this.authorizeAction(
      requestingUser,
      rawExistingApplication.listingId,
      permissionActions.update,
    );

    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.listings.id,
      },
      include: {
        jurisdictions: { include: { featureFlags: true } },
        listingMultiselectQuestions: {
          include: {
            multiselectQuestions: { include: { multiselectOptions: true } },
          },
        },
      },
    });

    const transactions = [];

    // All connected household members should be deleted so they can be recreated in the update below.
    // This solves for all cases of deleted members, updated members, and new members
    transactions.push(
      this.prisma.householdMember.deleteMany({
        where: {
          applicationId: dto.id,
        },
      }),
    );

    transactions.push(
      this.prisma.applications.update({
        where: {
          id: dto.id,
        },
        include: view.details,
        data: {
          ...dto,
          id: undefined,
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
                  firstName: dto.applicant.firstName?.trim(),
                  lastName: dto.applicant.lastName?.trim(),
                  birthDay: dto.applicant.birthDay
                    ? Number(dto.applicant.birthDay)
                    : undefined,
                  birthMonth: dto.applicant.birthMonth
                    ? Number(dto.applicant.birthMonth)
                    : undefined,
                  birthYear: dto.applicant.birthYear
                    ? Number(dto.applicant.birthYear)
                    : undefined,
                  fullTimeStudent: dto.applicant.fullTimeStudent,
                },
              }
            : undefined,
          applicationSelections: dto.applicationSelections ? {} : undefined,
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
          demographics: dto.demographics
            ? {
                create: {
                  ...dto.demographics,
                },
              }
            : undefined,
          householdMember: dto.householdMember
            ? {
                create: dto.householdMember.map((member) => ({
                  ...member,
                  id: undefined,
                  sameAddress: member.sameAddress || YesNoEnum.no,
                  workInRegion: member.workInRegion || YesNoEnum.no,
                  householdMemberAddress: {
                    create: {
                      ...member.householdMemberAddress,
                      id: undefined,
                    },
                  },
                  householdMemberWorkAddress: {
                    create: {
                      ...member.householdMemberWorkAddress,
                      id: undefined,
                    },
                  },
                  firstName: member.firstName?.trim(),
                  lastName: member.lastName?.trim(),
                  birthDay: member.birthDay
                    ? Number(member.birthDay)
                    : undefined,
                  birthMonth: member.birthMonth
                    ? Number(member.birthMonth)
                    : undefined,
                  birthYear: member.birthYear
                    ? Number(member.birthYear)
                    : undefined,
                  fullTimeStudent: member.fullTimeStudent,
                })),
              }
            : undefined,
          listings: dto.listings
            ? {
                connect: {
                  id: dto.listings.id,
                },
              }
            : undefined,
          preferredUnitTypes: dto.preferredUnitTypes
            ? {
                set: dto.preferredUnitTypes.map((unitType) => ({
                  id: unitType.id,
                })),
              }
            : undefined,

          // TODO: Can be removed after MSQ refactor
          preferences: dto.preferences as unknown as Prisma.JsonArray,
          programs: dto.programs as unknown as Prisma.JsonArray,
        },
      }),
    );

    const prismaTransactions = await this.prisma.$transaction(transactions);
    const rawApplication = prismaTransactions[prismaTransactions.length - 1];

    if (!rawApplication) {
      throw new HttpException(
        `Application ${rawExistingApplication.id} failed to update`,
        500,
      );
    }

    const application = mapTo(Application, rawApplication);

    // Calculate geocoding preferences after save and email sent
    if (listing?.jurisdictions?.enableGeocodingPreferences) {
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

    await this.updateListingApplicationEditTimestamp(rawApplication.listingId);
    return application;
  }

  async sendApplicationUpdateEmail(
    applicationId: string,
    dto: ApplicationUpdateEmailDto,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const rawApplication = await this.findOrThrow(
      applicationId,
      ApplicationViews.base,
    );

    await this.authorizeAction(
      requestingUser,
      rawApplication.listingId,
      permissionActions.update,
    );

    const application = mapTo(Application, rawApplication);

    const listing = await this.prisma.listings.findUnique({
      where: { id: rawApplication.listingId },
      include: {
        jurisdictions: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('listing not found');
    }

    const changes = buildApplicationStatusChanges({
      initialStatus: dto.previousStatus,
      nextStatus: application.status,
      initialAccessibleUnitWaitlistNumber:
        dto.previousAccessibleUnitWaitlistNumber,
      nextAccessibleUnitWaitlistNumber:
        application.accessibleUnitWaitlistNumber,
      initialConventionalUnitWaitlistNumber:
        dto.previousConventionalUnitWaitlistNumber,
      nextConventionalUnitWaitlistNumber:
        application.conventionalUnitWaitlistNumber,
    });

    if (changes.length === 0) {
      return { success: false };
    }

    //TODO (Advocate): Update this to something like application?.alternateContact?.isAdvocate
    const isAdvocate = false;
    const applicantEmail = application?.applicant?.emailAddress;

    if (
      !isAdvocate &&
      !applicantEmail &&
      !application?.alternateContact?.emailAddress
    ) {
      return { success: false };
    }

    const mappedListing = mapTo(Listing, listing);
    //TODO: This contact email is a placeholder and must be updated per jurisdiction
    const contactEmail = 'https://www.exygy.com';

    await this.emailService.applicationUpdateEmail(
      mappedListing,
      application,
      changes,
      listing.jurisdictions?.publicUrl,
      contactEmail,
      isAdvocate,
    );

    return { success: true };
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
    finds the requested application or throws an error
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
    listingId: string,
    action: permissionActions,
    applicantUserId?: string,
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
      jurisdictionId: listingJurisdiction?.id,
      userId: applicantUserId,
    });
  }

  addressDeletionData = (id: string) => {
    return this.prisma.address.update({
      data: {
        latitude: null,
        longitude: null,
        street: null,
        street2: null,
      },
      where: {
        id: id,
      },
    });
  };

  /*
   * Remove all PII fields from the passed in application
   */
  async removePII(applicationId: string): Promise<void> {
    const application = await this.prisma.applications.findFirst({
      select: {
        id: true,
        mailingAddressId: true,
        applicant: {
          select: {
            id: true,
            addressId: true,
            workAddressId: true,
          },
        },
        householdMember: {
          select: {
            id: true,
            addressId: true,
            workAddressId: true,
          },
        },
        alternateContact: {
          select: {
            id: true,
            mailingAddressId: true,
          },
        },
      },
      where: {
        id: applicationId,
        wasPIICleared: false,
      },
    });

    if (!application) return;

    const transactions = [];

    if (application.mailingAddressId) {
      transactions.push(this.addressDeletionData(application.mailingAddressId));
    }

    if (application.applicant?.addressId) {
      transactions.push(
        this.addressDeletionData(application.applicant?.addressId),
      );
    }

    if (application.applicant?.workAddressId) {
      transactions.push(
        this.addressDeletionData(application.applicant?.workAddressId),
      );
    }

    if (application.applicant?.id) {
      transactions.push(
        this.prisma.applicant.update({
          data: {
            birthDay: null,
            birthMonth: null,
            birthYear: null,
            emailAddress: null,
            firstName: null,
            lastName: null,
            middleName: null,
            phoneNumber: null,
          },
          where: {
            id: application.applicant.id,
          },
        }),
      );
    }

    if (application.alternateContact?.mailingAddressId) {
      transactions.push(
        this.addressDeletionData(application.alternateContact.mailingAddressId),
      );
    }

    if (application.alternateContact) {
      transactions.push(
        this.prisma.alternateContact.update({
          data: {
            emailAddress: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
          },
          where: {
            id: application.alternateContact.id,
          },
        }),
      );
    }

    for (const householdMember of application.householdMember) {
      if (householdMember.addressId) {
        transactions.push(this.addressDeletionData(householdMember.addressId));
      }
      if (householdMember.workAddressId) {
        transactions.push(
          this.addressDeletionData(householdMember.workAddressId),
        );
      }

      transactions.push(
        this.prisma.householdMember.update({
          data: {
            birthDay: null,
            birthMonth: null,
            birthYear: null,
            firstName: null,
            middleName: null,
            lastName: null,
          },
          where: {
            id: householdMember.id,
          },
        }),
      );
    }

    transactions.push(
      this.prisma.applications.update({
        data: {
          additionalPhoneNumber: null,
          wasPIICleared: true,
        },
        where: {
          id: application.id,
        },
      }),
    );

    await this.prisma.$transaction(transactions);
  }

  async removePIICronJob(): Promise<SuccessDTO> {
    if (process.env.APPLICATION_DAYS_TILL_EXPIRY) {
      this.logger.warn('removePIICron job running');
      await this.cronJobService.markCronJobAsStarted(
        PII_DELETION_CRON_JOB_NAME,
      );
      // Only delete applications that are scheduled to be expired and is not the most
      // recent application for that user
      const applications = await this.prisma.applications.findMany({
        select: { id: true },
        where: {
          expireAfter: { lte: new Date() },
          isNewest: false,
          wasPIICleared: false,
        },
      });
      this.logger.warn(
        `removing PII information for ${applications.length} applications`,
      );
      for (const application of applications) {
        await this.removePII(application.id);
      }
    } else {
      this.logger.warn(
        'APPLICATION_DAYS_TILL_EXPIRY variable not set so the cron job will not run',
      );
    }
    return {
      success: true,
    };
  }

  /*
    generates a random confirmation code
  */
  generateConfirmationCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async createApplicationSelection(
    selection: ApplicationSelectionCreate,
    applicationId: string,
  ): Promise<ApplicationSelections> {
    const selectedOptions = [];

    for (const selectionOption of selection.selections) {
      let address;
      // If an address is passed, create the address for the selection option
      if (selectionOption.addressHolderAddress) {
        address = await this.prisma.address.create({
          data: {
            ...selectionOption.addressHolderAddress,
          },
        });
      }
      // Build the create selection option body
      const selectedOptionBody = {
        addressHolderAddressId: address?.id,
        addressHolderName: selectionOption.addressHolderName,
        addressHolderRelationship: selectionOption.addressHolderRelationship,
        isGeocodingVerified: selectionOption.isGeocodingVerified,
        multiselectOptionId: selectionOption.multiselectOption.id,
      };
      // Push the selection option to a list for the createMany
      selectedOptions.push(selectedOptionBody);
    }
    // Create the application selection with nested createMany applicationSelectionOptions
    return await this.prisma.applicationSelections.create({
      data: {
        applicationId: applicationId,
        hasOptedOut: selection.hasOptedOut ?? false,
        multiselectQuestionId: selection.multiselectQuestion.id,
        selections: {
          createMany: {
            data: selectedOptions,
          },
        },
      },
      include: {
        multiselectQuestion: true,
        selections: {
          include: {
            addressHolderAddress: {
              select: {
                id: true,
                placeName: true,
                city: true,
                county: true,
                state: true,
                street: true,
                street2: true,
                zipCode: true,
                latitude: true,
                longitude: true,
              },
            },
            multiselectOption: true,
          },
        },
      },
    });
  }
}
