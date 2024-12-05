import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { featureFlagFactory } from '../../prisma/seed-helpers/feature-flag-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { randomName } from '../../prisma/seed-helpers/word-generator';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('Feature Flag Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;

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
    adminAccessToken = resLogIn.header?.['set-cookie'].find((cookie) =>
      cookie.startsWith('access-token='),
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('list endpoint', () => {
    it('should return all existing feature flags', async () => {
      const featureFlagA = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });
      const featureFlagB = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });

      const res = await request(app.getHttpServer())
        .get(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(2);
      const featureFlags = res.body.map((value) => value.name);
      expect(featureFlags).toContain(featureFlagA.name);
      expect(featureFlags).toContain(featureFlagB.name);
    });
  });

  describe('create endpoint', () => {
    it('should create a feature flag', async () => {
      const body = {
        name: randomName(),
        description: 'new description',
        active: true,
      };

      const res = await request(app.getHttpServer())
        .post(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(201);

      expect(res.body).toEqual({
        ...body,
        jurisdictions: [],
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });

  describe('update endpoint', () => {
    it('should update an existing feature flag', async () => {
      const featureFlag = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });

      const body = {
        id: featureFlag.id,
        description: 'updated description',
        active: !featureFlag.active,
      };

      const res = await request(app.getHttpServer())
        .put(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body).toEqual({
        ...body,
        name: featureFlag.name,
        jurisdictions: [],
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    it('should error when trying to update a feature flag that does not exist', async () => {
      const body = {
        id: randomUUID(),
        description: 'updated description',
        active: true,
      };

      const res = await request(app.getHttpServer())
        .put(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(404);

      expect(res.body.message).toEqual(
        `feature flag id ${body.id} was requested but not found`,
      );
    });
  });

  describe('delete endpoint', () => {
    it('should delete an existing feature flag', async () => {
      const featureFlag = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });

      const res = await request(app.getHttpServer())
        .delete(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({ id: featureFlag.id })
        .set('Cookie', adminAccessToken)
        .expect(200);

      const featureFlagAfterDelete = await prisma.featureFlags.findUnique({
        where: { id: featureFlag.id },
      });
      expect(featureFlagAfterDelete).toBeNull();
      expect(res.body.success).toEqual(true);
    });

    it('should error when trying to delete a feature flag that does not exist', async () => {
      const id = randomUUID();

      const res = await request(app.getHttpServer())
        .delete(`/featureFlags`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({ id: id })
        .set('Cookie', adminAccessToken)
        .expect(404);

      expect(res.body.message).toEqual(
        `feature flag id ${id} was requested but not found`,
      );
    });
  });

  describe('associateJurisdictions endpoint', () => {
    it('should associate and remove jurisdictions to an existing feature flag', async () => {
      const jurisdiction1 = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const jurisdiction2 = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const jurisdiction3 = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const featureFlag = await prisma.featureFlags.create({
        data: featureFlagFactory(undefined, undefined, undefined, [
          jurisdiction1.id,
          jurisdiction2.id,
        ]),
      });

      const body = {
        id: featureFlag.id,
        associate: [jurisdiction3.id],
        remove: [jurisdiction2.id],
      };

      const res = await request(app.getHttpServer())
        .put(`/featureFlags/associateJurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body).toEqual({
        ...featureFlag,
        jurisdictions: [
          {
            id: jurisdiction1.id,
            name: jurisdiction1.name,
          },
          {
            id: jurisdiction3.id,
            name: jurisdiction3.name,
          },
        ],
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    it('should not associate a jurisdiction also set to remove to an existing feature flag', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const featureFlag = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });

      const body = {
        id: featureFlag.id,
        associate: [jurisdiction.id],
        remove: [jurisdiction.id],
      };

      const res = await request(app.getHttpServer())
        .put(`/featureFlags/associateJurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body).toEqual({
        ...featureFlag,
        jurisdictions: [],
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    it('should error when trying to associateJurisdictions a feature flag that does not exist', async () => {
      const body = {
        id: randomUUID(),
        associate: [],
        remove: [],
      };

      const res = await request(app.getHttpServer())
        .put(`/featureFlags/associateJurisdictions`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send(body)
        .set('Cookie', adminAccessToken)
        .expect(404);

      expect(res.body.message).toEqual(
        `feature flag id ${body.id} was requested but not found`,
      );
    });
  });

  describe('retrieve endpoint', () => {
    it('should return an existing feature flag by id', async () => {
      const featureFlag = await prisma.featureFlags.create({
        data: featureFlagFactory(),
      });

      const res = await request(app.getHttpServer())
        .get(`/featureFlags/${featureFlag.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', adminAccessToken)
        .expect(200);

      expect(res.body.name).toEqual(featureFlag.name);
      expect(res.body.description).toEqual(featureFlag.description);
      expect(res.body.active).toEqual(featureFlag.active);
    });
  });

  it('should error when trying to retrieve a feature flag that does not exist', async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .get(`/featureFlags/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(404);

    expect(res.body.message).toEqual(
      `feature flag id ${id} was requested but not found`,
    );
  });
});
