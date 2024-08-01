import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  UnitTypeEnum,
} from '@prisma/client';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import { Request as ExpressRequest, Response } from 'express';
import { stringify } from 'qs';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { translationFactory } from '../../prisma/seed-helpers/translation-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { reservedCommunityTypeFactoryAll } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { LotteryService } from '../../src/services/lottery.service';
import { ApplicationCsvQueryParams } from 'src/dtos/applications/application-csv-query-params.dto';

describe('Application Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let lotteryService: LotteryService;
  let cookies = '';

  const createMultiselectQuestion = async (
    jurisdictionId: string,
    listingId: string,
    section: MultiselectQuestionsApplicationSectionEnum,
  ) => {
    const res = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionId, {
        multiselectQuestion: {
          applicationSection: section,
          listings: {
            create: {
              listingId: listingId,
            },
          },
        },
      }),
    });

    return res.id;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    lotteryService = moduleFixture.get<LotteryService>(LotteryService);
    app.use(cookieParser());
    await app.init();
    await unitTypeFactoryAll(prisma);
    await await prisma.translations.create({
      data: translationFactory(),
    });

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

  describe('generateLotteryResults endpoint', () => {
    it('should generate results when no previous attempt to run lotteries has happened (no preferences)', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const appA = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationA = await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const appB = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationB = await prisma.applications.create({
        data: appB,
        include: {
          applicant: true,
        },
      });

      const appC = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationC = await prisma.applications.create({
        data: appC,
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .put(`/lottery/generateLotteryResults`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          listingId: listing1Created.id,
        })
        .set('Cookie', cookies)
        .expect(200);

      const lotteryPositions =
        await prisma.applicationLotteryPositions.findMany({
          where: {
            listingId: listing1Created.id,
          },
        });

      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationA.id),
      ).toBe(true);
      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationB.id),
      ).toBe(true);
      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationC.id),
      ).toBe(true);

      const updatedListing = await prisma.listings.findUnique({
        where: {
          id: listing1Created.id,
        },
      });

      expect(updatedListing.lotteryStatus).toEqual(LotteryStatusEnum.ran);
    });

    it('should generate results when no previous attempt to run lotteries has happened (with preferences)', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const preferenceAId = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const preferenceA = await prisma.multiselectQuestions.findUnique({
        where: {
          id: preferenceAId,
        },
      });

      const preferenceBId = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const preferenceB = await prisma.multiselectQuestions.findUnique({
        where: {
          id: preferenceBId,
        },
      });

      const appA = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationA = await prisma.applications.create({
        data: {
          ...appA,
          preferences: [
            {
              multiselectQuestionId: preferenceA,
              key: preferenceA.text,
              claimed: true,
              options: [],
            },
            {
              multiselectQuestionId: preferenceB,
              key: preferenceB.text,
              claimed: true,
              options: [],
            },
          ],
        },
        include: {
          applicant: true,
        },
      });

      const appB = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationB = await prisma.applications.create({
        data: {
          ...appB,
          preferences: [
            {
              multiselectQuestionId: preferenceA,
              key: preferenceA.text,
              claimed: true,
              options: [],
            },
            {
              multiselectQuestionId: preferenceB,
              key: preferenceB.text,
              claimed: false,
              options: [],
            },
          ],
        },
        include: {
          applicant: true,
        },
      });

      const appC = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      const applicationC = await prisma.applications.create({
        data: {
          ...appC,
          preferences: [
            {
              multiselectQuestionId: preferenceA,
              key: preferenceA.text,
              claimed: false,
              options: [],
            },
            {
              multiselectQuestionId: preferenceB,
              key: preferenceB.text,
              claimed: true,
              options: [],
            },
          ],
        },
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .put(`/lottery/generateLotteryResults`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          listingId: listing1Created.id,
        })
        .set('Cookie', cookies)
        .expect(200);

      const lotteryPositions =
        await prisma.applicationLotteryPositions.findMany({
          where: {
            listingId: listing1Created.id,
            multiselectQuestionId: null,
          },
        });

      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationA.id),
      ).toBe(true);
      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationB.id),
      ).toBe(true);
      expect(
        lotteryPositions.some((pos) => pos.applicationId === applicationC.id),
      ).toBe(true);

      const prefALotteryPositions =
        await prisma.applicationLotteryPositions.findMany({
          where: {
            listingId: listing1Created.id,
            multiselectQuestionId: preferenceAId,
          },
        });

      expect(
        prefALotteryPositions.some(
          (pos) => pos.applicationId === applicationA.id,
        ),
      ).toBe(true);
      expect(
        prefALotteryPositions.some(
          (pos) => pos.applicationId === applicationB.id,
        ),
      ).toBe(true);
      expect(
        prefALotteryPositions.some(
          (pos) => pos.applicationId === applicationC.id,
        ),
      ).toBe(false);

      const prefBLotteryPositions =
        await prisma.applicationLotteryPositions.findMany({
          where: {
            listingId: listing1Created.id,
            multiselectQuestionId: preferenceBId,
          },
        });

      expect(
        prefBLotteryPositions.some(
          (pos) => pos.applicationId === applicationA.id,
        ),
      ).toBe(true);
      expect(
        prefBLotteryPositions.some(
          (pos) => pos.applicationId === applicationB.id,
        ),
      ).toBe(false);
      expect(
        prefBLotteryPositions.some(
          (pos) => pos.applicationId === applicationC.id,
        ),
      ).toBe(true);

      const updatedListing = await prisma.listings.findUnique({
        where: {
          id: listing1Created.id,
        },
      });

      expect(updatedListing.lotteryStatus).toEqual(LotteryStatusEnum.ran);
    });

    it('should throw an error when a run of lotteries already occured', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listing1Created = await prisma.listings.create({
        data: {
          ...listing1,
          lotteryLastRunAt: new Date(),
          lotteryStatus: LotteryStatusEnum.ran,
        },
      });

      const appA = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/lottery/generateLotteryResults`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          listingId: listing1Created.id,
        })
        .set('Cookie', cookies)
        .expect(400);
      expect(res.body.message).toEqual(
        `Listing ${listing1Created.id}: the lottery was attempted to be generated but it was already run previously`,
      );
    });
  });

  describe('getLotteryResults endpoint', () => {
    it('should get a lottery export of application', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const appA = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const appB = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      await prisma.applications.create({
        data: appB,
        include: {
          applicant: true,
        },
      });

      const appC = await applicationFactory({
        unitTypeId: unitTypeA.id,
        listingId: listing1Created.id,
      });

      await prisma.applications.create({
        data: appC,
        include: {
          applicant: true,
        },
      });

      await lotteryService.lotteryGenerate(
        {
          user: {
            id: randomUUID(),
            userRoles: {
              isAdmin: true,
            },
          },
        } as unknown as ExpressRequest,
        {} as Response,
        { listingId: listing1Created.id },
      );

      const queryParams: ApplicationCsvQueryParams = {
        listingId: listing1Created.id,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/lottery/getLotteryResults?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });
  });
});
