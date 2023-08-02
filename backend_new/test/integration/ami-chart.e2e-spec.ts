import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { stringify } from 'qs';
import { AmiChartQueryParams } from '../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { amiChartFactory } from '../../prisma/seed-helpers/ami-chart-factory';
import { AmiChartCreate } from '../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../../src/dtos/ami-charts/ami-chart-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

describe('AmiChart Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    jurisdictionAId = jurisdictionA.id;
  });

  it('testing list endpoint', async () => {
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionAId),
    });
    await prisma.amiChart.create({
      data: amiChartFactory(15, jurisdictionB.id),
    });
    const queryParams: AmiChartQueryParams = {
      jurisdictionId: jurisdictionAId,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/amiCharts?${query}`)
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(amiChartA.name);
  });

  it('testing retrieve endpoint', async () => {
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .get(`/amiCharts/${amiChartA.id}`)
      .expect(200);

    expect(res.body.name).toEqual(amiChartA.name);
  });

  it('testing create endpoint', async () => {
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
          id: jurisdictionAId,
        },
      } as AmiChartCreate)
      .expect(201);

    expect(res.body.name).toEqual('name: 10');
    expect(res.body.items).toEqual([
      {
        percentOfAmi: 80,
        householdSize: 2,
        income: 5000,
      },
    ]);
  });

  it('testing update endpoint', async () => {
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .put(`/amiCharts/${amiChartA.id}`)
      .send({
        id: amiChartA.id,
        name: 'updated name',
        items: [
          {
            percentOfAmi: 80,
            householdSize: 2,
            income: 5000,
          },
        ],
      } as AmiChartUpdate)
      .expect(200);

    expect(res.body.name).toEqual('updated name');
    expect(res.body.items).toEqual([
      {
        percentOfAmi: 80,
        householdSize: 2,
        income: 5000,
      },
    ]);
  });

  it('testing delete endpoint', async () => {
    const amiChartA = await prisma.amiChart.create({
      data: amiChartFactory(10, jurisdictionAId),
    });

    const res = await request(app.getHttpServer())
      .delete(`/amiCharts`)
      .send({
        id: amiChartA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
