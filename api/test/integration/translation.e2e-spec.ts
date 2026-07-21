import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';

describe('Translation Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;
  let jurisdictionName: string;

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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('returns the public overrides for a jurisdiction and caches the response', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/jurisdictions/${jurisdictionId}/translations?site=public&language=en`,
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
        `/jurisdictions/${jurisdictionId}/translations?site=public&language=es`,
      )
      .set(passkey)
      .expect(200);

    expect(res.body).toEqual({ 'region.name': 'Bloomington ES' });
  });

  it('resolves overrides by jurisdiction name', async () => {
    const res = await request(app.getHttpServer())
      .get(
        `/jurisdictions/byName/${jurisdictionName}/translations?site=public&language=en`,
      )
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
      .get(`/jurisdictions/${jurisdictionId}/translations?language=en`)
      .set(passkey)
      .expect(400);
  });

  it('returns 404 for an unknown jurisdiction id', async () => {
    await request(app.getHttpServer())
      .get(
        `/jurisdictions/${randomUUID()}/translations?site=public&language=en`,
      )
      .set(passkey)
      .expect(404);
  });
});
