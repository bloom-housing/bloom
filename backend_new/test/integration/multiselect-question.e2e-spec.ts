import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { MultiselectQuestionCreate } from '../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { stringify } from 'qs';
import { MultiselectQuestionQueryParams } from '../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { randomUUID } from 'crypto';

describe('MultiselectQuestion Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(41),
    });
    jurisdictionId = jurisdiction.id;
  });

  it('testing list endpoint without params', async () => {
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(18),
    });

    const multiselectQuestionA = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(7, jurisdictionB.id),
    });
    const multiselectQuestionB = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(8, jurisdictionB.id),
    });

    const res = await request(app.getHttpServer())
      .get(`/multiselectQuestions?`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort((a, b) => (a.text < b.text ? -1 : 1));
    expect(sortedResults[0].text).toEqual(multiselectQuestionA.text);
    expect(sortedResults[1].text).toEqual(multiselectQuestionB.text);
  });

  it('testing list endpoint with params', async () => {
    const multiselectQuestionA = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(7, jurisdictionId),
    });
    const multiselectQuestionB = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(8, jurisdictionId),
    });

    const queryParams: MultiselectQuestionQueryParams = {
      filter: [
        {
          $comparison: Compare['='],
          jurisdiction: jurisdictionId,
        },
      ],
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/multiselectQuestions?${query}`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort((a, b) => (a.text < b.text ? -1 : 1));
    expect(sortedResults[0].text).toEqual(multiselectQuestionA.text);
    expect(sortedResults[1].text).toEqual(multiselectQuestionB.text);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/multiselectQuestions/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `multiselectQuestionId ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const multiselectQuestionA = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(10, jurisdictionId),
    });

    const res = await request(app.getHttpServer())
      .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
      .expect(200);

    expect(res.body.text).toEqual(multiselectQuestionA.text);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/multiselectQuestions')
      .send({
        text: 'example text',
        subText: 'example subText',
        description: 'example description',
        links: [
          {
            title: 'title 1',
            url: 'title 1',
          },
          {
            title: 'title 2',
            url: 'title 2',
          },
        ],
        jurisdictions: [{ id: jurisdictionId }],
        options: [
          {
            text: 'example option text 1',
            ordinal: 1,
            description: 'example option description 1',
            links: [
              {
                title: 'title 3',
                url: 'title 3',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
          {
            text: 'example option text 2',
            ordinal: 2,
            description: 'example option description 2',
            links: [
              {
                title: 'title 4',
                url: 'title 4',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
        ],
        optOutText: 'example optOutText',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      } as MultiselectQuestionCreate)
      .expect(201);

    expect(res.body.text).toEqual('example text');
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/multiselectQuestions/${id}`)
      .send({
        id: id,
        text: 'example text',
        subText: 'example subText',
        description: 'example description',
        links: [
          {
            title: 'title 1',
            url: 'title 1',
          },
          {
            title: 'title 2',
            url: 'title 2',
          },
        ],
        jurisdictions: [{ id: jurisdictionId }],
        options: [
          {
            text: 'example option text 1',
            ordinal: 1,
            description: 'example option description 1',
            links: [
              {
                title: 'title 3',
                url: 'title 3',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
          {
            text: 'example option text 2',
            ordinal: 2,
            description: 'example option description 2',
            links: [
              {
                title: 'title 4',
                url: 'title 4',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
        ],
        optOutText: 'example optOutText',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      } as MultiselectQuestionUpdate)
      .expect(404);
    expect(res.body.message).toEqual(
      `multiselectQuestionId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const multiselectQuestionA = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(10, jurisdictionId),
    });

    const res = await request(app.getHttpServer())
      .put(`/multiselectQuestions/${multiselectQuestionA.id}`)
      .send({
        id: multiselectQuestionA.id,
        text: 'example text',
        subText: 'example subText',
        description: 'example description',
        links: [
          {
            title: 'title 1',
            url: 'title 1',
          },
          {
            title: 'title 2',
            url: 'title 2',
          },
        ],
        jurisdictions: [{ id: jurisdictionId }],
        options: [
          {
            text: 'example option text 1',
            ordinal: 1,
            description: 'example option description 1',
            links: [
              {
                title: 'title 3',
                url: 'title 3',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
          {
            text: 'example option text 2',
            ordinal: 2,
            description: 'example option description 2',
            links: [
              {
                title: 'title 4',
                url: 'title 4',
              },
            ],
            collectAddress: true,
            exclusive: false,
          },
        ],
        optOutText: 'example optOutText',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      } as MultiselectQuestionUpdate)
      .expect(200);

    expect(res.body.text).toEqual('example text');
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/multiselectQuestions`)
      .send({
        id: id,
      } as IdDTO)
      .expect(404);
    expect(res.body.message).toEqual(
      `multiselectQuestionId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const multiselectQuestionA = await prisma.multiselectQuestions.create({
      data: multiselectQuestionFactory(16, jurisdictionId),
    });

    const res = await request(app.getHttpServer())
      .delete(`/multiselectQuestions`)
      .send({
        id: multiselectQuestionA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
