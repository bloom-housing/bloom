import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { stringify } from 'qs';
import { AmiChartQueryParams } from '../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { amiChartFactory } from '../../prisma/seed-helpers/ami-chart-factory';
import { AmiChartCreate } from '../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChart } from '../../src/dtos/ami-charts/ami-chart-get.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

describe('AmiChart Controller Tests', () => {
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

  const cleanUpDb = async (
    amiChartIds: string[],
    jurisdictionIds: string[],
  ) => {
    for (let i = 0; i < amiChartIds.length; i++) {
      await prisma.amiChart.delete({
        where: {
          id: amiChartIds[i],
        },
      });
    }
    for (let i = 0; i < jurisdictionIds.length; i++) {
      await prisma.jurisdictions.delete({
        where: {
          id: jurisdictionIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(11),
    });
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionA.id),
    });
    const amiChartB = await prisma.amiChart.create({
      data: amiChartFactory(15, jurisdictionB.id),
    });
    const queryParams: AmiChartQueryParams = {
      jurisdictionId: jurisdictionA.id,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/amiCharts?${query}`)
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(amiChartA.name);

    await cleanUpDb(
      [amiChartA.id, amiChartB.id],
      [jurisdictionA.id, jurisdictionB.id],
    );
  });

  it('testing retrieve endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionA.id),
    });

    const res = await request(app.getHttpServer())
      .get(`/amiCharts/${amiChartA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(amiChartA.name);

    await cleanUpDb([amiChartA.id], [jurisdictionA.id]);
  });

  it('testing create endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const res = await request(app.getHttpServer())
      .post('/amiCharts')
      .send({
        name: 'name: 10',
        items: [
          {
            percentOfAmi: 80,
            householdSize: 2,
            income: 5000,
          },
        ],
        jurisdictions: {
          id: jurisdictionA.id,
        },
      } as AmiChartCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');
    expect(res.body.items).toEqual(
      JSON.stringify([
        {
          percentOfAmi: 80,
          householdSize: 2,
          income: 5000,
        },
      ]),
    );

    await cleanUpDb([res.body.id], [jurisdictionA.id]);
  });

  it('testing update endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionA.id),
    });

    const res = await request(app.getHttpServer())
      .put(`/amiCharts/${amiChartA.id}`)
      .send({
        id: amiChartA.id,
        name: 'name: 11',
        items: [
          {
            percentOfAmi: 80,
            householdSize: 2,
            income: 5000,
          },
        ],
        jurisdictions: {
          id: jurisdictionA.id,
        },
        createdAt: amiChartA.createdAt,
        updatedAt: amiChartA.updatedAt,
      } as AmiChart)
      .expect(200);

    expect(res.body.name).toEqual('name: 11');
    expect(res.body.items).toEqual(
      JSON.stringify([
        {
          percentOfAmi: 80,
          householdSize: 2,
          income: 5000,
        },
      ]),
    );

    await cleanUpDb([amiChartA.id], [jurisdictionA.id]);
  });

  it('testing delete endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(10),
    });

    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionA.id),
    });

    const res = await request(app.getHttpServer())
      .delete(`/amiCharts`)
      .send({
        id: amiChartA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);

    await cleanUpDb([], [jurisdictionA.id]);
  });
});
