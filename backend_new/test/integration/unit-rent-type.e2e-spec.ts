import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeCreate } from '../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { randomUUID } from 'crypto';

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

    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const unitTypeNames = res.body.map((value) => value.name);
    expect(unitTypeNames).toContain(unitRentTypeA.name);
    expect(unitTypeNames).toContain(unitRentTypeB.name);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(10),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes/${unitRentTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitRentTypeA.name);
  });

  it('testing create endpoint', async () => {
    const name = unitRentTypeFactory(10).name;
    const res = await request(app.getHttpServer())
      .post('/unitRentTypes')
      .send({
        name: name,
      } as UnitRentTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual(name);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/unitRentTypes/${id}`)
      .send({
        id: id,
        name: unitRentTypeFactory(10).name,
      } as UnitRentTypeUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(10),
    });
    const name = unitRentTypeFactory(11).name;
    const res = await request(app.getHttpServer())
      .put(`/unitRentTypes/${unitRentTypeA.id}`)
      .send({
        id: unitRentTypeA.id,
        name: name,
      } as UnitRentTypeUpdate)
      .expect(200);

    expect(res.body.name).toEqual(name);
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/unitRentTypes`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
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
