import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../prisma/seed-helpers/unit-type-factory';
import { ApplicationQueryParams } from '../../src/dtos/applications/application-query-params.dto';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ApplicationOrderByKeys } from '../../src/enums/applications/order-by-enum';
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
    await app.close();
  });

  const cleanUpDb = async (applicationIds: string[]) => {
    for (let i = 0; i < applicationIds.length; i++) {
      await prisma.householdMember.deleteMany();
      const res = await prisma.applications.delete({
        where: {
          id: applicationIds[i],
        },
        include: {
          alternateContact: true,
          applicant: true,
          accessibility: true,
          demographics: true,
        },
      });
      if (res.alternateContact) {
        await prisma.alternateContact.delete({
          where: {
            id: res.alternateContact.id,
          },
        });
      }
      await prisma.applicant.delete({
        where: {
          id: res.applicant.id,
        },
      });
      if (res.accessibility) {
        await prisma.accessibility.delete({
          where: {
            id: res.accessibility.id,
          },
        });
      }
      if (res.demographics) {
        await prisma.demographics.delete({
          where: {
            id: res.demographics.id,
          },
        });
      }
      await prisma.address.deleteMany({
        where: {
          id: {
            in: [
              res.mailingAddressId ?? undefined,
              res.alternateAddressId ?? undefined,
              res.alternateContact?.mailingAddressId,
              res.applicant.workAddressId,
              res.applicant.addressId,
            ],
          },
        },
      });
    }
  };

  it('testing list endpoint', async () => {
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

    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: 2,
      itemsPerPage: 2,
      totalItems: 2,
      totalPages: 1,
    });
    expect(res.body.items.length).toEqual(2);
    const resApplicationA = res.body.items.find(
      (item) => item.applicant.firstName === applicationA.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();
    const resApplicationB = res.body.items.find(
      (item) => item.applicant.firstName === applicationB.applicant.firstName,
    );
    expect(resApplicationA).not.toBeNull();

    await cleanUpDb([applicationA.id, applicationB.id]);
  });

  it('testing retrieve endpoint', async () => {
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

    await cleanUpDb([applicationA.id]);
  });
});
