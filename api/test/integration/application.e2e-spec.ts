import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  UnitTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { ApplicationQueryParams } from '../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../src/enums/applications/order-by-enum';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { ApplicationCreate } from '../../src/dtos/applications/application-create.dto';
import { InputType } from '../../src/enums/shared/input-type-enum';
import { addressFactory } from '../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../src/dtos/addresses/address-create.dto';
import { ApplicationUpdate } from '../../src/dtos/applications/application-update.dto';
import { translationFactory } from '../../prisma/seed-helpers/translation-factory';
import { EmailService } from '../../src/services/email.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { reservedCommunityTypeFactoryAll } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ValidationMethod } from '../../src/enums/multiselect-questions/validation-method-enum';
import { AlternateContactRelationship } from '../../src/enums/applications/alternate-contact-relationship-enum';
import { HouseholdMemberRelationship } from '../../src/enums/applications/household-member-relationship-enum';
import { ApplicationsFilterEnum } from '../../src/enums/applications/filter-enum';
import { PublicAppsViewQueryParams } from '../../src/dtos/applications/public-apps-view-params.dto';
import dayjs from 'dayjs';

describe('Application Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminCookies = '';
  let logger: Logger;

  const testEmailService = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    applicationConfirmation: async () => {},
  };

  const mockApplicationConfirmation = jest.spyOn(
    testEmailService,
    'applicationConfirmation',
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
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    logger = moduleFixture.get<Logger>(Logger);
    app.use(cookieParser());
    await app.init();
    await unitTypeFactoryAll(prisma);
    await prisma.translations.create({
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

    adminCookies = resLogIn.headers['set-cookie'];
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('listing endpoint', () => {
    it('should get no applications when params are sent, and no applications are stored', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);
      expect(res.body.items.length).toBe(0);
    });

    // without clearing the db between tests or test suites this is flakes because of other e2e tests
    it.skip('should get no applications when no params are sent, and no applications are stored', async () => {
      const res = await request(app.getHttpServer())
        .get(`/applications`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.items.length).toBe(0);
    });

    it('should get stored applications when params are sent', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const appA = await applicationFactory({ unitTypeId: unitTypeA.id });
      const applicationA = await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const appB = await applicationFactory({ unitTypeId: unitTypeA.id });
      const applicationB = await prisma.applications.create({
        data: appB,
        include: {
          applicant: true,
        },
      });

      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.items.length).toBeGreaterThanOrEqual(2);
      const resApplicationA = res.body.items.find(
        (item) => item.applicant.firstName === applicationA.applicant.firstName,
      );
      expect(resApplicationA).not.toBeNull();
      res.body.items.find(
        (item) => item.applicant.firstName === applicationB.applicant.firstName,
      );
      expect(resApplicationA).not.toBeNull();
    });

    it('should get stored applications when no params sent', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const appA = await applicationFactory({ unitTypeId: unitTypeA.id });
      const applicationA = await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const appB = await applicationFactory({ unitTypeId: unitTypeA.id });
      const applicationB = await prisma.applications.create({
        data: appB,
        include: {
          applicant: true,
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/applications`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.items.length).toBeGreaterThanOrEqual(2);
      const resApplicationA = res.body.items.find(
        (item) => item.applicant.firstName === applicationA.applicant.firstName,
      );
      expect(resApplicationA).not.toBeNull();
      res.body.items.find(
        (item) => item.applicant.firstName === applicationB.applicant.firstName,
      );
      expect(resApplicationA).not.toBeNull();
    });
  });

  describe('retreive endpoint', () => {
    it('should retrieve an application when one exists', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const appA = await applicationFactory({ unitTypeId: unitTypeA.id });
      const applicationA = await prisma.applications.create({
        data: appA,
        include: {
          applicant: true,
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.applicant.firstName).toEqual(
        applicationA.applicant.firstName,
      );
    });

    it("should throw an error when retrieve is called with an Id that doesn't exist", async () => {
      const id = randomUUID();

      const res = await request(app.getHttpServer())
        .get(`/applications/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `applicationId ${id} was requested but not found`,
      );
    });

    it('should delete an application when one exists', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma);
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

      const res = await request(app.getHttpServer())
        .delete(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: applicationA.id,
        })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.success).toEqual(true);

      const applicationAfterDelete = await prisma.applications.findUnique({
        where: {
          id: applicationA.id,
        },
      });

      expect(applicationAfterDelete.deletedAt).not.toBeNull();
    });
  });

  describe('delete endpoint', () => {
    it("should throw an error when delete is called with an Id that doesn't exist", async () => {
      const id = randomUUID();

      const res = await request(app.getHttpServer())
        .delete(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id,
        })
        .expect(404);

      expect(res.body.message).toEqual(
        `applicationId ${id} was requested but not found`,
      );
    });
  });

  describe('submit endpoint', () => {
    let publicUserCookies = '';
    let storedUser = { id: '', email: '' };
    beforeAll(async () => {
      storedUser = await prisma.userAccounts.create({
        data: await userFactory({
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

      publicUserCookies = resLogIn.headers['set-cookie'];
    });
    it('should create application from public site', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        digitalApp: true,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: null,
          applicantWorkAddress: null,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: null,
            householdMemberWorkAddress: null,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };
      const res = await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .set('Cookie', publicUserCookies)
        .expect(201);

      expect(res.body.id).not.toBeNull();
      expect(res.body).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        contactPreferences: ['example contact preference'],
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: 'perYear',
        status: 'submitted',
        language: 'en',
        acceptedTerms: true,
        submissionType: 'electronical',
        submissionDate: expect.any(String),
        markedAsDuplicate: false,
        confirmationCode: expect.any(String),
        receivedAt: null,
        receivedBy: null,
        accessibleUnitWaitlistNumber: null,
        conventionalUnitWaitlistNumber: null,
        manualLotteryPositionNumber: null,
        reviewStatus: 'valid',
        applicationsMailingAddress: {
          id: expect.any(String),
          placeName: exampleAddress.placeName,
          city: exampleAddress.city,
          county: exampleAddress.county,
          state: exampleAddress.state,
          street: exampleAddress.street,
          street2: null,
          zipCode: exampleAddress.zipCode,
          latitude: exampleAddress.latitude,
          longitude: exampleAddress.longitude,
        },
        applicationsAlternateAddress: {
          id: expect.any(String),
          placeName: exampleAddress.placeName,
          city: exampleAddress.city,
          county: exampleAddress.county,
          state: exampleAddress.state,
          street: exampleAddress.street,
          street2: null,
          zipCode: exampleAddress.zipCode,
          latitude: exampleAddress.latitude,
          longitude: exampleAddress.longitude,
        },
        accessibility: {
          id: expect.any(String),
          mobility: false,
          vision: false,
          hearing: false,
          other: null,
        },
        demographics: {
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
            name: 'oneBdrm',
            numBedrooms: 1,
          },
        ],
        applicant: {
          id: expect.any(String),
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: null,
          fullTimeStudent: null,
          applicantWorkAddress: null,
          applicantAddress: {
            id: expect.any(String),
            placeName: exampleAddress.placeName,
            city: exampleAddress.city,
            county: exampleAddress.county,
            state: exampleAddress.state,
            street: exampleAddress.street,
            street2: null,
            zipCode: exampleAddress.zipCode,
            latitude: exampleAddress.latitude,
            longitude: exampleAddress.longitude,
          },
        },
        alternateContact: {
          id: expect.any(String),
          type: 'friend',
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: {
            id: expect.any(String),
            placeName: exampleAddress.placeName,
            city: exampleAddress.city,
            county: exampleAddress.county,
            state: exampleAddress.state,
            street: exampleAddress.street,
            street2: null,
            zipCode: exampleAddress.zipCode,
            latitude: exampleAddress.latitude,
            longitude: exampleAddress.longitude,
          },
        },
        householdMember: [
          {
            birthDay: '17',
            birthMonth: '12',
            birthYear: '1993',
            firstName: 'example first name',
            fullTimeStudent: null,
            householdMemberAddress: {
              id: expect.any(String),
              placeName: exampleAddress.placeName,
              city: exampleAddress.city,
              county: exampleAddress.county,
              state: exampleAddress.state,
              street: exampleAddress.street,
              street2: null,
              zipCode: exampleAddress.zipCode,
              latitude: exampleAddress.latitude,
              longitude: exampleAddress.longitude,
            },
            householdMemberWorkAddress: null,
            id: expect.any(String),
            lastName: 'example last name',
            middleName: 'example middle name',
            orderId: 0,
            relationship: 'friend',
            sameAddress: 'yes',
            workInRegion: null,
          },
        ],
        preferences: [
          {
            claimed: true,
            key: 'example key',
            multiselectQuestionId: expect.any(String),
            options: [
              {
                checked: true,
                extraData: [
                  {
                    key: 'example key',
                    type: 'boolean',
                    value: true,
                  },
                ],
                key: 'example key',
              },
            ],
          },
        ],
        programs: [
          {
            claimed: true,
            key: 'example key',
            multiselectQuestionId: expect.any(String),
            options: [
              {
                checked: true,
                extraData: [
                  {
                    key: 'example key',
                    type: 'boolean',
                    value: true,
                  },
                ],
                key: 'example key',
              },
            ],
          },
        ],
        listings: {
          id: listing1Created.id,
          name: listing1.name,
        },
        isNewest: true,
      });
      expect(mockApplicationConfirmation).toBeCalledTimes(1);
    });

    it('should throw an error when submitting an application from the public site on a listing with no common app', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        digitalApp: false,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .set('Cookie', publicUserCookies)
        .expect(400);
      expect(res.body.message).toEqual(
        `Listing is not open for application submission`,
      );
    });

    it('should set the isNewest flag', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        digitalApp: true,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const listing2 = await listingFactory(jurisdiction.id, prisma, {
        digitalApp: true,
      });
      const listing2Created = await prisma.listings.create({
        data: listing2,
      });

      // create previous applications for the user with one being the newest
      await prisma.applications.create({
        data: {
          listings: { connect: { id: listing2Created.id } },
          confirmationCode: randomUUID(),
          preferences: [],
          submissionType: ApplicationSubmissionTypeEnum.electronical,
          status: ApplicationStatusEnum.submitted,
          isNewest: true,
        },
      });

      await prisma.applications.create({
        data: {
          listings: { connect: { id: listing2Created.id } },
          confirmationCode: randomUUID(),
          preferences: [],
          submissionType: ApplicationSubmissionTypeEnum.electronical,
          status: ApplicationStatusEnum.submitted,
          isNewest: false,
        },
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [],
      };
      const res = await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .set('Cookie', publicUserCookies)
        .expect(201);

      expect(res.body.id).not.toBeNull();
      expect(res.body.isNewest).toBe(true);
      expect(mockApplicationConfirmation).toBeCalledTimes(1);

      const otherUserApplications = await prisma.applications.findMany({
        select: { id: true, isNewest: true },
        where: { userId: storedUser.id, id: { not: res.body.id } },
      });
      otherUserApplications.forEach((application) => {
        expect(application.isNewest).toBe(false);
      });
    });

    it('should calculate geocoding on application', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const exampleAddress = addressFactory() as AddressCreate;
      const listing1 = await listingFactory(jurisdiction.id, prisma, {
        digitalApp: true,
        listing: {
          listingsBuildingAddress: { create: exampleAddress },
        } as unknown as Prisma.ListingsCreateInput,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionPreference =
        await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdiction.id, {
            multiselectQuestion: {
              applicationSection:
                MultiselectQuestionsApplicationSectionEnum.preferences,
              listings: {
                create: {
                  listingId: listing1Created.id,
                },
              },
              options: [
                {
                  text: 'geocoding preference',
                  collectAddress: true,
                  validationMethod: ValidationMethod.radius,
                  radiusSize: 5,
                },
              ],
            },
          }),
        });

      const submissionDate = new Date();
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference.id,
            key: multiselectQuestionPreference.text,
            claimed: true,
            options: [
              {
                key: 'geocoding preference',
                checked: true,
                extraData: [
                  {
                    type: InputType.address,
                    key: 'address',
                    value: exampleAddress,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [],
      };
      const res = await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .expect(201);

      expect(res.body.id).not.toBeNull();

      let savedApplication = await prisma.applications.findMany({
        where: {
          id: res.body.id,
        },
      });
      const savedPreferences = savedApplication[0].preferences;
      expect(savedPreferences).toHaveLength(1);
      let geocodingOptions = savedPreferences[0].options[0];
      // This catches the edge case where the geocoding hasn't completed yet
      if (geocodingOptions.extraData.length === 1) {
        // I'm unsure why removing this console log makes this test fail. This should be looked into
        console.log('');
        savedApplication = await prisma.applications.findMany({
          where: {
            id: res.body.id,
          },
        });
      }
      geocodingOptions = savedApplication[0].preferences[0].options[0];
      expect(geocodingOptions.extraData).toHaveLength(2);
      expect(geocodingOptions.extraData).toContainEqual({
        key: 'geocodingVerified',
        type: 'text',
        value: true,
      });
    });
  });

  describe('create endpoint', () => {
    it('should create application from partner site', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };
      const res = await request(app.getHttpServer())
        .post(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .set('Cookie', adminCookies)
        .expect(201);

      expect(res.body.id).not.toBeNull();
    });
  });

  describe('update endpoint', () => {
    it('should update an application when one exists', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

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

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationUpdate = {
        id: applicationA.id,
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.applicant.firstName).toEqual(dto.applicant.firstName);
      expect(res.body.id).toEqual(dto.id);
    });

    it("should throw an error when update is called with an Id that doesn't exist", async () => {
      const id = randomUUID();
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationUpdate = {
        id,
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .put(`/applications/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .expect(404);

      expect(res.body.message).toEqual(
        `applicationId ${id} was requested but not found`,
      );
    });
  });

  describe('verify endpoint', () => {
    it('should verify an application', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const multiselectQuestionProgram = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.programs,
      );
      const multiselectQuestionPreference = await createMultiselectQuestion(
        jurisdiction.id,
        listing1Created.id,
        MultiselectQuestionsApplicationSectionEnum.preferences,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
            multiselectQuestionId: multiselectQuestionPreference,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
        status: ApplicationStatusEnum.submitted,
        submissionType: ApplicationSubmissionTypeEnum.electronical,
        applicant: {
          firstName: 'applicant first name',
          middleName: 'applicant middle name',
          lastName: 'applicant last name',
          birthMonth: '12',
          birthDay: '17',
          birthYear: '1993',
          emailAddress: 'example@email.com',
          noEmail: false,
          phoneNumber: '111-111-1111',
          phoneNumberType: 'Cell',
          noPhone: false,
          workInRegion: YesNoEnum.yes,
          applicantWorkAddress: exampleAddress,
          applicantAddress: exampleAddress,
        },
        accessibility: {
          mobility: false,
          vision: false,
          hearing: false,
        },
        alternateContact: {
          type: AlternateContactRelationship.friend,
          otherType: 'example other type',
          firstName: 'example first name',
          lastName: 'example last name',
          agency: 'example agency',
          phoneNumber: '111-111-1111',
          emailAddress: 'example@email.com',
          address: exampleAddress,
        },
        applicationsAlternateAddress: exampleAddress,
        applicationsMailingAddress: exampleAddress,
        listings: {
          id: listing1Created.id,
        },
        demographics: {
          ethnicity: '',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
          spokenLanguage: 'example language',
        },
        preferredUnitTypes: [
          {
            id: unitTypeA.id,
          },
        ],
        householdMember: [
          {
            orderId: 0,
            firstName: 'example first name',
            middleName: 'example middle name',
            lastName: 'example last name',
            birthMonth: '12',
            birthDay: '17',
            birthYear: '1993',
            sameAddress: YesNoEnum.yes,
            relationship: HouseholdMemberRelationship.friend,
            workInRegion: YesNoEnum.yes,
            householdMemberWorkAddress: exampleAddress,
            householdMemberAddress: exampleAddress,
          },
        ],
        appUrl: 'http://www.example.com',
        additionalPhone: true,
        additionalPhoneNumber: '111-111-1111',
        additionalPhoneNumberType: 'example type',
        householdSize: 2,
        housingStatus: 'example status',
        sendMailToMailingAddress: true,
        householdExpectingChanges: false,
        householdStudent: false,
        incomeVouchers: [],
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
            multiselectQuestionId: multiselectQuestionProgram,
            key: 'example key',
            claimed: true,
            options: [
              {
                key: 'example key',
                checked: true,
                extraData: [
                  {
                    type: InputType.boolean,
                    key: 'example key',
                    value: true,
                  },
                ],
              },
            ],
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post(`/applications/verify`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .expect(201);

      expect(res.body.success).toEqual(true);
    });

    it('should throw an error when trying to verify an incomplete application', async () => {
      const dto: ApplicationCreate = {} as unknown as ApplicationCreate;

      const res = await request(app.getHttpServer())
        .post(`/applications/verify`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(dto)
        .expect(400);

      expect(res.body.error).toEqual('Bad Request');
      expect(res.body.message).toEqual([
        'preferences should not be null or undefined',
      ]);
    });
  });

  describe('publicAppsView endpoint', () => {
    it('should retrieve applications and counts when they exist', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const user = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(juris.id, prisma);

      const listingOpen = await listingFactory(juris.id, prisma, {
        status: ListingsStatusEnum.active,
      });
      const listingClosed = await listingFactory(juris.id, prisma, {
        status: ListingsStatusEnum.closed,
      });
      const listingLottery = await listingFactory(juris.id, prisma, {
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.publishedToPublic,
      });
      const listingOpenCreated = await prisma.listings.create({
        data: listingOpen,
      });
      const listingClosedCreated = await prisma.listings.create({
        data: listingClosed,
      });
      const listingLotteryCreated = await prisma.listings.create({
        data: listingLottery,
      });

      const appOpenListing = await applicationFactory({
        unitTypeId: unitTypeA.id,
        userId: user.id,
        listingId: listingOpenCreated.id,
      });

      const appClosedListing = await applicationFactory({
        unitTypeId: unitTypeA.id,
        userId: user.id,
        listingId: listingClosedCreated.id,
      });

      const appLotteryListing = await applicationFactory({
        unitTypeId: unitTypeA.id,
        userId: user.id,
        listingId: listingLotteryCreated.id,
      });
      const appArr = [appOpenListing, appClosedListing, appLotteryListing];
      await Promise.all(
        appArr.map(async (app) => {
          await prisma.applications.create({
            data: app,
            include: {
              applicant: true,
            },
          });
        }),
      );

      const queryParams: PublicAppsViewQueryParams = {
        userId: user.id,
        filterType: ApplicationsFilterEnum.all,
        includeLotteryApps: true,
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .get(`/applications/publicAppsView?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.applicationsCount.total).toEqual(3);
      expect(res.body.applicationsCount.lottery).toEqual(1);
      expect(res.body.applicationsCount.closed).toEqual(1);
      expect(res.body.applicationsCount.open).toEqual(1);

      expect(res.body.displayApplications.length).toBe(3);
      expect(res.body.displayApplications[0].id).not.toBeNull();
    });

    it('should not retrieve applications nor error when none exist', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const queryParams: PublicAppsViewQueryParams = {
        userId: userA.id,
        filterType: ApplicationsFilterEnum.all,
        includeLotteryApps: true,
      };
      const query = stringify(queryParams as any);

      const res = await request(app.getHttpServer())
        .get(`/applications/publicAppsView?${query}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(res.body.applicationsCount.total).toEqual(0);
      expect(res.body.displayApplications.length).toEqual(0);
    });
  });

  describe('removePIICronJob endpoint', () => {
    it('should not run the removePII cron job if env variable not set', async () => {
      await request(app.getHttpServer())
        .put(`/applications/removePIICronJob`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(logger.warn).toBeCalledWith(
        'APPLICATION_DAYS_TILL_EXPIRY variable not set so the cron job will not run',
      );
    });
    it('should run the removePII cron job for expired applications', async () => {
      process.env.APPLICATION_DAYS_TILL_EXPIRY = '90';
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(juris.id, prisma);
      const listing = await prisma.listings.create({
        data: await listingFactory(juris.id, prisma, {
          status: ListingsStatusEnum.active,
        }),
      });

      // Application that is the newest for a user
      const newestApplication = await prisma.applications.create({
        data: await applicationFactory({
          listingId: listing.id,
          isNewest: true,
          expireAfter: dayjs(new Date()).subtract(180, 'days').toDate(),
        }),
      });
      // Application that expires in the future
      const futureApplication = await prisma.applications.create({
        data: await applicationFactory({
          listingId: listing.id,
          isNewest: false,
          expireAfter: dayjs(new Date()).add(3, 'days').toDate(),
        }),
      });
      // This application should have the PII script run against it
      const applicationToBeCleaned = await prisma.applications.create({
        data: await applicationFactory({
          listingId: listing.id,
          isNewest: false,
          additionalPhone: '(123) 456-7890',
          expireAfter: dayjs(new Date()).subtract(2, 'days').toDate(),
          applicant: {
            emailAddress: 'applicantToBeCleaned@example.com',
          },
          householdMember: [
            {
              firstName: 'firstNameMember',
              lastName: 'lastNameMember',
              birthDay: 2,
              birthMonth: 2,
              birthYear: 2002,
              householdMemberAddress: {
                create: addressFactory(),
              },
            },
          ],
        }),
      });
      // Application that already had PII cleared
      await prisma.applications.create({
        data: await applicationFactory({
          listingId: listing.id,
          isNewest: false,
          wasPIICleared: true,
          expireAfter: dayjs(new Date()).subtract(2, 'days').toDate(),
        }),
      });

      await request(app.getHttpServer())
        .put(`/applications/removePIICronJob`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminCookies)
        .expect(200);

      expect(logger.warn).toBeCalledWith(
        expect.stringContaining('removing PII information for '),
      );
      expect(logger.warn).toBeCalledWith(
        expect.stringContaining('completed PII information removal for '),
      );

      const applicant1 = await prisma.applicant.findFirst({
        where: { id: applicationToBeCleaned.applicantId },
      });
      expect(applicant1).toEqual({
        id: applicationToBeCleaned.applicantId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        firstName: null,
        middleName: null,
        lastName: null,
        birthMonth: null,
        birthDay: null,
        birthYear: null,
        emailAddress: 'applicantToBeCleaned@example.com',
        noEmail: false,
        phoneNumber: null,
        phoneNumberType: 'home',
        noPhone: false,
        workInRegion: 'no',
        fullTimeStudent: null,
        workAddressId: expect.anything(),
        addressId: expect.anything(),
      });
      const applicant1WorkAddress = await prisma.address.findFirst({
        where: { id: applicant1.workAddressId },
      });
      expect(applicant1WorkAddress).toEqual({
        id: applicant1.workAddressId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        latitude: null,
        longitude: null,
        placeName: expect.anything(),
        street: null,
        street2: null,
        city: expect.anything(),
        county: expect.anything(),
        state: expect.anything(),
        zipCode: expect.anything(),
      });
      const applicant1AlternateContact =
        await prisma.alternateContact.findFirst({
          where: { id: applicationToBeCleaned.alternateContactId },
        });
      expect(applicant1AlternateContact.emailAddress).toBeNull();
      expect(applicant1AlternateContact.firstName).toBeNull();
      expect(applicant1AlternateContact.lastName).toBeNull();
      expect(applicant1AlternateContact.phoneNumber).toBeNull();

      const applicant1HouseholdMember = await prisma.householdMember.findFirst({
        where: { applicationId: applicationToBeCleaned.id },
      });
      expect(applicant1HouseholdMember).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        addressId: expect.anything(),
        applicationId: applicationToBeCleaned.id,
        birthDay: null,
        birthMonth: null,
        birthYear: null,
        firstName: null,
        fullTimeStudent: null,
        lastName: null,
        middleName: null,
        orderId: null,
        relationship: null,
        sameAddress: null,
        workAddressId: null,
        workInRegion: null,
      });

      const application1 = await prisma.applications.findFirst({
        where: { id: applicationToBeCleaned.id },
      });
      expect(application1.wasPIICleared).toBe(true);
      expect(application1.additionalPhoneNumber).toBeNull();

      // Verify that the other applications didn't have their data cleared
      const application2 = await prisma.applications.findFirst({
        select: { wasPIICleared: true },
        where: { id: newestApplication.id },
      });
      expect(application2.wasPIICleared).toBe(false);
      const application3 = await prisma.applications.findFirst({
        select: { wasPIICleared: true },
        where: { id: futureApplication.id },
      });
      expect(application3.wasPIICleared).toBe(false);
    });
  });
});
