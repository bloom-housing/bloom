import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('Jurisdiction Content Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;
  let jurisdictionName: string;
  let emptyJurisdictionId: string;
  let jurisdictionBId: string;
  let adminCookies = '';
  let jurisAdminCookies = '';
  let publicUserCookies = '';

  const passkey = { passkey: process.env.API_PASS_KEY || '' };

  const adminScope = (language: string) =>
    `/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/${language}`;

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

    await prisma.jurisdictionContent.createMany({
      data: [
        {
          jurisdictionId,
          language: LanguagesEnum.en,
          footer: {
            textSectionsHtml: ['<p>EN footer</p>'],
            links: [{ id: 'l1', text: 'Home', href: '/' }],
          },
          contact: { phone: '555-0100' },
        },
        {
          jurisdictionId,
          language: LanguagesEnum.es,
          // Only the link text is translated; the rest falls back to English.
          footer: { links: [{ id: 'l1', text: 'Inicio', href: '/' }] },
        },
      ],
    });

    // A jurisdiction with no content row at all, for the 204 read.
    const emptyJurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    emptyJurisdictionId = emptyJurisdiction.id;

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

    // A logged-in user with no admin role, for the authorization boundary.
    const publicUser = await prisma.userAccounts.create({
      data: await userFactory({
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    publicUserCookies = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .set(passkey)
        .send({ email: publicUser.email, password: 'Abcdef12345!' } as Login)
        .expect(201)
    ).headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /jurisdictionContent/jurisdictions/:jurisdictionId', () => {
    it('returns the English content and caches the response', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}?language=en`)
        .set(passkey)
        .expect(200);

      expect(res.body.footer.links[0].text).toEqual('Home');
      expect(res.body.footer.textSectionsHtml).toEqual(['<p>EN footer</p>']);
      expect(res.body.contact.phone).toEqual('555-0100');
      expect(res.headers['cache-control']).toEqual(
        'public, s-maxage=300, stale-while-revalidate=600',
      );
    });

    it('folds the language row over the English default field by field', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}?language=es`)
        .set(passkey)
        .expect(200);

      // Translated where set, English fallback where not.
      expect(res.body.footer.links[0].text).toEqual('Inicio');
      expect(res.body.footer.textSectionsHtml).toEqual(['<p>EN footer</p>']);
      expect(res.body.contact.phone).toEqual('555-0100');
    });

    it('returns 204 when the jurisdiction has no content row', async () => {
      await request(app.getHttpServer())
        .get(
          `/jurisdictionContent/jurisdictions/${emptyJurisdictionId}?language=en`,
        )
        .set(passkey)
        .expect(204);
    });

    it('returns 404 for an unknown jurisdiction id', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${randomUUID()}?language=en`)
        .set(passkey)
        .expect(404);
    });
  });

  describe('GET /jurisdictionContent/byName/:jurisdictionName', () => {
    it('resolves content by jurisdiction name', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/byName/${jurisdictionName}?language=en`)
        .set(passkey)
        .expect(200);

      expect(res.body.footer.links[0].text).toEqual('Home');
    });
  });

  describe('GET /jurisdictionContent/jurisdictions/:jurisdictionId/admin', () => {
    it('lists the jurisdiction content rows across languages', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      const languages = res.body.map((row) => row.language);
      expect(languages).toEqual(expect.arrayContaining(['en', 'es']));
    });

    it('forbids an anonymous request', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin`)
        .set(passkey)
        .expect(403);
    });

    it('forbids a logged-in non-admin user', async () => {
      await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin`)
        .set('Cookie', publicUserCookies)
        .set(passkey)
        .expect(403);
    });
  });

  describe('GET /jurisdictionContent/jurisdictions/:jurisdictionId/admin/:language', () => {
    it('returns 204 when that language has no row', async () => {
      await request(app.getHttpServer())
        .get(adminScope('bn'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(204);
    });
  });

  describe('PUT /jurisdictionContent/jurisdictions/:jurisdictionId/admin/:language', () => {
    it('creates a language row and reads it back', async () => {
      await request(app.getHttpServer())
        .put(adminScope('vi'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          faq: {
            categories: [
              {
                id: 'c1',
                title: 'Chung',
                items: [
                  {
                    id: 'i1',
                    question: 'Cau hoi?',
                    answerHtml: '<p>Tra loi</p>',
                  },
                ],
              },
            ],
          },
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(adminScope('vi'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      expect(res.body.language).toEqual('vi');
      expect(res.body.faq.categories[0].items[0].answerHtml).toEqual(
        '<p>Tra loi</p>',
      );
      expect(res.body.updatedAt).toBeDefined();
    });

    it('rejects a stale optimistic lock with a 409 and accepts a current one', async () => {
      const current = (
        await request(app.getHttpServer())
          .get(adminScope('en'))
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;

      await request(app.getHttpServer())
        .put(adminScope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          lastUpdatedAt: new Date('2000-01-01').toISOString(),
          contact: { phone: '555-9999' },
        })
        .expect(409);

      await request(app.getHttpServer())
        .put(adminScope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          lastUpdatedAt: current.updatedAt,
          contact: { phone: '555-2222' },
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(adminScope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(res.body.contact.phone).toEqual('555-2222');
    });

    it('rejects a malformed content payload', async () => {
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ faq: { categories: 'not-an-array' } })
        .expect(400);
    });

    it('rejects an unsafe URL scheme in a link href', async () => {
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          footer: {
            links: [
              {
                id: 'l1',
                text: 'Evil',
                href: 'javascript:alert(document.cookie)',
              },
            ],
          },
        })
        .expect(400);
    });

    it('rejects a content list that exceeds the size cap', async () => {
      const categories = Array.from({ length: 257 }, (_, i) => ({
        id: `c${i}`,
        title: 'Category',
      }));
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ faq: { categories } })
        .expect(400);
    });

    it('rejects other malformed payloads (missing id, wrong types)', async () => {
      // A FAQ item missing its required id.
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          faq: { categories: [{ id: 'c1', items: [{ question: 'no id' }] }] },
        })
        .expect(400);

      // A non-string question.
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          faq: {
            categories: [
              {
                id: 'c1',
                items: [{ id: 'i1', question: 42, answerHtml: '<p>A</p>' }],
              },
            ],
          },
        })
        .expect(400);

      // A non-Date lastUpdatedAt.
      await request(app.getHttpServer())
        .put(adminScope('ko'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ lastUpdatedAt: 'not-a-date', contact: { phone: '555' } })
        .expect(400);
    });

    it('sanitizes rich-text HTML on write, stripping disallowed tags', async () => {
      await request(app.getHttpServer())
        .put(adminScope('zh'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          footer: {
            textSectionsHtml: ['<script>alert(1)</script><p>keep</p>'],
          },
          faq: {
            categories: [
              {
                id: 'c1',
                items: [
                  {
                    id: 'i1',
                    question: 'Q?',
                    answerHtml: '<h1>drop</h1><strong>keep</strong>',
                  },
                ],
              },
            ],
          },
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(adminScope('zh'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      expect(res.body.footer.textSectionsHtml[0]).toEqual('<p>keep</p>');
      expect(res.body.faq.categories[0].items[0].answerHtml).toEqual(
        'drop<strong>keep</strong>',
      );
    });

    it('records what a translation was translated from and flags it when the source changes', async () => {
      // Its own jurisdiction, so each write below is the first for its language and needs no lock.
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const scope = (language: string) =>
        `/jurisdictionContent/jurisdictions/${jurisdiction.id}/admin/${language}`;
      const faqFor = (answerHtml: string) => ({
        faq: {
          categories: [
            {
              id: 'applying',
              title: 'Applying',
              items: [{ id: 'how', question: 'How?', answerHtml }],
            },
          ],
        },
      });

      await request(app.getHttpServer())
        .put(scope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send(faqFor('<p>Apply online.</p>'))
        .expect(200);

      await request(app.getHttpServer())
        .put(scope('vi'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send(faqFor('<p>Nop don truc tuyen.</p>'))
        .expect(200);

      const beforeChange = await request(app.getHttpServer())
        .get(scope('vi'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(beforeChange.body.staleFields).toEqual([]);
      // The hashes are storage, not part of the response.
      expect(JSON.stringify(beforeChange.body)).not.toContain('_sourceHashes');

      const english = await request(app.getHttpServer())
        .get(scope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      await request(app.getHttpServer())
        .put(scope('en'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          ...faqFor('<p>Apply online or by mail.</p>'),
          lastUpdatedAt: english.body.updatedAt,
        })
        .expect(200);

      const afterChange = await request(app.getHttpServer())
        .get(scope('vi'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(afterChange.body.staleFields).toEqual([
        'faq.categories[applying].items[how].answerHtml',
      ]);

      const publicRead = await request(app.getHttpServer())
        .get(
          `/jurisdictionContent/jurisdictions/${jurisdiction.id}?language=vi`,
        )
        .set(passkey)
        .expect(200);
      expect(JSON.stringify(publicRead.body)).not.toContain('_sourceHashes');
    });

    it('clears fields omitted from a PUT (full-row replace)', async () => {
      await request(app.getHttpServer())
        .put(adminScope('ar'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          footer: { links: [{ id: 'l1', text: 'Home', href: '/' }] },
          contact: { phone: '555-0100' },
        })
        .expect(200);

      const created = (
        await request(app.getHttpServer())
          .get(adminScope('ar'))
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;
      expect(created.footer).not.toBeNull();

      await request(app.getHttpServer())
        .put(adminScope('ar'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          lastUpdatedAt: created.updatedAt,
          contact: { phone: '555-0199' },
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(adminScope('ar'))
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(res.body.contact.phone).toEqual('555-0199');
      // footer was omitted from the second PUT, so it is cleared.
      expect(res.body.footer).toBeNull();
    });

    it('forbids a jurisdictional admin', async () => {
      // Editing content is limited to the admin role, which has access to every jurisdiction in
      // the system. A jurisdictional admin is denied its own jurisdiction and any other.
      await request(app.getHttpServer())
        .put(adminScope('tl'))
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ contact: { phone: '555-0000' } })
        .expect(403);

      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionBId}/admin/tl`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ contact: { phone: '555-0000' } })
        .expect(403);
    });

    it('forbids an anonymous request', async () => {
      await request(app.getHttpServer())
        .put(adminScope('en'))
        .set(passkey)
        .send({ contact: { phone: '555-0000' } })
        .expect(403);
    });
  });
});
