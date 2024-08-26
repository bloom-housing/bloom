import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  ReviewOrderTypeEnum,
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
import { ApplicationCsvQueryParams } from '../../src/dtos/applications/application-csv-query-params.dto';
import { EmailService } from '../../src/services/email.service';
import { permissionActions } from '../../src/enums/permissions/permission-actions-enum';
import dayjs from 'dayjs';

describe('Lottery Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let lotteryService: LotteryService;
  let cookies = '';
  let adminAccessToken: string;

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    lotteryReleased: async () => {},
    lotteryPublishedAdmin: async () => {},
    lotteryPublishedApplicant: async () => {},
  };

  const mockLotteryReleased = jest.spyOn(testEmailService, 'lotteryReleased');
  const mockLotteryPublishedAdmin = jest.spyOn(
    testEmailService,
    'lotteryPublishedAdmin',
  );
  const mockLotteryPublishedApplicant = jest.spyOn(
    testEmailService,
    'lotteryPublishedApplicant',
  );

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
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

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

    adminAccessToken = resLogIn.header?.['set-cookie'].find((cookie) =>
      cookie.startsWith('access-token='),
    );
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
          id: listing1Created.id,
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

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: listing1Created.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
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
          id: listing1Created.id,
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
        { id: listing1Created.id },
      );

      const queryParams: ApplicationCsvQueryParams = {
        id: listing1Created.id,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/lottery/getLotteryResults?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('autoPublishResults endpoint', () => {
    it('should only publish listing lotteries that are due today', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const today = new Date();
      const dueListingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: true,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
        listingEvents: [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: today,
          },
        ],
      });
      const dueListing = await prisma.listings.create({
        include: { listingEvents: true },
        data: dueListingData,
      });

      const dueButNotReleasedListingData = await listingFactory(
        jurisdictionA.id,
        prisma,
        {
          status: ListingsStatusEnum.closed,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          lotteryOptIn: true,
          lotteryStatus: LotteryStatusEnum.ran,
          listingEvents: [
            {
              type: ListingEventsTypeEnum.publicLottery,
              startDate: today,
            },
          ],
        },
      );
      const dueButNotReleasedListing = await prisma.listings.create({
        data: dueButNotReleasedListingData,
      });

      const notDueListingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: true,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
        listingEvents: [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: dayjs(today).add(5, 'days').toDate(),
          },
        ],
      });
      const notDueListing = await prisma.listings.create({
        data: notDueListingData,
      });

      const res = await request(app.getHttpServer())
        .put(`/lottery/autoPublishResults`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const postJobListing = await prisma.listings.findUnique({
        where: {
          id: dueListing.id,
        },
      });

      expect(postJobListing.lotteryStatus).toEqual(
        LotteryStatusEnum.publishedToPublic,
      );

      const postJobListing2 = await prisma.listings.findUnique({
        where: {
          id: dueButNotReleasedListing.id,
        },
      });

      expect(postJobListing2.lotteryStatus).toEqual(LotteryStatusEnum.ran);

      const postJobListing3 = await prisma.listings.findUnique({
        where: {
          id: notDueListing.id,
        },
      });

      expect(postJobListing3.lotteryStatus).toEqual(
        LotteryStatusEnum.releasedToPartners,
      );

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: postJobListing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('expireLotteries endpoint', () => {
    it('should only expire listing lotteries that are past due', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const expiredClosedListingDate = dayjs(new Date())
        .subtract(
          Number(process.env.LOTTERY_DAYS_TILL_EXPIRY || 45) + 1,
          'days',
        )
        .toDate();

      const expiredListingData = await listingFactory(
        jurisdictionA.id,
        prisma,
        {
          status: ListingsStatusEnum.closed,
          closedAt: expiredClosedListingDate,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
        },
      );
      const expiredListing = await prisma.listings.create({
        data: expiredListingData,
      });

      const recentlyClosedListingData = await listingFactory(
        jurisdictionA.id,
        prisma,
        {
          status: ListingsStatusEnum.closed,
          closedAt: new Date(),
          reviewOrderType: ReviewOrderTypeEnum.lottery,
        },
      );
      const recentlyClosedListing = await prisma.listings.create({
        data: recentlyClosedListingData,
      });

      const openListingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.active,
        reviewOrderType: ReviewOrderTypeEnum.lottery,
      });
      const openListing = await prisma.listings.create({
        data: openListingData,
      });

      const res = await request(app.getHttpServer())
        .put(`/lottery/expireLotteries`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const postJobListing = await prisma.listings.findUnique({
        where: {
          id: expiredListing.id,
        },
      });

      expect(postJobListing.lotteryStatus).toEqual(LotteryStatusEnum.expired);

      const postJobListing2 = await prisma.listings.findUnique({
        where: {
          id: recentlyClosedListing.id,
        },
      });

      expect(postJobListing2.lotteryStatus).toBeNull;

      const postJobListing3 = await prisma.listings.findUnique({
        where: {
          id: openListing.id,
        },
      });

      expect(postJobListing3.lotteryStatus).toBeNull;

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: postJobListing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('lottery status endpoint', () => {
    let adminUser, adminAccessToken;
    beforeAll(async () => {
      adminUser = await prisma.userAccounts.create({
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

    it("should error when trying to update listing that doesn't exist", async () => {
      const id = randomUUID();
      const res = await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: id,
          lotteryStatus: LotteryStatusEnum.ran,
        })
        .set('Cookie', adminAccessToken)
        .expect(404);
      expect(res.body.message).toEqual(
        `listingId ${id} was requested but not found`,
      );
    });

    it('should error if user is not an admin and tries to update to ran or releasedToPartner', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.ran,
        })
        .expect(403);

      await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        })
        .expect(403);
    });

    it('should update listing lottery status to releasedToPartners from ran', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
      });
      const appUpdate = new Date();
      appUpdate.setDate(appUpdate.getDate() - 1);
      const listing = await prisma.listings.create({
        data: {
          ...listingData,
          lotteryLastRunAt: new Date(),
          lastApplicationUpdateAt: appUpdate,
        },
      });

      const partnerUser = await prisma.userAccounts.create({
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
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        })
        .set('Cookie', adminAccessToken)
        .expect(200);
      expect(res.body.success).toEqual(true);

      expect(mockLotteryReleased).toBeCalledWith(
        {
          id: listing.id,
          name: listing.name,
          juris: expect.stringMatching(jurisdictionA.id),
        },
        expect.arrayContaining([partnerUser.email, adminUser.email]),
        process.env.PARTNERS_PORTAL_URL,
      );

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should error trying to update listing lottery status to releasedToPartners from ran if there are new paper application updates', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
      });
      const lotteryLastRun = new Date();
      lotteryLastRun.setDate(lotteryLastRun.getDate() - 1);
      const listing = await prisma.listings.create({
        data: {
          ...listingData,
          lotteryLastRunAt: lotteryLastRun,
          lastApplicationUpdateAt: new Date(),
        },
      });

      await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        })
        .set('Cookie', adminAccessToken)
        .expect(400);
    });

    it('should update listing lottery status to ran from releasedToPartners aka retract', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const res = await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.ran,
        })
        .set('Cookie', adminAccessToken)
        .expect(200);
      expect(res.body.success).toEqual(true);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should update listing lottery status to publishedToPublic from releasedToPartners', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
      const listingData = await listingFactory(jurisdictionA.id, prisma, {
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
        applications: [
          {
            preferences: [],
            status: ApplicationStatusEnum.submitted,
            confirmationCode: 'ABCD1234',
            submissionType: ApplicationSubmissionTypeEnum.electronical,
            language: LanguagesEnum.en,
            applicant: {
              create: {
                emailAddress: 'applicant@email.com',
              },
            },
          },
          {
            preferences: [],
            status: ApplicationStatusEnum.submitted,
            confirmationCode: 'EFGH5678',
            submissionType: ApplicationSubmissionTypeEnum.electronical,
            language: LanguagesEnum.es,
            applicant: {
              create: {
                emailAddress: 'applicant2@email.com',
              },
            },
          },
          {
            preferences: [],
            status: ApplicationStatusEnum.submitted,
            confirmationCode: 'IJKL9012',
            submissionType: ApplicationSubmissionTypeEnum.electronical,
            language: null,
            applicant: {
              create: {
                emailAddress: 'applicant3@email.com',
              },
            },
          },
        ],
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const partnerUser = await prisma.userAccounts.create({
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
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: LotteryStatusEnum.publishedToPublic,
        })
        .set('Cookie', adminAccessToken)
        .expect(200);
      expect(res.body.success).toEqual(true);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'lottery',
          action: permissionActions.update,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();

      expect(mockLotteryPublishedAdmin).toBeCalledWith(
        {
          id: listing.id,
          name: listing.name,
          juris: expect.stringMatching(jurisdictionA.id),
        },
        expect.arrayContaining([partnerUser.email, adminUser.email]),
        process.env.PARTNERS_PORTAL_URL,
      );

      expect(mockLotteryPublishedApplicant).toBeCalledWith(
        {
          id: listing.id,
          name: listing.name,
          juris: expect.stringMatching(jurisdictionA.id),
        },
        expect.objectContaining({
          en: ['applicant@email.com', 'applicant3@email.com'],
          es: ['applicant2@email.com'],
        }),
      );
    });
  });
});
