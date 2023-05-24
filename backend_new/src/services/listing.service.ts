import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LanguagesEnum, Prisma } from '@prisma/client';
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
import { ListingGet } from '../dtos/listings/listing-get.dto';
import { mapTo } from '../utilities/mapTo';
import {
  summarizeUnitsByTypeAndRent,
  summarizeUnits,
} from '../utilities/unit-utilities';
import { AmiChart } from '../dtos/units/ami-chart-get.dto';

export type getListingsArgs = {
  skip: number;
  take: number;
  orderBy: any;
  where: Prisma.ListingsWhereInput;
};

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

    const listingsRaw = await this.prisma.listings.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy(params.orderBy, params.orderDir),
      include: views[params.view ?? 'full'],
      where: whereClause,
    });

    const listings = mapTo(ListingGet, listingsRaw);

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
    const itemsPerPage =
      isPaginated && params.limit !== 'all' ? params.limit : listings.length;
    const totalItems = isPaginated ? count : listings.length;

    const paginationInfo = {
      currentPage: isPaginated ? params.page : 1,
      itemCount: listings.length,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: Math.ceil(
        totalItems / itemsPerPage ? itemsPerPage : totalItems,
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
    const listingRaw = await this.prisma.listings.findFirst({
      include: views[view],
      where: {
        id: {
          equals: listingId,
        },
      },
    });

    const result = mapTo(ListingGet, listingRaw);

    if (!result) {
      throw new NotFoundException();
    }

    if (lang !== LanguagesEnum.en) {
      // TODO: await this.translationService.translateListing(result, lang);
    }

    await this.addUnitsSummarized(result);
    return result;
  }

  addUnitsSummarized = async (listing: ListingGet) => {
    if (Array.isArray(listing.units) && listing.units.length > 0) {
      const amiChartsRaw = await this.prisma.amiChart.findMany({
        where: {
          id: {
            in: listing.units.map((unit) => unit.amiChart.id),
          },
        },
      });
      const amiCharts = mapTo(AmiChart, amiChartsRaw);
      listing.unitsSummarized = summarizeUnits(listing, amiCharts);
    }
    return listing;
  };
}
