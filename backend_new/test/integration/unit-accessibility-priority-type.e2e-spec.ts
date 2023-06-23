import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitAccessibilityPriorityTypeFactory } from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeCreate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { randomUUID } from 'crypto';

describe('UnitAccessibilityPriorityType Controller Tests', () => {
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

    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const unitTypeNames = res.body.map((value) => value.name);
    expect(unitTypeNames).toContain(unitTypeA.name);
    expect(unitTypeNames).toContain(unitTypeB.name);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitTypeA.name);
  });

  it('testing create endpoint', async () => {
    const name = unitAccessibilityPriorityTypeFactory(10).name;
    const res = await request(app.getHttpServer())
      .post('/unitAccessibilityPriorityTypes')
      .send({
        name: name,
      } as UnitAccessibilityPriorityTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual(name);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const name = unitAccessibilityPriorityTypeFactory(10).name;
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/unitAccessibilityPriorityTypes/${id}`)
      .send({
        id: id,
        name: name,
      } as UnitAccessibilityPriorityTypeUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const unitTypeA = await prisma.unitAccessibilityPriorityTypes.create({
      data: unitAccessibilityPriorityTypeFactory(10),
    });
    const name = unitAccessibilityPriorityTypeFactory(11).name;
    const res = await request(app.getHttpServer())
      .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .send({
        id: unitTypeA.id,
        name: name,
      } as UnitAccessibilityPriorityTypeUpdate)
      .expect(200);

    expect(res.body.name).toEqual(name);
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/unitAccessibilityPriorityTypes`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
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
