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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

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

  it('resolves content by jurisdiction name', async () => {
    const res = await request(app.getHttpServer())
      .get(`/jurisdictionContent/byName/${jurisdictionName}?language=en`)
      .set(passkey)
      .expect(200);

    expect(res.body.footer.links[0].text).toEqual('Home');
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

  describe('admin CRUD', () => {
    it('creates a language row via PUT and reads it back', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/vi`)
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
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/vi`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      expect(res.body.language).toEqual('vi');
      expect(res.body.faq.categories[0].items[0].answerHtml).toEqual(
        '<p>Tra loi</p>',
      );
      expect(res.body.updatedAt).toBeDefined();
    });

    it('lists the jurisdiction content rows across languages', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);

      const languages = res.body.map((row) => row.language);
      expect(languages).toEqual(expect.arrayContaining(['en', 'es', 'vi']));
    });

    it('rejects a stale optimistic lock with a 409 and accepts a current one', async () => {
      const current = (
        await request(app.getHttpServer())
          .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/en`)
          .set('Cookie', adminCookies)
          .set(passkey)
          .expect(200)
      ).body;

      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/en`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          lastUpdatedAt: new Date('2000-01-01').toISOString(),
          contact: { phone: '555-9999' },
        })
        .expect(409);

      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/en`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({
          lastUpdatedAt: current.updatedAt,
          contact: { phone: '555-2222' },
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/en`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .expect(200);
      expect(res.body.contact.phone).toEqual('555-2222');
    });

    it('rejects a malformed content payload', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/ko`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ faq: { categories: 'not-an-array' } })
        .expect(400);
    });

    it('rejects an unsafe URL scheme in a link href', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/ko`)
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
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/ko`)
        .set('Cookie', adminCookies)
        .set(passkey)
        .send({ faq: { categories } })
        .expect(400);
    });

    it('lets a jurisdictional admin write its own jurisdiction but not another', async () => {
      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionId}/admin/tl`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ contact: { phone: '555-0000' } })
        .expect(200);

      await request(app.getHttpServer())
        .put(`/jurisdictionContent/jurisdictions/${jurisdictionBId}/admin/tl`)
        .set('Cookie', jurisAdminCookies)
        .set(passkey)
        .send({ contact: { phone: '555-0000' } })
        .expect(403);
    });
  });
});
