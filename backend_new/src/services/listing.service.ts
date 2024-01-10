import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  LanguagesEnum,
  ListingsStatusEnum,
  Prisma,
  ReviewOrderTypeEnum,
  UserRoleEnum,
} from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from './prisma.service';
import { ListingsQueryParams } from '../dtos/listings/listings-query-params.dto';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { buildOrderByForListings } from '../utilities/build-order-by';
import { ListingFilterParams } from '../dtos/listings/listings-filter-params.dto';
import { ListingFilterKeys } from '../enums/listings/filter-key-enum';
import { buildFilter } from '../utilities/build-filter';
import { Listing } from '../dtos/listings/listing.dto';
import { mapTo } from '../utilities/mapTo';
import {
  summarizeUnitsByTypeAndRent,
  summarizeUnits,
} from '../utilities/unit-utilities';
import { AmiChart } from '../dtos/ami-charts/ami-chart.dto';
import { ListingViews } from '../enums/listings/view-enum';
import { TranslationService } from './translation.service';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ApplicationFlaggedSetService } from './application-flagged-set.service';
import { User } from '../dtos/users/user.dto';
import { EmailService } from './email.service';
import { IdDTO } from '../dtos/shared/id.dto';
import { startCronJob } from '../utilities/cron-job-starter';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';

export type getListingsArgs = {
  skip: number;
  take: number;
  orderBy: any;
  where: Prisma.ListingsWhereInput;
};

const views: Partial<Record<ListingViews, Prisma.ListingsInclude>> = {
  fundamentals: {
    jurisdictions: true,
    listingsBuildingAddress: true,
    reservedCommunityTypes: true,
    listingImages: {
      include: {
        assets: true,
      },
    },
    listingMultiselectQuestions: {
      include: {
        multiselectQuestions: true,
      },
    },
    listingFeatures: true,
    listingUtilities: true,
  },
};

views.base = {
  ...views.fundamentals,
  units: {
    include: {
      unitTypes: true,
      unitAmiChartOverrides: true,
      amiChart: {
        include: {
          amiChartItem: true,
        },
      },
    },
  },
};

views.full = {
  ...views.fundamentals,
  applicationMethods: {
    include: {
      paperApplications: {
        include: {
          assets: true,
        },
      },
    },
  },
  listingsBuildingSelectionCriteriaFile: true,
  listingEvents: {
    include: {
      assets: true,
    },
  },
  listingsResult: true,
  listingsLeasingAgentAddress: true,
  listingsApplicationPickUpAddress: true,
  listingsApplicationDropOffAddress: true,
  listingsApplicationMailingAddress: true,
  units: {
    include: {
      unitAmiChartOverrides: true,
      unitTypes: true,
      unitRentTypes: true,
      unitAccessibilityPriorityTypes: true,
      amiChart: {
        include: {
          jurisdictions: true,
          amiChartItem: true,
          unitGroupAmiLevels: true,
        },
      },
    },
  },
};

views.details = {
  ...views.base,
  ...views.full,
};

const CRON_JOB_NAME = 'LISTING_CRON_JOB';

/*
  this is the service for listings
  it handles all the backend's business logic for reading in listing(s)
*/
@Injectable()
export class ListingService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private translationService: TranslationService,
    private httpService: HttpService,
    private afsService: ApplicationFlaggedSetService,
    private emailService: EmailService,
    private configService: ConfigService,
    @Inject(Logger)
    private logger = new Logger(ListingService.name),
    private schedulerRegistry: SchedulerRegistry,
    private permissionService: PermissionService,
  ) {}

  onModuleInit() {
    startCronJob(
      this.prisma,
      CRON_JOB_NAME,
      process.env.LISTING_PROCESSING_CRON_STRING,
      this.process.bind(this),
      this.logger,
      this.schedulerRegistry,
    );
  }

  /*
    this will get a set of listings given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of listings, and some meta information to help with pagination
  */
  async list(params: ListingsQueryParams): Promise<{
    items: Listing[];
    meta: {
      currentPage: number;
      itemCount: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const whereClause = this.buildWhereClause(params.filter, params.search);
    const count = await this.prisma.listings.count({
      where: whereClause,
    });

    const listingsRaw = await this.prisma.listings.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderByForListings(params.orderBy, params.orderDir),
      include: views[params.view ?? 'full'],
      where: whereClause,
    });

    const listings = mapTo(Listing, listingsRaw);

    listings.forEach((listing) => {
      if (Array.isArray(listing.units) && listing.units.length > 0) {
        listing.unitsSummarized = {
          byUnitTypeAndRent: summarizeUnitsByTypeAndRent(
            listing.units,
            listing,
          ),
        };
      }
    });

    const paginationInfo = buildPaginationMetaInfo(
      params,
      count,
      listings.length,
    );

    return {
      items: listings,
      meta: paginationInfo,
    };
  }

  public async getUserEmailInfo(
    userRoles: UserRoleEnum | UserRoleEnum[],
    listingId?: string,
    jurisId?: string,
    getPublicUrl = false,
  ): Promise<{ emails: string[]; publicUrl?: string | null }> {
    // determine where clause(s)
    const userRolesWhere: Prisma.UserAccountsWhereInput[] = [];
    if (userRoles.includes(UserRoleEnum.admin))
      userRolesWhere.push({ userRoles: { isAdmin: true } });
    if (userRoles.includes(UserRoleEnum.partner))
      userRolesWhere.push({
        userRoles: { isPartner: true },
        listings: { some: { id: listingId } },
      });
    if (userRoles.includes(UserRoleEnum.jurisdictionAdmin)) {
      userRolesWhere.push({
        userRoles: { isJurisdictionalAdmin: true },
        jurisdictions: { some: { id: jurisId } },
      });
    }

    const userResults = await this.prisma.userAccounts.findMany({
      include: {
        jurisdictions: {
          select: {
            id: true,
            publicUrl: getPublicUrl,
          },
        },
      },
      where: {
        OR: userRolesWhere,
      },
    });

    // account for users having access to multiple jurisdictions
    const publicUrl = getPublicUrl
      ? userResults[0]?.jurisdictions?.find((juris) => juris.id === jurisId)
          ?.publicUrl
      : null;
    const userEmails: string[] = [];
    userResults?.forEach((user) => user?.email && userEmails.push(user.email));
    return { emails: userEmails, publicUrl };
  }

  public async listingApprovalNotify(params: {
    user: User;
    listingInfo: IdDTO;
    status: ListingsStatusEnum;
    approvingRoles: UserRoleEnum[];
    previousStatus?: ListingsStatusEnum;
    jurisId: string;
  }) {
    const nonApprovingRoles: UserRoleEnum[] = [UserRoleEnum.partner];
    if (!params.approvingRoles.includes(UserRoleEnum.jurisdictionAdmin))
      nonApprovingRoles.push(UserRoleEnum.jurisdictionAdmin);
    if (params.status === ListingsStatusEnum.pendingReview) {
      const userInfo = await this.getUserEmailInfo(
        params.approvingRoles,
        params.listingInfo.id,
        params.jurisId,
      );
      await this.emailService.requestApproval(
        { id: params.jurisId },
        { id: params.listingInfo.id, name: params.listingInfo.name },
        userInfo.emails,
        this.configService.get('PARTNERS_PORTAL_URL'),
      );
    }
    // admin updates status to changes requested when approval requires partner changes
    else if (params.status === ListingsStatusEnum.changesRequested) {
      const userInfo = await this.getUserEmailInfo(
        nonApprovingRoles,
        params.listingInfo.id,
        params.jurisId,
      );
      await this.emailService.changesRequested(
        params.user,
        { id: params.listingInfo.id, name: params.listingInfo.name },
        userInfo.emails,
        this.configService.get('PARTNERS_PORTAL_URL'),
      );
    }
    // check if status of active requires notification
    else if (params.status === ListingsStatusEnum.active) {
      // if newly published listing, notify non-approving users with access
      if (
        params.previousStatus === ListingsStatusEnum.pendingReview ||
        params.previousStatus === ListingsStatusEnum.changesRequested ||
        params.previousStatus === ListingsStatusEnum.pending
      ) {
        const userInfo = await this.getUserEmailInfo(
          nonApprovingRoles,
          params.listingInfo.id,
          params.jurisId,
          true,
        );
        await this.emailService.listingApproved(
          { id: params.jurisId },
          { id: params.listingInfo.id, name: params.listingInfo.name },
          userInfo.emails,
          userInfo.publicUrl,
        );
      }
    }
  }

  /*
    this helps build the where clause for the list()
  */
  buildWhereClause(
    params?: ListingFilterParams[],
    search?: string,
  ): Prisma.ListingsWhereInput {
    const filters: Prisma.ListingsWhereInput[] = [];

    if (params?.length) {
      params.forEach((filter) => {
        if (filter[ListingFilterKeys.name]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.name],
            key: ListingFilterKeys.name,
            caseSensitive: false,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({ [ListingFilterKeys.name]: filt })),
          });
        } else if (filter[ListingFilterKeys.status]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.status],
            key: ListingFilterKeys.status,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              [ListingFilterKeys.status]: filt,
            })),
          });
        } else if (filter[ListingFilterKeys.neighborhood]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.neighborhood],
            key: ListingFilterKeys.neighborhood,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              [ListingFilterKeys.neighborhood]: filt,
            })),
          });
        } else if (filter[ListingFilterKeys.bedrooms]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.bedrooms],
            key: ListingFilterKeys.bedrooms,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              units: {
                some: {
                  numBedrooms: filt,
                },
              },
            })),
          });
        } else if (filter[ListingFilterKeys.zipcode]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.zipcode],
            key: ListingFilterKeys.zipcode,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              listingsBuildingAddress: {
                zipCode: filt,
              },
            })),
          });
        } else if (filter[ListingFilterKeys.leasingAgents]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.leasingAgents],
            key: ListingFilterKeys.leasingAgents,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              userAccounts: {
                some: {
                  id: filt,
                },
              },
            })),
          });
        } else if (filter[ListingFilterKeys.jurisdiction]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.jurisdiction],
            key: ListingFilterKeys.jurisdiction,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              jurisdictionId: filt,
            })),
          });
        }
      });
    }

    if (search) {
      filters.push({
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    return {
      AND: filters,
    };
  }

  /*
    this will return 1 listing or error
    the scope of data it returns is dependent on the view arg passed in
  */
  async findOne(
    listingId: string,
    lang: LanguagesEnum = LanguagesEnum.en,
    view: ListingViews = ListingViews.full,
  ): Promise<Listing> {
    const listingRaw = await this.findOrThrow(listingId, view);

    let result = mapTo(Listing, listingRaw);

    if (lang !== LanguagesEnum.en) {
      result = await this.translationService.translateListing(result, lang);
    }

    await this.addUnitsSummarized(result);
    return result;
  }

  /*
    creates a listing
  */
  async create(dto: ListingCreate, requestingUser: User): Promise<Listing> {
    await this.permissionService.canOrThrow(
      requestingUser,
      'listing',
      permissionActions.create,
      {
        jurisdictionId: dto.jurisdictions.id,
      },
    );

    const rawListing = await this.prisma.listings.create({
      include: views.details,
      data: {
        ...dto,
        assets: dto.assets
          ? {
              create: dto.assets.map((asset) => ({
                fileId: asset.fileId,
                label: asset.label,
              })),
            }
          : undefined,
        applicationMethods: dto.applicationMethods
          ? {
              create: dto.applicationMethods.map((applicationMethod) => ({
                ...applicationMethod,
                paperApplications: applicationMethod.paperApplications
                  ? {
                      create: applicationMethod.paperApplications.map(
                        (paperApplication) => ({
                          ...paperApplication,
                          assets: {
                            create: {
                              ...paperApplication.assets,
                            },
                          },
                        }),
                      ),
                    }
                  : undefined,
              })),
            }
          : undefined,
        listingEvents: dto.listingEvents
          ? {
              create: dto.listingEvents.map((event) => ({
                type: event.type,
                startDate: event.startDate,
                startTime: event.startTime,
                endTime: event.endTime,
                url: event.url,
                note: event.note,
                label: event.label,
                assets: event.assets
                  ? {
                      create: {
                        ...event.assets,
                      },
                    }
                  : undefined,
              })),
            }
          : undefined,
        listingImages: dto.listingImages
          ? {
              create: dto.listingImages.map((image) => ({
                assets: {
                  create: {
                    ...image.assets,
                  },
                },
                ordinal: image.ordinal,
              })),
            }
          : undefined,
        listingMultiselectQuestions: dto.listingMultiselectQuestions
          ? {
              create: dto.listingMultiselectQuestions.map(
                (multiselectQuestion) => ({
                  ordinal: multiselectQuestion.ordinal,
                  multiselectQuestions: {
                    connect: {
                      id: multiselectQuestion.id,
                    },
                  },
                }),
              ),
            }
          : undefined,
        listingsApplicationDropOffAddress: dto.listingsApplicationDropOffAddress
          ? {
              create: {
                ...dto.listingsApplicationDropOffAddress,
              },
            }
          : undefined,
        reservedCommunityTypes: dto.reservedCommunityTypes
          ? {
              connect: {
                id: dto.reservedCommunityTypes.id,
              },
            }
          : undefined,
        listingsBuildingSelectionCriteriaFile:
          dto.listingsBuildingSelectionCriteriaFile
            ? {
                create: {
                  ...dto.listingsBuildingSelectionCriteriaFile,
                },
              }
            : undefined,
        listingUtilities: dto.listingUtilities
          ? {
              create: {
                ...dto.listingUtilities,
              },
            }
          : undefined,
        listingsApplicationMailingAddress: dto.listingsApplicationMailingAddress
          ? {
              create: {
                ...dto.listingsApplicationMailingAddress,
              },
            }
          : undefined,
        listingsLeasingAgentAddress: dto.listingsLeasingAgentAddress
          ? {
              create: {
                ...dto.listingsLeasingAgentAddress,
              },
            }
          : undefined,
        listingFeatures: dto.listingFeatures
          ? {
              create: {
                ...dto.listingFeatures,
              },
            }
          : undefined,
        jurisdictions: dto.jurisdictions
          ? {
              connect: {
                id: dto.jurisdictions.id,
              },
            }
          : undefined,
        listingsApplicationPickUpAddress: dto.listingsApplicationPickUpAddress
          ? {
              create: {
                ...dto.listingsApplicationPickUpAddress,
              },
            }
          : undefined,
        listingsBuildingAddress: dto.listingsBuildingAddress
          ? {
              create: {
                ...dto.listingsBuildingAddress,
              },
            }
          : undefined,
        units: dto.units
          ? {
              create: dto.units.map((unit) => ({
                amiPercentage: unit.amiPercentage,
                annualIncomeMin: unit.annualIncomeMin,
                monthlyIncomeMin: unit.monthlyIncomeMin,
                floor: unit.floor,
                annualIncomeMax: unit.annualIncomeMax,
                maxOccupancy: unit.maxOccupancy,
                minOccupancy: unit.minOccupancy,
                monthlyRent: unit.monthlyRent,
                numBathrooms: unit.numBathrooms,
                numBedrooms: unit.numBedrooms,
                number: unit.number,
                sqFeet: unit.sqFeet,
                monthlyRentAsPercentOfIncome: unit.monthlyRentAsPercentOfIncome,
                bmrProgramChart: unit.bmrProgramChart,
                unitTypes: unit.unitTypes
                  ? {
                      connect: {
                        id: unit.unitTypes.id,
                      },
                    }
                  : undefined,
                amiChart: unit.amiChart
                  ? {
                      connect: {
                        id: unit.amiChart.id,
                      },
                    }
                  : undefined,
                unitAmiChartOverrides: unit.unitAmiChartOverrides
                  ? {
                      create: {
                        items: unit.unitAmiChartOverrides.items,
                      },
                    }
                  : undefined,
                unitAccessibilityPriorityTypes:
                  unit.unitAccessibilityPriorityTypes
                    ? {
                        connect: {
                          id: unit.unitAccessibilityPriorityTypes.id,
                        },
                      }
                    : undefined,
                unitRentTypes: unit.unitRentTypes
                  ? {
                      connect: {
                        id: unit.unitRentTypes.id,
                      },
                    }
                  : undefined,
              })),
            }
          : undefined,
        unitsSummary: dto.unitsSummary
          ? {
              create: dto.unitsSummary.map((unitSummary) => ({
                ...unitSummary,
                unitTypes: unitSummary.unitTypes
                  ? {
                      connect: {
                        id: unitSummary.unitTypes.id,
                      },
                    }
                  : undefined,
                unitAccessibilityPriorityTypes:
                  unitSummary.unitAccessibilityPriorityTypes
                    ? {
                        connect: {
                          id: unitSummary.unitAccessibilityPriorityTypes.id,
                        },
                      }
                    : undefined,
              })),
            }
          : undefined,
        listingsResult: dto.listingsResult
          ? {
              create: {
                ...dto.listingsResult,
              },
            }
          : undefined,
      },
    });

    if (rawListing.status === ListingsStatusEnum.pendingReview) {
      const jurisdiction = await this.prisma.jurisdictions.findFirst({
        where: {
          id: rawListing.jurisdictions?.id,
        },
      });
      await this.listingApprovalNotify({
        user: requestingUser,
        listingInfo: { id: rawListing.id, name: rawListing.name },
        status: rawListing.status,
        approvingRoles: jurisdiction?.listingApprovalPermissions,
        jurisId: rawListing.jurisdictions.id,
      });
    }
    await this.cachePurge(undefined, dto.status, rawListing.id);
    return mapTo(Listing, rawListing);
  }

  /*
    deletes a listing
  */
  async delete(id: string, requestingUser: User): Promise<SuccessDTO> {
    const storedListing = await this.findOrThrow(id);

    await this.permissionService.canOrThrow(
      requestingUser,
      'listing',
      permissionActions.delete,
      {
        id: storedListing.id,
        jurisdictionId: storedListing.jurisdictionId,
      },
    );

    await this.prisma.listings.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    This will either find a listing or throw an error
    a listing view can be provided which will add the joins to produce that view correctly
  */
  async findOrThrow(id: string, view?: ListingViews) {
    const listing = await this.prisma.listings.findUnique({
      include: view ? views[view] : undefined,
      where: {
        id,
      },
    });

    if (!listing) {
      throw new NotFoundException(
        `listingId ${id} was requested but not found`,
      );
    }
    return listing;
  }

  /*
    This should be run for all address fields on an update of a listing.
    The address either needs to be updated if fields are changed, deleted if no longer attached,
    or created if it is a new address
  */
  async addressUpdate(
    existingListing,
    newListing: ListingUpdate,
    field: string,
  ) {
    if (existingListing[field]) {
      if (newListing[field]) {
        return await this.prisma.address.update({
          data: {
            ...newListing[field],
          },
          where: {
            id: existingListing[field].id,
          },
        });
      } else {
        await this.prisma.address.delete({
          where: {
            id: existingListing[field].id,
          },
        });
      }
    } else if (newListing[field]) {
      return await this.prisma.address.create({
        data: {
          ...newListing[field],
        },
      });
    }
    return undefined;
  }

  /*
    update a listing
  */
  async update(dto: ListingUpdate, requestingUser: User): Promise<Listing> {
    const storedListing = await this.findOrThrow(dto.id, ListingViews.details);

    await this.permissionService.canOrThrow(
      requestingUser,
      'listing',
      permissionActions.update,
      {
        id: storedListing.id,
        jurisdictionId: storedListing.jurisdictionId,
      },
    );

    dto.unitsAvailable =
      dto.reviewOrderType !== ReviewOrderTypeEnum.waitlist && dto.units
        ? dto.units.length
        : 0;

    // We need to save the assets before saving it to the listing_images table
    let allAssets = [];
    const unsavedImages = dto.listingImages?.reduce((values, value) => {
      if (!value.assets.id) {
        values.push(value);
      } else {
        allAssets.push(value);
      }
      return values;
    }, []);

    if (unsavedImages?.length) {
      const assetCreates = unsavedImages.map((unsavedImage) => {
        return this.prisma.assets.create({
          data: unsavedImage.assets,
        });
      });
      const uploadedImages = await Promise.all(assetCreates);
      allAssets = [
        ...allAssets,
        ...uploadedImages.map((image, index) => {
          return { assets: image, ordinal: unsavedImages[index].ordinal };
        }),
      ];
    }

    const pickUpAddress = await this.addressUpdate(
      storedListing,
      dto,
      'listingsApplicationPickUpAddress',
    );
    const mailAddress = await this.addressUpdate(
      storedListing,
      dto,
      'listingsApplicationMailingAddress',
    );
    const dropOffAddress = await this.addressUpdate(
      storedListing,
      dto,
      'listingsApplicationDropOffAddress',
    );
    const leasingAgentAddress = await this.addressUpdate(
      storedListing,
      dto,
      'listingsLeasingAgentAddress',
    );
    const buildingAddress = await this.addressUpdate(
      storedListing,
      dto,
      'listingsBuildingAddress',
    );

    // Wrap the deletion and update in one transaction so that units aren't lost if update fails
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactions = await this.prisma.$transaction([
      // delete all connected units before recreating in update
      this.prisma.units.deleteMany({
        where: {
          listingId: storedListing.id,
        },
      }),
      // Delete all listing images before creating new ones
      this.prisma.listingImages.deleteMany({
        where: {
          listingId: dto.id,
        },
      }),
      // Delete all listing events before creating new ones
      this.prisma.listingEvents.deleteMany({
        where: {
          listingId: dto.id,
        },
      }),
      // Delete all paper applications and methods before creating new ones
      this.prisma.paperApplications.deleteMany({
        where: {
          applicationMethods: {
            is: {
              listingId: dto.id,
            },
          },
        },
      }),
      this.prisma.applicationMethods.deleteMany({
        where: {
          listingId: dto.id,
        },
      }),
      this.prisma.listings.update({
        data: {
          ...dto,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          assets: dto.assets as unknown as Prisma.InputJsonArray,
          applicationMethods: dto.applicationMethods
            ? {
                create: dto.applicationMethods.map((applicationMethod) => ({
                  ...applicationMethod,
                  paperApplications: applicationMethod.paperApplications
                    ? {
                        create: applicationMethod.paperApplications.map(
                          (paperApplication) => ({
                            ...paperApplication,
                            assets: {
                              create: {
                                ...paperApplication.assets,
                                id: undefined,
                              },
                            },
                          }),
                        ),
                      }
                    : undefined,
                })),
              }
            : undefined,
          listingEvents: dto.listingEvents
            ? {
                create: dto.listingEvents.map((event) => ({
                  type: event.type,
                  startDate: event.startDate,
                  startTime: event.startTime,
                  endTime: event.endTime,
                  url: event.url,
                  note: event.note,
                  label: event.label,
                  assets: event.assets
                    ? {
                        create: {
                          ...event.assets,
                        },
                      }
                    : undefined,
                })),
              }
            : undefined,
          listingImages: allAssets.length
            ? {
                create: allAssets.map((asset) => {
                  return {
                    ordinal: asset.ordinal,
                    assets: {
                      connect: {
                        id: asset.assets.id,
                      },
                    },
                  };
                }),
              }
            : undefined,
          listingMultiselectQuestions: dto.listingMultiselectQuestions
            ? {
                upsert: dto.listingMultiselectQuestions.map(
                  (multiselectQuestion) => ({
                    where: {
                      listingId_multiselectQuestionId: {
                        listingId: dto.id,
                        multiselectQuestionId: multiselectQuestion.id,
                      },
                    },
                    update: {
                      ordinal: multiselectQuestion.ordinal,
                      multiselectQuestionId: multiselectQuestion.id,
                    },
                    create: {
                      ordinal: multiselectQuestion.ordinal,
                      multiselectQuestionId: multiselectQuestion.id,
                    },
                  }),
                ),
              }
            : undefined,
          listingsApplicationDropOffAddress: dropOffAddress
            ? {
                connect: {
                  id: dropOffAddress.id,
                },
              }
            : undefined,
          reservedCommunityTypes: dto.reservedCommunityTypes
            ? {
                connect: {
                  id: dto.reservedCommunityTypes.id,
                },
              }
            : undefined,
          // Three options for the building selection criteria file
          // create new one, connect existing one, or deleted (disconnect)
          listingsBuildingSelectionCriteriaFile:
            dto.listingsBuildingSelectionCriteriaFile
              ? dto.listingsBuildingSelectionCriteriaFile.id
                ? {
                    connectOrCreate: {
                      where: {
                        id: dto.listingsBuildingSelectionCriteriaFile.id,
                      },
                      create: {
                        ...dto.listingsBuildingSelectionCriteriaFile,
                      },
                    },
                  }
                : {
                    create: {
                      ...dto.listingsBuildingSelectionCriteriaFile,
                    },
                  }
              : {
                  disconnect: true,
                },
          listingUtilities: dto.listingUtilities
            ? {
                create: {
                  ...dto.listingUtilities,
                },
              }
            : undefined,
          listingsApplicationMailingAddress: mailAddress
            ? {
                connect: {
                  id: mailAddress.id,
                },
              }
            : undefined,
          listingsLeasingAgentAddress: leasingAgentAddress
            ? {
                connect: {
                  id: leasingAgentAddress.id,
                },
              }
            : undefined,
          listingFeatures: dto.listingFeatures
            ? {
                create: {
                  ...dto.listingFeatures,
                },
              }
            : undefined,
          jurisdictions: dto.jurisdictions
            ? {
                connect: {
                  id: dto.jurisdictions.id,
                },
              }
            : undefined,
          listingsApplicationPickUpAddress: pickUpAddress
            ? {
                connect: {
                  id: pickUpAddress.id,
                },
              }
            : undefined,
          listingsBuildingAddress: buildingAddress
            ? {
                connect: {
                  id: buildingAddress.id,
                },
              }
            : undefined,
          units: dto.units
            ? {
                create: dto.units.map((unit) => ({
                  amiPercentage: unit.amiPercentage,
                  annualIncomeMin: unit.annualIncomeMin,
                  monthlyIncomeMin: unit.monthlyIncomeMin,
                  floor: unit.floor,
                  annualIncomeMax: unit.annualIncomeMax,
                  maxOccupancy: unit.maxOccupancy,
                  minOccupancy: unit.minOccupancy,
                  monthlyRent: unit.monthlyRent,
                  numBathrooms: unit.numBathrooms,
                  numBedrooms: unit.numBedrooms,
                  number: unit.number,
                  sqFeet: unit.sqFeet,
                  monthlyRentAsPercentOfIncome:
                    unit.monthlyRentAsPercentOfIncome,
                  bmrProgramChart: unit.bmrProgramChart,
                  unitTypes: unit.unitTypes
                    ? {
                        connect: {
                          id: unit.unitTypes.id,
                        },
                      }
                    : undefined,
                  amiChart: unit.amiChart
                    ? {
                        connect: {
                          id: unit.amiChart.id,
                        },
                      }
                    : undefined,
                  unitAmiChartOverrides: unit.unitAmiChartOverrides
                    ? {
                        create: {
                          items: unit.unitAmiChartOverrides.items,
                        },
                      }
                    : undefined,
                  unitAccessibilityPriorityTypes:
                    unit.unitAccessibilityPriorityTypes
                      ? {
                          connect: {
                            id: unit.unitAccessibilityPriorityTypes.id,
                          },
                        }
                      : undefined,
                  unitRentTypes: unit.unitRentTypes
                    ? {
                        connect: {
                          id: unit.unitRentTypes.id,
                        },
                      }
                    : undefined,
                })),
              }
            : undefined,
          unitsSummary: dto.unitsSummary
            ? {
                create: dto.unitsSummary.map((unitSummary) => ({
                  ...unitSummary,
                  unitTypes: unitSummary.unitTypes
                    ? {
                        connect: {
                          id: unitSummary.unitTypes.id,
                        },
                      }
                    : undefined,
                  unitAccessibilityPriorityTypes:
                    unitSummary.unitAccessibilityPriorityTypes
                      ? {
                          connect: {
                            id: unitSummary.unitAccessibilityPriorityTypes.id,
                          },
                        }
                      : undefined,
                })),
              }
            : undefined,
          publishedAt:
            storedListing.status !== ListingsStatusEnum.active &&
            dto.status === ListingsStatusEnum.active
              ? new Date()
              : storedListing.publishedAt,
          closedAt:
            storedListing.status !== ListingsStatusEnum.closed &&
            dto.status === ListingsStatusEnum.closed
              ? new Date()
              : storedListing.closedAt,
          requestedChangesUserId:
            dto.status === ListingsStatusEnum.changesRequested &&
            storedListing.status !== ListingsStatusEnum.changesRequested
              ? requestingUser.id
              : storedListing.requestedChangesUserId,
          listingsResult: dto.listingsResult
            ? {
                create: {
                  ...dto.listingsResult,
                },
              }
            : undefined,
        },
        include: views.details,
        where: {
          id: dto.id,
        },
      }),
    ]);

    const rawListing = transactions[
      transactions.length - 1
    ] as unknown as Listing;

    if (!rawListing) {
      throw new HttpException('listing failed to save', 500);
    }
    const listingApprovalPermissions = (
      await this.prisma.jurisdictions.findFirst({
        where: { id: dto.jurisdictions.id },
      })
    )?.listingApprovalPermissions;

    if (listingApprovalPermissions?.length > 0)
      await this.listingApprovalNotify({
        user: requestingUser,
        listingInfo: { id: dto.id, name: dto.name },
        approvingRoles: listingApprovalPermissions,
        status: dto.status,
        previousStatus: storedListing.status,
        jurisId: dto.jurisdictions.id,
      });

    // if listing is closed for the first time the application flag set job needs to run
    if (
      storedListing.status === ListingsStatusEnum.active &&
      dto.status === ListingsStatusEnum.closed
    ) {
      await this.afsService.process(dto.id);
    }

    await this.cachePurge(storedListing.status, dto.status, rawListing.id);

    return mapTo(Listing, rawListing);
  }

  /**
    clears the listing cache of either 1 listing or all listings
     @param storedListingStatus the status that was stored for the listing
     @param incomingListingStatus the incoming "new" status for a listing
     @param savedResponseId the id of the listing   
  */
  async cachePurge(
    storedListingStatus: ListingsStatusEnum | undefined,
    incomingListingStatus: ListingsStatusEnum,
    savedResponseId: string,
  ): Promise<void> {
    if (!process.env.PROXY_URL) {
      return;
    }
    const shouldPurgeAllListings =
      incomingListingStatus !== ListingsStatusEnum.pending ||
      storedListingStatus === ListingsStatusEnum.active;
    await firstValueFrom(
      this.httpService.request({
        baseURL: process.env.PROXY_URL,
        method: 'PURGE',
        url: shouldPurgeAllListings
          ? '/listings?*'
          : `/listings/${savedResponseId}*`,
      }),
      undefined,
    ).catch((e) =>
      console.error(
        shouldPurgeAllListings
          ? 'purge all listings error = '
          : `purge listing ${savedResponseId} error = `,
        e,
      ),
    );
  }

  /*
    this builds the units summarized for the list()
  */
  addUnitsSummarized = async (listing: Listing) => {
    if (Array.isArray(listing.units) && listing.units.length > 0) {
      const amiChartsRaw = await this.prisma.amiChart.findMany({
        where: {
          id: {
            in: listing.units.map((unit) => unit.amiChart?.id),
          },
        },
      });
      const amiCharts = mapTo(AmiChart, amiChartsRaw);
      listing.unitsSummarized = summarizeUnits(listing, amiCharts);
    }
    return listing;
  };

  /*
    returns id, name of listing given a multiselect question id
  */
  findListingsWithMultiSelectQuestion = async (
    multiselectQuestionId: string,
  ) => {
    const listingsRaw = await this.prisma.listings.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        listingMultiselectQuestions: {
          some: {
            multiselectQuestionId: multiselectQuestionId,
          },
        },
      },
    });
    return mapTo(Listing, listingsRaw);
  };

  /**
    runs the job to auto close listings that are passed their due date
    will call the the cache purge to purge all listings as long as updates had to be made
  */
  async process(): Promise<SuccessDTO> {
    this.logger.warn('changeOverdueListingsStatusCron job running');
    await this.markCronJobAsStarted();
    const res = await this.prisma.listings.updateMany({
      data: {
        status: ListingsStatusEnum.closed,
        closedAt: new Date(),
      },
      where: {
        status: ListingsStatusEnum.active,
        AND: [
          {
            applicationDueDate: {
              not: null,
            },
          },
          {
            applicationDueDate: {
              lte: new Date(),
            },
          },
        ],
      },
    });
    this.logger.warn(`Changed the status of ${res?.count} listings`);
    if (res?.count) {
      await this.cachePurge(
        ListingsStatusEnum.closed,
        ListingsStatusEnum.active,
        '',
      );
    }

    return {
      success: true,
    };
  }

  /**
    marks the db record for this cronjob as begun or creates a cronjob that
    is marked as begun if one does not already exist 
  */
  async markCronJobAsStarted(): Promise<void> {
    const job = await this.prisma.cronJob.findFirst({
      where: {
        name: CRON_JOB_NAME,
      },
    });
    if (job) {
      // if a job exists then we update db entry
      await this.prisma.cronJob.update({
        data: {
          lastRunDate: new Date(),
        },
        where: {
          id: job.id,
        },
      });
    } else {
      // if no job we create a new entry
      await this.prisma.cronJob.create({
        data: {
          lastRunDate: new Date(),
          name: CRON_JOB_NAME,
        },
      });
    }
  }
}
