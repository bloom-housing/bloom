import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitTypeFactory } from '../../prisma/seed-helpers/unit-type-factory';
import { UnitTypeCreate } from '../../src/dtos/unit-types/unit-type-create.dto';
import { UnitType } from '../../src/dtos/unit-types/unit-type-get.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

describe('UnitType Controller Tests', () => {
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

  const cleanUpDb = async (unitTypeIds: string[]) => {
    for (let i = 0; i < unitTypeIds.length; i++) {
      await prisma.unitTypes.delete({
        where: {
          id: unitTypeIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const unitTypeA = await prisma.unitTypes.create({
      data: unitTypeFactory(7),
    });
    const unitTypeB = await prisma.unitTypes.create({
      data: unitTypeFactory(8),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitTypes?`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort(
      (a, b) => a.numBedrooms - b.numBedrooms,
    );
    expect(sortedResults[0].name).toEqual(unitTypeA.name);
    expect(sortedResults[1].name).toEqual(unitTypeB.name);

    await cleanUpDb([unitTypeA.id, unitTypeB.id]);
  });

  it('testing retrieve endpoint', async () => {
    const unitTypeA = await prisma.unitTypes.create({
      data: unitTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitTypes/${unitTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitTypeA.name);

    await cleanUpDb([unitTypeA.id]);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/unitTypes')
      .send({
        name: 'name: 10',
        numBedrooms: 10,
      } as UnitTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');

    await cleanUpDb([res.body.id]);
  });

  it('testing update endpoint', async () => {
    const unitTypeA = await prisma.unitTypes.create({
      data: unitTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .put(`/unitTypes/${unitTypeA.id}`)
      .send({
        id: unitTypeA.id,
        name: 'name: 11',
        numBedrooms: 11,
        createdAt: unitTypeA.createdAt,
        updatedAt: unitTypeA.updatedAt,
      } as UnitType)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.numBedrooms).toEqual(11);

    await cleanUpDb([unitTypeA.id]);
  });

  it('testing delete endpoint', async () => {
    const unitTypeA = await prisma.unitTypes.create({
      data: unitTypeFactory(16),
    });

    const res = await request(app.getHttpServer())
      .delete(`/unitTypes`)
      .send({
        id: unitTypeA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
