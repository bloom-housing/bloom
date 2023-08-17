import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { stringify } from 'qs';
import { ListingsQueryParams } from '../../src/dtos/listings/listings-query-params.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { ListingOrderByKeys } from '../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { randomUUID } from 'crypto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { ListingPublishedUpdate } from '../../src/dtos/listings/listing-published-update.dto';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from '@prisma/client';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { amiChartFactory } from '../../prisma/seed-helpers/ami-chart-factory';
import { unitAccessibilityPriorityTypeFactorySingle } from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { reservedCommunityTypeFactory } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ListingPublishedCreate } from '../../src/dtos/listings/listing-published-create.dto';

describe('Listing Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    jurisdictionAId = jurisdiction.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should not get listings from list endpoint when no params are sent', async () => {
    const res = await request(app.getHttpServer()).get('/listings').expect(200);

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
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const listing2 = await listingFactory(jurisdictionAId, prisma);
    const listing2Created = await prisma.listings.create({
      data: listing2,
    });

    const res = await request(app.getHttpServer()).get('/listings').expect(200);

    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: 2,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
    });

    const items = res.body.items.map((item) => item.name);

    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items).toContain(listing1Created.name);
    expect(items).toContain(listing2Created.name);
  });

  it('should not get listings from list endpoint when params are sent', async () => {
    const queryParams: ListingsQueryParams = {
      limit: 1,
      page: 1,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: 'random name',
        },
      ],
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/listings?${query}`)
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

  it('should get listings from retrieveListings endpoint', async () => {
    const listingA = await listingFactory(jurisdictionAId, prisma, {
      multiselectQuestions: [{ text: 'example a' }],
    });
    const listingACreated = await prisma.listings.create({
      data: listingA,
      include: {
        listingMultiselectQuestions: true,
      },
    });

    const listingB = await listingFactory(jurisdictionAId, prisma, {
      multiselectQuestions: [{ text: 'example b' }],
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
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(listingA.name);
  });

  it("should error when trying to delete listing that doesn't exist", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/listings`)
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
    const listingData = await listingFactory(jurisdictionA.id, prisma);
    const listing = await prisma.listings.create({
      data: listingData,
    });

    const res = await request(app.getHttpServer())
      .delete(`/listings/`)
      .send({
        id: listing.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });

  it("should error when trying to update listing that doesn't exist", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/listings/${id}`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `listingId ${id} was requested but not found`,
    );
  });

  it('should update listing', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    await unitTypeFactoryAll(prisma);
    const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
    const amiChart = await prisma.amiChart.create({
      data: amiChartFactory(1, jurisdictionA.id),
    });
    const unitAccessibilityPriorityType =
      await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
    const rentType = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });
    const multiselectQuestion = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionA.id),
    });
    const reservedCommunityType = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionA.id),
    });

    const listingData = await listingFactory(jurisdictionA.id, prisma);
    const listing = await prisma.listings.create({
      data: listingData,
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
      id: listing.id,
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

    const res = await request(app.getHttpServer())
      .put(`/listings/${listing.id}`)
      .send(val)
      .expect(200);
    expect(res.body.id).toEqual(listing.id);
    expect(res.body.name).toEqual(val.name);
  });

  it('should create listing', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    await unitTypeFactoryAll(prisma);
    const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
    const amiChart = await prisma.amiChart.create({
      data: amiChartFactory(1, jurisdictionA.id),
    });
    const unitAccessibilityPriorityType =
      await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
    const rentType = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });
    const multiselectQuestion = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionA.id),
    });
    const reservedCommunityType = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionA.id),
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

    const res = await request(app.getHttpServer())
      .post('/listings')
      .send(val)
      .expect(201);
    expect(res.body.name).toEqual(val.name);
  });
});
