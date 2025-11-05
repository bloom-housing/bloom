import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { MultiselectQuestionCreate } from '../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionQueryParams } from '../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { MultiselectQuestionUpdate } from '../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { createAllFeatureFlags } from '../../prisma/seed-helpers/feature-flag-factory';

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

        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions?`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(2);
        const multiselectQuestions = res.body.map((value) => value.text);
        expect(multiselectQuestions).toContain(multiselectQuestionA.text);
        expect(multiselectQuestions).toContain(multiselectQuestionB.text);
      });

      it('should get multiselect questions from list endpoint when params are sent', async () => {
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
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
        expect(multiselectQuestions).toContain(multiselectQuestionA.text);
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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .put('/multiselectQuestions')
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestionA.id,
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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestionA.id,
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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.text).toEqual(multiselectQuestionA.text);
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
      it('should get multiselect questions from list endpoint when no params are sent', async () => {
        const jurisdictionB = await prisma.jurisdictions.create({
          data: jurisdictionFactory('enableV2 juris list', {
            featureFlags: [FeatureFlagEnum.enableV2MSQ],
          }),
        });

        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id, {}, true),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionB.id, {}, true),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions?`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.length).toBeGreaterThanOrEqual(2);
        const multiselectQuestions = res.body.map((value) => value.name);
        expect(multiselectQuestions).toContain(multiselectQuestionA.name);
        expect(multiselectQuestions).toContain(multiselectQuestionB.name);
      });

      it('should get multiselect questions from list endpoint when params are sent', async () => {
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });
        const multiselectQuestionB = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
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
        const multiselectQuestions = res.body.map((value) => value.name);
        expect(multiselectQuestions).toContain(multiselectQuestionA.name);
        expect(multiselectQuestions).toContain(multiselectQuestionB.name);
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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
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
            id: multiselectQuestionA.id,
            applicationSection: multiselectQuestionA.applicationSection,
            isExclusive: multiselectQuestionA.isExclusive,
            jurisdiction: { id: multiselectQuestionA.jurisdictionId },
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
            jurisdictions: [{ id: multiselectQuestionA.jurisdictionId }],
            text: multiselectQuestionA.text,
          } as MultiselectQuestionUpdate)
          .set('Cookie', cookies);
        // .expect(200);
        console.log(res);

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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });

        const res = await request(app.getHttpServer())
          .delete(`/multiselectQuestions`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .send({
            id: multiselectQuestionA.id,
          } as IdDTO)
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.success).toEqual(true);
      });
    });

    // describe('reActivate', () => {});

    // describe('retire', () => {});

    // describe('retireMultiselectQuestions', () => {});

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
        const multiselectQuestionA = await prisma.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdictionId, {}, true),
        });

        const res = await request(app.getHttpServer())
          .get(`/multiselectQuestions/${multiselectQuestionA.id}`)
          .set({ passkey: process.env.API_PASS_KEY || '' })
          .set('Cookie', cookies)
          .expect(200);

        expect(res.body.name).toEqual(multiselectQuestionA.name);
      });
    });
  });
});
