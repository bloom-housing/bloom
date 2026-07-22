import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('Translation Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;
  let jurisdictionName: string;
  let jurisdictionBId: string;
  let adminCookies = '';
  let jurisAdminCookies = '';

  const passkey = { passkey: process.env.API_PASS_KEY || '' };

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
    await prisma.$disconnect();
    await app.close();
  });

  it('returns the public overrides for a jurisdiction and caches the response', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/translations/jurisdictions/${jurisdictionId}?site=public&language=en`,
      )
      .set(passkey)
      .expect(200);

    expect(res.body).toEqual({ 'region.name': 'Bloomington' });
    // Scope isolation: the partner-only key must not leak into a public response.
    expect(res.body['partners.only']).toBeUndefined();
    expect(res.headers['cache-control']).toEqual(
      'public, s-maxage=300, stale-while-revalidate=600',
    );
  });

  it('layers the requested language over the English default', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/translations/jurisdictions/${jurisdictionId}?site=public&language=es`,
      )
      .set(passkey)
      .expect(200);

    expect(res.body).toEqual({ 'region.name': 'Bloomington ES' });
  });

  it('resolves overrides by jurisdiction name', async () => {
    const res = await request(app.getHttpServer())
      .get(`/translations/byName/${jurisdictionName}?site=public&language=en`)
      .set(passkey)
      .expect(200);

    expect(res.body).toEqual({ 'region.name': 'Bloomington' });
  });

  it('returns the global Partners overrides', async () => {
    const res = await request(app.getHttpServer())
      .get(`/translations?language=en`)
      .set(passkey)
      .expect(200);

    expect(res.body['partners.brand']).toEqual('Bloom');
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

  describe('admin raw CRUD', () => {
    const enScope = () =>
      `/translations/jurisdictions/${jurisdictionId}/raw/public/en`;
    const esScope = () =>
      `/translations/jurisdictions/${jurisdictionId}/raw/public/es`;

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

      const row = res.body.find((r) => r.key === 'footer.title');
      expect(row.value).toEqual('Footer Title');
      expect(row.origin).toEqual('human');
      expect(row.stale).toBe(false);
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

    it('lets a jurisdictional admin write its own jurisdiction but not another', async () => {
      await request(app.getHttpServer())
        .put(enScope())
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'juris.ok', value: 'ok' }] })
        .expect(200);

      await request(app.getHttpServer())
        .put(`/translations/jurisdictions/${jurisdictionBId}/raw/public/en`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ edits: [{ key: 'juris.bad', value: 'bad' }] })
        .expect(403);
    });
  });
});
