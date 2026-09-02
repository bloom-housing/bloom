import { INestApplication, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from '../../src/services/prisma.service';
import { AppModule } from '../../src/modules/app.module';
import { Login } from '../../src/dtos/auth/login.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { reservedCommunityTypeFactoryAll } from '../../prisma/seed-helpers/reserved-community-type-factory';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import dayjs from 'dayjs';
import { multiselectQuestionFactory } from '../../prisma/seed-helpers/multiselect-question-factory';

describe('Script Runner Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';
  let adminUserId: string;
  let logger: Logger;
  const httpServiceMock = { get: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    logger = moduleFixture.get<Logger>(Logger);

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
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        email: storedUser.email,
        password: 'Abcdef12345!',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
    adminUserId = storedUser.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('migrateTranslationOverridesToKeyRows endpoint', () => {
    const call = (body: Record<string, unknown>) =>
      request(app.getHttpServer())
        .put('/scriptRunner/migrateTranslationOverridesToKeyRows')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send(body);

    const valid = {
      jurisdictionName: 'nonexistent jurisdiction for this spec',
      commit: false,
      skipExisting: false,
    };

    it('refuses a jurisdictional admin, who has no grant on translations', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const jurisAdmin = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isJurisdictionalAdmin: true },
          jurisdictionIds: [jurisdiction.id],
          mfaEnabled: false,
          confirmedAt: new Date(),
        }),
      });
      const logIn = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: jurisAdmin.email,
          password: 'Abcdef12345!',
        } as Login)
        .expect(201);

      await request(app.getHttpServer())
        .put('/scriptRunner/migrateTranslationOverridesToKeyRows')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', logIn.headers['set-cookie'])
        .send({
          jurisdictionName: jurisdiction.name,
          commit: false,
          skipExisting: false,
        })
        .expect(403);
    });

    const KEY_PREFIX = 'spec.migration';

    const serveOverrides = (hero: string, title: string) =>
      httpServiceMock.get.mockImplementation((url: string) => {
        if (url.includes('locale_overrides/general.json')) {
          return of({ data: { [KEY_PREFIX]: { hero } } });
        }
        if (url.includes('overrides/general.json')) {
          return of({ data: { [KEY_PREFIX]: { title } } });
        }
        return throwError(
          () => new Error('Request failed with status code 404'),
        );
      });

    const storedRows = async () =>
      await prisma.translationStrings.findMany({
        where: { key: { startsWith: `${KEY_PREFIX}.` } },
        select: { jurisdictionId: true, site: true, key: true, value: true },
      });

    beforeEach(() => {
      serveOverrides('First hero', 'First title');
    });

    afterAll(async () => {
      await prisma.translationStrings.deleteMany({
        where: { key: { startsWith: `${KEY_PREFIX}.` } },
      });
    });

    it('writes the rows, then updates them on a second run', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const scriptName = `migrate translation overrides to key rows for ${jurisdiction.name}`;
      serveOverrides('First hero', 'First title');

      await call({
        jurisdictionName: jurisdiction.name,
        commit: true,
        skipExisting: false,
        languages: ['es'],
      }).expect(200);

      expect(await storedRows()).toEqual(
        expect.arrayContaining([
          {
            jurisdictionId: jurisdiction.id,
            site: 'public',
            key: `${KEY_PREFIX}.hero`,
            value: 'First hero',
          },
          {
            jurisdictionId: null,
            site: 'partners',
            key: `${KEY_PREFIX}.title`,
            value: 'First title',
          },
        ]),
      );

      await prisma.scriptRuns.delete({ where: { scriptName } });
      serveOverrides('Second hero', 'Second title');

      await call({
        jurisdictionName: jurisdiction.name,
        commit: true,
        skipExisting: false,
        languages: ['es'],
      }).expect(200);

      const rows = await storedRows();
      expect(rows).toHaveLength(2);
      expect(rows.map((row) => row.value).sort()).toEqual([
        'Second hero',
        'Second title',
      ]);
    });

    it('rejects a body with commit missing', async () => {
      // The validation pipe drops unknown properties, so a misspelled field must not
      // fall through to a default.
      const res = await call({
        jurisdictionName: 'Bloomington',
        skipExisting: false,
      }).expect(400);

      expect(JSON.stringify(res.body.message)).toContain('commit');
    });

    it('rejects a body with skipExisting missing', async () => {
      const res = await call({
        jurisdictionName: 'Bloomington',
        commit: false,
      }).expect(400);

      expect(JSON.stringify(res.body.message)).toContain('skipExisting');
    });

    // A body naming a jurisdiction that does not exist also answers 400, so each of these
    // asserts the field the pipe complained about.
    const rejects = async (body: Record<string, unknown>, field: string) => {
      const res = await call({ ...valid, ...body }).expect(400);

      expect(JSON.stringify(res.body.message)).toContain(field);
    };

    it('rejects a git ref that climbs out of the repository', async () => {
      await rejects(
        { gitRef: 'main/../../../attacker/bloom-fork/main' },
        'gitRef',
      );
    });

    it('rejects a git ref that is not a ref', async () => {
      await rejects({ gitRef: 'main; rm -rf /' }, 'gitRef');
    });

    it('rejects an override path that climbs out of the repository', async () => {
      await rejects(
        { publicPath: 'sites/public/../../../attacker/overrides' },
        'publicPath',
      );
    });

    it('rejects an override path that is absolute', async () => {
      await rejects({ partnersPath: '/etc/passwd' }, 'partnersPath');
    });

    it('rejects a repository url off the allowed host', async () => {
      await rejects(
        { repositoryUrl: 'https://169.254.169.254' },
        'repositoryUrl',
      );
    });

    it('rejects a repository url that is not https', async () => {
      await rejects({ repositoryUrl: 'http://example.com/x' }, 'repositoryUrl');
    });

    it('rejects a language list that is a bare string', async () => {
      await rejects({ languages: 'es' }, 'languages');
    });

    it('rejects an empty language list', async () => {
      await rejects({ languages: [] }, 'languages');
    });

    it('rejects a language outside the enum', async () => {
      await rejects({ languages: ['klingon'] }, 'languages');
    });

    it('rejects a missing jurisdiction name', async () => {
      const res = await call({ commit: false, skipExisting: false }).expect(
        400,
      );

      expect(JSON.stringify(res.body.message)).toContain('jurisdictionName');
    });

    it('rejects an unknown jurisdiction, without recording a run', async () => {
      const res = await call(valid).expect(400);

      expect(res.body.message).toContain('does not exist');
      const recorded = await prisma.scriptRuns.findUnique({
        where: {
          scriptName: `migrate translation overrides to key rows for ${valid.jurisdictionName}`,
        },
      });
      expect(recorded).toBeNull();
    });

    it('refuses a jurisdiction whose run already succeeded', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await prisma.scriptRuns.create({
        data: {
          scriptName: `migrate translation overrides to key rows for ${jurisdiction.name}`,
          didScriptRun: true,
          triggeringUser: adminUserId,
        },
      });

      const res = await call({
        ...valid,
        jurisdictionName: jurisdiction.name,
        commit: true,
      }).expect(400);

      expect(res.body.message).toContain('already been run');
    });
  });

  describe('setInitialExpireAfterValues endpoint', () => {
    it('should not run if APPLICATION_DAYS_TILL_EXPIRY not set', async () => {
      process.env.APPLICATION_DAYS_TILL_EXPIRY = '';
      const res = await request(app.getHttpServer())
        .put(`/scriptRunner/setInitialExpireAfterValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(501);
      expect(res.body.message).toEqual(
        'APPLICATION_DAYS_TILL_EXPIRY env variable is not set',
      );
    });

    it('should set the expire_after value for applications on closed listings', async () => {
      process.env.APPLICATION_DAYS_TILL_EXPIRY = '90';
      const jurisData = jurisdictionFactory();
      const jurisdiction = await prisma.jurisdictions.create({
        data: {
          ...jurisData,
          name: `${jurisData.name} ${Math.floor(Math.random() * 100)}`,
        },
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const closedListing1 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
        closedAt: new Date('2024-04-28 00:00 -08:00'),
      });
      const createdClosedListing1 = await prisma.listings.create({
        data: closedListing1,
      });
      // Create all listings
      const closedListing2 = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.closed,
        closedAt: new Date('2025-06-01 00:00 -08:00'),
      });
      const createdClosedListing2 = await prisma.listings.create({
        data: closedListing2,
      });
      const reopenedListing = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.active,
        closedAt: new Date('2025-06-01 00:00 -08:00'),
      });
      const createdReopenedListing = await prisma.listings.create({
        data: reopenedListing,
      });
      const neverClosedListing = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.active,
        closedAt: undefined,
      });
      await prisma.listings.create({
        data: neverClosedListing,
      });
      // Create applications for closed listing 1
      const application1 = await applicationFactory({
        listingId: createdClosedListing1.id,
      });
      const app1 = await prisma.applications.create({
        data: application1,
      });
      await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing1.id,
        }),
      });
      await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing1.id,
        }),
      });
      // Create applications for closed listing 2
      const app2 = await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdClosedListing2.id,
        }),
      });
      // Create applications that shouldn't be updated
      const app3 = await prisma.applications.create({
        data: await applicationFactory({
          listingId: createdReopenedListing.id,
        }),
      });

      await request(app.getHttpServer())
        .put(`/scriptRunner/setInitialExpireAfterValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      // Can't validate the log because other tests can add closed listings
      // expect(logger.log).toBeCalledWith(
      //   'updating expireAfter for 2 closed listings',
      // );
      expect(logger.log).toBeCalledWith(
        `updated 3 applications for ${createdClosedListing1.id}`,
      );
      expect(logger.log).toBeCalledWith(
        `updated 1 applications for ${createdClosedListing2.id}`,
      );
      const afterUpdate = await prisma.applications.findFirst({
        where: { id: app1.id },
      });
      expect(afterUpdate.expireAfter.toISOString()).toEqual(
        '2024-07-27T08:00:00.000Z',
      );
      const afterUpdate2 = await prisma.applications.findFirst({
        where: { id: app2.id },
      });
      expect(afterUpdate2.expireAfter.toISOString()).toEqual(
        '2025-08-30T08:00:00.000Z',
      );
      const afterUpdate3 = await prisma.applications.findFirst({
        where: { id: app3.id },
      });
      expect(afterUpdate3.expireAfter).toBeNull();
    });
  });

  describe('setIsNewestApplicationValues endpoint', () => {
    it('should update only the newest applications', async () => {
      // create partner user that shouldn't be counted
      await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
        }),
      });
      // Create public users
      const user1 = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      const user2 = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      // create applications
      const notNewestApplication1 = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(10, 'day').toDate(),
        }),
      });
      const newestApplication = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(4, 'day').toDate(),
        }),
      });
      const notNewestApplication2 = await prisma.applications.create({
        data: await applicationFactory({
          userId: user1.id,
          createdAt: dayjs(new Date()).subtract(6, 'day').toDate(),
        }),
      });
      const user2Application = await prisma.applications.create({
        data: await applicationFactory({
          userId: user2.id,
        }),
      });
      await request(app.getHttpServer())
        .put(`/scriptRunner/setIsNewestApplicationValues`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      // Can't validate the log because other tests might add users
      // expect(logger.log).toBeCalledWith('total public user count 2');
      const updatedApplicationsUser1 = await prisma.applications.findMany({
        where: { userId: user1.id },
      });
      expect(
        updatedApplicationsUser1.find(
          (app) => app.id === notNewestApplication1.id,
        ).isNewest,
      ).toEqual(false);
      expect(
        updatedApplicationsUser1.find((app) => app.id === newestApplication.id)
          .isNewest,
      ).toEqual(true);
      expect(
        updatedApplicationsUser1.find(
          (app) => app.id === notNewestApplication2.id,
        ).isNewest,
      ).toEqual(false);

      expect(
        (
          await prisma.applications.findFirst({
            where: { id: user2Application.id },
          })
        ).isNewest,
      ).toEqual(true);
    });
  });

  describe('migrateMultiselectApplicationDataToRefactor endpoint', () => {
    it('should only migrate programs/preferences with data', async () => {
      // const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
      const listingData = await listingFactory(jurisdiction.id, prisma, {
        status: ListingsStatusEnum.active,
        closedAt: undefined,
      });
      const listing = await prisma.listings.create({
        data: listingData,
      });
      const preference1 = await prisma.multiselectQuestions.create({
        data: multiselectQuestionFactory(
          jurisdiction.id,
          {
            multiselectQuestion: {
              applicationSection:
                MultiselectQuestionsApplicationSectionEnum.preferences,
              description: 'description of msq migration preference',
              multiselectOptions: {
                createMany: {
                  data: [
                    {
                      name: 'msq migration preference option 1',
                      ordinal: 1,
                    },
                    {
                      name: 'msq migration preference option 2',
                      ordinal: 2,
                    },
                  ],
                },
              },
              text: 'msq migration preference text',
            },
          },
          true,
        ),
      });
      const app1 = await applicationFactory();
      await prisma.applications.create({
        data: { ...app1, preferences: [], programs: [] },
      });
      const app2 = await applicationFactory();
      await prisma.applications.create({
        data: { ...app2, preferences: '{}', programs: '[]' },
      });
      const app3 = await applicationFactory();
      await prisma.applications.create({
        data: { ...app3, preferences: [], programs: null },
      });
      const app4 = await applicationFactory({
        listingId: listing.id,
      });
      const createdApp4 = await prisma.applications.create({
        data: {
          ...app4,
        },
      });
      await prisma.applications.update({
        where: { id: createdApp4.id },
        data: {
          programs: {},
          preferences: [
            {
              multiselectQuestionId: preference1.id,
              key: 'msq migration preference text',
              claimed: true,
              options: [
                {
                  key: 'msq migration preference option 1',
                  checked: true,
                  extraData: [],
                },
              ],
            },
          ],
        },
      });

      await request(app.getHttpServer())
        .put(`/scriptRunner/migrateMultiselectApplicationDataToRefactor`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      // Only the one application is fetched from the database
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      // "updating 1 application's multiselect data",
      // );
      const updatedMultiselectData =
        await prisma.applicationSelections.findMany({
          include: {
            selections: { include: { multiselectOption: true } },
          },
          where: { applicationId: createdApp4.id },
        });
      expect(updatedMultiselectData.length).toEqual(1);
      expect(updatedMultiselectData[0].multiselectQuestionId).toEqual(
        preference1.id,
      );
      expect(
        updatedMultiselectData[0].selections[0].multiselectOption.name,
      ).toEqual('msq migration preference option 1');
    });
  });
});
