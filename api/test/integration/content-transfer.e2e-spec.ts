import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { sourceHash } from '../../src/utilities/translation-source-hash';

describe('Content Transfer Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sourceId: string;
  let sourceName: string;
  let targetId: string;
  let targetName: string;
  let adminCookies = '';
  let jurisAdminCookies = '';

  const passkey = { passkey: process.env.API_PASS_KEY || '' };

  const login = async (email: string) =>
    (
      await request(app.getHttpServer())
        .post('/auth/login')
        .set(passkey)
        .send({ email, password: 'Abcdef12345!' } as Login)
        .expect(201)
    ).headers['set-cookie'];

  const exportSource = async () =>
    (
      await request(app.getHttpServer())
        .get(`/contentTransfer/jurisdictions/${sourceId}/export`)
        .set(passkey)
        .set('Cookie', adminCookies)
        .expect(200)
    ).body;

  const asImport = (
    file: Record<string, unknown>,
    jurisdictionName: string,
  ) => {
    const { assets, exportedAt, ...rest } = file;
    void assets;
    void exportedAt;
    return { ...rest, jurisdictionName };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();

    const source = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    sourceId = source.id;
    sourceName = source.name;
    await prisma.jurisdictions.update({
      where: { id: sourceId },
      data: { brand: { primary: { base: '#773E98' } } },
    });
    await prisma.translationStrings.createMany({
      data: [
        {
          jurisdictionId: sourceId,
          site: SiteEnum.public,
          language: LanguagesEnum.es,
          key: 'nav.listings',
          value: 'Listados',
          origin: TranslationOrigin.machine,
          sourceHash: sourceHash('Listings'),
        },
        {
          jurisdictionId: sourceId,
          site: SiteEnum.email,
          language: LanguagesEnum.en,
          key: 'footer.line',
          value: 'A footer line',
          origin: TranslationOrigin.human,
        },
      ],
    });
    await prisma.jurisdictionContent.createMany({
      data: [
        {
          jurisdictionId: sourceId,
          language: LanguagesEnum.en,
          disclaimers: {
            privacyHtml: '<p>Privacy</p>',
            disclaimerHtml: '<p>Disclaimer</p>',
          },
          footer: { textSectionsHtml: ['<p>Footer</p>'] },
        },
        {
          jurisdictionId: sourceId,
          language: LanguagesEnum.es,
          // The content editor stores an emptied html field as null and still stamps its hash.
          disclaimers: {
            privacyHtml: '<p>Privacidad</p>',
            disclaimerHtml: null,
            _sourceHashes: {
              privacyHtml: sourceHash('<p>Privacy</p>'),
              disclaimerHtml: sourceHash('<p>Disclaimer</p>'),
            },
          },
        },
      ],
    });

    const target = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    targetId = target.id;
    targetName = target.name;
    await prisma.translationStrings.create({
      data: {
        jurisdictionId: targetId,
        site: SiteEnum.public,
        language: LanguagesEnum.es,
        key: 'nav.old',
        value: 'Viejo',
      },
    });

    const admin = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    adminCookies = await login(admin.email);

    const jurisAdmin = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isJurisdictionalAdmin: true },
        jurisdictionIds: [sourceId, targetId],
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    jurisAdminCookies = await login(jurisAdmin.email);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('export', () => {
    it("exports a jurisdiction's strings, stored content and brand", async () => {
      const file = await exportSource();

      expect(file).toEqual(
        expect.objectContaining({
          format: 'bloom-content-transfer',
          version: 1,
          jurisdictionName: sourceName,
          brand: {
            brand: { primary: { base: '#773E98' } },
            logoFileId: null,
            faviconFileId: null,
          },
          assets: [],
        }),
      );
      expect(file.translations).toHaveLength(2);
      expect(file.content[1].disclaimers._sourceHashes).toEqual({
        privacyHtml: sourceHash('<p>Privacy</p>'),
        disclaimerHtml: sourceHash('<p>Disclaimer</p>'),
      });
    });

    it('refuses a request without a user', async () => {
      await request(app.getHttpServer())
        .get(`/contentTransfer/jurisdictions/${sourceId}/export`)
        .set(passkey)
        .expect(403);
    });

    it('refuses a jurisdictional admin', async () => {
      await request(app.getHttpServer())
        .get(`/contentTransfer/jurisdictions/${sourceId}/export`)
        .set(passkey)
        .set('Cookie', jurisAdminCookies)
        .expect(403);
      await request(app.getHttpServer())
        .get('/contentTransfer/global/export')
        .set(passkey)
        .set('Cookie', jurisAdminCookies)
        .expect(403);
    });
  });

  describe('import', () => {
    // The stored rows went through no editor, so this also checks that they pass the import's rules.
    it('previews no changes for a file imported back into its own jurisdiction', async () => {
      const file = await exportSource();

      const res = await request(app.getHttpServer())
        .post('/contentTransfer/import/preview')
        .set(passkey)
        .set('Cookie', adminCookies)
        .send(asImport(file, sourceName))
        .expect(200);

      expect(res.body).toEqual({
        jurisdictionName: sourceName,
        translations: [],
        content: [],
        brand: { fields: [], logo: null, favicon: null },
      });
    });

    it("replaces another jurisdiction's strings, content and brand", async () => {
      const file = await exportSource();

      const preview = await request(app.getHttpServer())
        .post('/contentTransfer/import/preview')
        .set(passkey)
        .set('Cookie', adminCookies)
        .send(asImport(file, targetName))
        .expect(200);
      expect(preview.body.translations).toEqual([
        {
          site: SiteEnum.email,
          language: LanguagesEnum.en,
          added: 1,
          changed: 0,
          removed: 0,
        },
        {
          site: SiteEnum.public,
          language: LanguagesEnum.es,
          added: 1,
          changed: 0,
          removed: 1,
        },
      ]);

      await request(app.getHttpServer())
        .post('/contentTransfer/import')
        .set(passkey)
        .set('Cookie', adminCookies)
        .send(asImport(file, targetName))
        .expect(200);

      const strings = await prisma.translationStrings.findMany({
        where: { jurisdictionId: targetId },
        orderBy: { key: 'asc' },
      });
      expect(
        strings.map(({ key, value, origin, sourceHash: hash }) => ({
          key,
          value,
          origin,
          hash,
        })),
      ).toEqual([
        {
          key: 'footer.line',
          value: 'A footer line',
          origin: TranslationOrigin.human,
          hash: null,
        },
        {
          key: 'nav.listings',
          value: 'Listados',
          origin: TranslationOrigin.machine,
          hash: sourceHash('Listings'),
        },
      ]);

      const content = await prisma.jurisdictionContent.findMany({
        where: { jurisdictionId: targetId },
        orderBy: { language: 'asc' },
      });
      expect(content.map((row) => row.language)).toEqual([
        LanguagesEnum.en,
        LanguagesEnum.es,
      ]);
      expect(content[1].disclaimers).toEqual({
        privacyHtml: '<p>Privacidad</p>',
        disclaimerHtml: null,
        _sourceHashes: {
          privacyHtml: sourceHash('<p>Privacy</p>'),
          disclaimerHtml: sourceHash('<p>Disclaimer</p>'),
        },
      });
      expect(content[1].faq).toBeNull();

      const target = await prisma.jurisdictions.findUnique({
        where: { id: targetId },
      });
      expect(target.brand).toEqual({ primary: { base: '#773E98' } });

      expect(
        await prisma.translationStrings.count({
          where: { jurisdictionId: sourceId },
        }),
      ).toEqual(2);
    });

    it('refuses a translation with no value before the service sees it', async () => {
      const file = await exportSource();
      file.translations[0].value = null;

      await request(app.getHttpServer())
        .post('/contentTransfer/import/preview')
        .set(passkey)
        .set('Cookie', adminCookies)
        .send(asImport(file, sourceName))
        .expect(400);
    });

    it('refuses a jurisdictional admin', async () => {
      const file = await exportSource();

      await request(app.getHttpServer())
        .post('/contentTransfer/import')
        .set(passkey)
        .set('Cookie', jurisAdminCookies)
        .send(asImport(file, targetName))
        .expect(403);
    });
  });
});
