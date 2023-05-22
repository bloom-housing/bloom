import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { ListingService } from '../../../src/services/listing.service';
import { ListingsQueryParams } from '../../../src/dtos/listings/listings-query-params.dto';
import { ListingOrderByKeys } from '../../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { ListingFilterKeys } from '../../../src/enums/listings/filter-key-enum';
import { Compare } from '../../../src/dtos/shared/base-filter.dto';
import { ListingFilterParams } from '../../../src/dtos/listings/listings-filter-params.dto';
import { LanguagesEnum } from '@prisma/client';
describe('Testing listing service', () => {
  let service: ListingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingService, PrismaService],
    }).compile();

    service = module.get<ListingService>(ListingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list() with no params', async () => {
    prisma.listings.findMany = jest.fn().mockResolvedValue([
      { id: 0, name: 'listing 1' },
      { id: 1, name: 'listing 2' },
      { id: 2, name: 'listing 3' },
      { id: 3, name: 'listing 4' },
      { id: 4, name: 'listing 5' },
      { id: 5, name: 'listing 6' },
      { id: 6, name: 'listing 7' },
      { id: 7, name: 'listing 8' },
      { id: 8, name: 'listing 9' },
      { id: 9, name: 'listing 10' },
    ]);

    prisma.listings.count = jest.fn().mockResolvedValue(10);

    const params: ListingsQueryParams = {};

    expect(await service.list(params)).toEqual({
      items: [
        { id: 0, name: 'listing 1' },
        { id: 1, name: 'listing 2' },
        { id: 2, name: 'listing 3' },
        { id: 3, name: 'listing 4' },
        { id: 4, name: 'listing 5' },
        { id: 5, name: 'listing 6' },
        { id: 6, name: 'listing 7' },
        { id: 7, name: 'listing 8' },
        { id: 8, name: 'listing 9' },
        { id: 9, name: 'listing 10' },
      ],
      meta: {
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 10,
        totalPages: 1,
      },
    });

    expect(prisma.listings.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: undefined,
      orderBy: undefined,
      where: {
        AND: [],
      },
      include: {
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
      },
    });

    expect(prisma.listings.count).toHaveBeenCalledWith({
      where: {
        AND: [],
      },
    });
  });

  it('testing list() with params', async () => {
    prisma.listings.findMany = jest.fn().mockResolvedValue([
      { id: 0, name: 'listing 1' },
      { id: 1, name: 'listing 2' },
      { id: 2, name: 'listing 3' },
      { id: 3, name: 'listing 4' },
      { id: 4, name: 'listing 5' },
      { id: 5, name: 'listing 6' },
      { id: 6, name: 'listing 7' },
      { id: 7, name: 'listing 8' },
      { id: 8, name: 'listing 9' },
      { id: 9, name: 'listing 10' },
    ]);

    prisma.listings.count = jest.fn().mockResolvedValue(20);

    const params: ListingsQueryParams = {
      view: 'base',
      page: 2,
      limit: 10,
      orderBy: [ListingOrderByKeys.name],
      orderDir: [OrderByEnum.ASC],
      search: 'simple search',
      filter: [
        {
          [ListingFilterKeys.name]: 'Listing,name',
          $comparison: Compare.IN,
        },
        {
          [ListingFilterKeys.bedrooms]: 2,
          $comparison: Compare['>='],
        },
      ],
    };

    expect(await service.list(params)).toEqual({
      items: [
        { id: 0, name: 'listing 1' },
        { id: 1, name: 'listing 2' },
        { id: 2, name: 'listing 3' },
        { id: 3, name: 'listing 4' },
        { id: 4, name: 'listing 5' },
        { id: 5, name: 'listing 6' },
        { id: 6, name: 'listing 7' },
        { id: 7, name: 'listing 8' },
        { id: 8, name: 'listing 9' },
        { id: 9, name: 'listing 10' },
      ],
      meta: {
        currentPage: 2,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 20,
        totalPages: 2,
      },
    });

    expect(prisma.listings.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      orderBy: [
        {
          name: 'asc',
        },
      ],
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  in: ['listing', 'name'],
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            OR: [
              {
                units: {
                  some: {
                    numBedrooms: {
                      gte: 2,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
          {
            name: {
              contains: 'simple search',
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
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
        units: {
          include: {
            unitTypes: true,
            unitAmiChartOverrides: true,
          },
        },
      },
    });

    expect(prisma.listings.count).toHaveBeenCalledWith({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  in: ['listing', 'name'],
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            OR: [
              {
                units: {
                  some: {
                    numBedrooms: {
                      gte: 2,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
          {
            name: {
              contains: 'simple search',
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  });

  it('testing buildWhereClause() with params no search', async () => {
    const params: ListingFilterParams[] = [
      {
        [ListingFilterKeys.name]: 'Listing,name',
        $comparison: Compare.IN,
      },
      {
        [ListingFilterKeys.bedrooms]: 2,
        $comparison: Compare['>='],
      },
    ];

    expect(service.buildWhereClause(params)).toEqual({
      AND: [
        {
          OR: [
            {
              name: {
                in: ['listing', 'name'],
                mode: 'insensitive',
              },
            },
          ],
        },
        {
          OR: [
            {
              units: {
                some: {
                  numBedrooms: {
                    gte: 2,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('testing buildWhereClause() with no params, search present', async () => {
    expect(service.buildWhereClause(null, 'simple search')).toEqual({
      AND: [
        {
          name: {
            contains: 'simple search',
            mode: 'insensitive',
          },
        },
      ],
    });
  });

  it('testing buildWhereClause() with params, and search present', async () => {
    const params: ListingFilterParams[] = [
      {
        [ListingFilterKeys.name]: 'Listing,name',
        $comparison: Compare.IN,
      },
      {
        [ListingFilterKeys.bedrooms]: 2,
        $comparison: Compare['>='],
      },
    ];

    expect(service.buildWhereClause(params, 'simple search')).toEqual({
      AND: [
        {
          OR: [
            {
              name: {
                in: ['listing', 'name'],
                mode: 'insensitive',
              },
            },
          ],
        },
        {
          OR: [
            {
              units: {
                some: {
                  numBedrooms: {
                    gte: 2,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
        {
          name: {
            contains: 'simple search',
            mode: 'insensitive',
          },
        },
      ],
    });
  });

  it('testing findOne() base view found record', async () => {
    prisma.listings.findFirst = jest
      .fn()
      .mockResolvedValue({ id: 0, name: 'listing 1' });

    expect(
      await service.findOne('listingId', LanguagesEnum.en, 'base'),
    ).toEqual({ id: 0, name: 'listing 1' });

    expect(prisma.listings.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'listingId',
        },
      },
      include: {
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
        units: {
          include: {
            unitTypes: true,
            unitAmiChartOverrides: true,
          },
        },
      },
    });
  });

  it('testing findOne() base view no record found', async () => {
    prisma.listings.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () =>
        await service.findOne(
          'a different listingId',
          LanguagesEnum.en,
          'details',
        ),
    ).rejects.toThrowError();

    expect(prisma.listings.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'a different listingId',
        },
      },
      include: {
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
      },
    });
  });
});
