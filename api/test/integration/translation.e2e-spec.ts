import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { readFileSync } from 'fs';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { baseTranslationRows } from '../../src/locales/email-translations';

describe('Translation Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;
  let jurisdictionName: string;
  let jurisdictionBId: string;
  let adminCookies = '';
  let jurisAdminCookies = '';

  const passkey = { passkey: process.env.API_PASS_KEY || '' };

  const enScope = () =>
    `/translations/jurisdictions/${jurisdictionId}/raw/public/en`;
  const esScope = () =>
    `/translations/jurisdictions/${jurisdictionId}/raw/public/es`;
  const globalScope = '/translations/partners/raw/en';
  const GLOBAL_TEST_KEY_PREFIX = 'e2e.partners.';

  // Global rows have no jurisdiction, so unlike the jurisdiction-scoped fixtures they are not
  // isolated by a fresh jurisdiction each run. They would otherwise collide on the NULLS NOT
  // DISTINCT unique index on a re-run, and stay in the database a dev server reads.
  const clearGlobalRows = () =>
    prisma.translationStrings.deleteMany({
      where: {
        jurisdictionId: null,
        OR: [
          { key: 'partners.brand' },
          { key: { startsWith: GLOBAL_TEST_KEY_PREFIX } },
        ],
      },
    });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    jurisdictionId = jurisdiction.id;
    jurisdictionName = jurisdiction.name;

    await clearGlobalRows();

    await prisma.translationStrings.createMany({
      data: [
        // Public overrides for this jurisdiction (English default + Spanish).
        {
          jurisdictionId,
          language: LanguagesEnum.en,
          site: SiteEnum.public,
          key: 'region.name',
          value: 'Bloomington',
        },
        {
          jurisdictionId,
          language: LanguagesEnum.es,
          site: SiteEnum.public,
          key: 'region.name',
          value: 'Bloomington ES',
        },
        // Partner override for the same jurisdiction; must not appear in a public read.
        {
          jurisdictionId,
          language: LanguagesEnum.en,
          site: SiteEnum.partners,
          key: 'partners.only',
          value: 'partners value',
        },
        // Global Partners layer (jurisdiction-independent).
        {
          jurisdictionId: null,
          language: LanguagesEnum.en,
          site: SiteEnum.partners,
          key: 'partners.brand',
          value: 'Bloom',
        },
      ],
    });

    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    jurisdictionBId = jurisdictionB.id;

    const admin = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    adminCookies = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .set(passkey)
        .send({ email: admin.email, password: 'Abcdef12345!' } as Login)
        .expect(201)
    ).headers['set-cookie'];

    const jurisAdmin = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isJurisdictionalAdmin: true },
        jurisdictionIds: [jurisdictionId],
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    jurisAdminCookies = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .set(passkey)
        .send({ email: jurisAdmin.email, password: 'Abcdef12345!' } as Login)
        .expect(201)
    ).headers['set-cookie'];
  });

  afterAll(async () => {
    await clearGlobalRows();
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /translations/jurisdictions/:jurisdictionId', () => {
    it('returns the public overrides for a jurisdiction and caches the response', async () => {
      const res = await request(app.getHttpServer())
        .get(
          `/translations/jurisdictions/${jurisdictionId}?site=public&language=en`,
        )
        .set(passkey)
        .expect(200);

      expect(res.body).toEqual({ en: { 'region.name': 'Bloomington' } });
      // Scope isolation: the partner-only key must not leak into a public response.
      expect(res.body.en['partners.only']).toBeUndefined();
      expect(res.headers['cache-control']).toEqual(
        'public, s-maxage=300, stale-while-revalidate=600',
      );
    });

    it('returns each language apart, so a consumer can layer them itself', async () => {
      const res = await request(app.getHttpServer())
        .get(
          `/translations/jurisdictions/${jurisdictionId}?site=public&language=es`,
        )
        .set(passkey)
        .expect(200);

      expect(res.body).toEqual({
        en: { 'region.name': 'Bloomington' },
        es: { 'region.name': 'Bloomington ES' },
      });
    });

    it('rejects a jurisdiction read that omits the site', async () => {
      await request(app.getHttpServer())
        .get(`/translations/jurisdictions/${jurisdictionId}?language=en`)
        .set(passkey)
        .expect(400);
    });

    it('returns 404 for an unknown jurisdiction id', async () => {
      await request(app.getHttpServer())
        .get(
          `/translations/jurisdictions/${randomUUID()}?site=public&language=en`,
        )
        .set(passkey)
        .expect(404);
    });
  });

  describe('GET /translations/byName/:jurisdictionName', () => {
    it('resolves overrides by jurisdiction name', async () => {
      const res = await request(app.getHttpServer())
        .get(`/translations/byName/${jurisdictionName}?site=public&language=en`)
        .set(passkey)
        .expect(200);

      expect(res.body).toEqual({ en: { 'region.name': 'Bloomington' } });
    });
  });

  describe('GET /translations', () => {
    it('returns the global Partners overrides', async () => {
      const res = await request(app.getHttpServer())
        .get(`/translations?language=en`)
        .set(passkey)
        .expect(200);

      expect(res.body.en['partners.brand']).toEqual('Bloom');
    });
  });

  describe('migration 71, moving legacy email overrides', () => {
    const migrationSql = readFileSync(
      join(
        __dirname,
        '../../prisma/migrations/71_move_jurisdiction_email_translations/migration.sql',
      ),
      'utf8',
    );

    let legacyJurisdictionId: string;
    let legacyGenericId: string;

    beforeAll(async () => {
      const legacy = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      legacyJurisdictionId = legacy.id;

      const generic = await prisma.translations.create({
        data: {
          jurisdictionId: null,
          language: LanguagesEnum.en,
          translations: {
            footer: { line1: 'Bloom', thankYou: 'Thank you' },
            confirmation: { subject: 'Shared subject' },
          },
        },
      });
      legacyGenericId = generic.id;
      await prisma.translations.create({
        data: {
          jurisdictionId: legacyJurisdictionId,
          language: LanguagesEnum.en,
          translations: {
            // Same as the generic row, so these are not this jurisdiction's own.
            footer: { line1: 'Bloom', thankYou: 'Thank you' },
            // Differs, so it is.
            confirmation: { subject: 'Their subject' },
            // Absent from the generic row, so it is theirs too.
            lotteryAvailable: { header: 'Their header' },
          },
        },
      });

      await prisma.$executeRawUnsafe(migrationSql);
    });

    afterAll(async () => {
      await prisma.translationStrings.deleteMany({
        where: { jurisdictionId: legacyJurisdictionId },
      });
      await prisma.translations.deleteMany({
        where: { jurisdictionId: legacyJurisdictionId },
      });
      await prisma.translations.delete({ where: { id: legacyGenericId } });
      await prisma.jurisdictions.delete({
        where: { id: legacyJurisdictionId },
      });
    });

    it('moves only the keys that differ from the generic row', async () => {
      const rows = await prisma.translationStrings.findMany({
        where: { jurisdictionId: legacyJurisdictionId, site: SiteEnum.email },
        select: { key: true, value: true },
        orderBy: { key: 'asc' },
      });

      expect(rows).toEqual([
        { key: 'confirmation.subject', value: 'Their subject' },
        { key: 'lotteryAvailable.header', value: 'Their header' },
      ]);
    });

    it('leaves the generic rows in place and off the email scope', async () => {
      const generic = await prisma.translationStrings.findMany({
        where: { jurisdictionId: null, site: SiteEnum.email },
      });
      expect(generic).toEqual([]);

      const legacyGeneric = await prisma.translations.findFirst({
        where: { id: legacyGenericId },
      });
      expect(legacyGeneric).not.toBeNull();
    });

    it('is safe to run twice', async () => {
      await prisma.$executeRawUnsafe(migrationSql);

      const rows = await prisma.translationStrings.findMany({
        where: { jurisdictionId: legacyJurisdictionId, site: SiteEnum.email },
      });
      expect(rows).toHaveLength(2);
    });
  });

  describe('staleness on the email scope', () => {
    const emailEs = () =>
      `/translations/jurisdictions/${jurisdictionId}/raw/email/es`;
    const emailEn = () =>
      `/translations/jurisdictions/${jurisdictionId}/raw/email/en`;

    it('marks a translation stale once the english it came from changes', async () => {
      // t.hello ships as "Hello", so the spanish row records that as its source.
      await request(app.getHttpServer())
        .put(emailEs())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 't.hello', value: 'Hola' }] })
        .expect(200);

      const fresh = await request(app.getHttpServer())
        .get(emailEs())
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(fresh.body.find((row) => row.key === 't.hello').stale).toBe(false);

      await request(app.getHttpServer())
        .put(emailEn())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 't.hello', value: 'Howdy' }] })
        .expect(200);

      const after = await request(app.getHttpServer())
        .get(emailEs())
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(after.body.find((row) => row.key === 't.hello').stale).toBe(true);
    });
  });

  describe('email overrides are not served by the public reads', () => {
    it('rejects site=email on the jurisdiction read', async () => {
      await request(app.getHttpServer())
        .get(
          `/translations/jurisdictions/${jurisdictionId}?site=email&language=en`,
        )
        .set(passkey)
        .expect(400);
    });

    it('rejects site=email on the byName read', async () => {
      await request(app.getHttpServer())
        .get(
          `/translations/byName/${encodeURIComponent(
            jurisdictionName,
          )}?site=email&language=en`,
        )
        .set(passkey)
        .expect(400);
    });

    it('still serves the site scopes', async () => {
      await request(app.getHttpServer())
        .get(
          `/translations/jurisdictions/${jurisdictionId}?site=public&language=en`,
        )
        .set(passkey)
        .expect(200);
    });
  });

  describe('GET /translations/base/email/:language', () => {
    // Derived from the shipped strings, so a copy edit does not fail these.
    const shipped = (language: LanguagesEnum) =>
      Object.fromEntries(
        baseTranslationRows(language).map((row) => [row.key, row.value]),
      );

    it.each(Object.values(LanguagesEnum))(
      'serves the strings shipped for %s',
      async (language) => {
        const res = await request(app.getHttpServer())
          .get(`/translations/base/email/${language}`)
          .set(passkey)
          .expect(200);

        expect(res.body).toEqual(shipped(language));
      },
    );

    it('omits a key the language does not translate, rather than serving english', async () => {
      const english = shipped(LanguagesEnum.en);
      const spanish = shipped(LanguagesEnum.es);
      const untranslated = Object.keys(english).find(
        (key) => spanish[key] === undefined,
      );
      expect(untranslated).toBeDefined();

      const res = await request(app.getHttpServer())
        .get('/translations/base/email/es')
        .set(passkey)
        .expect(200);

      expect(res.body[untranslated]).toBeUndefined();
    });

    it('rejects a language outside the enum', async () => {
      await request(app.getHttpServer())
        .get('/translations/base/email/klingon')
        .set(passkey)
        .expect(400);
    });
  });

  describe('PUT /translations/jurisdictions/:jurisdictionId/raw/:site/:language', () => {
    it('upserts keys and returns them with origin via the raw get', async () => {
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'footer.title', value: 'Footer Title' }] })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      expect(res.body).toContainEqual(
        expect.objectContaining({
          key: 'footer.title',
          value: 'Footer Title',
          origin: 'human',
          stale: false,
        }),
      );
    });

    it('reports only the stale-lock key as a 409 and writes the rest', async () => {
      const res = await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key: 'region.name',
              value: 'Changed',
              lastUpdatedAt: new Date('2000-01-01').toISOString(),
            },
            { key: 'new.key', value: 'New Value' },
          ],
        })
        .expect(409);

      expect(res.body.conflicts).toEqual(['region.name']);

      const getRes = await request(app.getHttpServer())
        .get(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(getRes.body.find((r) => r.key === 'new.key').value).toEqual(
        'New Value',
      );
      // the stale write did not land
      expect(getRes.body.find((r) => r.key === 'region.name').value).toEqual(
        'Bloomington',
      );
    });

    it('tracks staleness across an english edit and a re-save', async () => {
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'greeting', value: 'Hello' }] })
        .expect(200);
      await request(app.getHttpServer())
        .put(esScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'greeting', value: 'Hola' }] })
        .expect(200);

      let es = (
        await request(app.getHttpServer())
          .get(esScope())
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;
      expect(es.find((r) => r.key === 'greeting').stale).toBe(false);

      const enGreeting = (
        await request(app.getHttpServer())
          .get(enScope())
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body.find((r) => r.key === 'greeting');
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key: 'greeting',
              value: 'Hi there',
              lastUpdatedAt: enGreeting.updatedAt,
            },
          ],
        })
        .expect(200);

      es = (
        await request(app.getHttpServer())
          .get(esScope())
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;
      const esGreeting = es.find((r) => r.key === 'greeting');
      expect(esGreeting.stale).toBe(true);

      await request(app.getHttpServer())
        .put(esScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key: 'greeting',
              value: 'Hola de nuevo',
              lastUpdatedAt: esGreeting.updatedAt,
            },
          ],
        })
        .expect(200);

      es = (
        await request(app.getHttpServer())
          .get(esScope())
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;
      expect(es.find((r) => r.key === 'greeting').stale).toBe(false);
    });

    it('forbids a jurisdictional admin from writing translations', async () => {
      // Editing translations is limited to the admin role, which has access to every jurisdiction
      // in the system. A jurisdictional admin is denied its own jurisdiction and any other.
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'juris.ok', value: 'ok' }] })
        .expect(403);

      await request(app.getHttpServer())
        .put(`/translations/jurisdictions/${jurisdictionBId}/raw/public/en`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'juris.bad', value: 'bad' }] })
        .expect(403);
    });
  });

  describe('DELETE /translations/jurisdictions/:jurisdictionId/raw/:site/:language/:key', () => {
    it('deletes a key override', async () => {
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'temp.key', value: 'Temp' }] })
        .expect(200);
      await request(app.getHttpServer())
        .delete(
          `/translations/jurisdictions/${jurisdictionId}/raw/public/en/temp.key`,
        )
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(enScope())
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(res.body.find((r) => r.key === 'temp.key')).toBeUndefined();
    });
  });

  describe('PUT /translations/partners/raw/:language', () => {
    it('upserts global keys and returns them via the raw get', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key: `${GLOBAL_TEST_KEY_PREFIX}title`,
              value: 'Partners Portal',
            },
          ],
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      expect(res.body).toContainEqual(
        expect.objectContaining({
          key: `${GLOBAL_TEST_KEY_PREFIX}title`,
          value: 'Partners Portal',
          origin: 'human',
          stale: false,
        }),
      );
    });

    it('reports only the stale-lock key as a 409 and writes the rest', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            { key: `${GLOBAL_TEST_KEY_PREFIX}locked`, value: 'Original' },
          ],
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key: `${GLOBAL_TEST_KEY_PREFIX}locked`,
              value: 'Changed',
              lastUpdatedAt: new Date('2000-01-01').toISOString(),
            },
            { key: `${GLOBAL_TEST_KEY_PREFIX}fresh`, value: 'New Value' },
          ],
        })
        .expect(409);

      expect(res.body.conflicts).toEqual([`${GLOBAL_TEST_KEY_PREFIX}locked`]);

      const getRes = await request(app.getHttpServer())
        .get(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(
        getRes.body.find((r) => r.key === `${GLOBAL_TEST_KEY_PREFIX}fresh`)
          .value,
      ).toEqual('New Value');
      // the stale write did not land
      expect(
        getRes.body.find((r) => r.key === `${GLOBAL_TEST_KEY_PREFIX}locked`)
          .value,
      ).toEqual('Original');
    });

    it('applies to every jurisdiction through the public read', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            { key: `${GLOBAL_TEST_KEY_PREFIX}shared`, value: 'Every Juris' },
          ],
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/translations?language=en')
        .set(passkey)
        .expect(200);

      expect(res.body.en[`${GLOBAL_TEST_KEY_PREFIX}shared`]).toEqual(
        'Every Juris',
      );
    });

    it('forbids a jurisdictional admin from writing the global scope', async () => {
      await request(app.getHttpServer())
        .get(globalScope)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .expect(403);

      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({
          edits: [{ key: `${GLOBAL_TEST_KEY_PREFIX}blocked`, value: 'bad' }],
        })
        .expect(403);
    });

    it('refuses an anonymous write, passkey alone is not enough', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set(passkey)
        .send({
          edits: [{ key: `${GLOBAL_TEST_KEY_PREFIX}anon`, value: 'bad' }],
        })
        .expect(403);
    });

    it('rejects a key longer than the column index allows', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'k'.repeat(256), value: 'Too long a key' }] })
        .expect(400);
    });

    it('rejects a language outside the supported set', async () => {
      await request(app.getHttpServer())
        .put('/translations/partners/raw/xx')
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [{ key: `${GLOBAL_TEST_KEY_PREFIX}badlang`, value: 'x' }],
        })
        .expect(400);
    });

    it('tracks staleness in the global scope across an english edit', async () => {
      const key = `${GLOBAL_TEST_KEY_PREFIX}stale`;
      const englishScope = globalScope;
      const spanishScope = '/translations/partners/raw/es';

      await request(app.getHttpServer())
        .put(englishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key, value: 'Original English' }] })
        .expect(200);

      await request(app.getHttpServer())
        .put(spanishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ edits: [{ key, value: 'Original Spanish' }] })
        .expect(200);

      const beforeEdit = await request(app.getHttpServer())
        .get(spanishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(beforeEdit.body.find((r) => r.key === key).stale).toBe(false);

      const english = await request(app.getHttpServer())
        .get(englishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      await request(app.getHttpServer())
        .put(englishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [
            {
              key,
              value: 'Changed English',
              lastUpdatedAt: english.body.find((r) => r.key === key).updatedAt,
            },
          ],
        })
        .expect(200);

      const afterEdit = await request(app.getHttpServer())
        .get(spanishScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(afterEdit.body.find((r) => r.key === key).stale).toBe(true);
    });
  });

  describe('DELETE /translations/partners/raw/:language/:key', () => {
    it('deletes a global key override', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [{ key: `${GLOBAL_TEST_KEY_PREFIX}temp`, value: 'Temp' }],
        })
        .expect(200);
      await request(app.getHttpServer())
        .delete(`${globalScope}/${GLOBAL_TEST_KEY_PREFIX}temp`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(
        res.body.find((r) => r.key === `${GLOBAL_TEST_KEY_PREFIX}temp`),
      ).toBeUndefined();
    });

    it('forbids a jurisdictional admin from deleting a global key', async () => {
      await request(app.getHttpServer())
        .put(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          edits: [{ key: `${GLOBAL_TEST_KEY_PREFIX}guarded`, value: 'Keep' }],
        })
        .expect(200);

      await request(app.getHttpServer())
        .delete(`${globalScope}/${GLOBAL_TEST_KEY_PREFIX}guarded`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .expect(403);

      const res = await request(app.getHttpServer())
        .get(globalScope)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(
        res.body.find((r) => r.key === `${GLOBAL_TEST_KEY_PREFIX}guarded`)
          .value,
      ).toEqual('Keep');
    });
  });
});
