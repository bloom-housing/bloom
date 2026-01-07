import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import { createAllFeatureFlags } from '../../prisma/seed-helpers/feature-flag-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { MultiselectQuestionCreate } from '../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionQueryParams } from '../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { MultiselectQuestionUpdate } from '../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { MultiselectQuestionOrderByKeys } from '../../src/enums/multiselect-questions/order-by-enum';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';

describe('MultiselectQuestion Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();
    await createAllFeatureFlags(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  // TODO: Can be removed after MSQ refactor
  describe('current msq implementation', () => {
    let jurisdictionId: string;
    let cookies = '';
    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      jurisdictionId = jurisdiction.id;

      const storedUser = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
          mfaEnabled: false,
          confirmedAt: new Date(),
        }),
      });
      const resLogIn = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: storedUser.email,
          password: 'Abcdef12345!',
        } as Login)
        .expect(201);

      cookies = resLogIn.headers['set-cookie'];
    });

    describe('list', () => {
      it('should get multiselect questions from list endpoint when no params are sent', async () => {
        const jurisdictionB = await prisma.jurisdictions.create({
          data: jurisdictionFactory(),
        });

        await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id),
        });
        await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(2);
      });

      it('should get multiselect questions from list endpoint when params are sent', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
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
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(2);
        const multiselectQuestions = res.body.map((value) => value.text);
        expect(multiselectQuestions).toContain(multiselectQuestion.text);
        expect(multiselectQuestions).toContain(multiselectQuestionB.text);
      });
    });

    describe('create', () => {
      it('should create a multiselect question', async () => {
        const res = await request(app.getHttpServer())
          .post('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            text: 'example text',
            subText: 'example subText',
            description: 'example description',
            links: [
              {
                title: 'title 1',
                url: 'https://title-1.com',
              },
              {
                title: 'title 2',
                url: 'https://title-2.com',
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
                    url: 'https://title-3.com',
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
                    url: 'https://title-4.com',
                  },
                ],
                collectAddress: true,
                exclusive: false,
              },
            ],
            optOutText: 'example optOutText',
            hideFromListing: false,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            status: MultiselectQuestionsStatusEnum.draft,
          } as MultiselectQuestionCreate)
          .set('Cookie', cookies)
          .expect(201);

        expect(res.body.text).toEqual('example text');
      });
    });

    describe('update', () => {
      it('should throw error when update endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
            text: 'example text',
            subText: 'example subText',
            description: 'example description',
            links: [
              {
                title: 'title 1',
                url: 'https://title-1.com',
              },
              {
                title: 'title 2',
                url: 'https://title-2.com',
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
                    url: 'https://title-3.com',
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
                    url: 'https://title-4.com',
                  },
                ],
                collectAddress: true,
                exclusive: false,
              },
            ],
            optOutText: 'example optOutText',
            hideFromListing: false,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            status: MultiselectQuestionsStatusEnum.draft,
          } as MultiselectQuestionUpdate)
          .set('Cookie', cookies)
          .expect(404);
        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should update multiselect question', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
            text: 'example text',
            subText: 'example subText',
            description: 'example description',
            links: [
              {
                title: 'title 1',
                url: 'https://title-1.com',
              },
              {
                title: 'title 2',
                url: 'https://title-2.com',
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
                    url: 'https://title-3.com',
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
                    url: 'https://title-4.com',
                  },
                ],
                collectAddress: true,
                exclusive: false,
              },
            ],
            optOutText: 'example optOutText',
            hideFromListing: false,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            status: MultiselectQuestionsStatusEnum.draft,
          } as MultiselectQuestionUpdate)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.text).toEqual('example text');
      });
    });

    describe('delete', () => {
      it('should throw error when delete endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(404);
        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should delete multiselect question', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);
      });
    });

    describe('retrieve', () => {
      it('should throw error when retrieve endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(404);
        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should get multiselect question when retrieve endpoint is called and id exists', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${multiselectQuestion.id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.text).toEqual(multiselectQuestion.text);
      });
    });
  });

  describe('v2 msq implementation enabled', () => {
    let jurisdictionId: string;
    let cookies = '';
    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory('enableV2', {
          featureFlags: [FeatureFlagEnum.enableV2MSQ],
        }),
      });
      jurisdictionId = jurisdiction.id;

      const storedUser = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
          mfaEnabled: false,
          confirmedAt: new Date(),
        }),
      });
      const resLogIn = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: storedUser.email,
          password: 'Abcdef12345!',
        } as Login)
        .expect(201);

      cookies = resLogIn.headers['set-cookie'];
    });

    describe('list', () => {
      let listJurisdictionId: string;
      beforeAll(async () => {
        const jurisdiction = await prisma.jurisdictions.create({
          data: jurisdictionFactory('enableV2 juris list', {
            featureFlags: [FeatureFlagEnum.enableV2MSQ],
          }),
        });
        listJurisdictionId = jurisdiction.id;
      });

      it('should get multiselect questions from list endpoint when jurisdiction filter is sent', async () => {
        const jurisdictionB = await prisma.jurisdictions.create({
          data: jurisdictionFactory('enableV2 juris list test', {
            featureFlags: [FeatureFlagEnum.enableV2MSQ],
          }),
        });

        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id, {}, true),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id, {}, true),
        });

        const queryParams: MultiselectQuestionQueryParams = {
          filter: [
            {
              $comparison: Compare['='],
              jurisdiction: jurisdictionB.id,
            },
          ],
        };
        const query = stringify(queryParams as any);

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions?${query}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toEqual(2);
        const multiselectQuestions = res.body.map((value) => value.name);
        expect(multiselectQuestions).toContain(multiselectQuestionA.name);
        expect(multiselectQuestions).toContain(multiselectQuestionB.name);
      });

      it('should get multiselect questions from list endpoint when multiple filter params are sent', async () => {
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(listJurisdictionId, {}, true),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            listJurisdictionId,
            {
              multiselectQuestion: {
                applicationSection:
                  MultiselectQuestionsApplicationSectionEnum.programs,
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
            true,
          ),
        });
        const multiselectQuestionC = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            listJurisdictionId,
            {
              multiselectQuestion: {
                applicationSection:
                  MultiselectQuestionsApplicationSectionEnum.preferences,
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
            true,
          ),
        });

        const queryParams: MultiselectQuestionQueryParams = {
          filter: [
            {
              $comparison: Compare['='],
              applicationSection:
                MultiselectQuestionsApplicationSectionEnum.preferences,
            },
            {
              $comparison: Compare['='],
              jurisdiction: listJurisdictionId,
            },
            {
              $comparison: Compare['='],
              status: MultiselectQuestionsStatusEnum.active,
            },
          ],
        };
        const query = stringify(queryParams as any);

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions?${query}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(1);
        const multiselectQuestions = res.body.map((value) => value.name);
        expect(multiselectQuestions).not.toContain(multiselectQuestionA.name);
        expect(multiselectQuestions).not.toContain(multiselectQuestionB.name);
        expect(multiselectQuestions).toContain(multiselectQuestionC.name);
      });

      it('should get multiselect questions in correct order from list endpoint when orderBy and search are sent', async () => {
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            listJurisdictionId,
            {
              multiselectQuestion: {
                name: 'MSQ A1',
              },
            },
            true,
          ),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            listJurisdictionId,
            {
              multiselectQuestion: {
                name: 'MSQ B2',
              },
            },
            true,
          ),
        });
        const multiselectQuestionC = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            listJurisdictionId,
            {
              multiselectQuestion: {
                name: 'MSQ C3',
              },
            },
            true,
          ),
        });

        const queryParams: MultiselectQuestionQueryParams = {
          filter: [
            {
              $comparison: Compare['='],
              jurisdiction: listJurisdictionId,
            },
          ],
          orderBy: [MultiselectQuestionOrderByKeys.name],
          orderDir: [OrderByEnum.DESC],
          search: 'MSQ',
        };
        const query = stringify(queryParams as any);

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions?${query}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toEqual(3);
        expect(res.body[0].name).toEqual(multiselectQuestionC.name);
        expect(res.body[1].name).toEqual(multiselectQuestionB.name);
        expect(res.body[2].name).toEqual(multiselectQuestionA.name);
      });
    });

    describe('create', () => {
      it('should create a multiselect question', async () => {
        const res = await request(app.getHttpServer())
          .post('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            description: 'example description',
            isExclusive: true,
            jurisdiction: { id: jurisdictionId },
            links: [
              {
                title: 'title 1',
                url: 'https://title-1.com',
              },
              {
                title: 'title 2',
                url: 'https://title-2.com',
              },
            ],
            multiselectOptions: [
              {
                description: 'example option description',
                name: 'example option name',
                ordinal: 1,
                // TODO: Can be removed after MSQ refactor
                text: 'example option text',
              },
            ],
            name: 'example name',
            status: MultiselectQuestionsStatusEnum.draft,
            subText: 'example subText',

            // TODO: Can be removed after MSQ refactor
            jurisdictions: [{ id: jurisdictionId }],
            text: 'example text',
          } as MultiselectQuestionCreate)
          .set('Cookie', cookies)
          .expect(201);

        expect(res.body.name).toEqual('example name');
      });
    });

    describe('update', () => {
      it('should throw error when update endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            isExclusive: true,
            jurisdiction: { id: jurisdictionId },
            name: 'example name',
            status: MultiselectQuestionsStatusEnum.visible,

            // TODO: Can be removed after MSQ refactor
            jurisdictions: [{ id: jurisdictionId }],
            text: 'example text',
          } as MultiselectQuestionUpdate)
          .set('Cookie', cookies)
          .expect(404);
        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should update multiselect question', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            jurisdictionId,
            {
              multiselectQuestion: {
                multiselectOptions: {
                  createMany: {
                    data: [
                      {
                        name: 'example option name1',
                        ordinal: 1,
                      },
                      {
                        isOptOut: true,
                        name: 'example option name2',
                        ordinal: 2,
                      },
                    ],
                  },
                },
              },
            },
            true,
          ),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
            applicationSection: multiselectQuestion.applicationSection,
            isExclusive: multiselectQuestion.isExclusive,
            jurisdiction: { id: multiselectQuestion.jurisdictionId },
            multiselectOptions: [
              {
                description: 'example option description',
                name: 'example option name',
                ordinal: 1,
                // TODO: Can be removed after MSQ refactor
                text: 'example option text',
              },
            ],
            name: 'example name',
            status: MultiselectQuestionsStatusEnum.visible,

            // TODO: Can be removed after MSQ refactor
            jurisdictions: [{ id: multiselectQuestion.jurisdictionId }],
            text: multiselectQuestion.text,
          } as MultiselectQuestionUpdate)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.name).toEqual('example name');
      });
    });

    describe('delete', () => {
      it('should throw error when delete endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(404);
        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should delete multiselect question', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });

        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);
      });
    });

    describe('reActivate', () => {
      it('should re-activate a multiselectQuestion in the toRetire status', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            jurisdictionId,
            {
              multiselectQuestion: {
                status: MultiselectQuestionsStatusEnum.toRetire,
              },
            },
            true,
          ),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/reActivate')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);

        const updatedData = await prisma.multiselectQuestions.findUnique({
          select: { status: true },
          where: { id: multiselectQuestion.id },
        });
        expect(updatedData.status).toEqual(
          MultiselectQuestionsStatusEnum.active,
        );
      });

      it('should throw error when reActivate endpoint is hit with an multiselectQuestion not in toRetire status', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            jurisdictionId,
            {
              multiselectQuestion: {
                status: MultiselectQuestionsStatusEnum.retired,
              },
            },
            true,
          ),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/reActivate')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(400);

        expect(res.body.message).toEqual("status 'retired' cannot be changed");
      });

      it('should throw error when reActivate endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/reActivate')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(404);

        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });
    });

    describe('retire', () => {
      it('should retire a multiselectQuestion in the active status with no active listings', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            jurisdictionId,
            {
              multiselectQuestion: {
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
            true,
          ),
        });

        const listingData = await listingFactory(jurisdictionId, prisma, {
          multiselectQuestions: [multiselectQuestion],
          status: ListingsStatusEnum.closed,
        });
        await prisma.listings.create({
          data: listingData,
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retire')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);

        const updatedData = await prisma.multiselectQuestions.findUnique({
          select: { status: true },
          where: { id: multiselectQuestion.id },
        });
        expect(updatedData.status).toEqual(
          MultiselectQuestionsStatusEnum.retired,
        );
      });

      it('should set toRetire a multiselectQuestion in the active status with active listings', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(
            jurisdictionId,
            {
              multiselectQuestion: {
                status: MultiselectQuestionsStatusEnum.active,
              },
            },
            true,
          ),
        });

        const listingData = await listingFactory(jurisdictionId, prisma, {
          multiselectQuestions: [multiselectQuestion],
          status: ListingsStatusEnum.active,
        });
        await prisma.listings.create({
          data: listingData,
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retire')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);

        const updatedData = await prisma.multiselectQuestions.findUnique({
          select: { status: true },
          where: { id: multiselectQuestion.id },
        });
        expect(updatedData.status).toEqual(
          MultiselectQuestionsStatusEnum.toRetire,
        );
      });

      it('should throw error when retire endpoint is hit with an multiselectQuestion not in active status', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retire')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestion.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(400);

        expect(res.body.message).toEqual(
          "status 'draft' can only change to 'visible'",
        );
      });

      it('should throw error when retire endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retire')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(404);

        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });
    });

    describe('retireMultiselectQuestions', () => {
      it('should retire multiselectQuestions in toRetire status with no active listings', async () => {
        const jurisdictionAll = await prisma.jurisdictions.create({
          data: jurisdictionFactory('enableV2 juris retire all', {
            featureFlags: [FeatureFlagEnum.enableV2MSQ],
          }),
        });
        const multiselectQuestionClosedListing =
          await prisma.multiselectQuestions.create({
            data: multiselectQuestionFactory(
              jurisdictionAll.id,
              {
                multiselectQuestion: {
                  status: MultiselectQuestionsStatusEnum.toRetire,
                },
              },
              true,
            ),
          });
        const multiselectQuestionNoListing =
          await prisma.multiselectQuestions.create({
            data: multiselectQuestionFactory(
              jurisdictionAll.id,
              {
                multiselectQuestion: {
                  status: MultiselectQuestionsStatusEnum.toRetire,
                },
              },
              true,
            ),
          });

        const listingData = await listingFactory(jurisdictionId, prisma, {
          multiselectQuestions: [multiselectQuestionClosedListing],
          status: ListingsStatusEnum.closed,
        });
        await prisma.listings.create({
          data: listingData,
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retireMultiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);

        const updatedDataA = await prisma.multiselectQuestions.findUnique({
          select: { status: true },
          where: { id: multiselectQuestionClosedListing.id },
        });
        expect(updatedDataA.status).toEqual(
          MultiselectQuestionsStatusEnum.retired,
        );

        const updatedDataB = await prisma.multiselectQuestions.findUnique({
          select: { status: true },
          where: { id: multiselectQuestionNoListing.id },
        });
        expect(updatedDataB.status).toEqual(
          MultiselectQuestionsStatusEnum.retired,
        );
      });

      it('should not retire multiselectQuestions in toRetire status with active listings', async () => {
        const jurisdictionSome = await prisma.jurisdictions.create({
          data: jurisdictionFactory('enableV2 juris retire some', {
            featureFlags: [FeatureFlagEnum.enableV2MSQ],
          }),
        });
        const multiselectQuestionActiveListing =
          await prisma.multiselectQuestions.create({
            data: multiselectQuestionFactory(
              jurisdictionSome.id,
              {
                multiselectQuestion: {
                  status: MultiselectQuestionsStatusEnum.toRetire,
                },
              },
              true,
            ),
          });
        const multiselectQuestionNoListing =
          await prisma.multiselectQuestions.create({
            data: multiselectQuestionFactory(
              jurisdictionSome.id,
              {
                multiselectQuestion: {
                  status: MultiselectQuestionsStatusEnum.toRetire,
                },
              },
              true,
            ),
          });

        const listingData = await listingFactory(jurisdictionId, prisma, {
          multiselectQuestions: [multiselectQuestionActiveListing],
          status: ListingsStatusEnum.active,
        });
        await prisma.listings.create({
          data: listingData,
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions/retireMultiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);

        const updatedDataActiveListing =
          await prisma.multiselectQuestions.findUnique({
            select: { status: true },
            where: { id: multiselectQuestionActiveListing.id },
          });
        expect(updatedDataActiveListing.status).toEqual(
          MultiselectQuestionsStatusEnum.toRetire,
        );

        const updatedDataNoListing =
          await prisma.multiselectQuestions.findUnique({
            select: { status: true },
            where: { id: multiselectQuestionNoListing.id },
          });
        expect(updatedDataNoListing.status).toEqual(
          MultiselectQuestionsStatusEnum.retired,
        );
      });
    });

    describe('retrieve', () => {
      it('should throw error when retrieve endpoint is hit with nonexistent id', async () => {
        const id = randomUUID();
        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(404);

        expect(res.body.message).toEqual(
          `multiselectQuestionId ${id} was requested but not found`,
        );
      });

      it('should get multiselect question when retrieve endpoint is called and id exists', async () => {
        const multiselectQuestion = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${multiselectQuestion.id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.name).toEqual(multiselectQuestion.name);
      });
    });
  });
});
