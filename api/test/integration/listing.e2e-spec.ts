import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
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
import { ListingsQueryParams } from '../../src/dtos/listings/listings-query-params.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { ListingOrderByKeys } from '../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { ListingPublishedUpdate } from '../../src/dtos/listings/listing-published-update.dto';
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
import { ListingPublishedCreate } from '../../src/dtos/listings/listing-published-create.dto';
import { addressFactory } from '../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../src/dtos/addresses/address-create.dto';
import { EmailService } from '../../src/services/email.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';

describe('Listing Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;
  let adminAccessToken: string;

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    requestApproval: async () => {},
    changesRequested: async () => {},
    listingApproved: async () => {},
    listingOpportunity: async () => {},
    lotteryReleased: async () => {},
    lotteryPublishedAdmin: async () => {},
    lotteryPublishedApplicant: async () => {},
  };
  const mockChangesRequested = jest.spyOn(testEmailService, 'changesRequested');
  const mockRequestApproval = jest.spyOn(testEmailService, 'requestApproval');
  const mockListingApproved = jest.spyOn(testEmailService, 'listingApproved');
  const mockListingOpportunity = jest.spyOn(
    testEmailService,
    'listingOpportunity',
  );

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
    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
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
  ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
    let jurisdictionA: IdDTO = { id: '' };

    if (jurisdictionId) {
      jurisdictionA.id = jurisdictionId;
    } else {
      jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
    }

    await unitTypeFactoryAll(prisma);
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

    // without clearing the db between runs this test is flaky
    it.skip('should get listings from list endpoint when no params are sent', async () => {
      const listing1 = await listingFactory(jurisdictionAId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const listing2 = await listingFactory(jurisdictionAId, prisma);
      const listing2Created = await prisma.listings.create({
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
      expect(items).toContain(listing1Created.name);
      expect(items).toContain(listing2Created.name);
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
      const listing1 = await listingFactory(jurisdictionAId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const listing2 = await listingFactory(jurisdictionAId, prisma);
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
        data: jurisdictionFactory(),
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
        } as IdDTO)
        .set('Cookie', adminAccessToken)
        .expect(404);
      expect(res.body.message).toEqual(
        `listingId ${id} was requested but not found`,
      );
    });

    it('should update listing', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
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
      const val = await constructFullListingData();

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', adminAccessToken)
        .expect(201);
      expect(res.body.name).toEqual(val.name);
    });
  });

  describe('process endpoint', () => {
    it('should successfully process listings that are past due', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
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
        data: jurisdictionFactory(),
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
        data: jurisdictionFactory('jurisdictionA', [
          UserRoleEnum.admin,
          UserRoleEnum.jurisdictionAdmin,
        ]),
      });
      const jurisdictionB = await prisma.jurisdictions.create({
        data: jurisdictionFactory('jurisdictionB'),
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
      // turn on enableListingOpportunity
      jurisdictionA.enableListingOpportunity = true;
      const val = await constructFullListingData(listing.id, jurisdictionA.id);
      val.status = ListingsStatusEnum.active;
      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionA.id}`)
        .send(jurisdictionA)
        .set('Cookie', adminAccessToken)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);
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
      expect(mockListingOpportunity).toBeCalledWith(
        expect.objectContaining({
          id: listing.id,
          name: val.name,
        }),
      );
      // re-disable listing opportunity
      jurisdictionA.enableListingOpportunity = false;
      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionA.id}`)
        .send(jurisdictionA)
        .set('Cookie', adminAccessToken)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);
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
});
