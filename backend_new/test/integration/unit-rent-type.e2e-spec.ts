import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { unitRentTypeFactory } from '../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeCreate } from '../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('UnitRentType Controller Tests', () => {
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('testing list endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });
    const unitRentTypeB = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes?`)
      .set('Cookie', cookies)
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
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/unitRentTypes/${unitRentTypeA.id}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual(unitRentTypeA.name);
  });

  it('testing create endpoint', async () => {
    const name = unitRentTypeFactory().name;
    const res = await request(app.getHttpServer())
      .post('/unitRentTypes')
      .send({
        name: name,
      } as UnitRentTypeCreate)
      .set('Cookie', cookies)
      .expect(201);

    expect(res.body.name).toEqual(name);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/unitRentTypes/${id}`)
      .send({
        id: id,
        name: unitRentTypeFactory().name,
      } as UnitRentTypeUpdate)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });
    const name = unitRentTypeFactory().name;
    const res = await request(app.getHttpServer())
      .put(`/unitRentTypes/${unitRentTypeA.id}`)
      .send({
        id: unitRentTypeA.id,
        name: name,
      } as UnitRentTypeUpdate)
      .set('Cookie', cookies)
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
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `unitRentTypeId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const unitRentTypeA = await prisma.unitRentTypes.create({
      data: unitRentTypeFactory(),
    });

    const res = await request(app.getHttpServer())
      .delete(`/unitRentTypes`)
      .send({
        id: unitRentTypeA.id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
