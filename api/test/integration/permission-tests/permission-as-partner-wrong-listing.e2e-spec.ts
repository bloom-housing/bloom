import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { stringify } from 'qs';
import {
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  MultiselectQuestionsStatusEnum,
  RuleEnum,
  UnitTypeEnum,
} from '@prisma/client';
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
import { UnitTypeCreate } from '../../../src/dtos/unit-types/unit-type-create.dto';
import { UnitTypeUpdate } from '../../../src/dtos/unit-types/unit-type-update.dto';
import { multiselectQuestionFactory } from '../../../prisma/seed-helpers/multiselect-question-factory';
import { UserUpdate } from '../../../src/dtos/users/user-update.dto';
import { EmailAndAppUrl } from '../../../src/dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../../../src/dtos/users/confirmation-request.dto';
import { UserService } from '../../../src/services/user.service';
import { EmailService } from '../../../src/services/email.service';
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
} from './helpers';

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

describe('Testing Permissioning of endpoints as partner with wrong listing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let cookies = '';
  let jurisdictionId = '';
  let listingId = '';
  let listingIdToBeDeleted = '';
  let listingMultiselectQuestion = '';
  let listingClosed = '';

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

    jurisdictionId = await generateJurisdiction(
      prisma,
      'wrong partner permission juris',
    );
    await reservedCommunityTypeFactoryAll(jurisdictionId, prisma);

    const msq = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionId, {
        multiselectQuestion: {
          text: 'example a',
        },
      }),
    });

    listingMultiselectQuestion = msq.id;

    const listingData = await listingFactory(jurisdictionId, prisma, {
      multiselectQuestions: [msq],
      digitalApp: true,
    });
    const listing = await prisma.listings.create({
      data: listingData,
    });
    listingId = listing.id;

    const listingData2 = await listingFactory(jurisdictionId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing2 = await prisma.listings.create({
      data: listingData2,
    });
    listingIdToBeDeleted = listing2.id;

    const listingData3 = await listingFactory(jurisdictionId, prisma, {
      multiselectQuestions: [msq],
    });
    const listing3 = await prisma.listings.create({
      data: listingData3,
    });

    const closedListingData = await listingFactory(jurisdictionId, prisma, {
      multiselectQuestions: [msq],
      status: ListingsStatusEnum.closed,
    });
    const closedListing = await prisma.listings.create({
      data: closedListingData,
    });
    listingClosed = closedListing.id;

    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isPartner: true },
        listings: [listing3.id],
        jurisdictionIds: [jurisdictionId],
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
        data: amiChartFactory(10, jurisdictionId),
      });
      const queryParams: AmiChartQueryParams = {
        jurisdictionId: jurisdictionId,
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
        data: amiChartFactory(10, jurisdictionId),
      });

      await request(app.getHttpServer())
        .get(`/amiCharts/${amiChartA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/amiCharts')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildAmiChartCreateMock(jurisdictionId))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionId),
      });

      await request(app.getHttpServer())
        .put(`/amiCharts/${amiChartA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildAmiChartUpdateMock(amiChartA.id))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const amiChartA = await prisma.amiChart.create({
        data: amiChartFactory(10, jurisdictionId),
      });

      await request(app.getHttpServer())
        .delete(`/amiCharts`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
      await prisma.translations.create({
        data: translationFactory(),
      });
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/applications?listingId=${listingId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      const unitTypeA = await unitTypeFactorySingle(
        prisma,
        UnitTypeEnum.oneBdrm,
      );

      const applicationA = await prisma.applications.create({
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listingId,
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
      const applicationA = await prisma.applications.create({
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listingId,
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

      const exampleAddress = addressFactory() as AddressCreate;
      await request(app.getHttpServer())
        .post(`/applications/submit`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listingId,
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

      const exampleAddress = addressFactory() as AddressCreate;
      await request(app.getHttpServer())
        .post(`/applications/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listingId,
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

      const applicationA = await prisma.applications.create({
        data: await applicationFactory({
          unitTypeId: unitTypeA.id,
          listingId: listingId,
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
            listingId,
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

      const exampleAddress = addressFactory() as AddressCreate;

      await request(app.getHttpServer())
        .post(`/applications/verify`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildApplicationCreateMock(
            exampleAddress,
            listingId,
            unitTypeA.id,
            new Date(),
          ),
        )
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for csv endpoint', async () => {
      const jurisdiction = await generateJurisdiction(
        prisma,
        'permission juris csv endpoint wrong listing',
      );
      await reservedCommunityTypeFactoryAll(jurisdiction, prisma);
      const application = await applicationFactory();
      const listing1 = await listingFactory(jurisdiction, prisma, {
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
        .post('/assets/presigned-upload-metadata/')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildPresignedEndpointMock())
        .set('Cookie', cookies)
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
        .get(`/jurisdictions/${jurisdictionId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve by name endpoint', async () => {
      const jurisdictionA = await prisma.jurisdictions.findFirst({
        where: {
          id: jurisdictionId,
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
        .send(buildJurisdictionCreateMock('new permission jurisdiction 5'))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictions/${jurisdictionId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildJurisdictionUpdateMock(jurisdictionId, 'permission juris 9:6'),
        )
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const jurisdictionDeleteId = await generateJurisdiction(
        prisma,
        'wrong partner permission juris delete',
      );

      await request(app.getHttpServer())
        .delete(`/jurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: jurisdictionDeleteId,
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
        jurisdictionId,
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
        .send(buildReservedCommunityTypeCreateMock(jurisdictionId))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
        prisma,
        jurisdictionId,
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
        jurisdictionId,
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
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post('/multiselectQuestions')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildMultiselectQuestionCreateMock(jurisdictionId))
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .put('/multiselectQuestions')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(
          buildMultiselectQuestionUpdateMock(
            jurisdictionId,
            multiselectQuestionA.id,
          ),
        )
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(jurisdictionId),
      });

      await request(app.getHttpServer())
        .delete(`/multiselectQuestions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for reActivate endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(
          jurisdictionId,
          {
            multiselectQuestion: {
              status: MultiselectQuestionsStatusEnum.toRetire,
            },
          },
          true,
        ),
      });

      await request(app.getHttpServer())
        .put('/multiselectQuestions/reActivate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retire endpoint', async () => {
      const multiselectQuestionA = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(
          jurisdictionId,
          {
            multiselectQuestion: {
              status: MultiselectQuestionsStatusEnum.active,
            },
          },
          true,
        ),
      });

      await request(app.getHttpServer())
        .put('/multiselectQuestions/retire')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: multiselectQuestionA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retireMultiselectQuestions endpoint', async () => {
      await request(app.getHttpServer())
        .put('/multiselectQuestions/retireMultiselectQuestions')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
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
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      await request(app.getHttpServer())
        .put(`/user/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
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
      const juris = await generateJurisdiction(
        prisma,
        'wrong partner permission juris create success',
      );

      const data = await applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      await prisma.applications.create({
        data,
      });

      await request(app.getHttpServer())
        .post(`/user/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildUserCreateMock(juris, 'publicUser+partnerWrong@email.com'))
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for partner create endpoint', async () => {
      const juris = await generateJurisdiction(
        prisma,
        'wrong partner permission juris create error',
      );

      await request(app.getHttpServer())
        .post(`/user/invite`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(buildUserInviteMock(juris, 'partnerUser+partnerWrong@email.com'))
        .set('Cookie', cookies)
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

    it('should succeed for filterableList endpoint', async () => {
      await request(app.getHttpServer())
        .post(`/listings/list`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should succeed for retrieveListings endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/byMultiselectQuestion/${listingMultiselectQuestion}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for external listing endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/external/${listingId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for delete endpoint', async () => {
      await request(app.getHttpServer())
        .delete(`/listings/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listingIdToBeDeleted,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      const val = await constructFullListingData(
        prisma,
        listingId,
        jurisdictionId,
      );

      await request(app.getHttpServer())
        .put(`/listings/${listingId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      const val = await constructFullListingData(
        prisma,
        undefined,
        jurisdictionId,
      );

      await request(app.getHttpServer())
        .post('/listings')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(val)
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for duplicate endpoint', async () => {
      const listingData = await listingFactory(jurisdictionId, prisma);
      const listing = await prisma.listings.create({
        data: listingData,
      });

      await request(app.getHttpServer())
        .post('/listings/duplicate')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          includeUnits: true,
          name: 'name',
          storedListing: {
            id: listing.id,
          },
        })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for process endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/listings/closeListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for csv endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/csv`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for mapMarkers endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/listings/mapMarkers`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });
  });

  describe('Testing application flagged set endpoints', () => {
    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/applicationFlaggedSets?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for meta endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/applicationFlaggedSets/meta?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const resolvedAFS = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listingId}`,
          showConfirmationAlert: false,
          status: FlaggedSetStatusEnum.resolved,
          listings: {
            connect: {
              id: listingId,
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
        .expect(200);
    });

    it('should succeed for resolve endpoint', async () => {
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const afs = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listingId} resolve`,
          showConfirmationAlert: false,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: listingClosed,
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
        .expect(201);
    });

    it('should succeed for reset confirmation endpoint', async () => {
      const applicationA = await createSimpleApplication(prisma);
      const applicationB = await createSimpleApplication(prisma);

      const afs = await prisma.applicationFlaggedSet.create({
        data: {
          rule: RuleEnum.email,
          ruleKey: `example rule key ${listingId} reset`,
          showConfirmationAlert: true,
          status: FlaggedSetStatusEnum.resolved,
          listings: {
            connect: {
              id: listingId,
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
        .expect(200);
    });
  });

  describe('Testing lottery endpoints', () => {
    it('should error as forbidden for expireLotteries endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/lottery/expireLotteries`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for lottery status endpoint', async () => {
      await request(app.getHttpServer())
        .put('/lottery/lotteryStatus')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: listingId,
          lotteryStatus: 'publishedToPublic',
        })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing feature flag endpoints', () => {
    it('should error as forbidden for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for create endpoint', async () => {
      await request(app.getHttpServer())
        .post(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({})
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({})
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      await request(app.getHttpServer())
        .delete(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({})
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for associate jurisdictions endpoint', async () => {
      await request(app.getHttpServer())
        .put(`/featureFlags/associateJurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({})
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for retrieve endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/featureFlags/example`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing property endpoints', () => {
    let propertyId: string;

    beforeAll(async () => {
      // Create a test property for use in the tests
      const propertyData = {
        name: 'Test Property',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await prisma.properties.create({
        data: {
          name: propertyData.name,
          jurisdictions: {
            connect: {
              id: propertyData.jurisdictions.id,
            },
          },
        },
      });

      if (res.id) {
        propertyId = res.id;
      }
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/properties?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      if (!propertyId) {
        throw new Error('Property ID not set up for test');
      }

      await request(app.getHttpServer())
        .get(`/properties/${propertyId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const propertyData = {
        name: 'New Test Property',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      await request(app.getHttpServer())
        .post('/properties')
        .send(propertyData)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should succeed for filterable list endpoint', async () => {
      await request(app.getHttpServer())
        .post(`/properties/list`)
        .send({})
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(201);
    });

    it('should error as forbidden for update endpoint', async () => {
      if (!propertyId) {
        throw new Error('Property ID not set up for test');
      }

      const propertyUpdateData = {
        id: propertyId,
        name: 'Updated Test Property',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      await request(app.getHttpServer())
        .put(`/properties`)
        .send(propertyUpdateData)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const propertyData = {
        name: 'Property to Delete',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await prisma.properties.create({
        data: {
          name: propertyData.name,
          jurisdictions: {
            connect: {
              id: propertyData.jurisdictions.id,
            },
          },
        },
      });

      const deleteId = res.id;

      await request(app.getHttpServer())
        .delete(`/properties`)
        .send({
          id: deleteId,
        } as IdDTO)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });

  describe('Testing agencies endpoints', () => {
    let agencyId: string;

    beforeAll(async () => {
      const agencyData = {
        name: 'Test Agency',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await prisma.agency.create({
        data: {
          name: agencyData.name,
          jurisdictions: {
            connect: {
              id: agencyData.jurisdictions.id,
            },
          },
        },
      });

      if (res.id) {
        agencyId = res.id;
      }
    });

    it('should succeed for list endpoint', async () => {
      await request(app.getHttpServer())
        .get(`/agency`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should succeed for retrieve endpoint', async () => {
      if (!agencyId) {
        throw new Error('Agency ID not set up for test');
      }

      await request(app.getHttpServer())
        .get(`/agency/${agencyId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });

    it('should error as forbidden for create endpoint', async () => {
      const agencyData = {
        name: 'New Test Agency',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      await request(app.getHttpServer())
        .post('/agency')
        .send(agencyData)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for update endpoint', async () => {
      if (!agencyId) {
        throw new Error('Agency ID not set up for test');
      }

      const agencyUpdateData = {
        id: agencyId,
        name: 'Updated Test Agency',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      await request(app.getHttpServer())
        .put(`/agency`)
        .send(agencyUpdateData)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });

    it('should error as forbidden for delete endpoint', async () => {
      const agencyData = {
        name: 'Agency to Delete',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await prisma.agency.create({
        data: {
          name: agencyData.name,
          jurisdictions: {
            connect: {
              id: agencyData.jurisdictions.id,
            },
          },
        },
      });
      const deleteId = res.id;

      await request(app.getHttpServer())
        .delete(`/agency`)
        .send({
          id: deleteId,
        } as IdDTO)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(403);
    });
  });
});
