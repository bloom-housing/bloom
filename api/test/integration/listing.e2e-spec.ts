import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  HomeTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MarketingTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  RegionEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
  UserRoleEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { ListingsQueryBody } from '../../src/dtos/listings/listings-query-body.dto';
import { ListingsQueryParams } from '../../src/dtos/listings/listings-query-params.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { ListingOrderByKeys } from '../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { ListingCreate } from '../../src/dtos/listings/listing-create.dto';
import { ListingUpdate } from '../../src/dtos/listings/listing-update.dto';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { amiChartFactory } from '../../prisma/seed-helpers/ami-chart-factory';
import {
  unitAccessibilityPriorityTypeFactoryAll,
  unitAccessibilityPriorityTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import {
  reservedCommunityTypeFactoryAll,
  reservedCommunityTypeFactoryGet,
} from '../../prisma/seed-helpers/reserved-community-type-factory';
import { addressFactory } from '../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../src/dtos/addresses/address-create.dto';
import { EmailService } from '../../src/services/email.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { unitFactorySingle } from '../../prisma/seed-helpers/unit-factory';
import { FilterAvailabilityEnum } from '../../src/enums/listings/filter-availability-enum';
import { unitGroupFactorySingle } from '../../prisma/seed-helpers/unit-group-factory';
import { randomName } from '../../prisma/seed-helpers/word-generator';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { createAllFeatureFlags } from '../../prisma/seed-helpers/feature-flag-factory';

describe('Listing Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;
  let adminAccessToken: string;
  let unitTypeOneBed;
  let unitTypeThreeBed;

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    requestApproval: async () => {},
    changesRequested: async () => {},
    listingApproved: async () => {},
    lotteryReleased: async () => {},
    lotteryPublishedAdmin: async () => {},
    lotteryPublishedApplicant: async () => {},
  };
  const mockChangesRequested = jest.spyOn(testEmailService, 'changesRequested');
  const mockRequestApproval = jest.spyOn(testEmailService, 'requestApproval');
  const mockListingApproved = jest.spyOn(testEmailService, 'listingApproved');

  const listingFeatures = {
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
    barrierFreeUnitEntrance: false,
    loweredLightSwitch: true,
    barrierFreeBathroom: false,
    wideDoorways: true,
    loweredCabinets: false,
  };
  const listingUtilities = {
    water: false,
    gas: true,
    trash: false,
    sewer: true,
    electricity: false,
    cable: true,
    phone: false,
    internet: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    await unitTypeFactoryAll(prisma);
    unitTypeOneBed = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);
    unitTypeThreeBed = await unitTypeFactorySingle(
      prisma,
      UnitTypeEnum.threeBdrm,
    );
    await createAllFeatureFlags(prisma);
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`listing controller ${randomName()}`),
    });
    jurisdictionAId = jurisdiction.id;
    await reservedCommunityTypeFactoryAll(jurisdictionAId, prisma);
    await unitAccessibilityPriorityTypeFactoryAll(prisma);
    const adminUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: {
          isAdmin: true,
        },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({ email: adminUser.email, password: 'Abcdef12345!' })
      .expect(201);
    adminAccessToken = res.header?.['set-cookie'].find((cookie) =>
      cookie.startsWith('access-token='),
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const constructFullListingData = async (
    listingId?: string,
    jurisdictionId?: string,
    jurisdictionName?: string,
  ): Promise<ListingCreate | ListingUpdate> => {
    let jurisdictionA: IdDTO = { id: '' };

    if (jurisdictionId) {
      jurisdictionA.id = jurisdictionId;
    } else {
      jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(jurisdictionName || randomName()),
      });
    }

    const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
    const amiChart = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionA.id),
    });
    const unitAccessibilityPriorityType =
      await unitAccessibilityPriorityTypeFactorySingle(prisma);

    const rentType = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });
    const multiselectQuestion = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionA.id),
    });
    await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
    const reservedCommunityType = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionA.id,
    );

    const exampleAddress = addressFactory() as AddressCreate;

    const exampleAsset = {
      fileId: randomUUID(),
      label: 'example asset label',
    };

    const shouldIncludeCommunityDisclaimer = Math.random() >= 0.5;

    return {
      id: listingId ?? undefined,
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
            id: unitType.id,
          },
          amiChart: {
            id: amiChart.id,
          },
          unitAccessibilityPriorityTypes: {
            id: unitAccessibilityPriorityType.id,
          },
          unitRentTypes: {
            id: rentType.id,
          },
        },
      ],
      unitGroups: [],
      listingMultiselectQuestions: [
        {
          id: multiselectQuestion.id,
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
            id: unitType.id,
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
            id: unitAccessibilityPriorityType.id,
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
      buildingSelectionCriteria: 'https://selection-criteria.com',
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
        id: jurisdictionA.id,
      },
      reservedCommunityTypes: {
        id: reservedCommunityType.id,
      },
      listingFeatures: listingFeatures,
      listingUtilities: listingUtilities,
      includeCommunityDisclaimer: shouldIncludeCommunityDisclaimer,
      communityDisclaimerTitle: shouldIncludeCommunityDisclaimer
        ? 'example title'
        : undefined,
      communityDisclaimerDescription: shouldIncludeCommunityDisclaimer
        ? 'example description'
        : undefined,
      homeType: 'apartment',
      marketingType: undefined,
    };
  };

  describe('list endpoint', () => {
    // without clearing the db between runs this test is flaky
    it.skip('should not get listings from list endpoint when no params are sent', async () => {
      const res = await request(app.getHttpServer())
        .get('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body).toEqual({
        items: [],
        meta: {
          currentPage: 1,
          itemCount: 0,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
        },
      });
    });

    it('should get listings from list endpoint when no params are sent', async () => {
      const listing1 = await listingFactory(jurisdictionAId, prisma);
      await prisma.listings.create({
        data: listing1,
      });

      const listing2 = await listingFactory(jurisdictionAId, prisma);
      await prisma.listings.create({
        data: listing2,
      });

      const res = await request(app.getHttpServer())
        .get('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.meta.currentPage).toEqual(1);
      expect(res.body.meta.itemCount).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.itemsPerPage).toEqual(10);
      expect(res.body.meta.totalItems).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(1);

      const items = res.body.items.map((item) => item.name);

      expect(items.length).toBeGreaterThanOrEqual(2);
    });

    it('should not get listings from list endpoint when params are sent but do not match anything', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            jurisdiction: randomUUID(),
          },
          {
            $comparison: Compare.IN,
            name: 'random name',
          },
          {
            $comparison: Compare['='],
            status: 'active',
          },
        ],
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .get(`/listings?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body).toEqual({
        items: [],
        meta: {
          currentPage: 1,
          itemCount: 0,
          itemsPerPage: 1,
          totalItems: 0,
          totalPages: 0,
        },
      });
    });

    it('should get listings from list endpoint when params are sent', async () => {
      const listing1 = await listingFactory(jurisdictionAId, prisma, {
        listing: {
          name: `listing endpoint 1 ${randomName()}`,
        } as Prisma.ListingsCreateInput,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const listing2 = await listingFactory(jurisdictionAId, prisma, {
        listing: {
          name: `listing endpoint 2 ${randomName()}`,
        } as Prisma.ListingsCreateInput,
      });
      const listing2Created = await prisma.listings.create({
        data: listing2,
      });

      const orderedNames = [listing1Created.name, listing2Created.name].sort(
        (a, b) => a.localeCompare(b),
      );

      let queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            name: orderedNames.toString(),
          },
        ],
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      let query = stringify(queryParams as any);

      let res = await request(app.getHttpServer())
        .get(`/listings?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 1,
        totalItems: 2,
        totalPages: 2,
      });

      expect(res.body.items.length).toEqual(1);
      expect(res.body.items[0].name).toEqual(orderedNames[0]);

      queryParams = {
        limit: 1,
        page: 2,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            name: orderedNames.toString(),
          },
        ],
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      query = stringify(queryParams as any);

      res = await request(app.getHttpServer())
        .get(`/listings?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.meta).toEqual({
        currentPage: 2,
        itemCount: 1,
        itemsPerPage: 1,
        totalItems: 2,
        totalPages: 2,
      });
      expect(res.body.items.length).toEqual(1);
      expect(res.body.items[0].name).toEqual(orderedNames[1]);
    });
  });

  describe('filterableList endpoint', () => {
    let listing1WithUnits;
    let listing2WithUnits;
    let listing3WithUnits;
    let listing4WithUnitGroups;
    let listing5WithUnitGroups;
    let listing6WithUnitGroups;
    let jurisdictionB;
    let jurisdictionC;
    let jurisdictionDWithUnitGroups;
    let multiselectQuestionPreference;
    let multiselectQuestionProgram;

    beforeAll(async () => {
      jurisdictionB = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`filterableList B ${randomName()}`),
      });
      multiselectQuestionPreference = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionB.id, {
          multiselectQuestion: {
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.preferences,
          },
        }),
      });
      multiselectQuestionProgram = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionB.id, {
          multiselectQuestion: {
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
          },
        }),
      });
      const listing1Input = await listingFactory(jurisdictionB.id, prisma, {
        listing: {
          homeType: HomeTypeEnum.apartment,
          isVerified: true,
          neighborhood: 'SoHo',
          region: RegionEnum.Eastside,
          section8Acceptance: false,
        } as Prisma.ListingsCreateInput,
        multiselectQuestions: [multiselectQuestionPreference],
        optionalFeatures: {
          acInUnit: true,
        },
        status: ListingsStatusEnum.pending,
        units: [
          unitFactorySingle(unitTypeOneBed, {
            otherFields: {
              monthlyRent: '30000',
              numBathrooms: 1,
            },
          }),
        ],
      });
      listing1WithUnits = await prisma.listings.create({
        data: listing1Input,
      });

      const listing2Input = await listingFactory(jurisdictionB.id, prisma, {
        includeReservedCommunityTypes: true,
        listing: {
          homeType: HomeTypeEnum.duplex,
          isVerified: false,
          neighborhood: 'Downtown',
          region: RegionEnum.Southwest,
          section8Acceptance: true,
        } as Prisma.ListingsCreateInput,
        multiselectQuestions: [multiselectQuestionProgram],
        optionalFeatures: {
          acInUnit: false,
        },
        reviewOrderType: ReviewOrderTypeEnum.waitlist,
        status: ListingsStatusEnum.active,
        units: [
          unitFactorySingle(unitTypeThreeBed, {
            otherFields: {
              monthlyRent: '1000',
              numBathrooms: 3,
            },
          }),
        ],
      });
      listing2WithUnits = await prisma.listings.create({
        data: listing2Input,
      });

      jurisdictionC = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`filterableList C ${randomName()}`),
      });
      const listing3Input = await listingFactory(jurisdictionC.id, prisma);
      listing3WithUnits = await prisma.listings.create({
        data: listing3Input,
      });
      jurisdictionDWithUnitGroups = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`filterableList D ${randomName()}`),
      });
      const listing4Input = await listingFactory(
        jurisdictionDWithUnitGroups.id,
        prisma,
        {
          unitGroups: [
            unitGroupFactorySingle(unitTypeThreeBed, {
              openWaitlist: true,
            }),
          ],
        },
      );
      listing4WithUnitGroups = await prisma.listings.create({
        data: listing4Input,
      });
      const listing5Input = await listingFactory(
        jurisdictionDWithUnitGroups.id,
        prisma,
        {
          unitGroups: [
            unitGroupFactorySingle(unitTypeThreeBed, {
              openWaitlist: false,
            }),
          ],
        },
      );
      listing5WithUnitGroups = await prisma.listings.create({
        data: listing5Input,
      });
      const listing6Input = await listingFactory(
        jurisdictionDWithUnitGroups.id,
        prisma,
        {
          listing: {
            marketingType: MarketingTypeEnum.comingSoon,
          } as Prisma.ListingsCreateInput,
          unitGroups: [
            unitGroupFactorySingle(unitTypeOneBed, {
              openWaitlist: undefined,
              unitGroupAmiLevelsFlatRentValue: 1000,
            }),
          ],
        },
      );
      listing6WithUnitGroups = await prisma.listings.create({
        data: listing6Input,
      });
    });

    it('should get listings from list endpoint when no params are sent', async () => {
      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.meta.currentPage).toEqual(1);
      expect(res.body.meta.itemCount).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.itemsPerPage).toEqual(10);
      expect(res.body.meta.totalItems).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(1);

      const items = res.body.items.map((item) => item.name);

      expect(items.length).toBeGreaterThanOrEqual(2);
    });
    it('should not get listings from list endpoint when params are sent but do not match anything', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            jurisdiction: randomUUID(),
          },
          {
            $comparison: Compare.IN,
            name: 'random name',
          },
          {
            $comparison: Compare['='],
            status: 'active',
          },
        ],
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body).toEqual({
        items: [],
        meta: {
          currentPage: 1,
          itemCount: 0,
          itemsPerPage: 1,
          totalItems: 0,
          totalPages: 0,
        },
      });
    });
    it('should return a listing based on filter availabilities - closedWaitlist', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.closedWaitlist],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing5WithUnitGroups.id);
    });
    it('should return a listing based on filter availabilities - comingSoon', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.comingSoon],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing6WithUnitGroups.id);
    });
    it('should return a listing based on filter availabilities - openWaitlist', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.openWaitlist],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing4WithUnitGroups.id);
    });
    it('should return a listing based on filter availabilities - waitlistOpen', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.waitlistOpen],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing2WithUnits.id);
    });
    it('should return a listing based on filter availabilities - unitsAvailable - unitGroups', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.unitsAvailable],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(3);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
      expect(ids).toContain(listing6WithUnitGroups.id);
    });
    it('should return a listing based on filter availabilities - unitsAvailable - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            availabilities: [FilterAvailabilityEnum.unitsAvailable],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(2);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing1WithUnits.id);
      expect(ids).toContain(listing2WithUnits.id);
    });
    it('should return a listing based on filter availability - closedWaitlist', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            availability: FilterAvailabilityEnum.closedWaitlist,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing5WithUnitGroups.id);
    });
    it('should return a listing based on filter availability - comingSoon', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            availability: FilterAvailabilityEnum.comingSoon,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing6WithUnitGroups.id);
    });
    it('should return a listing based on filter availability - openWaitlist', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            availability: FilterAvailabilityEnum.openWaitlist,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing4WithUnitGroups.id);
    });
    it('should return a listing based on filter availability - waitlistOpen', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            availability: FilterAvailabilityEnum.waitlistOpen,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing2WithUnits.id);
    });
    it('should return a listing based on filter availability - unitsAvailable - unitGroups', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['>='],
            availability: FilterAvailabilityEnum.unitsAvailable,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(3);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
      expect(ids).toContain(listing6WithUnitGroups.id);
    });
    it('should return a listing based on filter availability - unitsAvailable - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['>='],
            availability: FilterAvailabilityEnum.unitsAvailable,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(2);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing1WithUnits.id);
      expect(ids).toContain(listing2WithUnits.id);
    });
    it('should return a listing based on filter bathrooms - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            bathrooms: 1,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter bedrooms - unitGroups', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            bedrooms: 3,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(2);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
    });
    it('should return a listing based on filter bedrooms - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            bedrooms: 3,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing2WithUnits.id);
    });
    it('should return a listing based on filter bedroomTypes - unitGroups', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            bedroomTypes: [3],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(2);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
    });
    it('should return a listing based on filter bedroomTypes - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['IN'],
            bedroomTypes: [3],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing2WithUnits.id);
    });
    it('should return a listing based on filter city', async () => {
      const buildingAddress = await prisma.address.findFirst({
        where: {
          id: listing1WithUnits.buildingAddressId,
        },
      });
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            city: buildingAddress.city,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter counties', async () => {
      const buildingAddress = await prisma.address.findFirst({
        where: {
          id: listing2WithUnits.buildingAddressId,
        },
      });
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            counties: [buildingAddress.county],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing2WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter homeTypes', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            homeTypes: [HomeTypeEnum.apartment],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter ids', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            ids: [listing2WithUnits.id],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing2WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter isVerified', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            isVerified: true,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter jurisdiction', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionC.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing3WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter leasingAgent', async () => {
      const leasingAgent = await prisma.userAccounts.create({
        data: await userFactory({
          listings: [listing1WithUnits.id],
          roles: {
            isPartner: true,
          },
        }),
      });

      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            leasingAgent: leasingAgent.id,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter listingFeatures', async () => {
      const query: ListingsQueryBody = {
        limit: 20,
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            listingFeatures: ['acInUnit'],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return all listings with percentageOfIncome based on filter monthlyRent - unitGroups ', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            monthlyRent: '3000',
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(2);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
    });
    it('should return all listings with percentageOfIncome and flatRent based on filter monthlyRent - unitGroups', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            monthlyRent: '1000',
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionDWithUnitGroups.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(3);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing4WithUnitGroups.id);
      expect(ids).toContain(listing5WithUnitGroups.id);
      expect(ids).toContain(listing6WithUnitGroups.id);
    });
    it('should return a listing based on filter multiselectQuestions', async () => {
      const queryPrefence: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            multiselectQuestions: [multiselectQuestionPreference.id],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const queryProgram: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            multiselectQuestions: [multiselectQuestionProgram.id],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const resPreference = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(queryPrefence)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(resPreference.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(resPreference.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId1 = resPreference.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId1).toEqual(true);

      const resProgram = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(queryProgram)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(resProgram.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(resProgram.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId2 = resProgram.body.items.some(
        (elem) => elem.id === listing2WithUnits.id,
      );
      expect(foundId2).toEqual(true);
    });
    it('should return a listing based on filter monthlyRent - units', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            monthlyRent: '30000',
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter name', async () => {
      const orderedNames = [
        listing1WithUnits.name,
        listing2WithUnits.name,
      ].sort((a, b) => a.localeCompare(b));

      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            name: orderedNames.toString(),
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 2,
        itemsPerPage: 10,
        totalItems: 2,
        totalPages: 1,
      });

      expect(res.body.items.length).toEqual(2);
      expect(res.body.items[0].name).toEqual(orderedNames[0]);
      expect(res.body.items[1].name).toEqual(orderedNames[1]);
    });
    it('should return a listing based on filter neighborhood', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            neighborhood: listing1WithUnits.neighborhood,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter regions', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            regions: [RegionEnum.Eastside],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing1WithUnits.id);
    });
    it('should return a listing based on filter reservedCommunityTypes', async () => {
      const reservedCommunityType =
        await prisma.reservedCommunityTypes.findFirst({
          where: {
            id: listing2WithUnits.reservedCommunityTypeId,
          },
        });

      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare.IN,
            reservedCommunityTypes: [reservedCommunityType?.name],
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing2WithUnits.id);
    });
    it('should return a listing based on filter section8Acceptance', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            section8Acceptance: true,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toEqual(1);

      expect(res.body.items[0].id).toEqual(listing2WithUnits.id);
    });
    it('should return a listing based on filter status', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            status: ListingsStatusEnum.active,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing2WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on filter zipCode', async () => {
      const buildingAddress = await prisma.address.findFirst({
        where: {
          id: listing1WithUnits.buildingAddressId,
        },
      });
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        filter: [
          {
            $comparison: Compare['='],
            zipCode: buildingAddress.zipCode,
          },
          {
            $comparison: Compare['='],
            jurisdiction: jurisdictionB.id,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const foundId = res.body.items.some(
        (elem) => elem.id === listing1WithUnits.id,
      );
      expect(foundId).toEqual(true);
    });
    it('should return a listing based on search', async () => {
      const query: ListingsQueryBody = {
        page: 1,
        view: ListingViews.base,
        search: listing1WithUnits.name,
      };

      const res = await request(app.getHttpServer())
        .post(`/listings/list`)
        .send(query)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);

      expect(res.body.items.length).toBeGreaterThanOrEqual(1);

      const ids = res.body.items.map((listing) => listing.id);
      expect(ids).toContain(listing1WithUnits.id);
    });
  });

  describe('retrieve listings endpoint', () => {
    it('should get listings from retrieveListings endpoint', async () => {
      const multiselectQuestion1 = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionAId, {
          multiselectQuestion: {
            text: 'example a',
          },
        }),
      });
      const listingA = await listingFactory(jurisdictionAId, prisma, {
        multiselectQuestions: [multiselectQuestion1],
      });
      const listingACreated = await prisma.listings.create({
        data: listingA,
        include: {
          listingMultiselectQuestions: true,
        },
      });
      const multiselectQuestion2 = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionAId, {
          multiselectQuestion: {
            text: 'example b',
          },
        }),
      });
      const listingB = await listingFactory(jurisdictionAId, prisma, {
        multiselectQuestions: [multiselectQuestion2],
      });
      await prisma.listings.create({
        data: listingB,
        include: {
          listingMultiselectQuestions: true,
        },
      });

      const res = await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.length).toEqual(1);
      expect(res.body[0].name).toEqual(listingA.name);
    });
  });

  describe('delete endpoint', () => {
    it("should error when trying to delete listing that doesn't exist", async () => {
      const id = randomUUID();
      const res = await request(app.getHttpServer())
        .delete(`/listings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: id,
        } as IdDTO)
        .expect(404);
      expect(res.body.message).toEqual(
        `listingId ${id} was requested but not found`,
      );
    });

    it('should delete listing', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`delete ${randomName()}`),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        noImage: true,
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const res = await request(app.getHttpServer())
        .delete(`/listings/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', adminAccessToken)
        .expect(200);

      const listingAfterDelete = await prisma.listings.findUnique({
        where: { id: listing.id },
      });
      expect(listingAfterDelete).toBeNull();
      expect(res.body.success).toEqual(true);
    });
  });

  describe('update endpoint', () => {
    it("should error when trying to update listing that doesn't exist", async () => {
      const id = randomUUID();
      const res = await request(app.getHttpServer())
        .put(`/listings/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: id,
          status: ListingsStatusEnum.pending,
          name: randomName(),
          jurisdictions: { id: jurisdictionAId },
        } as IdDTO)
        .set('Cookie', adminAccessToken)
        .expect(404);
      expect(res.body.message).toEqual(
        `listingId ${id} was requested but not found`,
      );
    });

    it('should update listing', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`update ${randomName()}`),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisdictionA.id);
      val.listingsApplicationMailingAddress = undefined;

      const res = await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', adminAccessToken)
        .expect(200);
      expect(res.body.id).toEqual(listing.id);
      expect(res.body.name).toEqual(val.name);
    });
  });

  describe('create endpoint', () => {
    it('should create listing', async () => {
      const val = await constructFullListingData(
        undefined,
        undefined,
        `create listing ${randomName()}`,
      );

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', adminAccessToken)
        .expect(201);
      expect(res.body.name).toEqual(val.name);

      const newDBValues = await prisma.listings.findMany({
        include: {
          listingFeatures: true,
          listingUtilities: true,
        },
        where: { name: val.name },
      });
      expect(newDBValues.length).toBeGreaterThanOrEqual(1);
      expect(newDBValues[0].listingFeatures).toMatchObject(listingFeatures);
      expect(newDBValues[0].listingUtilities).toMatchObject(listingUtilities);
    });
  });

  describe('duplicate endpoint', () => {
    it('should duplicate listing, include units', async () => {
      const listingData = await listingFactory(jurisdictionAId, prisma, {
        numberOfUnits: 2,
      });
      const listing = await prisma.listings.create({
        data: listingData,
        include: {
          units: true,
        },
      });

      const newName = 'duplicate name 1';

      const res = await request(app.getHttpServer())
        .post('/listings/duplicate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          includeUnits: true,
          name: newName,
          storedListing: {
            id: listing.id,
          },
        })
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(newName);
      expect(res.body.units.length).toBe(listing.units.length);

      const newDBValues = await prisma.listings.findMany({
        include: {
          units: true,
        },
        where: { name: newName },
      });
      expect(newDBValues.length).toBeGreaterThanOrEqual(1);
      expect(newDBValues[0].units).toHaveLength(2);
    });

    it('should duplicate listing, include unit groups', async () => {
      const jurisdictionWithUnitGroupsEnabled =
        await prisma.jurisdictions.create({
          data: jurisdictionFactory(`duplicate unit groups ${randomName()}`, {
            featureFlags: [FeatureFlagEnum.enableUnitGroups],
          }),
        });
      const listingData = await listingFactory(
        jurisdictionWithUnitGroupsEnabled.id,
        prisma,
        {
          numberOfUnits: 0,
          unitGroups: [
            unitGroupFactorySingle(unitTypeThreeBed),
            unitGroupFactorySingle(unitTypeOneBed),
            unitGroupFactorySingle(unitTypeOneBed),
          ],
        },
      );
      const listing = await prisma.listings.create({
        data: listingData,
        include: {
          units: true,
          unitGroups: true,
        },
      });

      const newName = `${listing.name} duplicate`;

      const res = await request(app.getHttpServer())
        .post('/listings/duplicate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          includeUnits: true,
          name: newName,
          storedListing: {
            id: listing.id,
          },
        })
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(newName);
      expect(res.body.unitGroups.length).toBe(listing.unitGroups.length);

      const newDBValues = await prisma.listings.findMany({
        include: {
          unitGroups: true,
        },
        where: { name: newName },
      });
      expect(newDBValues.length).toBeGreaterThanOrEqual(1);
      expect(newDBValues[0].unitGroups).toHaveLength(3);
    });

    it('should duplicate listing, exclude units', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`duplicate exclude units ${randomName()}`),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        numberOfUnits: 2,
      });
      const listing = await prisma.listings.create({
        data: listingData,
        include: {
          units: true,
        },
      });
      const newName = 'duplicate name 2';

      const res = await request(app.getHttpServer())
        .post('/listings/duplicate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          includeUnits: false,
          name: newName,
          storedListing: {
            id: listing.id,
          },
        })
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(newName);
      expect(res.body.units).toEqual([]);

      const newListing = await prisma.listings.findFirst({
        select: {
          copyOfId: true,
        },
        where: { id: res.body.id },
      });
      expect(newListing.copyOfId).toEqual(listing.id);
    });

    it('should duplicate listing, exclude units with unit groups', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(
          `duplicate exclude units unit groups ${randomName()}`,
        ),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        numberOfUnits: 0,
        unitGroups: [unitGroupFactorySingle(unitTypeThreeBed)],
      });
      const listing = await prisma.listings.create({
        data: listingData,
        include: {
          units: true,
          unitGroups: true,
        },
      });
      const newName = 'duplicate name 2';

      const res = await request(app.getHttpServer())
        .post('/listings/duplicate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          includeUnits: false,
          name: newName,
          storedListing: {
            id: listing.id,
          },
        })
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(newName);
      expect(res.body.units).toEqual([]);
      expect(res.body.unitGroups).toEqual([]);

      const newListing = await prisma.listings.findFirst({
        select: {
          copyOfId: true,
        },
        where: { id: res.body.id },
      });
      expect(newListing.copyOfId).toEqual(listing.id);
    });
  });

  describe('process endpoint', () => {
    it('should successfully process listings that are past due', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`process listings ${randomName()}`),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.active,
        applicationDueDate: new Date(0),
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const res = await request(app.getHttpServer())
        .put(`/listings/closeListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);
      expect(res.body.success).toEqual(true);

      const postProcessListing = await prisma.listings.findUnique({
        where: {
          id: listing.id,
        },
      });

      expect(postProcessListing.status).toEqual(ListingsStatusEnum.closed);
      expect(postProcessListing.closedAt).not.toBeNull();
    });

    it('should only process listings that are past due', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`process some listings ${randomName()}`),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const pastDueListingData = await listingFactory(
        jurisdictionA.id,
        prisma,
        {
          status: ListingsStatusEnum.active,
          applicationDueDate: new Date(0),
        },
      );
      const passedDueListing = await prisma.listings.create({
        data: pastDueListingData,
      });

      const date = new Date();
      date.setDate(date.getDate() + 10);

      const futureDueListingData = await listingFactory(
        jurisdictionA.id,
        prisma,
        {
          status: ListingsStatusEnum.active,
          applicationDueDate: date,
        },
      );
      const futureDueListing = await prisma.listings.create({
        data: futureDueListingData,
      });

      const res = await request(app.getHttpServer())
        .put(`/listings/closeListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const postProcessListing = await prisma.listings.findUnique({
        where: {
          id: passedDueListing.id,
        },
      });

      expect(postProcessListing.status).toEqual(ListingsStatusEnum.closed);
      expect(postProcessListing.closedAt).not.toBeNull();

      const postProcessListing2 = await prisma.listings.findUnique({
        where: {
          id: futureDueListing.id,
        },
      });

      expect(postProcessListing2.status).toEqual(ListingsStatusEnum.active);
      expect(postProcessListing2.closedAt).toBeNull();
    });
  });

  describe('listings approval notification', () => {
    let listing,
      adminUser,
      jurisAdmin,
      wrongJurisAdmin,
      jurisdictionA,
      partnerUser,
      adminAccessToken;
    beforeAll(async () => {
      jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`approval notifications A ${randomName()}`, {
          listingApprovalPermissions: [
            UserRoleEnum.admin,
            UserRoleEnum.jurisdictionAdmin,
          ],
        }),
      });
      const jurisdictionB = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`approval notifications B ${randomName()}`),
      });
      adminUser = await prisma.userAccounts.create({
        data: await userFactory({
          roles: {
            isAdmin: true,
          },
          mfaEnabled: false,
          confirmedAt: new Date(),
        }),
      });
      wrongJurisAdmin = await prisma.userAccounts.create({
        data: await userFactory({
          roles: {
            isJurisdictionalAdmin: true,
          },
          jurisdictionIds: [jurisdictionB.id],
        }),
      });
      jurisAdmin = await prisma.userAccounts.create({
        data: await userFactory({
          roles: {
            isJurisdictionalAdmin: true,
          },
          jurisdictionIds: [jurisdictionA.id],
        }),
      });

      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.pending,
      });
      listing = await prisma.listings.create({
        data: listingData,
      });
      partnerUser = await prisma.userAccounts.create({
        data: await userFactory({
          roles: {
            isPartner: true,
            isAdmin: false,
            isJurisdictionalAdmin: false,
          },
          listings: [listing.id],
          jurisdictionIds: [jurisdictionA.id],
          confirmedAt: new Date(),
        }),
      });
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({ email: adminUser.email, password: 'Abcdef12345!' })
        .expect(201);

      adminAccessToken = res.header?.['set-cookie'].find((cookie) =>
        cookie.startsWith('access-token='),
      );
    });

    it('update status to pending approval and notify appropriate users', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({ email: partnerUser.email, password: 'Abcdef12345!' })
        .expect(201);

      const partnerAccessToken = res.header?.['set-cookie'].find((cookie) =>
        cookie.startsWith('access-token='),
      );
      const val = await constructFullListingData(listing.id, jurisdictionA.id);
      val.status = ListingsStatusEnum.pendingReview;
      const putPendingApprovalResponse = await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', partnerAccessToken)
        .expect(200);

      const listingPendingApprovalResponse = await request(app.getHttpServer())
        .get(`/listings/${putPendingApprovalResponse.body.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(listingPendingApprovalResponse.body.status).toBe(
        ListingsStatusEnum.pendingReview,
      );
      expect(mockRequestApproval).toBeCalledWith(
        expect.objectContaining({
          id: jurisdictionA.id,
        }),
        { id: listing.id, name: val.name },
        expect.arrayContaining([adminUser.email, jurisAdmin.email]),
        process.env.PARTNERS_PORTAL_URL,
      );
      //ensure juris admin is not included since don't have approver permissions in alameda seed
      expect(mockRequestApproval.mock.calls[0]['emails']).toEqual(
        expect.not.arrayContaining([wrongJurisAdmin.email, partnerUser.email]),
      );
    });

    it('update status to listing approved and notify appropriate users', async () => {
      const val = await constructFullListingData(listing.id, jurisdictionA.id);
      val.status = ListingsStatusEnum.active;
      const putApprovedResponse = await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', adminAccessToken)
        .expect(200);

      const listingApprovedResponse = await request(app.getHttpServer())
        .get(`/listings/${putApprovedResponse.body.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(listingApprovedResponse.body.status).toBe(
        ListingsStatusEnum.active,
      );
      expect(mockListingApproved).toBeCalledWith(
        expect.objectContaining({
          id: jurisdictionA.id,
        }),
        { id: listing.id, name: val.name },
        expect.arrayContaining([partnerUser.email]),
        jurisdictionA.publicUrl,
      );
    });

    it('update status to changes requested and notify appropriate users', async () => {
      const val = await constructFullListingData(listing.id, jurisdictionA.id);
      val.status = ListingsStatusEnum.changesRequested;
      const putChangesRequestedResponse = await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', adminAccessToken)
        .expect(200);

      const listingChangesRequestedResponse = await request(app.getHttpServer())
        .get(`/listings/${putChangesRequestedResponse.body.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(listingChangesRequestedResponse.body.status).toBe(
        ListingsStatusEnum.changesRequested,
      );
      expect(mockChangesRequested).toBeCalledWith(
        expect.objectContaining({
          id: adminUser.id,
        }),
        { id: listing.id, name: val.name, juris: expect.anything() },
        expect.arrayContaining([partnerUser.email]),
        process.env.PARTNERS_PORTAL_URL,
      );
    });
  });

  describe('dynamic required fields validation', () => {
    let customJurisdiction;
    let defaultJurisdiction;
    let unitGroupJurisdiction;

    beforeAll(async () => {
      // Create a jurisdiction with custom required fields
      customJurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`dynamic required custom ${randomName()}`, {
          requiredListingFields: ['name', 'listingsBuildingAddress'],
        }),
      });

      // Create a jurisdiction without specified required fields (should use default strict validation)
      defaultJurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`dynamic required default ${randomName()}`),
      });

      // Create a unit group jurisdiction
      unitGroupJurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(
          `dynamic required unit group ${randomName()}`,
          {
            featureFlags: [FeatureFlagEnum.enableUnitGroups],
            requiredListingFields: ['name', 'unitGroups'],
          },
        ),
      });
    });

    it('should allow saving active listing with requiredListingFields declared in jurisdiction', async () => {
      const listingData = {
        name: 'Minimal Listing for custom jurisdiction',
        status: ListingsStatusEnum.active,
        listingsBuildingAddress: addressFactory() as AddressCreate,
        jurisdictions: {
          id: customJurisdiction.id,
        },
      };

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(listingData)
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(listingData.name);
      expect(res.body.status).toEqual(ListingsStatusEnum.active);
    });

    it('should fail saving active listing without requiredListingFields declared in jurisdictions', async () => {
      const incompleteData = {
        name: 'Minimal Listing for custom jurisdiction',
        status: ListingsStatusEnum.active,
        jurisdictions: {
          id: customJurisdiction.id,
        },
      };

      // Should fail due to missing required fields from requiredListingFields
      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(incompleteData)
        .set('Cookie', adminAccessToken)
        .expect(400);

      expect(res.body.message).toContain(
        'listingsBuildingAddress is required when publishing the listing',
      );
    });

    it('should enforce default strict validation when jurisdiction has no requiredListingFields', async () => {
      const incompleteData = {
        name: 'Default Jurisdiction Listing',
        status: ListingsStatusEnum.active,
        listingsBuildingAddress: addressFactory() as AddressCreate,
        jurisdictions: {
          id: defaultJurisdiction.id,
        },
      };

      // Should fail due to missing required fields from default validation
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(incompleteData)
        .set('Cookie', adminAccessToken)
        .expect(400);

      expect(response.body.message).toHaveLength(6);
      expect(response.body.message.sort()).toEqual(
        [
          'listingImages is required when publishing the listing',
          'developer is required when publishing the listing',
          'leasingAgentEmail is required when publishing the listing',
          'leasingAgentName is required when publishing the listing',
          'leasingAgentPhone is required when publishing the listing',
          'units must contain at least 1 element',
        ].sort(),
      );
    });

    it('should allow saving non-active listing with only name and jurisdiction field', async () => {
      const minimalData = {
        name: 'Minimal Draft Listing',
        status: ListingsStatusEnum.pending,
        jurisdictions: {
          id: defaultJurisdiction.id,
        },
      };

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(minimalData)
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body.name).toEqual(minimalData.name);
      expect(res.body.status).toEqual(ListingsStatusEnum.pending);
    });

    it('should validate optional fields when provided even if not required', async () => {
      const invalidOptionalData = {
        name: 'Invalid Optional Fields',
        status: ListingsStatusEnum.pending,
        jurisdictions: {
          id: customJurisdiction.id,
        },
        leasingAgentEmail: 'not-a-valid-email', // Optional but should be validated if provided
      };

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(invalidOptionalData)
        .set('Cookie', adminAccessToken)
        .expect(400);

      expect(res.body.message).toContain('leasingAgentEmail must be an email');
    });

    it('should error if sending units on a unit group', async () => {
      const wrongData = {
        name: 'Minimal Listing for unit group jurisdiction',
        status: ListingsStatusEnum.active,
        jurisdictions: {
          id: unitGroupJurisdiction.id,
        },
        units: [{}],
      };
      // Should fail due to missing required fields from requiredListingFields
      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(wrongData)
        .set('Cookie', adminAccessToken)
        .expect(400);
      expect(res.body.message).toContain(
        'units cannot exist on this jurisdiction',
      );
    });

    it('should error if sending unit groups on a unit jurisdiction', async () => {
      const wrongData = {
        name: 'Minimal Listing for unit group jurisdiction',
        status: ListingsStatusEnum.active,
        jurisdictions: {
          id: customJurisdiction.id,
        },
        unitGroups: [{}],
      };
      // Should fail due to missing required fields from requiredListingFields
      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(wrongData)
        .set('Cookie', adminAccessToken)
        .expect(400);
      expect(res.body.message).toContain(
        'unitGroups cannot exist on this jurisdiction',
      );
    });

    it('should validate length of unit groups if a required field', async () => {
      const incompleteData = {
        name: 'partial unit group',
        status: ListingsStatusEnum.active,
        jurisdictions: {
          id: unitGroupJurisdiction.id,
        },
      };
      // Should fail due to missing required fields from requiredListingFields
      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(incompleteData)
        .set('Cookie', adminAccessToken)
        .expect(400);
      expect(res.body.message).toContain(
        'unitGroups must contain at least 1 element',
      );
    });

    it('should ignore unit group validation if not active', async () => {
      const incompleteData = {
        name: 'partial unit group',
        status: ListingsStatusEnum.pending,
        jurisdictions: {
          id: unitGroupJurisdiction.id,
        },
      };
      // Should pass since not publishing
      await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(incompleteData)
        .set('Cookie', adminAccessToken)
        .expect(201);
    });

    it('should validate applicationDueDate only if not waitlist', async () => {
      // Create a jurisdiction applicationDueDate required
      const applicationDueDateJurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`dynamic required custom ${randomName()}`, {
          requiredListingFields: ['name', 'applicationDueDate'],
        }),
      });
      const completeData = {
        name: 'waitlist listing',
        status: ListingsStatusEnum.active,
        reviewOrderType: ReviewOrderTypeEnum.waitlist,
        listingsBuildingAddress: {
          city: 'Bloomington',
          state: 'AK',
          street: 'Main st.',
          zipCode: '12345',
        },
        jurisdictions: {
          id: applicationDueDateJurisdiction.id,
        },
      };
      // Should pass since is of type waitlist
      await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(completeData)
        .set('Cookie', adminAccessToken)
        .expect(201);

      // Should fail on validation when fcfs
      const incompleteData = {
        name: 'fcfs listing',
        status: ListingsStatusEnum.active,
        reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
        jurisdictions: {
          id: applicationDueDateJurisdiction.id,
        },
      };
      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(incompleteData)
        .set('Cookie', adminAccessToken)
        .expect(400);

      expect(res.body.message).toContain(
        'applicationDueDate is required when publishing the listing',
      );
    });
  });

  describe('mapMarkers endpoint', () => {
    it('should find all active listings', async () => {
      const listingData = await listingFactory(jurisdictionAId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const closedListingData = await listingFactory(jurisdictionAId, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const closedListing = await prisma.listings.create({
        data: closedListingData,
      });

      const res = await request(app.getHttpServer())
        .get('/listings/mapMarkers')
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);

      const ids = res.body.map((marker) => marker.id);
      expect(ids).toContain(listing.id);
      expect(ids).not.toContain(closedListing.id);
    });
  });
});
