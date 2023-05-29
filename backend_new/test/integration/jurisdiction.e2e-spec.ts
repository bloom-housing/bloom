import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { JurisdictionCreate } from '../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { LanguagesEnum } from '@prisma/client';

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
    await app.close();
  });

  const cleanUpDb = async (jurisdictionIds: string[]) => {
    for (let i = 0; i < jurisdictionIds.length; i++) {
      await prisma.jurisdictions.delete({
        where: {
          id: jurisdictionIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(7),
    });
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(8),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions?`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort((a, b) => (a.name < b.name ? -1 : 1));
    expect(sortedResults[0].name).toEqual(jurisdictionA.name);
    expect(sortedResults[1].name).toEqual(jurisdictionB.name);

    await cleanUpDb([jurisdictionA.id, jurisdictionB.id]);
  });

  it('testing retrieve endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/${jurisdictionA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);

    await cleanUpDb([jurisdictionA.id]);
  });

  it('testing retrieveByName endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${jurisdictionA.name}`)
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);

    await cleanUpDb([jurisdictionA.id]);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/jurisdictions')
      .send({
        name: 'name: 10',
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

    expect(res.body.name).toEqual('name: 10');

    await cleanUpDb([res.body.id]);
  });

  it('testing update endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${jurisdictionA.id}`)
      .send({
        id: jurisdictionA.id,
        name: 'name: 11',
        notificationsSignUpUrl: `notificationsSignUpUrl: 11`,
        languages: [LanguagesEnum.en],
        partnerTerms: `partnerTerms: 11`,
        publicUrl: `publicUrl: 11`,
        emailFromAddress: `emailFromAddress: 11`,
        rentalAssistanceDefault: `rentalAssistanceDefault: 11`,
        enablePartnerSettings: true,
        enableAccessibilityFeatures: true,
        enableUtilitiesIncluded: true,
      } as JurisdictionUpdate)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.publicUrl).toEqual('publicUrl: 11');

    await cleanUpDb([jurisdictionA.id]);
  });

  it('testing delete endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(16),
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
