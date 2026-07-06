import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingsStatusEnum,
  UnitRentTypeEnum,
  UnitRentTypes,
  UnitTypeEnum,
  UnitTypes,
} from '@prisma/client';
import { AppModule } from '../../src/modules/app.module';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import {
  reservedCommunityTypeFactoryAll,
  reservedCommunityTypeFactoryGet,
} from '../../prisma/seed-helpers/reserved-community-type-factory';
import { unitTypeFactoryAll } from '../../prisma/seed-helpers/unit-type-factory';
import { unitRentTypeFactoryAll } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { randomNoun } from '../../prisma/seed-helpers/word-generator';
import { PrismaService } from '../../src/services/prisma.service';

describe('External Listings Controller Tests', () => {
  let app: INestApplication;
  let logger: Logger;
  let prisma: PrismaService;
  let unitRentTypes: UnitRentTypes[];
  let unitTypes: UnitTypes[];

  const testHttpService = {
    pipe: jest.fn(),
    get: jest.fn((url) => {
      // Get and parse the URL parameter.
      let response = {};
      if (url === 'error.com/externalListings') {
        response = { response: 'resp', status: '500' };
        return new Observable((subscriber) => subscriber.error(response));
      } else if (url === 'noMatch.com/externalListings') {
        response = {
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined,
          },
          data: {
            jurisdictions: [{ id: randomUUID(), name: randomNoun() }],
            listings: [],
            reservedCommunityTypes: [],
            unitRentTypes: [],
            unitTypes: [],
          },
        };
      } else if (url === 'externalJurisdictionName.com/externalListings') {
        response = {
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined,
          },
          data: {
            jurisdictions: [
              {
                id: 'externalJurisdictionId',
                name: 'externalJurisdictionName',
              },
            ],
            listings: [
              {
                id: 'externalListingId',
                contentUpdatedAt: new Date(),
                jurisdictionId: 'externalJurisdictionId',
              },
            ],
            reservedCommunityTypes: [
              { id: 'externalRCTId', name: 'senior' },
              { id: randomUUID(), name: 'fake' },
            ],
            unitRentTypes: [
              { id: 'externalURTId', name: UnitRentTypeEnum.fixed },
              { id: randomUUID(), name: UnitRentTypeEnum.percentageOfIncome },
            ],
            unitTypes: [
              { id: 'externalUTId', name: UnitTypeEnum.studio },
              { id: randomUUID(), name: UnitTypeEnum.oneBdrm },
            ],
          },
        };
      } else if (
        url ===
        `externalJurisdictionName.com/listings/externalListingId?view=base`
      ) {
        response = {
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined,
          },
          data: {
            id: 'externalListingId',
            assets: [
              {
                fileId: randomUUID(),
                label: 'example asset',
              },
            ],
            contentUpdatedAt: new Date(),
            displayWaitlistSize: false,
            isVerified: true,
            jurisdictions: [
              {
                id: 'externalJurisdictionId',
                name: 'externalJurisdictionName',
              },
            ],
            name: 'example listing name',
            reservedCommunityTypes: { id: 'externalRCTId', name: 'senior' },
            status: ListingsStatusEnum.active,
            units: [
              {
                amiPercentage: '1',
                annualIncomeMax: '5',
                annualIncomeMin: '2',
                bmrProgramChart: true,
                floor: 4,
                maxOccupancy: 6,
                minOccupancy: 7,
                monthlyIncomeMin: '3',
                monthlyRent: '8',
                monthlyRentAsPercentOfIncome: '13',
                numBathrooms: 9,
                numBedrooms: 10,
                number: '11',
                sqFeet: '12',

                unitRentTypes: {
                  id: 'externalURTId',
                  name: UnitRentTypeEnum.fixed,
                },
                unitTypes: { id: 'externalUTId', name: UnitTypeEnum.studio },
              },
            ],
          },
        };
      }

      return of(response);
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(testHttpService)
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    logger = moduleFixture.get<Logger>(Logger);
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();
    unitRentTypes = await unitRentTypeFactoryAll(prisma);
    unitTypes = await unitTypeFactoryAll(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Test externalize endpoint', () => {
    it('should return object with lists of needed info', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory('exposeJurisdiction'),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const reservedCommunityType = await reservedCommunityTypeFactoryGet(
        prisma,
        jurisdiction.id,
      );
      const listingData = await listingFactory(jurisdiction.id, prisma);
      const listingCreated = await prisma.listings.create({
        data: listingData,
      });

      const res = await request(app.getHttpServer())
        .get(`/externalListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      const { jurisdictions, listings, reservedCommunityTypes } = res.body;
      expect(jurisdictions).toContainEqual({
        id: jurisdiction.id,
        name: jurisdiction.name,
      });
      expect(listings).toContainEqual({
        id: listingCreated.id,
        contentUpdatedAt: listingCreated.contentUpdatedAt,
        jurisdictionId: jurisdiction.id,
      });
      expect(reservedCommunityTypes).toContainEqual({
        id: reservedCommunityType.id,
        name: reservedCommunityType.name,
      });
      unitRentTypes.forEach((urt) => {
        expect(res.body.unitRentTypes).toContainEqual({
          id: urt.id,
          name: urt.name,
        });
      });
      unitTypes.forEach((ut) => {
        expect(res.body.unitTypes).toContainEqual({
          id: ut.id,
          name: ut.name,
        });
      });
    });
  });

  describe('Test ingest endpoint', () => {
    let adminAccessToken: string;
    beforeAll(async () => {
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

    it('should error if external call fails', async () => {
      const ingestParams = {
        externalURL: 'error.com',
        jurisdictionId: '',
        targetName: '',
      };
      const res = await request(app.getHttpServer())
        .put(`/externalListings/ingest`)
        .send(ingestParams)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(500);

      expect(res.body.message).toEqual('External details call failed');
      expect(logger.error).toBeCalledWith(
        'Request to external Bloom instance with URL error.com failed',
        { response: 'resp', status: '500' },
      );
    });

    it('should error if jurisdiction cannot be matched', async () => {
      const ingestParams = {
        externalURL: 'noMatch.com',
        jurisdictionId: '',
        targetName: 'externalJurisdictionName',
      };
      const res = await request(app.getHttpServer())
        .put(`/externalListings/ingest`)
        .send(ingestParams)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(500);

      expect(res.body.message).toEqual('Target jurisdiction not found');
    });

    it('should call createExternalListing if external listing does not exist in the system', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory('newExternalListing'),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);

      const ingestParams = {
        externalURL: 'externalJurisdictionName.com',
        jurisdictionId: jurisdiction.id,
        targetName: 'externalJurisdictionName',
      };
      const res = await request(app.getHttpServer())
        .put(`/externalListings/ingest`)
        .send(ingestParams)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      await new Promise((resolve) => setTimeout(resolve, 100));
      const listings = await prisma.listings.findMany({
        include: {
          units: {
            include: {
              unitRentTypes: true,
              unitTypes: true,
            },
          },
        },
        where: {
          externalJurisdictionId: 'externalJurisdictionId',
          jurisdictionId: jurisdiction.id,
        },
      });

      expect(listings.length).toEqual(1);
      expect(listings[0].externalListingId).toEqual('externalListingId');
      expect(listings[0].externalURL).toEqual('externalJurisdictionName.com');
      expect(listings[0].units.length).toEqual(1);
      expect(listings[0].units[0].unitRentTypes.name).toEqual(
        UnitRentTypeEnum.fixed,
      );
      expect(listings[0].units[0].unitTypes.name).toEqual(UnitTypeEnum.studio);
    });

    it('should delete and recreate a listing if external listing has been updated', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory('updateExternalListing'),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listingData = await listingFactory(jurisdiction.id, prisma);
      const listingCreated = await prisma.listings.create({
        data: {
          ...listingData,
          contentUpdatedAt: dayjs(new Date()).subtract(1, 'days').toDate(),
          externalJurisdictionId: 'externalJurisdictionId',
          externalListingId: 'externalListingId',
          externalURL: 'externalJurisdictionName.com',
        },
      });

      const ingestParams = {
        externalURL: 'externalJurisdictionName.com',
        jurisdictionId: jurisdiction.id,
        targetName: 'externalJurisdictionName',
      };
      const res = await request(app.getHttpServer())
        .put(`/externalListings/ingest`)
        .send(ingestParams)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      await new Promise((resolve) => setTimeout(resolve, 100));
      const listings = await prisma.listings.findMany({
        include: {
          units: {
            include: {
              unitRentTypes: true,
              unitTypes: true,
            },
          },
        },
        where: {
          externalJurisdictionId: 'externalJurisdictionId',
          jurisdictionId: jurisdiction.id,
        },
      });

      expect(listings.length).toEqual(1);
      expect(listings[0].id).not.toEqual(listingCreated.id);
      expect(listings[0].contentUpdatedAt).not.toEqual(
        listingCreated.contentUpdatedAt,
      );
      expect(listings[0].externalListingId).toEqual('externalListingId');
      expect(listings[0].externalURL).toEqual('externalJurisdictionName.com');
      expect(listings[0].units.length).toEqual(1);
      expect(listings[0].units[0].unitRentTypes.name).toEqual(
        UnitRentTypeEnum.fixed,
      );
      expect(listings[0].units[0].unitTypes.name).toEqual(UnitTypeEnum.studio);
    });

    it('should do nothing if external listing has not been updated', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory('doNothingExternalListing'),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listingData = await listingFactory(jurisdiction.id, prisma);
      const listingCreated = await prisma.listings.create({
        data: {
          ...listingData,
          contentUpdatedAt: dayjs(new Date()).add(1, 'days').toDate(),
          externalJurisdictionId: 'externalJurisdictionId',
          externalListingId: 'externalListingId',
          externalURL: 'externalJurisdictionName.com',
        },
      });

      const ingestParams = {
        externalURL: 'externalJurisdictionName.com',
        jurisdictionId: jurisdiction.id,
        targetName: 'externalJurisdictionName',
      };
      const res = await request(app.getHttpServer())
        .put(`/externalListings/ingest`)
        .send(ingestParams)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const listings = await prisma.listings.findUnique({
        where: {
          id: listingCreated.id,
        },
      });

      expect(listings.contentUpdatedAt).toEqual(
        listingCreated.contentUpdatedAt,
      );
      expect(listings.externalListingId).toEqual('externalListingId');
      expect(listings.externalURL).toEqual('externalJurisdictionName.com');
    });
  });
});
