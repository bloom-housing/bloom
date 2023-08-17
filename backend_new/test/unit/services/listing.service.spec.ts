import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { ListingService } from '../../../src/services/listing.service';
import { ListingsQueryParams } from '../../../src/dtos/listings/listings-query-params.dto';
import { ListingOrderByKeys } from '../../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { ListingFilterKeys } from '../../../src/enums/listings/filter-key-enum';
import { Compare } from '../../../src/dtos/shared/base-filter.dto';
import { ListingFilterParams } from '../../../src/dtos/listings/listings-filter-params.dto';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from '@prisma/client';
import { Unit } from '../../../src/dtos/units/unit.dto';
import { UnitTypeSort } from '../../../src/utilities/unit-utilities';
import { Listing } from '../../../src/dtos/listings/listing.dto';
import { ListingViews } from '../../../src/enums/listings/view-enum';
import { TranslationService } from '../../../src/services/translation.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { ListingCreate } from '../../../src/dtos/listings/listing-create.dto';
import { randomUUID } from 'crypto';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ListingUpdate } from '../../../src/dtos/listings/listing-update.dto';
import { ListingPublishedCreate } from '../../../src/dtos/listings/listing-published-create.dto';
import { ListingPublishedUpdate } from 'src/dtos/listings/listing-published-update.dto';

/*
  generates a super simple mock listing for us to test logic with
*/
const mockListing = (
  pos: number,
  genUnits?: { numberToMake: number; date: Date },
) => {
  const toReturn = { id: pos, name: `listing ${pos + 1}`, units: undefined };
  if (genUnits) {
    const units: Unit[] = [];
    const { numberToMake, date } = genUnits;
    for (let i = 0; i < numberToMake; i++) {
      units.push({
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
          name: UnitTypeSort[i % UnitTypeSort.length] as UnitTypeEnum,
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
        amiChart: {
          id: `AMI${i}`,
          items: [],
          name: `AMI Name ${i}`,
          createdAt: date,
          updatedAt: date,
          jurisdictions: {
            id: 'jurisdiction ID',
          },
        },
      });
    }
    toReturn.units = units;
  }

  return toReturn;
};

const mockListingSet = (
  pos: number,
  genUnits?: { numberToMake: number; date: Date },
) => {
  const toReturn = [];
  for (let i = 0; i < pos; i++) {
    toReturn.push(mockListing(i, genUnits));
  }
  return toReturn;
};

describe('Testing listing service', () => {
  let service: ListingService;
  let prisma: PrismaService;

  const googleTranslateServiceMock = {
    isConfigured: () => true,
    fetch: jest.fn(),
  };

  const httpServiceMock = {
    request: jest.fn().mockReturnValue(
      of({
        status: 200,
        statusText: 'OK',
      }),
    ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingService,
        PrismaService,
        TranslationService,
        {
          provide: GoogleTranslateService,
          useValue: googleTranslateServiceMock,
        },
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<ListingService>(ListingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(() => {
    process.env.PROXY_URL = undefined;
  });

  it('should handle call to list() with no params sent', async () => {
    prisma.listings.findMany = jest.fn().mockResolvedValue(mockListingSet(10));

    prisma.listings.count = jest.fn().mockResolvedValue(10);

    const params: ListingsQueryParams = {};

    await service.list(params);

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

  it('should handle call to list() with params sent', async () => {
    prisma.listings.findMany = jest.fn().mockResolvedValue(mockListingSet(10));

    prisma.listings.count = jest.fn().mockResolvedValue(20);

    const params: ListingsQueryParams = {
      view: ListingViews.base,
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

    await service.list(params);

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
            amiChart: {
              include: {
                amiChartItem: true,
              },
            },
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

  it('should build where clause when only params sent', async () => {
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

  it('should build where clause when only search param sent', async () => {
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

  it('should build where clause when params, and search param sent', async () => {
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

  it('should return records from findOne() with base view', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue(mockListing(0));

    await service.findOne('listingId', LanguagesEnum.en, ListingViews.base);

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'listingId',
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
            amiChart: {
              include: {
                amiChartItem: true,
              },
            },
          },
        },
      },
    });
  });

  it('should handle no records returned when findOne() is called with base view', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () =>
        await service.findOne(
          'a different listingId',
          LanguagesEnum.en,
          ListingViews.details,
        ),
    ).rejects.toThrowError();

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'a different listingId',
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

  it('should get records from list() with params and units', async () => {
    const date = new Date();

    prisma.listings.findMany = jest
      .fn()
      .mockResolvedValue([mockListing(9, { numberToMake: 9, date })]);

    prisma.listings.count = jest.fn().mockResolvedValue(20);

    const params: ListingsQueryParams = {
      view: ListingViews.base,
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
    expect(res.items[0].units).toEqual(
      mockListing(9, { numberToMake: 9, date }).units,
    );
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
            amiChart: {
              include: {
                amiChartItem: true,
              },
            },
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

  it('should get records from findOne() with base view found and units', async () => {
    const date = new Date();

    const mockedListing = mockListing(0, { numberToMake: 10, date });

    prisma.listings.findUnique = jest.fn().mockResolvedValue(mockedListing);

    prisma.amiChart.findMany = jest.fn().mockResolvedValue([
      {
        id: 'AMI0',
        items: [],
        name: '`AMI Name 0`',
      },
      {
        id: 'AMI1',
        items: [],
        name: '`AMI Name 1`',
      },
    ]);

    const listing: Listing = await service.findOne(
      'listingId',
      LanguagesEnum.en,
      ListingViews.base,
    );

    expect(listing.id).toEqual('0');
    expect(listing.name).toEqual('listing 1');
    expect(listing.units).toEqual(mockedListing.units);
    expect(listing.unitsSummarized).toEqual({
      amiPercentages: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      priorityTypes: [],
      unitTypes: [
        {
          createdAt: date,
          id: 'unitType 0',
          name: 'SRO',
          numBedrooms: 0,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 1',
          name: 'studio',
          numBedrooms: 1,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 2',
          name: 'oneBdrm',
          numBedrooms: 2,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 3',
          name: 'twoBdrm',
          numBedrooms: 3,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 4',
          name: 'threeBdrm',
          numBedrooms: 4,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 5',
          name: 'SRO',
          numBedrooms: 5,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 6',
          name: 'studio',
          numBedrooms: 6,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 7',
          name: 'oneBdrm',
          numBedrooms: 7,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 8',
          name: 'twoBdrm',
          numBedrooms: 8,
          updatedAt: date,
        },
        {
          createdAt: date,
          id: 'unitType 9',
          name: 'threeBdrm',
          numBedrooms: 9,
          updatedAt: date,
        },
      ],
      byAMI: [
        {
          byUnitType: [
            {
              areaRange: {
                max: 0,
                min: 0,
              },
              floorRange: {
                max: 0,
                min: 0,
              },
              minIncomeRange: {
                max: '$0',
                min: '$0',
              },
              occupancyRange: {
                max: 0,
                min: 0,
              },
              rentAsPercentIncomeRange: {
                max: 0,
                min: 0,
              },
              rentRange: {
                max: '$0',
                min: '$0',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 0',
                name: 'SRO',
                numBedrooms: 0,
                updatedAt: date,
              },
            },
          ],
          percent: '0',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 1,
                min: 1,
              },
              floorRange: {
                max: 1,
                min: 1,
              },
              minIncomeRange: {
                max: '$1',
                min: '$1',
              },
              occupancyRange: {
                max: 1,
                min: 1,
              },
              rentAsPercentIncomeRange: {
                max: 1,
                min: 1,
              },
              rentRange: {
                max: '$1',
                min: '$1',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 1',
                name: 'studio',
                numBedrooms: 1,
                updatedAt: date,
              },
            },
          ],
          percent: '1',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 2,
                min: 2,
              },
              floorRange: {
                max: 2,
                min: 2,
              },
              minIncomeRange: {
                max: '$2',
                min: '$2',
              },
              occupancyRange: {
                max: 2,
                min: 2,
              },
              rentAsPercentIncomeRange: {
                max: 2,
                min: 2,
              },
              rentRange: {
                max: '$2',
                min: '$2',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 2',
                name: 'oneBdrm',
                numBedrooms: 2,
                updatedAt: date,
              },
            },
          ],
          percent: '2',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 3,
                min: 3,
              },
              floorRange: {
                max: 3,
                min: 3,
              },
              minIncomeRange: {
                max: '$3',
                min: '$3',
              },
              occupancyRange: {
                max: 3,
                min: 3,
              },
              rentAsPercentIncomeRange: {
                max: 3,
                min: 3,
              },
              rentRange: {
                max: '$3',
                min: '$3',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 3',
                name: 'twoBdrm',
                numBedrooms: 3,
                updatedAt: date,
              },
            },
          ],
          percent: '3',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 4,
                min: 4,
              },
              floorRange: {
                max: 4,
                min: 4,
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
              unitTypes: {
                createdAt: date,
                id: 'unitType 4',
                name: 'threeBdrm',
                numBedrooms: 4,
                updatedAt: date,
              },
            },
          ],
          percent: '4',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 5,
                min: 5,
              },
              floorRange: {
                max: 5,
                min: 5,
              },
              minIncomeRange: {
                max: '$5',
                min: '$5',
              },
              occupancyRange: {
                max: 5,
                min: 5,
              },
              rentAsPercentIncomeRange: {
                max: 0,
                min: 0,
              },
              rentRange: {
                max: '$5',
                min: '$5',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 5',
                name: 'SRO',
                numBedrooms: 5,
                updatedAt: date,
              },
            },
          ],
          percent: '5',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 6,
                min: 6,
              },
              floorRange: {
                max: 6,
                min: 6,
              },
              minIncomeRange: {
                max: '$6',
                min: '$6',
              },
              occupancyRange: {
                max: 6,
                min: 6,
              },
              rentAsPercentIncomeRange: {
                max: 1,
                min: 1,
              },
              rentRange: {
                max: '$6',
                min: '$6',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 6',
                name: 'studio',
                numBedrooms: 6,
                updatedAt: date,
              },
            },
          ],
          percent: '6',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 7,
                min: 7,
              },
              floorRange: {
                max: 7,
                min: 7,
              },
              minIncomeRange: {
                max: '$7',
                min: '$7',
              },
              occupancyRange: {
                max: 7,
                min: 7,
              },
              rentAsPercentIncomeRange: {
                max: 2,
                min: 2,
              },
              rentRange: {
                max: '$7',
                min: '$7',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 7',
                name: 'oneBdrm',
                numBedrooms: 7,
                updatedAt: date,
              },
            },
          ],
          percent: '7',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 8,
                min: 8,
              },
              floorRange: {
                max: 8,
                min: 8,
              },
              minIncomeRange: {
                max: '$8',
                min: '$8',
              },
              occupancyRange: {
                max: 8,
                min: 8,
              },
              rentAsPercentIncomeRange: {
                max: 3,
                min: 3,
              },
              rentRange: {
                max: '$8',
                min: '$8',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 8',
                name: 'twoBdrm',
                numBedrooms: 8,
                updatedAt: date,
              },
            },
          ],
          percent: '8',
        },
        {
          byUnitType: [
            {
              areaRange: {
                max: 9,
                min: 9,
              },
              floorRange: {
                max: 9,
                min: 9,
              },
              minIncomeRange: {
                max: '$9',
                min: '$9',
              },
              occupancyRange: {
                max: 9,
                min: 9,
              },
              rentAsPercentIncomeRange: {
                max: 4,
                min: 4,
              },
              rentRange: {
                max: '$9',
                min: '$9',
              },
              totalAvailable: 1,
              unitTypes: {
                createdAt: date,
                id: 'unitType 9',
                name: 'threeBdrm',
                numBedrooms: 9,
                updatedAt: date,
              },
            },
          ],
          percent: '9',
        },
      ],
      byUnitType: [
        {
          areaRange: {
            max: 5,
            min: 0,
          },
          floorRange: {
            max: 5,
            min: 0,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 0',
            name: 'SRO',
            numBedrooms: 0,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 5,
            min: 0,
          },
          floorRange: {
            max: 5,
            min: 0,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 0',
            name: 'SRO',
            numBedrooms: 0,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 6,
            min: 1,
          },
          floorRange: {
            max: 6,
            min: 1,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 1',
            name: 'studio',
            numBedrooms: 1,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 6,
            min: 1,
          },
          floorRange: {
            max: 6,
            min: 1,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 1',
            name: 'studio',
            numBedrooms: 1,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 7,
            min: 2,
          },
          floorRange: {
            max: 7,
            min: 2,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 2',
            name: 'oneBdrm',
            numBedrooms: 2,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 7,
            min: 2,
          },
          floorRange: {
            max: 7,
            min: 2,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 2',
            name: 'oneBdrm',
            numBedrooms: 2,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 8,
            min: 3,
          },
          floorRange: {
            max: 8,
            min: 3,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 3',
            name: 'twoBdrm',
            numBedrooms: 3,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 8,
            min: 3,
          },
          floorRange: {
            max: 8,
            min: 3,
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
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 3',
            name: 'twoBdrm',
            numBedrooms: 3,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 9,
            min: 4,
          },
          floorRange: {
            max: 9,
            min: 4,
          },
          minIncomeRange: {
            max: '$9',
            min: '$4',
          },
          occupancyRange: {
            max: 9,
            min: 4,
          },
          rentAsPercentIncomeRange: {
            max: 4,
            min: 4,
          },
          rentRange: {
            max: '$9',
            min: '$4',
          },
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 4',
            name: 'threeBdrm',
            numBedrooms: 4,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 9,
            min: 4,
          },
          floorRange: {
            max: 9,
            min: 4,
          },
          minIncomeRange: {
            max: '$9',
            min: '$4',
          },
          occupancyRange: {
            max: 9,
            min: 4,
          },
          rentAsPercentIncomeRange: {
            max: 4,
            min: 4,
          },
          rentRange: {
            max: '$9',
            min: '$4',
          },
          totalAvailable: 0,
          unitTypes: {
            createdAt: date,
            id: 'unitType 4',
            name: 'threeBdrm',
            numBedrooms: 4,
            updatedAt: date,
          },
        },
      ],
      byUnitTypeAndRent: [
        {
          areaRange: {
            max: 5,
            min: 0,
          },
          floorRange: {
            max: 5,
            min: 0,
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
          unitTypes: {
            createdAt: date,
            id: 'unitType 0',
            name: 'SRO',
            numBedrooms: 0,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 6,
            min: 1,
          },
          floorRange: {
            max: 6,
            min: 1,
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
          unitTypes: {
            createdAt: date,
            id: 'unitType 1',
            name: 'studio',
            numBedrooms: 1,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 7,
            min: 2,
          },
          floorRange: {
            max: 7,
            min: 2,
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
          unitTypes: {
            createdAt: date,
            id: 'unitType 2',
            name: 'oneBdrm',
            numBedrooms: 2,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 8,
            min: 3,
          },
          floorRange: {
            max: 8,
            min: 3,
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
          unitTypes: {
            createdAt: date,
            id: 'unitType 3',
            name: 'twoBdrm',
            numBedrooms: 3,
            updatedAt: date,
          },
        },
        {
          areaRange: {
            max: 9,
            min: 4,
          },
          floorRange: {
            max: 9,
            min: 4,
          },
          minIncomeRange: {
            max: '$9',
            min: '$4',
          },
          occupancyRange: {
            max: 9,
            min: 4,
          },
          rentAsPercentIncomeRange: {
            max: 4,
            min: 4,
          },
          rentRange: {
            max: '$9',
            min: '$4',
          },
          totalAvailable: 2,
          unitTypes: {
            createdAt: date,
            id: 'unitType 4',
            name: 'threeBdrm',
            numBedrooms: 4,
            updatedAt: date,
          },
        },
      ],
      hmi: {
        columns: {
          ami0: 'listings.percentAMIUnit*percent:0',
          ami1: 'listings.percentAMIUnit*percent:1',
          ami2: 'listings.percentAMIUnit*percent:2',
          ami3: 'listings.percentAMIUnit*percent:3',
          ami4: 'listings.percentAMIUnit*percent:4',
          ami5: 'listings.percentAMIUnit*percent:5',
          ami6: 'listings.percentAMIUnit*percent:6',
          ami7: 'listings.percentAMIUnit*percent:7',
          ami8: 'listings.percentAMIUnit*percent:8',
          ami9: 'listings.percentAMIUnit*percent:9',
          sizeColumn: 't.unitType',
        },
        rows: [],
      },
    });

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'listingId',
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
            amiChart: {
              include: {
                amiChartItem: true,
              },
            },
          },
        },
      },
    });

    expect(prisma.amiChart.findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: mockedListing.units.map((unit) => unit.amiChart.id),
        },
      },
    });
  });

  it('should return listings from findListingsWithMultiSelectQuestion()', async () => {
    prisma.listings.findMany = jest.fn().mockResolvedValue([
      {
        id: 'example id',
        name: 'example name',
      },
    ]);

    const listings = await service.findListingsWithMultiSelectQuestion(
      'multiselectQuestionId 1',
    );

    expect(listings.length).toEqual(1);
    expect(listings[0].id).toEqual('example id');
    expect(listings[0].name).toEqual('example name');

    expect(prisma.listings.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
      },
      where: {
        listingMultiselectQuestions: {
          some: {
            multiselectQuestionId: 'multiselectQuestionId 1',
          },
        },
      },
    });
  });

  it('should create a simple listing', async () => {
    prisma.listings.create = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });

    await service.create({
      name: 'example listing name',
      depositMin: '5',
      assets: [
        {
          fileId: randomUUID(),
          label: 'example asset',
        },
      ],
      jurisdictions: {
        id: randomUUID(),
      },
      status: ListingsStatusEnum.pending,
      displayWaitlistSize: false,
      unitsSummary: null,
      listingEvents: [],
    } as ListingCreate);

    expect(prisma.listings.create).toHaveBeenCalledWith({
      include: {
        applicationMethods: {
          include: {
            paperApplications: {
              include: {
                assets: true,
              },
            },
          },
        },
        jurisdictions: true,
        listingEvents: {
          include: {
            assets: true,
          },
        },
        listingFeatures: true,
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
        listingUtilities: true,
        listingsApplicationDropOffAddress: true,
        listingsApplicationPickUpAddress: true,
        listingsBuildingAddress: true,
        listingsBuildingSelectionCriteriaFile: true,
        listingsLeasingAgentAddress: true,
        listingsResult: true,
        reservedCommunityTypes: true,
        units: {
          include: {
            amiChart: {
              include: {
                amiChartItem: true,
                jurisdictions: true,
                unitGroupAmiLevels: true,
              },
            },
            unitAccessibilityPriorityTypes: true,
            unitAmiChartOverrides: true,
            unitRentTypes: true,
            unitTypes: true,
          },
        },
      },
      data: {
        name: 'example listing name',
        depositMin: '5',
        assets: {
          create: [
            {
              fileId: expect.anything(),
              label: 'example asset',
            },
          ],
        },
        jurisdictions: {
          connect: {
            id: expect.anything(),
          },
        },
        status: ListingsStatusEnum.pending,
        displayWaitlistSize: false,
        unitsSummary: undefined,
        listingEvents: {
          create: [],
        },
      },
    });
  });

  it('should create a complete listing', async () => {
    prisma.listings.create = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });

    const exampleAddress = {
      city: 'Exygy',
      state: 'CA',
      zipCode: '94104',
      street: '548 Market St',
    };

    const exampleAsset = {
      fileId: randomUUID(),
      label: 'example asset label',
    };

    const val: ListingPublishedCreate = {
      assets: [exampleAsset],
      listingsBuildingAddress: exampleAddress,
      depositMin: '1000',
      depositMax: '5000',
      developer: 'example developer',
      digitalApplication: true,
      listingImages: [
        {
          ordinal: 0,
          assets: exampleAsset,
        },
      ],
      leasingAgentEmail: 'leasingAgent@exygy.com',
      leasingAgentName: 'Leasing Agent',
      leasingAgentPhone: '520-750-8811',
      name: 'example listing',
      paperApplication: false,
      referralOpportunity: false,
      rentalAssistance: 'rental assistance',
      reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
      units: [
        {
          amiPercentage: '1',
          annualIncomeMin: '2',
          monthlyIncomeMin: '3',
          floor: 4,
          annualIncomeMax: '5',
          maxOccupancy: 6,
          minOccupancy: 7,
          monthlyRent: '8',
          numBathrooms: 9,
          numBedrooms: 10,
          number: '11',
          sqFeet: '12',
          monthlyRentAsPercentOfIncome: '13',
          bmrProgramChart: true,
          unitTypes: {
            id: randomUUID(),
          },
          amiChart: {
            id: randomUUID(),
          },
          unitAccessibilityPriorityTypes: {
            id: randomUUID(),
          },
          unitRentTypes: {
            id: randomUUID(),
          },
          unitAmiChartOverrides: {
            items: [
              {
                percentOfAmi: 10,
                householdSize: 20,
                income: 30,
              },
            ],
          },
        },
      ],
      listingMultiselectQuestions: [
        {
          id: randomUUID(),
          ordinal: 0,
        },
      ],
      applicationMethods: [
        {
          type: ApplicationMethodsTypeEnum.Internal,
          label: 'example label',
          externalReference: 'example reference',
          acceptsPostmarkedApplications: false,
          phoneNumber: '520-750-8811',
          paperApplications: [
            {
              language: LanguagesEnum.en,
              assets: exampleAsset,
            },
          ],
        },
      ],
      unitsSummary: [
        {
          unitTypes: {
            id: randomUUID(),
          },
          monthlyRentMin: 1,
          monthlyRentMax: 2,
          monthlyRentAsPercentOfIncome: '3',
          amiPercentage: 4,
          minimumIncomeMin: '5',
          minimumIncomeMax: '6',
          maxOccupancy: 7,
          minOccupancy: 8,
          floorMin: 9,
          floorMax: 10,
          sqFeetMin: '11',
          sqFeetMax: '12',
          unitAccessibilityPriorityTypes: {
            id: randomUUID(),
          },
          totalCount: 13,
          totalAvailable: 14,
        },
      ],
      listingsApplicationPickUpAddress: exampleAddress,
      listingsApplicationMailingAddress: exampleAddress,
      listingsApplicationDropOffAddress: exampleAddress,
      listingsLeasingAgentAddress: exampleAddress,
      listingsBuildingSelectionCriteriaFile: exampleAsset,
      listingsResult: exampleAsset,
      listingEvents: [
        {
          type: ListingEventsTypeEnum.openHouse,
          startDate: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          url: 'https://www.google.com',
          note: 'example note',
          label: 'example label',
          assets: exampleAsset,
        },
      ],
      additionalApplicationSubmissionNotes: 'app submission notes',
      commonDigitalApplication: true,
      accessibility: 'accessibility string',
      amenities: 'amenities string',
      buildingTotalUnits: 5,
      householdSizeMax: 9,
      householdSizeMin: 1,
      neighborhood: 'neighborhood string',
      petPolicy: 'we love pets',
      smokingPolicy: 'smokeing policy string',
      unitsAvailable: 15,
      unitAmenities: 'unit amenity string',
      servicesOffered: 'services offered string',
      yearBuilt: 2023,
      applicationDueDate: new Date(),
      applicationOpenDate: new Date(),
      applicationFee: 'application fee string',
      applicationOrganization: 'app organization string',
      applicationPickUpAddressOfficeHours: 'pick up office hours string',
      applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
      applicationDropOffAddressOfficeHours: 'drop off office hours string',
      applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
      applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
      buildingSelectionCriteria: 'selection criteria',
      costsNotIncluded: 'all costs included',
      creditHistory: 'credit history',
      criminalBackground: 'criminal background',
      depositHelperText: 'deposit helper text',
      disableUnitsAccordion: false,
      leasingAgentOfficeHours: 'leasing agent office hours',
      leasingAgentTitle: 'leasing agent title',
      postmarkedApplicationsReceivedByDate: new Date(),
      programRules: 'program rules',
      rentalHistory: 'rental history',
      requiredDocuments: 'required docs',
      specialNotes: 'special notes',
      waitlistCurrentSize: 0,
      waitlistMaxSize: 100,
      whatToExpect: 'what to expect',
      status: ListingsStatusEnum.active,
      displayWaitlistSize: true,
      reservedCommunityDescription: 'reserved community description',
      reservedCommunityMinAge: 66,
      resultLink: 'result link',
      isWaitlistOpen: true,
      waitlistOpenSpots: 100,
      customMapPin: false,
      jurisdictions: {
        id: randomUUID(),
      },
      reservedCommunityTypes: {
        id: randomUUID(),
      },
      listingFeatures: {
        elevator: true,
        wheelchairRamp: false,
        serviceAnimalsAllowed: true,
        accessibleParking: false,
        parkingOnSite: true,
        inUnitWasherDryer: false,
        laundryInBuilding: true,
        barrierFreeEntrance: false,
        rollInShower: true,
        grabBars: false,
        heatingInUnit: true,
        acInUnit: false,
        hearing: true,
        visual: false,
        mobility: true,
      },
      listingUtilities: {
        water: false,
        gas: true,
        trash: false,
        sewer: true,
        electricity: false,
        cable: true,
        phone: false,
        internet: true,
      },
    };

    await service.create(val as ListingCreate);

    expect(prisma.listings.create).toHaveBeenCalledWith({
      include: {
        applicationMethods: {
          include: {
            paperApplications: {
              include: {
                assets: true,
              },
            },
          },
        },
        jurisdictions: true,
        listingEvents: {
          include: {
            assets: true,
          },
        },
        listingFeatures: true,
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
        listingUtilities: true,
        listingsApplicationDropOffAddress: true,
        listingsApplicationPickUpAddress: true,
        listingsBuildingAddress: true,
        listingsBuildingSelectionCriteriaFile: true,
        listingsLeasingAgentAddress: true,
        listingsResult: true,
        reservedCommunityTypes: true,
        units: {
          include: {
            amiChart: {
              include: {
                amiChartItem: true,
                jurisdictions: true,
                unitGroupAmiLevels: true,
              },
            },
            unitAccessibilityPriorityTypes: true,
            unitAmiChartOverrides: true,
            unitRentTypes: true,
            unitTypes: true,
          },
        },
      },
      data: {
        ...val,
        assets: {
          create: [exampleAsset],
        },
        applicationMethods: {
          create: [
            {
              type: ApplicationMethodsTypeEnum.Internal,
              label: 'example label',
              externalReference: 'example reference',
              acceptsPostmarkedApplications: false,
              phoneNumber: '520-750-8811',
              paperApplications: {
                create: [
                  {
                    language: LanguagesEnum.en,
                    assets: {
                      create: {
                        ...exampleAsset,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        listingEvents: {
          create: [
            {
              type: ListingEventsTypeEnum.openHouse,
              startDate: expect.anything(),
              startTime: expect.anything(),
              endTime: expect.anything(),
              url: 'https://www.google.com',
              note: 'example note',
              label: 'example label',
              assets: {
                create: {
                  ...exampleAsset,
                },
              },
            },
          ],
        },
        listingImages: {
          create: [
            {
              assets: {
                create: {
                  ...exampleAsset,
                },
              },
              ordinal: 0,
            },
          ],
        },
        listingMultiselectQuestions: {
          create: [
            {
              ordinal: 0,
              multiselectQuestions: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        listingsApplicationDropOffAddress: {
          create: {
            ...exampleAddress,
          },
        },
        reservedCommunityTypes: {
          connect: {
            id: expect.anything(),
          },
        },
        listingsBuildingSelectionCriteriaFile: {
          create: {
            ...exampleAsset,
          },
        },
        listingUtilities: {
          create: {
            water: false,
            gas: true,
            trash: false,
            sewer: true,
            electricity: false,
            cable: true,
            phone: false,
            internet: true,
          },
        },
        listingsApplicationMailingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingsLeasingAgentAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingFeatures: {
          create: {
            elevator: true,
            wheelchairRamp: false,
            serviceAnimalsAllowed: true,
            accessibleParking: false,
            parkingOnSite: true,
            inUnitWasherDryer: false,
            laundryInBuilding: true,
            barrierFreeEntrance: false,
            rollInShower: true,
            grabBars: false,
            heatingInUnit: true,
            acInUnit: false,
            hearing: true,
            visual: false,
            mobility: true,
          },
        },
        jurisdictions: {
          connect: {
            id: expect.anything(),
          },
        },
        listingsApplicationPickUpAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingsBuildingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        units: {
          create: [
            {
              amiPercentage: '1',
              annualIncomeMin: '2',
              monthlyIncomeMin: '3',
              floor: 4,
              annualIncomeMax: '5',
              maxOccupancy: 6,
              minOccupancy: 7,
              monthlyRent: '8',
              numBathrooms: 9,
              numBedrooms: 10,
              number: '11',
              sqFeet: '12',
              monthlyRentAsPercentOfIncome: '13',
              bmrProgramChart: true,
              unitTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              amiChart: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitAmiChartOverrides: {
                create: {
                  items: {
                    items: [
                      {
                        percentOfAmi: 10,
                        householdSize: 20,
                        income: 30,
                      },
                    ],
                  },
                },
              },
              unitAccessibilityPriorityTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitRentTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        unitsSummary: {
          create: [
            {
              monthlyRentMin: 1,
              monthlyRentMax: 2,
              monthlyRentAsPercentOfIncome: '3',
              amiPercentage: 4,
              minimumIncomeMin: '5',
              minimumIncomeMax: '6',
              maxOccupancy: 7,
              minOccupancy: 8,
              floorMin: 9,
              floorMax: 10,
              sqFeetMin: '11',
              sqFeetMax: '12',
              totalCount: 13,
              totalAvailable: 14,
              unitTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitAccessibilityPriorityTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        listingsResult: {
          create: {
            ...exampleAsset,
          },
        },
      },
    });
  });

  it('should delete a listing', async () => {
    const id = randomUUID();
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    prisma.listings.delete = jest.fn().mockResolvedValue({
      id,
    });

    await service.delete(id);

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: id,
      },
    });

    expect(prisma.listings.delete).toHaveBeenCalledWith({
      where: {
        id: id,
      },
    });
  });

  it('should error when nonexistent id is passed to delete()', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue(null);
    prisma.listings.delete = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.delete(randomUUID()),
    ).rejects.toThrowError();

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
    });

    expect(prisma.listings.delete).not.toHaveBeenCalled();
  });

  it('should return listing from call to findOrThrow()', async () => {
    const id = randomUUID();
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id,
    });

    await service.findOrThrow(id, ListingViews.fundamentals);

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listingFeatures: true,
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
        listingUtilities: true,
        listingsBuildingAddress: true,
        reservedCommunityTypes: true,
      },
      where: {
        id: id,
      },
    });
  });

  it('should error when nonexistent id is passed to findOrThrow()', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow(randomUUID()),
    ).rejects.toThrowError();

    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.anything(),
      },
    });
  });

  it('should update a simple listing', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });
    prisma.listings.update = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });

    await service.update({
      id: randomUUID(),
      name: 'example listing name',
      depositMin: '5',
      assets: [
        {
          fileId: randomUUID(),
          label: 'example asset',
        },
      ],
      jurisdictions: {
        id: randomUUID(),
      },
      status: ListingsStatusEnum.pending,
      displayWaitlistSize: false,
      unitsSummary: null,
      listingEvents: [],
    } as ListingUpdate);

    expect(prisma.listings.update).toHaveBeenCalledWith({
      include: {
        applicationMethods: {
          include: {
            paperApplications: {
              include: {
                assets: true,
              },
            },
          },
        },
        jurisdictions: true,
        listingEvents: {
          include: {
            assets: true,
          },
        },
        listingFeatures: true,
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
        listingUtilities: true,
        listingsApplicationDropOffAddress: true,
        listingsApplicationPickUpAddress: true,
        listingsBuildingAddress: true,
        listingsBuildingSelectionCriteriaFile: true,
        listingsLeasingAgentAddress: true,
        listingsResult: true,
        reservedCommunityTypes: true,
        units: {
          include: {
            amiChart: {
              include: {
                amiChartItem: true,
                jurisdictions: true,
                unitGroupAmiLevels: true,
              },
            },
            unitAccessibilityPriorityTypes: true,
            unitAmiChartOverrides: true,
            unitRentTypes: true,
            unitTypes: true,
          },
        },
      },
      data: {
        name: 'example listing name',
        depositMin: '5',
        assets: {
          create: [
            {
              fileId: expect.anything(),
              label: 'example asset',
            },
          ],
        },
        jurisdictions: {
          connect: {
            id: expect.anything(),
          },
        },
        status: ListingsStatusEnum.pending,
        displayWaitlistSize: false,
        unitsSummary: undefined,
        listingEvents: {
          create: [],
        },
        unitsAvailable: 0,
      },
      where: {
        id: expect.anything(),
      },
    });
  });

  it('should do a complete listing update', async () => {
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });
    prisma.listings.update = jest.fn().mockResolvedValue({
      id: 'example id',
      name: 'example name',
    });

    const exampleAddress = {
      city: 'Exygy',
      state: 'CA',
      zipCode: '94104',
      street: '548 Market St',
    };

    const exampleAsset = {
      fileId: randomUUID(),
      label: 'example asset label',
    };

    const val: ListingPublishedUpdate = {
      id: randomUUID(),
      assets: [exampleAsset],
      listingsBuildingAddress: exampleAddress,
      depositMin: '1000',
      depositMax: '5000',
      developer: 'example developer',
      digitalApplication: true,
      listingImages: [
        {
          ordinal: 0,
          assets: exampleAsset,
        },
      ],
      leasingAgentEmail: 'leasingAgent@exygy.com',
      leasingAgentName: 'Leasing Agent',
      leasingAgentPhone: '520-750-8811',
      name: 'example listing',
      paperApplication: false,
      referralOpportunity: false,
      rentalAssistance: 'rental assistance',
      reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
      units: [
        {
          amiPercentage: '1',
          annualIncomeMin: '2',
          monthlyIncomeMin: '3',
          floor: 4,
          annualIncomeMax: '5',
          maxOccupancy: 6,
          minOccupancy: 7,
          monthlyRent: '8',
          numBathrooms: 9,
          numBedrooms: 10,
          number: '11',
          sqFeet: '12',
          monthlyRentAsPercentOfIncome: '13',
          bmrProgramChart: true,
          unitTypes: {
            id: randomUUID(),
          },
          amiChart: {
            id: randomUUID(),
          },
          unitAccessibilityPriorityTypes: {
            id: randomUUID(),
          },
          unitRentTypes: {
            id: randomUUID(),
          },
          unitAmiChartOverrides: {
            items: [
              {
                percentOfAmi: 10,
                householdSize: 20,
                income: 30,
              },
            ],
          },
        },
      ],
      listingMultiselectQuestions: [
        {
          id: randomUUID(),
          ordinal: 0,
        },
      ],
      applicationMethods: [
        {
          type: ApplicationMethodsTypeEnum.Internal,
          label: 'example label',
          externalReference: 'example reference',
          acceptsPostmarkedApplications: false,
          phoneNumber: '520-750-8811',
          paperApplications: [
            {
              language: LanguagesEnum.en,
              assets: exampleAsset,
            },
          ],
        },
      ],
      unitsSummary: [
        {
          unitTypes: {
            id: randomUUID(),
          },
          monthlyRentMin: 1,
          monthlyRentMax: 2,
          monthlyRentAsPercentOfIncome: '3',
          amiPercentage: 4,
          minimumIncomeMin: '5',
          minimumIncomeMax: '6',
          maxOccupancy: 7,
          minOccupancy: 8,
          floorMin: 9,
          floorMax: 10,
          sqFeetMin: '11',
          sqFeetMax: '12',
          unitAccessibilityPriorityTypes: {
            id: randomUUID(),
          },
          totalCount: 13,
          totalAvailable: 14,
        },
      ],
      listingsApplicationPickUpAddress: exampleAddress,
      listingsApplicationMailingAddress: exampleAddress,
      listingsApplicationDropOffAddress: exampleAddress,
      listingsLeasingAgentAddress: exampleAddress,
      listingsBuildingSelectionCriteriaFile: exampleAsset,
      listingsResult: exampleAsset,
      listingEvents: [
        {
          type: ListingEventsTypeEnum.openHouse,
          startDate: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          url: 'https://www.google.com',
          note: 'example note',
          label: 'example label',
          assets: exampleAsset,
        },
      ],
      additionalApplicationSubmissionNotes: 'app submission notes',
      commonDigitalApplication: true,
      accessibility: 'accessibility string',
      amenities: 'amenities string',
      buildingTotalUnits: 5,
      householdSizeMax: 9,
      householdSizeMin: 1,
      neighborhood: 'neighborhood string',
      petPolicy: 'we love pets',
      smokingPolicy: 'smokeing policy string',
      unitsAvailable: 15,
      unitAmenities: 'unit amenity string',
      servicesOffered: 'services offered string',
      yearBuilt: 2023,
      applicationDueDate: new Date(),
      applicationOpenDate: new Date(),
      applicationFee: 'application fee string',
      applicationOrganization: 'app organization string',
      applicationPickUpAddressOfficeHours: 'pick up office hours string',
      applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
      applicationDropOffAddressOfficeHours: 'drop off office hours string',
      applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
      applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
      buildingSelectionCriteria: 'selection criteria',
      costsNotIncluded: 'all costs included',
      creditHistory: 'credit history',
      criminalBackground: 'criminal background',
      depositHelperText: 'deposit helper text',
      disableUnitsAccordion: false,
      leasingAgentOfficeHours: 'leasing agent office hours',
      leasingAgentTitle: 'leasing agent title',
      postmarkedApplicationsReceivedByDate: new Date(),
      programRules: 'program rules',
      rentalHistory: 'rental history',
      requiredDocuments: 'required docs',
      specialNotes: 'special notes',
      waitlistCurrentSize: 0,
      waitlistMaxSize: 100,
      whatToExpect: 'what to expect',
      status: ListingsStatusEnum.active,
      displayWaitlistSize: true,
      reservedCommunityDescription: 'reserved community description',
      reservedCommunityMinAge: 66,
      resultLink: 'result link',
      isWaitlistOpen: true,
      waitlistOpenSpots: 100,
      customMapPin: false,
      jurisdictions: {
        id: randomUUID(),
      },
      reservedCommunityTypes: {
        id: randomUUID(),
      },
      listingFeatures: {
        elevator: true,
        wheelchairRamp: false,
        serviceAnimalsAllowed: true,
        accessibleParking: false,
        parkingOnSite: true,
        inUnitWasherDryer: false,
        laundryInBuilding: true,
        barrierFreeEntrance: false,
        rollInShower: true,
        grabBars: false,
        heatingInUnit: true,
        acInUnit: false,
        hearing: true,
        visual: false,
        mobility: true,
      },
      listingUtilities: {
        water: false,
        gas: true,
        trash: false,
        sewer: true,
        electricity: false,
        cable: true,
        phone: false,
        internet: true,
      },
    };

    await service.update(val as ListingUpdate);

    expect(prisma.listings.update).toHaveBeenCalledWith({
      include: {
        applicationMethods: {
          include: {
            paperApplications: {
              include: {
                assets: true,
              },
            },
          },
        },
        jurisdictions: true,
        listingEvents: {
          include: {
            assets: true,
          },
        },
        listingFeatures: true,
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
        listingUtilities: true,
        listingsApplicationDropOffAddress: true,
        listingsApplicationPickUpAddress: true,
        listingsBuildingAddress: true,
        listingsBuildingSelectionCriteriaFile: true,
        listingsLeasingAgentAddress: true,
        listingsResult: true,
        reservedCommunityTypes: true,
        units: {
          include: {
            amiChart: {
              include: {
                amiChartItem: true,
                jurisdictions: true,
                unitGroupAmiLevels: true,
              },
            },
            unitAccessibilityPriorityTypes: true,
            unitAmiChartOverrides: true,
            unitRentTypes: true,
            unitTypes: true,
          },
        },
      },
      data: {
        ...val,
        id: undefined,
        publishedAt: expect.anything(),
        assets: {
          create: [exampleAsset],
        },
        applicationMethods: {
          create: [
            {
              type: ApplicationMethodsTypeEnum.Internal,
              label: 'example label',
              externalReference: 'example reference',
              acceptsPostmarkedApplications: false,
              phoneNumber: '520-750-8811',
              paperApplications: {
                create: [
                  {
                    language: LanguagesEnum.en,
                    assets: {
                      create: {
                        ...exampleAsset,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        listingEvents: {
          create: [
            {
              type: ListingEventsTypeEnum.openHouse,
              startDate: expect.anything(),
              startTime: expect.anything(),
              endTime: expect.anything(),
              url: 'https://www.google.com',
              note: 'example note',
              label: 'example label',
              assets: {
                create: {
                  ...exampleAsset,
                },
              },
            },
          ],
        },
        listingImages: {
          create: [
            {
              assets: {
                create: {
                  ...exampleAsset,
                },
              },
              ordinal: 0,
            },
          ],
        },
        listingMultiselectQuestions: {
          create: [
            {
              ordinal: 0,
              multiselectQuestions: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        listingsApplicationDropOffAddress: {
          create: {
            ...exampleAddress,
          },
        },
        reservedCommunityTypes: {
          connect: {
            id: expect.anything(),
          },
        },
        listingsBuildingSelectionCriteriaFile: {
          create: {
            ...exampleAsset,
          },
        },
        listingUtilities: {
          create: {
            water: false,
            gas: true,
            trash: false,
            sewer: true,
            electricity: false,
            cable: true,
            phone: false,
            internet: true,
          },
        },
        listingsApplicationMailingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingsLeasingAgentAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingFeatures: {
          create: {
            elevator: true,
            wheelchairRamp: false,
            serviceAnimalsAllowed: true,
            accessibleParking: false,
            parkingOnSite: true,
            inUnitWasherDryer: false,
            laundryInBuilding: true,
            barrierFreeEntrance: false,
            rollInShower: true,
            grabBars: false,
            heatingInUnit: true,
            acInUnit: false,
            hearing: true,
            visual: false,
            mobility: true,
          },
        },
        jurisdictions: {
          connect: {
            id: expect.anything(),
          },
        },
        listingsApplicationPickUpAddress: {
          create: {
            ...exampleAddress,
          },
        },
        listingsBuildingAddress: {
          create: {
            ...exampleAddress,
          },
        },
        units: {
          create: [
            {
              amiPercentage: '1',
              annualIncomeMin: '2',
              monthlyIncomeMin: '3',
              floor: 4,
              annualIncomeMax: '5',
              maxOccupancy: 6,
              minOccupancy: 7,
              monthlyRent: '8',
              numBathrooms: 9,
              numBedrooms: 10,
              number: '11',
              sqFeet: '12',
              monthlyRentAsPercentOfIncome: '13',
              bmrProgramChart: true,
              unitTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              amiChart: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitAmiChartOverrides: {
                create: {
                  items: {
                    items: [
                      {
                        percentOfAmi: 10,
                        householdSize: 20,
                        income: 30,
                      },
                    ],
                  },
                },
              },
              unitAccessibilityPriorityTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitRentTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        unitsSummary: {
          create: [
            {
              monthlyRentMin: 1,
              monthlyRentMax: 2,
              monthlyRentAsPercentOfIncome: '3',
              amiPercentage: 4,
              minimumIncomeMin: '5',
              minimumIncomeMax: '6',
              maxOccupancy: 7,
              minOccupancy: 8,
              floorMin: 9,
              floorMax: 10,
              sqFeetMin: '11',
              sqFeetMax: '12',
              totalCount: 13,
              totalAvailable: 14,
              unitTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
              unitAccessibilityPriorityTypes: {
                connect: {
                  id: expect.anything(),
                },
              },
            },
          ],
        },
        listingsResult: {
          create: {
            ...exampleAsset,
          },
        },
      },
      where: {
        id: expect.anything(),
      },
    });
  });

  it('should purge single listing', async () => {
    const id = randomUUID();
    process.env.PROXY_URL = 'https://www.google.com';
    await service.cachePurge(
      ListingsStatusEnum.pending,
      ListingsStatusEnum.pending,
      id,
    );
    expect(httpServiceMock.request).toHaveBeenCalledWith({
      baseURL: 'https://www.google.com',
      method: 'PURGE',
      url: `/listings/${id}*`,
    });

    process.env.PROXY_URL = undefined;
  });

  it('should purge all listings', async () => {
    const id = randomUUID();
    process.env.PROXY_URL = 'https://www.google.com';
    await service.cachePurge(
      ListingsStatusEnum.active,
      ListingsStatusEnum.pending,
      id,
    );
    expect(httpServiceMock.request).toHaveBeenCalledWith({
      baseURL: 'https://www.google.com',
      method: 'PURGE',
      url: `/listings?*`,
    });

    process.env.PROXY_URL = undefined;
  });
});
