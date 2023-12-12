import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UnitAccessibilityPriorityTypeEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import {
  unitAccessibilityPriorityTypeFactoryAll,
  unitAccessibilityPriorityTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeCreate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('UnitAccessibilityPriorityType Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';
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
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
    await unitAccessibilityPriorityTypeFactoryAll(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('testing list endpoint', async () => {
    const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(prisma);
    const unitTypeB = await unitAccessibilityPriorityTypeFactorySingle(prisma);

    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes?`)
      .set('Cookie', cookies)
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
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(prisma);

    const res = await request(app.getHttpServer())
      .get(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual(unitTypeA.name);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/unitAccessibilityPriorityTypes')
      .send({
        name: UnitAccessibilityPriorityTypeEnum.hearing,
      } as UnitAccessibilityPriorityTypeCreate)
      .set('Cookie', cookies)
      .expect(201);

    expect(res.body.name).toEqual(UnitAccessibilityPriorityTypeEnum.hearing);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const priorityType = await unitAccessibilityPriorityTypeFactorySingle(
      prisma,
    );
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/unitAccessibilityPriorityTypes/${id}`)
      .send({
        id: id,
        name: priorityType.name,
      } as UnitAccessibilityPriorityTypeUpdate)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const unitTypeA = await unitAccessibilityPriorityTypeFactorySingle(prisma);
    const priorityType = await unitAccessibilityPriorityTypeFactorySingle(
      prisma,
    );
    const res = await request(app.getHttpServer())
      .put(`/unitAccessibilityPriorityTypes/${unitTypeA.id}`)
      .send({
        id: unitTypeA.id,
        name: priorityType.name,
      } as UnitAccessibilityPriorityTypeUpdate)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual(priorityType.name);
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/unitAccessibilityPriorityTypes`)
      .send({
        id: id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitAccessibilityPriorityTypeId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    await request(app.getHttpServer())
      .post('/unitAccessibilityPriorityTypes')
      .send({
        name: UnitAccessibilityPriorityTypeEnum.hearing,
      } as UnitAccessibilityPriorityTypeCreate)
      .expect(201);
    const hearingTypes = await prisma.unitAccessibilityPriorityTypes.findMany({
      where: {
        name: {
          equals: UnitAccessibilityPriorityTypeEnum.hearing,
        },
      },
    });

    const res = await request(app.getHttpServer())
      .delete(`/unitAccessibilityPriorityTypes`)
      .send({
        id: hearingTypes[hearingTypes.length - 1].id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
