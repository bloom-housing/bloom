import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListingsStatusEnum } from '@prisma/client';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from '../../src/services/prisma.service';
import { AppModule } from '../../src/modules/app.module';
import { Login } from '../../src/dtos/auth/login.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { reservedCommunityTypeFactoryAll } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import dayjs from 'dayjs';

describe('Script Runner Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';
  let logger: Logger;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    logger = moduleFixture.get<Logger>(Logger);

    await app.init();

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        email: storedUser.email,
        password: 'Abcdef12345!',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('setInitialExpireAfterValues endpoint', () => {
    it('should not run if APPLICATION_DAYS_TILL_EXPIRY not set', async () => {
      process.env.APPLICATION_DAYS_TILL_EXPIRY = '';
      const res = await request(app.getHttpServer())
        .put(`/scriptRunner/setInitialExpireAfterValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(501);
      expect(res.body.message).toEqual(
        'APPLICATION_DAYS_TILL_EXPIRY env variable is not set',
      );
    });

    it('should set the expire_after value for applications on closed listings', async () => {
      process.env.APPLICATION_DAYS_TILL_EXPIRY = '90';
      const jurisData = jurisdictionFactory();
      const jurisdiction = await prisma.jurisdictions.create({
        data: {
          ...jurisData,
          name: `${jurisData.name} ${Math.floor(Math.random() * 100)}`,
        },
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const closedListing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
        closedAt: new Date('2024-04-28 00:00 -08:00'),
      });
      const createdClosedListing1 = await prisma.listings.create({
        data: closedListing1,
      });
      // Create all listings
      const closedListing2 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
        closedAt: new Date('2025-06-01 00:00 -08:00'),
      });
      const createdClosedListing2 = await prisma.listings.create({
        data: closedListing2,
      });
      const reopenedListing = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.active,
        closedAt: new Date('2025-06-01 00:00 -08:00'),
      });
      const createdReopenedListing = await prisma.listings.create({
        data: reopenedListing,
      });
      const neverClosedListing = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.active,
        closedAt: undefined,
      });
      await prisma.listings.create({
        data: neverClosedListing,
      });
      // Create applications for closed listing 1
      const application1 = await applicationFactory({
        listingId: createdClosedListing1.id,
      });
      const app1 = await prisma.applications.create({
        data: application1,
      });
      await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing1.id,
        }),
      });
      await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing1.id,
        }),
      });
      // Create applications for closed listing 2
      const app2 = await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing2.id,
        }),
      });
      // Create applications that shouldn't be updated
      const app3 = await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdReopenedListing.id,
        }),
      });

      await request(app.getHttpServer())
        .put(`/scriptRunner/setInitialExpireAfterValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      // Can't validate the log because other tests can add closed listings
      // expect(logger.log).toBeCalledWith(
      //   'updating expireAfter for 2 closed listings',
      // );
      expect(logger.log).toBeCalledWith(
        `updated 3 applications for ${createdClosedListing1.id}`,
      );
      expect(logger.log).toBeCalledWith(
        `updated 1 applications for ${createdClosedListing2.id}`,
      );
      const afterUpdate = await prisma.applications.findFirst({
        where: { id: app1.id },
      });
      expect(afterUpdate.expireAfter.toISOString()).toEqual(
        '2024-07-27T08:00:00.000Z',
      );
      const afterUpdate2 = await prisma.applications.findFirst({
        where: { id: app2.id },
      });
      expect(afterUpdate2.expireAfter.toISOString()).toEqual(
        '2025-08-30T08:00:00.000Z',
      );
      const afterUpdate3 = await prisma.applications.findFirst({
        where: { id: app3.id },
      });
      expect(afterUpdate3.expireAfter).toBeNull();
    });
  });

  describe('setIsNewestApplicationValues endpoint', () => {
    it('should update only the newest applications', async () => {
      // create partner user that shouldn't be counted
      await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
        }),
      });
      // Create public users
      const user1 = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      const user2 = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      // create applications
      const notNewestApplication1 = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(10, 'day').toDate(),
        }),
      });
      const newestApplication = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(4, 'day').toDate(),
        }),
      });
      const notNewestApplication2 = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(6, 'day').toDate(),
        }),
      });
      const user2Application = await prisma.applications.create({
        data: await applicationFactory({
          userId: user2.id,
        }),
      });
      await request(app.getHttpServer())
        .put(`/scriptRunner/setIsNewestApplicationValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      // Can't validate the log because other tests might add users
      // expect(logger.log).toBeCalledWith('total public user count 2');
      const updatedApplicationsUser1 = await prisma.applications.findMany({
        where: { userId: user1.id },
      });
      expect(
        updatedApplicationsUser1.find(
          (app) => app.id === notNewestApplication1.id,
        ).isNewest,
      ).toEqual(false);
      expect(
        updatedApplicationsUser1.find((app) => app.id === newestApplication.id)
          .isNewest,
      ).toEqual(true);
      expect(
        updatedApplicationsUser1.find(
          (app) => app.id === notNewestApplication2.id,
        ).isNewest,
      ).toEqual(false);

      expect(
        (
          await prisma.applications.findFirst({
            where: { id: user2Application.id },
          })
        ).isNewest,
      ).toEqual(true);
    });
  });
});
