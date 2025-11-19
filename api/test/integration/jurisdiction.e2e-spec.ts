import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, NeighborhoodAmenitiesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { JurisdictionCreate } from '../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('Jurisdiction Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
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

  it('testing list endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions?`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const jurisdictions = res.body.map((value) => value.name);
    expect(jurisdictions).toContain(jurisdictionA.name);
    expect(jurisdictions).toContain(jurisdictionB.name);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdiction ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/${jurisdictionA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it("retrieve endpoint with name that doesn't exist should error", async () => {
    const name = 'a nonexistant name';
    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${name}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdiction ${name} was requested but not found`,
    );
  });

  it('testing retrieveByName endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${jurisdictionA.name}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it('testing create endpoint', async () => {
    const createBody: JurisdictionCreate = {
      name: 'new jurisdiction',
      notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 10`,
      publicUrl: `publicUrl: 10`,
      emailFromAddress: `emailFromAddress: 10`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
    };
    const res = await request(app.getHttpServer())
      .post('/jurisdictions')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(createBody)
      .set('Cookie', cookies)
      .expect(201);

    expect(res.body.name).toEqual('new jurisdiction');
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const updateBody: JurisdictionUpdate = {
      id: id,
      name: 'updated name: 10',
      notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 10`,
      publicUrl: `updated publicUrl: 11`,
      emailFromAddress: `emailFromAddress: 10`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
    };
    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(updateBody)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdictionId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
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
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
    };

    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${jurisdictionA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(updateJurisdiction)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual('updated name: 10');
    expect(res.body.publicUrl).toEqual('updated publicUrl: 10');
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/jurisdictions`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdictionId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .delete(`/jurisdictions`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: jurisdictionA.id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
