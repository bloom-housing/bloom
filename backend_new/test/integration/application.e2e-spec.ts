import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { ApplicationQueryParams } from '../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../src/enums/applications/order-by-enum';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import { UnitTypeEnum } from '@prisma/client';

describe('Application Controller Tests', () => {
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

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should get no applications when params are sent, and no applications are stored', async () => {
    const queryParams: ApplicationQueryParams = {
      limit: 2,
      page: 1,
      order: OrderByEnum.ASC,
      orderBy: ApplicationOrderByKeys.createdAt,
      listingId: randomUUID(),
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applications?${query}`)
      .expect(200);
    expect(res.body.items.length).toBe(0);
  });

  // without clearing the db between tests or test suites this is flakes because of the user tests
  it.skip('should get no applications when no params are sent, and no applications are stored', async () => {
    const res = await request(app.getHttpServer())
      .get(`/applications`)
      .expect(200);

    expect(res.body.items.length).toBe(0);
  });

  it('should get stored applications when params are sent', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });
    const applicationB = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const queryParams: ApplicationQueryParams = {
      limit: 2,
      page: 1,
      order: OrderByEnum.ASC,
      orderBy: ApplicationOrderByKeys.createdAt,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applications?${query}`)
      .expect(200);

    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const resApplicationA = res.body.items.find(
      (item) => item.applicant.firstName === applicationA.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
    res.body.items.find(
      (item) => item.applicant.firstName === applicationB.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
  });

  it('should get stored applications when no params sent', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });
    const applicationB = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/applications`)
      .expect(200);

    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const resApplicationA = res.body.items.find(
      (item) => item.applicant.firstName === applicationA.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
    res.body.items.find(
      (item) => item.applicant.firstName === applicationB.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
  });

  it('should retrieve an application when one exists', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory({ unitTypeId: unitTypeA.id }),
      include: {
        applicant: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/applications/${applicationA.id}`)
      .expect(200);

    expect(res.body.applicant.firstName).toEqual(
      applicationA.applicant.firstName,
    );
  });

  it("should throw an error when retrieve is called with an Id that doesn't exist", async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .get(`/applications/${id}`)
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationId ${id} was requested but not found`,
    );
  });
});
