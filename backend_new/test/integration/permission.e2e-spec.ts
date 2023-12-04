import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { stringify } from 'qs';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { AppModule } from '../../src//modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { amiChartFactory } from '../../prisma/seed-helpers/ami-chart-factory';
import { AmiChartQueryParams } from '../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { AmiChartCreate } from '../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../../src/dtos/ami-charts/ami-chart-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { translationFactory } from '../../prisma/seed-helpers/translation-factory';
import { ApplicationQueryParams } from 'src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../src/enums/applications/order-by-enum';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import { addressFactory } from '../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../src/dtos/addresses/address-create.dto';
import { ApplicationCreate } from '../../src/dtos/applications/application-create.dto';
import { InputType } from '../../src/enums/shared/input-type-enum';
import { ApplicationUpdate } from '../../src/dtos/applications/application-update.dto';
import { JurisdictionCreate } from '../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { reservedCommunityTypeFactory } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ReservedCommunityTypeCreate } from '../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../../src/dtos/reserved-community-types/reserved-community-type-update.dto';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeCreate } from '../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { unitAccessibilityPriorityTypeFactorySingle } from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeCreate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { UnitTypeCreate } from '../../src/dtos/unit-types/unit-type-create.dto';
import { UnitTypeUpdate } from '../../src/dtos/unit-types/unit-type-update.dto';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { MultiselectQuestionCreate } from '../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { UserUpdate } from '../../src/dtos/users/user-update.dto';
import { EmailAndAppUrl } from '../../src/dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../../src/dtos/users/confirmation-request.dto';
import { UserService } from '../../src/services/user.service';
import { UserCreate } from '../../src/dtos/users/user-create.dto';
import { UserInvite } from '../../src/dtos/users/user-invite.dto';
import { EmailService } from '../../src/services/email.service';
import { ListingOrderByKeys } from '../../src/enums/listings/order-by-enum';
import { ListingsQueryParams } from '../../src/dtos/listings/listings-query-params.dto';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { ListingPublishedCreate } from '../../src/dtos/listings/listing-published-create.dto';
import { ListingPublishedUpdate } from '../../src/dtos/listings/listing-published-update.dto';
import { permissionActions } from '../../src/enums/permissions/permission-actions-enum';

const testEmailService = {
  confirmation: jest.fn(),
  welcome: jest.fn(),
  invitePartnerUser: jest.fn(),
  changeEmail: jest.fn(),
  forgotPassword: jest.fn(),
  sendMfaCode: jest.fn(),
  sendCSV: jest.fn(),
  applicationConfirmation: jest.fn(),
};

describe('Testing Permissioning of endpoints as Admin User', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
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
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 1`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisdictionAId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 2`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.delete,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 3`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner create endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 4`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 5`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(200);
      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.update,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 6`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 7`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisdictionA.id}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 8`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new permission jurisdiction 1',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 9`),
      });

      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisdictionA.id,
        name: 'permission juris 9:2',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionA.id}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 10`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 11`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.fiveBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    let jurisdictionId = '';
    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 12`),
      });
      jurisdictionId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'multiselectQuestion',
          action: permissionActions.delete,
          recordId: multiselectQuestionA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('Testing user endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'user',
          action: permissionActions.update,
          recordId: userA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'user',
          action: permissionActions.delete,
          recordId: userA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 13`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+13@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner create endpoint & create an activity log entry', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 14`),
      });

      const res = await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser+14@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'user',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing listing endpoints', () => {
    let jurisdictionAId = '';
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 15`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 16`),
      });
      jurisdictionAId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
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
      await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 17`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.delete,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 18`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisdictionA.id);

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.update,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for create endpoint & create an activity log entry', async () => {
      const val = await constructFullListingData();

      const res = await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });
});

describe('Testing Permissioning of endpoints as Jurisdictional Admin in the correct jurisdiction', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';
  let jurisId = '';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`permission juris 19`),
    });
    jurisId = jurisdiction.id;

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isJurisdictionalAdmin: true },
        jurisdictionId: jurisId,
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.delete,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner create endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.update,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisId}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.findFirst({
        where: {
          id: jurisId,
        },
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisId,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisId}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 20`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'multiselectQuestion',
          action: permissionActions.delete,
          recordId: multiselectQuestionA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('Testing user endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 21`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+jurisCorrect@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 22`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing listing endpoints', () => {
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 23`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
      const multiselectQuestion1 = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId, {
          multiselectQuestion: {
            text: 'example a',
          },
        }),
      });
      const listingA = await listingFactory(jurisId, prisma, {
        multiselectQuestions: [multiselectQuestion1],
      });
      const listingACreated = await prisma.listings.create({
        data: listingA,
        include: {
          listingMultiselectQuestions: true,
        },
      });
      await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const listingData = await listingFactory(jurisId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.delete,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const listingData = await listingFactory(jurisId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisId);

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.update,
          recordId: listing.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for create endpoint & create an activity log entry', async () => {
      const val = await constructFullListingData(undefined, jurisId);

      const res = await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });
});

describe('Testing Permissioning of endpoints as Jurisdictional Admin in the wrong jurisdiction', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';
  let userJurisId = '';
  let jurisId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`permission juris 24`),
    });
    userJurisId = jurisdiction.id;

    const jurisdiction2 = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`permission juris 25`),
    });
    jurisId = jurisdiction2.id;

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isJurisdictionalAdmin: true },
        jurisdictionId: userJurisId,
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisId}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.findFirst({
        where: {
          id: jurisId,
        },
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisId,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisId}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 26`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should succed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'multiselectQuestion',
          action: permissionActions.delete,
          recordId: multiselectQuestionA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('Testing user endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 27`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+jurisBad@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 28`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing listing endpoints', () => {
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 29`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
      const multiselectQuestion1 = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId, {
          multiselectQuestion: {
            text: 'example a',
          },
        }),
      });
      const listingA = await listingFactory(jurisId, prisma, {
        multiselectQuestions: [multiselectQuestion1],
      });
      const listingACreated = await prisma.listings.create({
        data: listingA,
        include: {
          listingMultiselectQuestions: true,
        },
      });
      await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const listingData = await listingFactory(jurisId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const listingData = await listingFactory(jurisId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisId);

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData(undefined, jurisId);

      await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});

describe('Testing Permissioning of endpoints as partner with correct listing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';
  let jurisId = '';
  let userListingId = '';
  let userListingToBeDeleted = '';
  let listingMulitselectQuestion = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`permission juris 30`),
    });
    jurisId = jurisdiction.id;

    const msq = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisId, {
        multiselectQuestion: {
          text: 'example a',
        },
      }),
    });

    listingMulitselectQuestion = msq.id;

    const listingData = await listingFactory(jurisId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing = await prisma.listings.create({
      data: listingData,
    });
    userListingId = listing.id;

    const listingData2 = await listingFactory(jurisId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing2 = await prisma.listings.create({
      data: listingData2,
    });
    userListingToBeDeleted = listing2.id;

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isPartner: true },
        listings: [userListingId, userListingToBeDeleted],
        jurisdictionId: jurisId,
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: userListingId,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.delete,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: userListingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner create endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: userListingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.create,
          recordId: res.body.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: userListingId,
        }),
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
          type: 'example type',
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
          id: userListingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'application',
          action: permissionActions.update,
          recordId: applicationA.id,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: userListingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisId}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.findFirst({
        where: {
          id: jurisId,
        },
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisId,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisId}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 31`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing user endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 32`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+partnerCorrect@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 33`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing listing endpoints', () => {
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 34`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/byMultiselectQuestion/${listingMulitselectQuestion}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: userListingToBeDeleted,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for update endpoint & create an activity log entry', async () => {
      const val = await constructFullListingData(userListingId, jurisId);

      await request(app.getHttpServer())
        .put(`/listings/${userListingId}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(200);

      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: permissionActions.update,
          recordId: userListingId,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData(undefined, jurisId);

      await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});

describe('Testing Permissioning of endpoints as partner with wrong listing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';
  let jurisId = '';
  let listingId = '';
  let listingIdToBeDeleted = '';
  let listingMulitselectQuestion = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(`permission juris 35`),
    });
    jurisId = jurisdiction.id;

    const msq = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisId, {
        multiselectQuestion: {
          text: 'example a',
        },
      }),
    });

    listingMulitselectQuestion = msq.id;

    const listingData = await listingFactory(jurisId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing = await prisma.listings.create({
      data: listingData,
    });
    listingId = listing.id;

    const listingData2 = await listingFactory(jurisId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing2 = await prisma.listings.create({
      data: listingData2,
    });
    listingIdToBeDeleted = listing2.id;

    const listingData3 = await listingFactory(jurisId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing3 = await prisma.listings.create({
      data: listingData3,
    });

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isPartner: true },
        listings: [listing3.id],
        jurisdictionId: jurisId,
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listingId,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: listingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: listingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listingId,
        }),
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
          type: 'example type',
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
          id: listingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          id: listingId,
        },
        demographics: {
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisId}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.findFirst({
        where: {
          id: jurisId,
        },
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisId,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisId}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 36`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing user endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 37`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+listingBad@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 38`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing listing endpoints', () => {
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 39`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/byMultiselectQuestion/${listingMulitselectQuestion}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listingIdToBeDeleted,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const val = await constructFullListingData(listingId, jurisId);

      await request(app.getHttpServer())
        .put(`/listings/${listingId}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData(undefined, jurisId);

      await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});

describe('Testing Permissioning of endpoints as public user', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 40`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should succeed for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisdictionAId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 41`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 42`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 43`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 44`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 45`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should error as forbidden for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 46`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisdictionA.id}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 47`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 48`),
      });

      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisdictionA.id,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionA.id}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 49`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 50`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    let jurisdictionId = '';
    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 51`),
      });
      jurisdictionId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing user endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 52`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+public@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 53`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing listing endpoints', () => {
    let jurisdictionAId = '';
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 54`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 55`),
      });
      jurisdictionAId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
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
      await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 56`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 57`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisdictionA.id);

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData();

      await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});

describe('Testing Permissioning of endpoints as logged out user', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  const cookies = '';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Testing ami-chart endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 58`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should error as unauthorized for list endpoint', async () => {
      await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisdictionAId,
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/amiCharts?${query}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .send({
          name: 'name: 10',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as AmiChartCreate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .send({
          id: amiChartA.id,
          name: 'updated name',
          items: [
            {
              percentOfAmi: 80,
              householdSize: 2,
              income: 5000,
            },
          ],
        } as AmiChartUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionAId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .send({
          id: amiChartA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing app endpoints', () => {
    it('should succeed for heartbeat endpoint', async () => {
      request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('Testing application endpoints', () => {
    beforeAll(async () => {
      await unitTypeFactoryAll(prisma);
      await await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ApplicationQueryParams = {
        limit: 2,
        page: 1,
        order: OrderByEnum.ASC,
        orderBy: ApplicationOrderByKeys.createdAt,
        listingId: randomUUID(),
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer())
        .get(`/applications?${query}`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: applicationFactory({ unitTypeId: unitTypeA.id }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 59`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .send({
          id: applicationA.id,
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 60`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 61`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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
      await request(app.getHttpServer())
        .post(`/applications/`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 62`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .send(dto)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for verify endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 63`),
      });
      const listing1 = await listingFactory(jurisdiction.id, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const submissionDate = new Date();
      const exampleAddress = addressFactory() as AddressCreate;
      const dto: ApplicationCreate = {
        contactPreferences: ['example contact preference'],
        preferences: [
          {
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
          type: 'example type',
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
          ethnicity: 'example ethnicity',
          gender: 'example gender',
          sexualOrientation: 'example sexual orientation',
          howDidYouHear: ['example how did you hear'],
          race: ['example race'],
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
            relationship: 'example relationship',
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
        incomeVouchers: false,
        income: '36000',
        incomePeriod: IncomePeriodEnum.perYear,
        language: LanguagesEnum.en,
        acceptedTerms: true,
        submissionDate: submissionDate,
        reviewStatus: ApplicationReviewStatusEnum.valid,
        programs: [
          {
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

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .send(dto)
        .expect(201);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should error as unauthorized for presigned endpoint', async () => {
      const publicId = randomUUID();
      const eager = 'eager';

      await request(app.getHttpServer())
        .post('/assets/presigned-upload-metadata/')
        .send({ parametersToSign: { publicId, eager } })
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer()).get(`/jurisdictions?`).expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 64`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisdictionA.id}`)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 65`),
      });

      await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${jurisdictionA.name}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const createBody: JurisdictionCreate = {
        name: 'new jurisdiction',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .send(createBody)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 66`),
      });

      const updateJurisdiction: JurisdictionUpdate = {
        id: jurisdictionA.id,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 10`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
        listingApprovalPermissions: [],
      };

      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionA.id}`)
        .send(updateJurisdiction)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 67`),
      });

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .send({
          id: jurisdictionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    let jurisdictionAId = '';
    beforeAll(async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 68`),
      });
      jurisdictionAId = jurisdictionA.id;
    });

    it('should error as unauthorized for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .send({
          name: 'name: 10',
          description: 'description: 10',
          jurisdictions: {
            id: jurisdictionAId,
          },
        } as ReservedCommunityTypeCreate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .send({
          id: reservedCommunityTypeA.id,
          name: 'name: 11',
          description: 'description: 11',
        } as ReservedCommunityTypeUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for delete endpoint', async () => {
      const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create(
        {
          data: reservedCommunityTypeFactory(jurisdictionAId),
        },
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .send({
          id: reservedCommunityTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing unit rent types endpoints', () => {
    it('should error as unauthorized for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitRentTypes?`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .send({
          name: name,
        } as UnitRentTypeCreate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .put(`/unitRentTypes/${unitRentTypeA.id}`)
        .send({
          id: unitRentTypeA.id,
          name: name,
        } as UnitRentTypeUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for delete endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/unitRentTypes`)
        .send({
          id: unitRentTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing unit accessibility priority types endpoints', () => {
    it('should error as unauthorized for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes?`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for create endpoint', async () => {
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .send({
          name: name,
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });
      const name = unitAccessibilityPriorityTypeFactorySingle().name;
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for delete endpoint', async () => {
      const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
        data: unitAccessibilityPriorityTypeFactorySingle(),
      });

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing unit types endpoints', () => {
    it('should error as unauthorized for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/unitTypes?`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .get(`/unitTypes/${unitTypeA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .send({
          name: name,
          numBedrooms: 10,
        } as UnitTypeCreate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const name = UnitTypeEnum.SRO;
      await request(app.getHttpServer())
        .put(`/unitTypes/${unitTypeA.id}`)
        .send({
          id: unitTypeA.id,
          name: name,
          numBedrooms: 11,
        } as UnitTypeUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for delete endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      await request(app.getHttpServer())
        .delete(`/unitTypes`)
        .send({
          id: unitTypeA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Testing multiselect questions endpoints', () => {
    let jurisdictionId = '';
    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 69`),
      });
      jurisdictionId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/multiselectQuestions?`)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .send({
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .send({
          id: multiselectQuestionA.id,
          text: 'example text',
          subText: 'example subText',
          description: 'example description',
          links: [
            {
              title: 'title 1',
              url: 'title 1',
            },
            {
              title: 'title 2',
              url: 'title 2',
            },
          ],
          jurisdictions: [{ id: jurisdictionId }],
          options: [
            {
              text: 'example option text 1',
              ordinal: 1,
              description: 'example option description 1',
              links: [
                {
                  title: 'title 3',
                  url: 'title 3',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
            {
              text: 'example option text 2',
              ordinal: 2,
              description: 'example option description 2',
              links: [
                {
                  title: 'title 4',
                  url: 'title 4',
                },
              ],
              collectAddress: true,
              exclusive: false,
            },
          ],
          optOutText: 'example optOutText',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
        } as MultiselectQuestionUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing user endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as unauthorized for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as unauthorized for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for public resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for partner resend confirmation endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for verify token endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = await userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for resetToken endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 70`),
      });

      const data = applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .send({
          firstName: 'Public User firstName',
          lastName: 'Public User lastName',
          password: 'example password 1',
          email: 'publicUser+loggedOut@email.com',
          jurisdictions: [{ id: juris.id }],
        } as UserCreate)
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as unauthorized for partner create endpoint', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 71`),
      });

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'example password 1',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as UserInvite)
        .set('Cookie', cookies)
        .expect(401);
    });

    it('should error as forbidden for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing listing endpoints', () => {
    let jurisdictionAId = '';
    const constructFullListingData = async (
      listingId?: string,
      jurisdictionId?: string,
    ): Promise<ListingPublishedCreate | ListingPublishedUpdate> => {
      let jurisdictionA: IdDTO = { id: '' };

      if (jurisdictionId) {
        jurisdictionA.id = jurisdictionId;
      } else {
        jurisdictionA = await prisma.jurisdictions.create({
          data: jurisdictionFactory(`permission juris 72`),
        });
      }

      await unitTypeFactoryAll(prisma);
      const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
      const amiChart = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionA.id),
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
    };

    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 73`),
      });
      jurisdictionAId = jurisdiction.id;
    });

    it('should succeed for list endpoint', async () => {
      const queryParams: ListingsQueryParams = {
        limit: 1,
        page: 1,
        view: ListingViews.base,
        orderBy: [ListingOrderByKeys.name],
        orderDir: [OrderByEnum.ASC],
      };
      const query = stringify(queryParams as any);

      await request(app.getHttpServer()).get(`/listings?${query}`).expect(200);
    });

    it('should succeed for retrieveListings endpoint', async () => {
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
      await request(app.getHttpServer())
        .get(
          `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
        )
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 74`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .send({
          id: listing.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.create({
        data: jurisdictionFactory(`permission juris 75`),
      });
      const listingData = await listingFactory(jurisdictionA.id, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(listing.id, jurisdictionA.id);

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData();

      await request(app.getHttpServer())
        .post('/listings')
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});
