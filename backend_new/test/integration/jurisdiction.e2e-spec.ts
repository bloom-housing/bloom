import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { JurisdictionCreate } from '../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('Jurisdiction Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
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
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it("retrieve endpoint with name that doesn't exist should error", async () => {
    const name = 'a nonexistant name';
    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${name}`)
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
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/jurisdictions')
      .send({
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
      } as JurisdictionCreate)
      .expect(201);

    expect(res.body.name).toEqual('new jurisdiction');
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${id}`)
      .send({
        id: id,
        name: 'updated name: 10',
        notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 10`,
        publicUrl: `updated publicUrl: 11`,
        emailFromAddress: `emailFromAddress: 10`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      } as JurisdictionUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdictionId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${jurisdictionA.id}`)
      .send({
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
      } as JurisdictionUpdate)
      .expect(200);

    expect(res.body.name).toEqual('updated name: 10');
    expect(res.body.publicUrl).toEqual('updated publicUrl: 10');
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/jurisdictions`)
      .send({
        id: id,
      } as IdDTO)
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
      .send({
        id: jurisdictionA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
