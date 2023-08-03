import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { stringify } from 'qs';
import { ReservedCommunityTypeQueryParams } from '../../src/dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { reservedCommunityTypeFactory } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ReservedCommunityTypeCreate } from '../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../../src/dtos/reserved-community-types/reserved-community-type-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { randomUUID } from 'crypto';

describe('ReservedCommunityType Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    jurisdictionAId = jurisdictionA.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('testing list endpoint without params', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const rctJurisdictionA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionA.id),
    });
    const rctJurisdictionB = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionB.id),
    });

    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes`)
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
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionAId),
    });
    await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionB.id),
    });
    const queryParams: ReservedCommunityTypeQueryParams = {
      jurisdictionId: jurisdictionAId,
    };
    const query = stringify(queryParams as any);

    // testing with params
    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes?${query}`)
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(reservedCommunityTypeA.name);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(reservedCommunityTypeA.name);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/reservedCommunityTypes')
      .send({
        name: 'name: 10',
        description: 'description: 10',
        jurisdictions: {
          id: jurisdictionAId,
        },
      } as ReservedCommunityTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');
    expect(res.body.description).toEqual('description: 10');
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/reservedCommunityTypes/${id}`)
      .send({
        id: id,
        name: 'example name',
        description: 'example description',
      } as ReservedCommunityTypeUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
      .send({
        id: reservedCommunityTypeA.id,
        name: 'name: 11',
        description: 'description: 11',
      } as ReservedCommunityTypeUpdate)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.description).toEqual('description: 11');
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/reservedCommunityTypes`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `reservedCommunityTypeId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .delete(`/reservedCommunityTypes`)
      .send({
        id: reservedCommunityTypeA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
