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
import { Unit } from '../../../src/dtos/units/unit-get.dto';
import { UnitTypeSort } from '../../../src/utilities/unit-utilities';

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

  it('testing list() with params and units', async () => {
    const date = new Date();

    const genUnits = (numberToMake: number): Unit[] => {
      const toReturn: Unit[] = [];

      for (let i = 0; i < numberToMake; i++) {
        toReturn.push({
          id: `unit ${i}`,
          createdAt: date,
          updatedAt: date,
          amiPercentage: `${i}`,
          annualIncomeMin: `${i}`,
          monthlyIncomeMin: `${i}`,
          floor: i,
          annualIncomeMax: `${i}`,
          maxOccupancy: i,
          minOccupancy: i,
          monthlyRent: `${i}`,
          numBathrooms: i,
          numBedrooms: i,
          number: `unit ${i}`,
          sqFeet: `${i}`,
          monthlyRentAsPercentOfIncome: `${i % UnitTypeSort.length}`,
          bmrProgramChart: !(i % 2),
          unitTypes: {
            id: `unitType ${i}`,
            createdAt: date,
            updatedAt: date,
            name: UnitTypeSort[i % UnitTypeSort.length],
            numBedrooms: i,
          },
          unitAmiChartOverrides: {
            id: `unitAmiChartOverrides ${i}`,
            createdAt: date,
            updatedAt: date,
            items: [
              {
                percentOfAmi: i,
                householdSize: i,
                income: i,
              },
            ],
          },
        });
      }
      return toReturn;
    };

    prisma.listings.findMany = jest
      .fn()
      .mockResolvedValue([{ id: 9, name: 'listing 10', units: genUnits(9) }]);

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

    const res = await service.list(params);

    expect(res.items[0].name).toEqual(`listing ${10}`);
    expect(res.items[0].units).toEqual(genUnits(9));
    expect(res.items[0].unitsSummarized).toEqual({
      byUnitTypeAndRent: [
        {
          unitTypes: {
            createdAt: date,
            updatedAt: date,
            id: 'unitType 0',
            name: UnitTypeSort[0],
            numBedrooms: 0,
          },
          minIncomeRange: {
            max: '$5',
            min: '$0',
          },
          occupancyRange: {
            max: 5,
            min: 0,
          },
          rentAsPercentIncomeRange: {
            max: 0,
            min: 0,
          },
          rentRange: {
            max: '$5',
            min: '$0',
          },
          totalAvailable: 2,
          areaRange: {
            max: 5,
            min: 0,
          },
          floorRange: {
            max: 5,
            min: 0,
          },
        },
        {
          unitTypes: {
            createdAt: date,
            updatedAt: date,
            id: 'unitType 1',
            name: UnitTypeSort[1],
            numBedrooms: 1,
          },
          minIncomeRange: {
            max: '$6',
            min: '$1',
          },
          occupancyRange: {
            max: 6,
            min: 1,
          },
          rentAsPercentIncomeRange: {
            max: 1,
            min: 1,
          },
          rentRange: {
            max: '$6',
            min: '$1',
          },
          totalAvailable: 2,
          areaRange: {
            max: 6,
            min: 1,
          },
          floorRange: {
            max: 6,
            min: 1,
          },
        },
        {
          unitTypes: {
            createdAt: date,
            updatedAt: date,
            id: 'unitType 2',
            name: UnitTypeSort[2],
            numBedrooms: 2,
          },
          minIncomeRange: {
            max: '$7',
            min: '$2',
          },
          occupancyRange: {
            max: 7,
            min: 2,
          },
          rentAsPercentIncomeRange: {
            max: 2,
            min: 2,
          },
          rentRange: {
            max: '$7',
            min: '$2',
          },
          totalAvailable: 2,
          areaRange: {
            max: 7,
            min: 2,
          },
          floorRange: {
            max: 7,
            min: 2,
          },
        },
        {
          unitTypes: {
            createdAt: date,
            updatedAt: date,
            id: 'unitType 3',
            name: UnitTypeSort[3],
            numBedrooms: 3,
          },
          minIncomeRange: {
            max: '$8',
            min: '$3',
          },
          occupancyRange: {
            max: 8,
            min: 3,
          },
          rentAsPercentIncomeRange: {
            max: 3,
            min: 3,
          },
          rentRange: {
            max: '$8',
            min: '$3',
          },
          totalAvailable: 2,
          areaRange: {
            max: 8,
            min: 3,
          },
          floorRange: {
            max: 8,
            min: 3,
          },
        },
        {
          unitTypes: {
            createdAt: date,
            updatedAt: date,
            id: 'unitType 4',
            name: UnitTypeSort[4],
            numBedrooms: 4,
          },
          minIncomeRange: {
            max: '$4',
            min: '$4',
          },
          occupancyRange: {
            max: 4,
            min: 4,
          },
          rentAsPercentIncomeRange: {
            max: 4,
            min: 4,
          },
          rentRange: {
            max: '$4',
            min: '$4',
          },
          totalAvailable: 1,
          areaRange: {
            max: 4,
            min: 4,
          },
          floorRange: {
            max: 4,
            min: 4,
          },
        },
      ],
    });

    expect(res.meta).toEqual({
      currentPage: 2,
      itemCount: 1,
      itemsPerPage: 10,
      totalItems: 20,
      totalPages: 2,
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

  // work in progress
  it.skip('testing findOne() base view found record and units', async () => {
    const date = new Date();
    const genUnits = (numberToMake: number): Unit[] => {
      const toReturn: Unit[] = [];

      for (let i = 0; i < numberToMake; i++) {
        toReturn.push({
          id: `unit ${i}`,
          createdAt: date,
          updatedAt: date,
          amiPercentage: `${i}`,
          annualIncomeMin: `${i}`,
          monthlyIncomeMin: `${i}`,
          floor: i,
          annualIncomeMax: `${i}`,
          maxOccupancy: i,
          minOccupancy: i,
          monthlyRent: `${i}`,
          numBathrooms: i,
          numBedrooms: i,
          number: `unit ${i}`,
          sqFeet: `${i}`,
          monthlyRentAsPercentOfIncome: `${i % UnitTypeSort.length}`,
          bmrProgramChart: !(i % 2),
          unitTypes: {
            id: `unitType ${i}`,
            createdAt: date,
            updatedAt: date,
            name: UnitTypeSort[i % UnitTypeSort.length],
            numBedrooms: i,
          },
          unitAmiChartOverrides: {
            id: `unitAmiChartOverrides ${i}`,
            createdAt: date,
            updatedAt: date,
            items: [
              {
                percentOfAmi: i,
                householdSize: i,
                income: i,
              },
            ],
          },
        });
      }
      return toReturn;
    };

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
});
