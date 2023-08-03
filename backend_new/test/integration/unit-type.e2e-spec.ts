import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { UnitTypeCreate } from '../../src/dtos/unit-types/unit-type-create.dto';
import { UnitTypeUpdate } from '../../src/dtos/unit-types/unit-type-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { randomUUID } from 'crypto';
import { UnitTypeEnum } from '@prisma/client';

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
    await unitTypeFactoryAll(prisma);
  });

  it('testing list endpoint', async () => {
    const res = await request(app.getHttpServer())
      .get(`/unitTypes?`)
      .expect(200);
    // all unit types are returned
    expect(res.body.length).toEqual(7);
    // check for random unit types
    const unitTypeNames = res.body.map((value) => value.name);
    expect(unitTypeNames).toContain(UnitTypeEnum.SRO);
    expect(unitTypeNames).toContain(UnitTypeEnum.threeBdrm);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/unitTypes/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const res = await request(app.getHttpServer())
      .get(`/unitTypes/${unitTypeA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(unitTypeA.name);
  });

  it('testing create endpoint', async () => {
    const name = UnitTypeEnum.twoBdrm;
    const res = await request(app.getHttpServer())
      .post('/unitTypes')
      .send({
        name: name,
        numBedrooms: 10,
      } as UnitTypeCreate)
      .expect(201);

    expect(res.body.name).toEqual(name);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const name = UnitTypeEnum.fourBdrm;
    const res = await request(app.getHttpServer())
      .put(`/unitTypes/${id}`)
      .send({
        id: id,
        name: name,
        numBedrooms: 11,
      } as UnitTypeUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
    const name = UnitTypeEnum.SRO;
    const res = await request(app.getHttpServer())
      .put(`/unitTypes/${unitTypeA.id}`)
      .send({
        id: unitTypeA.id,
        name: name,
        numBedrooms: 11,
      } as UnitTypeUpdate)
      .expect(200);

    expect(res.body.name).toEqual(name);
    expect(res.body.numBedrooms).toEqual(11);
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/unitTypes`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitTypeId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.studio);

    const res = await request(app.getHttpServer())
      .delete(`/unitTypes`)
      .send({
        id: unitTypeA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
