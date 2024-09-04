import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { stringify } from 'qs';
import { FlaggedSetStatusEnum, RuleEnum, UnitTypeEnum } from '@prisma/client';
import { AppModule } from '../../../src/modules/app.module';
import { PrismaService } from '../../../src/services/prisma.service';
import { userFactory } from '../../../prisma/seed-helpers/user-factory';
import { Login } from '../../../src/dtos/auth/login.dto';
import { listingFactory } from '../../../prisma/seed-helpers/listing-factory';
import { amiChartFactory } from '../../../prisma/seed-helpers/ami-chart-factory';
import { AmiChartQueryParams } from '../../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { IdDTO } from '../../../src/dtos/shared/id.dto';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../../prisma/seed-helpers/unit-type-factory';
import { translationFactory } from '../../../prisma/seed-helpers/translation-factory';
import { applicationFactory } from '../../../prisma/seed-helpers/application-factory';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../../src/dtos/addresses/address-create.dto';
import {
  reservedCommunityTypeFactoryAll,
  reservedCommunityTypeFactoryGet,
} from '../../../prisma/seed-helpers/reserved-community-type-factory';
import { unitRentTypeFactory } from '../../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeCreate } from '../../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import {
  unitAccessibilityPriorityTypeFactoryAll,
  unitAccessibilityPriorityTypeFactorySingle,
} from '../../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeCreate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { UnitTypeCreate } from '../../../src/dtos/unit-types/unit-type-create.dto';
import { UnitTypeUpdate } from '../../../src/dtos/unit-types/unit-type-update.dto';
import { multiselectQuestionFactory } from '../../../prisma/seed-helpers/multiselect-question-factory';
import { UserUpdate } from '../../../src/dtos/users/user-update.dto';
import { EmailAndAppUrl } from '../../../src/dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../../../src/dtos/users/confirmation-request.dto';
import { UserService } from '../../../src/services/user.service';
import { EmailService } from '../../../src/services/email.service';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';
import { AfsResolve } from '../../../src/dtos/application-flagged-sets/afs-resolve.dto';
import {
  generateJurisdiction,
  buildAmiChartCreateMock,
  buildAmiChartUpdateMock,
  buildPresignedEndpointMock,
  buildJurisdictionCreateMock,
  buildJurisdictionUpdateMock,
  buildReservedCommunityTypeCreateMock,
  buildReservedCommunityTypeUpdateMock,
  buildMultiselectQuestionCreateMock,
  buildMultiselectQuestionUpdateMock,
  buildUserCreateMock,
  buildUserInviteMock,
  buildApplicationCreateMock,
  buildApplicationUpdateMock,
  constructFullListingData,
  createSimpleApplication,
  createSimpleListing,
} from './helpers';
import { ApplicationFlaggedSetService } from '../../../src/services/application-flagged-set.service';

const testEmailService = {
  confirmation: jest.fn(),
  welcome: jest.fn(),
  invitePartnerUser: jest.fn(),
  changeEmail: jest.fn(),
  forgotPassword: jest.fn(),
  sendMfaCode: jest.fn(),
  applicationConfirmation: jest.fn(),
};

describe('Testing Permissioning of endpoints as Limited Jurisdictional Admin in the correct jurisdiction', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let applicationFlaggedSetService: ApplicationFlaggedSetService;
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
    applicationFlaggedSetService =
      moduleFixture.get<ApplicationFlaggedSetService>(
        ApplicationFlaggedSetService,
      );
    app.use(cookieParser());
    await app.init();

    jurisId = await generateJurisdiction(prisma, 'permission juris 80');
    await reservedCommunityTypeFactoryAll(jurisId, prisma);
    await unitAccessibilityPriorityTypeFactoryAll(prisma);

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isLimitedJurisdictionalAdmin: true },
        jurisdictionIds: [jurisId],
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildAmiChartCreateMock(jurisId))
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildAmiChartUpdateMock(amiChartA.id))
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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

    it('should succeed for list endpoint for listing with no applications', async () => {
      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      await request(app.getHttpServer())
        .get(`/applications?listingId=${listing1Created.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const listing1 = await listingFactory(jurisId, prisma);
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const applicationA = await prisma.applications.create({
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .get(`/applications/${applicationA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
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
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });

      await request(app.getHttpServer())
        .delete(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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

      const listing1 = await listingFactory(jurisId, prisma, {
        digitalApp: true,
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });

      const exampleAddress = addressFactory() as AddressCreate;
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listing1Created.id,
            unitTypeA.id,
            new Date(),
          ),
        )
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

      const exampleAddress = addressFactory() as AddressCreate;
      const res = await request(app.getHttpServer())
        .post(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listing1Created.id,
            unitTypeA.id,
            new Date(),
          ),
        )
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
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listing1Created.id,
        }),
        include: {
          applicant: true,
        },
      });
      const exampleAddress = addressFactory() as AddressCreate;
      await request(app.getHttpServer())
        .put(`/applications/${applicationA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationUpdateMock(
            applicationA.id,
            exampleAddress,
            listing1Created.id,
            unitTypeA.id,
            new Date(),
          ),
        )
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

      const exampleAddress = addressFactory() as AddressCreate;

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listing1Created.id,
            unitTypeA.id,
            new Date(),
          ),
        )
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for csv endpoint', async () => {
      const application = await applicationFactory();
      const listing1 = await listingFactory(jurisId, prisma, {
        applications: [application],
      });
      const listing1Created = await prisma.listings.create({
        data: listing1,
      });
      await request(app.getHttpServer())
        .get(`/applications/csv?id=${listing1Created.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing asset endpoints', () => {
    it('should succeed for presigned endpoint', async () => {
      await request(app.getHttpServer())
        .post('/asset/presigned-upload-metadata/')
        .send(buildPresignedEndpointMock())
        .set('Cookie', cookies)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(201);
    });
  });

  describe('Testing jurisdiction endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/jurisdictions')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildJurisdictionCreateMock('new permission jurisdiction 2'))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildJurisdictionUpdateMock(jurisId, 'permission juris 9:3'))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionA = await generateJurisdiction(
        prisma,
        'permission juris 81',
      );

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: jurisdictionA,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing reserved community types endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
        prisma,
        jurisId,
      );

      await request(app.getHttpServer())
        .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/reservedCommunityTypes')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildReservedCommunityTypeCreateMock(jurisId))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
        prisma,
        jurisId,
      );

      await request(app.getHttpServer())
        .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildReservedCommunityTypeUpdateMock(reservedCommunityTypeA.id))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
        prisma,
        jurisId,
      );

      await request(app.getHttpServer())
        .delete(`/reservedCommunityTypes`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitRentTypeA = await prisma.unitRentTypes.create({
        data: unitRentTypeFactory(),
      });

      await request(app.getHttpServer())
        .get(`/unitRentTypes/${unitRentTypeA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = unitRentTypeFactory().name;
      await request(app.getHttpServer())
        .post('/unitRentTypes')
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(
        prisma,
      );

      await request(app.getHttpServer())
        .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/unitAccessibilityPriorityTypes')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          name: 'mobility And Hearing',
        } as UnitAccessibilityPriorityTypeCreate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(
        prisma,
      );
      await request(app.getHttpServer())
        .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: unitTypeA.id,
          name: 'mobility Hearing And Visual',
        } as UnitAccessibilityPriorityTypeUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(
        prisma,
      );

      await request(app.getHttpServer())
        .delete(`/unitAccessibilityPriorityTypes`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const name = UnitTypeEnum.twoBdrm;
      await request(app.getHttpServer())
        .post('/unitTypes')
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildMultiselectQuestionCreateMock(jurisId))
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildMultiselectQuestionUpdateMock(jurisId, multiselectQuestionA.id),
        )
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/user/list?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory({ jurisdictionIds: [jurisId] }),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory({ jurisdictionIds: [jurisId] }),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
          jurisdictions: [{ id: jurisId } as IdDTO],
        } as UserUpdate)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory({ jurisdictionIds: [jurisId] }),
      });

      await request(app.getHttpServer())
        .delete(`/user/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for public create endpoint', async () => {
      const juris = await generateJurisdiction(prisma, 'permission juris 82');

      const data = await applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildUserCreateMock(juris, 'publicUser2+jurisCorrect@email.com'))
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      await request(app.getHttpServer())
        .post(`/user/invite`)
        .send(
          // builds an invite for an admin
          buildUserInviteMock(jurisId, 'partnerUser+jurisCorrect@email.com'),
        )
        .set('Cookie', cookies)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(403);
    });

    it('should error as forbidden for csv export endpoint', async () => {
      await request(app.getHttpServer())
        .get('/user/csv')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing listing endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for external listing endpoint', async () => {
      const listingA = await listingFactory(jurisId, prisma);
      const listingACreated = await prisma.listings.create({
        data: listingA,
        include: {
          listingMultiselectQuestions: true,
        },
      });
      await request(app.getHttpServer())
        .get(`/listings/external/${listingACreated.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for delete endpoint & create an activity log entry', async () => {
      const listingData = await listingFactory(jurisId, prisma, {
        noImage: true,
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .delete(`/listings/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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

    it('should succeed for update endpoint & create an activity log entry when user is not updating dates', async () => {
      const listingData = await listingFactory(jurisId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      const val = await constructFullListingData(prisma, listing.id, jurisId);
      val.reviewOrderType = listing.reviewOrderType;
      val.applicationDueDate = listing.applicationDueDate;

      await request(app.getHttpServer())
        .put(`/listings/${listing.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
      const val = await constructFullListingData(prisma, undefined, jurisId);

      const res = await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
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

    it('should error as forbidden for closeListings endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/listings/closeListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for expireLotteries endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/lottery/expireLotteries`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for lottery status endpoint', async () => {
      const listingData = await listingFactory(jurisId, prisma, {
        status: 'closed',
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listing.id,
          lotteryStatus: 'ran',
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for csv endpoint & create an activity log entry', async () => {
      await request(app.getHttpServer())
        .get(`/listings/csv`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
      const activityLogResult = await prisma.activityLog.findFirst({
        where: {
          module: 'listing',
          action: 'export',
          recordId: null,
        },
      });

      expect(activityLogResult).not.toBeNull();
    });
  });

  describe('Testing application flagged set endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/applicationFlaggedSets?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for meta endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/applicationFlaggedSets/meta?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const listing = await createSimpleListing(prisma, jurisId);
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const resolvedAFS = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listing}`,
          showConfirmationAlert: false,
          status: FlaggedSetStatusEnum.resolved,
          listings: {
            connect: {
              id: listing,
            },
          },
          applications: {
            connect: [{ id: applicationA }, { id: applicationB }],
          },
        },
      });

      await request(app.getHttpServer())
        .get(`/applicationFlaggedSets/${resolvedAFS.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for resolve endpoint', async () => {
      const listing = await createSimpleListing(prisma, jurisId);
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const afs = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listing}`,
          showConfirmationAlert: false,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: listing,
            },
          },
          applications: {
            connect: [{ id: applicationA }, { id: applicationB }],
          },
        },
      });

      await request(app.getHttpServer())
        .post(`/applicationFlaggedSets/resolve`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          afsId: afs.id,
          status: FlaggedSetStatusEnum.resolved,
          applications: [
            {
              id: applicationA,
            },
          ],
        } as AfsResolve)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for reset confirmation endpoint', async () => {
      const listing = await createSimpleListing(prisma, jurisId);
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const afs = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listing}`,
          showConfirmationAlert: true,
          status: FlaggedSetStatusEnum.resolved,
          listings: {
            connect: {
              id: listing,
            },
          },
          applications: {
            connect: [{ id: applicationA }, { id: applicationB }],
          },
        },
      });

      await request(app.getHttpServer())
        .put(`/applicationFlaggedSets/${afs.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: afs.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for process endpoint', async () => {
      /*
        Because so many different iterations of the process endpoint were firing we were running into collisions. 
        Since this is just testing the permissioning aspect I'm switching to mocking the process function
      */
      applicationFlaggedSetService.process = jest.fn();
      await request(app.getHttpServer())
        .put(`/applicationFlaggedSets/process`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});