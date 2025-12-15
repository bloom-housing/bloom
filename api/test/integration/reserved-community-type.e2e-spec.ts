import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { ReservedCommunityTypeQueryParams } from '../../src/dtos/reserved-community-types/reserved-community-type-query-params.dto';
import {
  reservedCommunityTypeFactory,
  reservedCommunityTypeFactoryAll,
  reservedCommunityTypeFactoryGet,
} from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ReservedCommunityTypeCreate } from '../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../../src/dtos/reserved-community-types/reserved-community-type-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('ReservedCommunityType Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;
  let cookies = '';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    jurisdictionAId = jurisdictionA.id;

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
    await reservedCommunityTypeFactoryAll(jurisdictionAId, prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('testing list endpoint without params', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    await reservedCommunityTypeFactoryAll(jurisdictionB.id, prisma);

    const rctJurisdictionA = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionA.id,
    );
    const rctJurisdictionB = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionB.id,
    );

    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const typeNames = res.body.map((value) => value.name);
    const jurisdictions = res.body.map((value) => value.jurisdictions.id);
    expect(typeNames).toContain(rctJurisdictionA.name);
    expect(typeNames).toContain(rctJurisdictionB.name);
    expect(jurisdictions).toContain(jurisdictionA.id);
    expect(jurisdictions).toContain(jurisdictionB.id);
  });

  it('testing list endpoint with params', async () => {
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionAId,
    );
    await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionB.id, 'jurisB RCT'),
    });
    const queryParams: ReservedCommunityTypeQueryParams = {
      jurisdictionId: jurisdictionAId,
    };
    const query = stringify(queryParams as any);

    // testing with params
    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes?${query}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.length).toEqual(11);
    expect(res.body.map((body) => body.name)).toContain(
      reservedCommunityTypeA.name,
    );
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionAId,
    );

    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual(reservedCommunityTypeA.name);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/reservedCommunityTypes')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        name: 'name: 10',
        description: 'description: 10',
        jurisdictions: {
          id: jurisdictionAId,
        },
      } as ReservedCommunityTypeCreate)
      .set('Cookie', cookies)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');
    expect(res.body.description).toEqual('description: 10');
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/reservedCommunityTypes/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: id,
        name: 'example name',
        description: 'example description',
      } as ReservedCommunityTypeUpdate)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionAId,
    );

    const res = await request(app.getHttpServer())
      .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: reservedCommunityTypeA.id,
        name: 'name: 11',
        description: 'description: 11',
      } as ReservedCommunityTypeUpdate)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.description).toEqual('description: 11');
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/reservedCommunityTypes`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory('jurisdictionForDeleteRCT'),
    });
    await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
    const reservedCommunityTypeA = await reservedCommunityTypeFactoryGet(
      prisma,
      jurisdictionA.id,
    );

    const res = await request(app.getHttpServer())
      .delete(`/reservedCommunityTypes`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: reservedCommunityTypeA.id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
