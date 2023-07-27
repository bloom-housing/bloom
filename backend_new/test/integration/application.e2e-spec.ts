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

  const cleanUpDb = async (applicationIds: string[], unitTypeIds: string[]) => {
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
      await prisma.alternateContact.delete({
        where: {
          id: res.alternateContact.id,
        },
      });
      await prisma.applicant.delete({
        where: {
          id: res.applicant.id,
        },
      });
      await prisma.accessibility.delete({
        where: {
          id: res.accessibility.id,
        },
      });
      await prisma.demographics.delete({
        where: {
          id: res.demographics.id,
        },
      });
      await prisma.address.deleteMany({
        where: {
          id: {
            in: [
              res.mailingAddressId,
              res.alternateAddressId,
              res.alternateContact.mailingAddressId,
              res.applicant.workAddressId,
              res.applicant.addressId,
            ],
          },
        },
      });
    }
    for (let i = 0; i < unitTypeIds.length; i++) {
      await prisma.unitTypes.delete({
        where: {
          id: unitTypeIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory(7, unitTypeA.id),
      include: {
        applicant: true,
      },
    });
    const applicationB = await prisma.applications.create({
      data: applicationFactory(8, unitTypeA.id),
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
    const sortedItems = res.body.items.sort((a, b) =>
      a.applicant.firstName < b.applicant.firstName ? -1 : 1,
    );
    expect(sortedItems[0].applicant.firstName).toEqual(
      applicationA.applicant.firstName,
    );
    expect(sortedItems[1].applicant.firstName).toEqual(
      applicationB.applicant.firstName,
    );

    await cleanUpDb([applicationA.id, applicationB.id], [unitTypeA.id]);
  });

  it('testing retrieve endpoint', async () => {
    const unitTypeA = await unitTypeFactorySingle(prisma, UnitTypeEnum.oneBdrm);

    const applicationA = await prisma.applications.create({
      data: applicationFactory(10, unitTypeA.id),
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

    await cleanUpDb([applicationA.id], [unitTypeA.id]);
  });
});
