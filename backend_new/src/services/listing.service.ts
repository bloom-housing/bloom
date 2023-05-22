import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  LanguagesEnum,
  Prisma,
  ReviewOrderTypeEnum,
  Units,
  UnitsSummary,
} from '@prisma/client';
import { ListingsQueryParams } from '../dtos/listings/listings-query-params.dto';
import {
  calculateSkip,
  calculateTake,
  shouldPaginate,
} from '../utilities/pagination-helpers';
import { buildOrderBy } from '../utilities/build-order-by';
import { ListingFilterParams } from '../dtos/listings/listings-filter-params.dto';
import { ListingFilterKeys } from '../enums/listings/filter-key-enum';
import { buildFilter } from '../utilities/build-filter';
import { SummaryOfUnits } from '../dtos/units/summary-of-units.dto';

export type getListingsArgs = {
  skip: number;
  take: number;
  orderBy: any;
  where: Prisma.ListingsWhereInput;
};

export const FullListing = Prisma.validator<Prisma.ListingsArgs>()({
  include: {
    listingNeighborhoodAmenities: true,
    applicationMethods: {
      include: {
        paperApplications: {
          include: {
            assets: true,
          },
        },
      },
    },
    listingEvents: {
      include: {
        assets: true,
      },
    },
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
    listingsApplicationDropOffAddress: true,
    reservedCommunityTypes: true,
    listingsBuildingSelectionCriteriaFile: true,
    listingsResult: true,
    listingUtilities: true,
    listingsApplicationMailingAddress: true,
    listingsLeasingAgentAddress: true,
    listingFeatures: true,
    jurisdictions: true,
    listingsApplicationPickUpAddress: true,
    listingsBuildingAddress: true,
    units: {
      include: {
        unitTypes: true,
        amiChart: {
          include: {
            amiChartItem: true,
          },
        },
        unitAmiChartOverrides: true,
        unitAccessibilityPriorityTypes: true,
        unitRentTypes: true,
      },
    },
    unitGroup: {
      include: {
        unitAccessibilityPriorityTypes: true,
        unitGroupAmiLevels: {
          include: {
            amiChart: {
              include: {
                amiChartItem: true,
                unitGroupAmiLevels: true,
              },
            },
          },
        },
        unitTypes: true,
      },
    },
    unitsSummary: {
      include: {
        unitTypes: true,
        unitAccessibilityPriorityTypes: true,
      },
    },
  },
});

export type FullListingType = Prisma.ListingsGetPayload<typeof FullListing>;

const views: Record<string, Prisma.ListingsInclude> = {
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

/*
  this is the service for listings
  it handles all the backend's business logic for reading in listing(s)
*/
@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of listings given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of listings, and some meta information to help with pagination
  */
  async list(params: ListingsQueryParams) {
    const whereClause = this.buildWhereClause(params.filter, params.search);
    const isPaginated = shouldPaginate(params.limit, params.page);

    const count = await this.prisma.listings.count({
      where: whereClause,
    });

    const listings = (await this.prisma.listings.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy(params.orderBy, params.orderDir),
      include: views[params.view ?? 'full'],
      where: whereClause,
    })) as FullListingType[];

    // listings.forEach((listing) => {
    //   listing.unitsSummarized = {
    //     byUnitTypeAndRent: this.summarizeUnitsByTypeAndRent(listing),
    //   };
    // });

    const itemsPerPage = isPaginated ? params.limit : listings.length;
    const totalItems = isPaginated ? count : listings.length;

    const paginationInfo = {
      currentPage: isPaginated ? params.page : 1,
      itemCount: listings.length,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: Math.ceil(
        totalItems / (itemsPerPage !== 'all' ? itemsPerPage : totalItems),
      ),
    };

    return {
      items: listings,
      meta: paginationInfo,
    };
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
        if (ListingFilterKeys.name in filter) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.name],
            key: ListingFilterKeys.name,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({ [ListingFilterKeys.name]: filt })),
          });
        } else if (ListingFilterKeys.status in filter) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.status],
            key: ListingFilterKeys.status,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              [ListingFilterKeys.status]: filt,
            })),
          });
        } else if (ListingFilterKeys.neighborhood in filter) {
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
        } else if (ListingFilterKeys.bedrooms in filter) {
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
        } else if (ListingFilterKeys.zipcode in filter) {
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
        } else if (ListingFilterKeys.leasingAgents in filter) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.leasingAgents],
            key: ListingFilterKeys.leasingAgents,
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
        } else if (ListingFilterKeys.jurisdiction in filter) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[ListingFilterKeys.jurisdiction],
            key: ListingFilterKeys.jurisdiction,
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
    view = 'full',
  ) {
    const result = (await this.prisma.listings.findFirst({
      include: views[view],
      where: {
        id: {
          equals: listingId,
        },
      },
    })) as FullListingType;

    if (!result) {
      throw new NotFoundException();
    }

    if (lang !== LanguagesEnum.en) {
      // TODO: await this.translationService.translateListing(result, lang);
    }

    // await this.addUnitsSummarized(result);
    return result;
  }

  // summarizeUnitsByTypeAndRent = (listing: FullListingType): UnitsSummary[] => {
  //   const summaries: UnitSummary[] = [];
  //   const unitMap: Record<string, Units[]> = {};
  //   const UnitTypeSort = ['SRO', 'studio', 'oneBdrm', 'twoBdrm', 'threeBdrm'];

  //   listing.units.forEach((unit) => {
  //     const currentUnitType = unit.unitTypes;
  //     const currentUnitRent = unit.monthlyRentAsPercentOfIncome;
  //     const thisKey = currentUnitType?.name.concat(`${currentUnitRent}`);
  //     if (!(thisKey in unitMap)) unitMap[thisKey] = [];
  //     unitMap[thisKey].push(unit);
  //   });

  //   for (const key in unitMap) {
  //     const finalSummary = unitMap[key].reduce((summary, unit, index) => {
  //       return getUnitsSummary(unit, index === 0 ? null : summary);
  //     }, {} as UnitSummary);
  //     if (listing.reviewOrderType !== ReviewOrderTypeEnum.waitlist) {
  //       finalSummary.totalAvailable = unitMap[key].length;
  //     }
  //     summaries.push(finalSummary);
  //   }

  //   return summaries.sort((a, b) => {
  //     return (
  //       UnitTypeSort.indexOf(a.unitType.name) -
  //         UnitTypeSort.indexOf(b.unitType.name) ||
  //       Number(a.minIncomeRange.min) - Number(b.minIncomeRange.min)
  //     );
  //   });
  // };
}
