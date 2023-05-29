import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeCreate } from '../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentType } from '../../src/dtos/unit-rent-types/unit-rent-type-get.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

describe('UnitRentType Controller Tests', () => {
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

  const cleanUpDb = async (unitRentTypeIds: string[]) => {
    for (let i = 0; i < unitRentTypeIds.length; i++) {
      await prisma.unitRentTypes.delete({
        where: {
          id: unitRentTypeIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(7),
    });
    const unitRentTypeB = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(8),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes?`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort((a, b) => (a.name < b.name ? 1 : -1));
    expect(sortedResults[0].name).toEqual(unitRentTypeA.name);
    expect(sortedResults[1].name).toEqual(unitRentTypeB.name);

    await cleanUpDb([unitRentTypeA.id, unitRentTypeB.id]);
  });

  it('testing retrieve endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes/${unitRentTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitRentTypeA.name);

    await cleanUpDb([unitRentTypeA.id]);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/unitRentTypes')
      .send({
        name: 'name: 10',
      } as UnitRentTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');

    await cleanUpDb([res.body.id]);
  });

  it('testing update endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .put(`/unitRentTypes/${unitRentTypeA.id}`)
      .send({
        id: unitRentTypeA.id,
        name: 'name: 11',
        createdAt: unitRentTypeA.createdAt,
        updatedAt: unitRentTypeA.updatedAt,
      } as UnitRentType)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');

    await cleanUpDb([unitRentTypeA.id]);
  });

  it('testing delete endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(16),
    });

    const res = await request(app.getHttpServer())
      .delete(`/unitRentTypes`)
      .send({
        id: unitRentTypeA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
