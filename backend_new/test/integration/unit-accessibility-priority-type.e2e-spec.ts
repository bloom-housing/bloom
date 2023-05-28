import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitAccessibilityPriorityTypeFactory } from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeCreate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create';
import { UnitAccessibilityPriorityType } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-get.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

describe('UnitAccessibilityPriorityType Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const cleanUpDb = async (unitTypeIds: string[]) => {
    for (let i = 0; i < unitTypeIds.length; i++) {
      await prisma.unitAccessibilityPriorityTypes.delete({
        where: {
          id: unitTypeIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(7),
    });
    const unitTypeB = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(8),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes?`)
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
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitTypeA.name);

    await cleanUpDb([unitTypeA.id]);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/unitAccessibilityPriorityTypes')
      .send({
        name: 'name: 10',
      } as UnitAccessibilityPriorityTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');

    await cleanUpDb([res.body.id]);
  });

  it('testing update endpoint', async () => {
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .send({
        id: unitTypeA.id,
        name: 'name: 11',
        createdAt: unitTypeA.createdAt,
        updatedAt: unitTypeA.updatedAt,
      } as UnitAccessibilityPriorityType)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');

    await cleanUpDb([unitTypeA.id]);
  });

  it('testing delete endpoint', async () => {
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(16),
    });

    const res = await request(app.getHttpServer())
      .delete(`/unitAccessibilityPriorityTypes`)
      .send({
        id: unitTypeA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
