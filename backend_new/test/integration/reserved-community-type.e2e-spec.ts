import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { stringify } from 'qs';
import { ReservedCommunityTypeQueryParams } from '../../src/dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { reservedCommunityTypeFactory } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { ReservedCommunityTypeCreate } from '../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityType } from '../../src/dtos/reserved-community-types/reserved-community-type.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

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
      data: jurisdictionFactory(12),
    });
    jurisdictionAId = jurisdictionA.id;
  });

  it('testing list endpoint', async () => {
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(13),
    });
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(10, jurisdictionAId),
    });
    await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(10, jurisdictionB.id),
    });
    const queryParams: ReservedCommunityTypeQueryParams = {
      jurisdictionId: jurisdictionAId,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/reservedCommunityTypes?${query}`)
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(reservedCommunityTypeA.name);
  });

  it('testing retrieve endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(10, jurisdictionAId),
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

  it('testing update endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(10, jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .put(`/reservedCommunityTypes/${reservedCommunityTypeA.id}`)
      .send({
        id: reservedCommunityTypeA.id,
        name: 'name: 11',
        description: 'description: 11',
        jurisdictions: {
          id: jurisdictionAId,
        },
        createdAt: reservedCommunityTypeA.createdAt,
        updatedAt: reservedCommunityTypeA.updatedAt,
      } as ReservedCommunityType)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.description).toEqual('description: 11');
  });

  it('testing delete endpoint', async () => {
    const reservedCommunityTypeA = await prisma.reservedCommunityTypes.create({
      data: reservedCommunityTypeFactory(16, jurisdictionAId),
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
