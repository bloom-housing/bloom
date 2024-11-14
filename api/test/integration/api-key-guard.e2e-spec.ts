import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { Login } from '../../src/dtos/auth/login.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';

describe('API Key Guard Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';

  beforeAll(async () => {
    process.env.API_PASS_KEY = 'OUR_API_PASS_KEY';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should succeed when correct header is present', async () => {
    await request(app.getHttpServer())
      .get('/reservedCommunityTypes')
      .set('Cookie', cookies)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);
  });

  it('should error when incorrect header is present', async () => {
    const res = await request(app.getHttpServer())
      .get('/reservedCommunityTypes')
      .set({ passkey: 'the wrong key' })
      .set('Cookie', cookies)
      .expect(401);
    expect(res.body.message).toBe('Traffic not from a known source');
  });

  it('should error when no header is present', async () => {
    const res = await request(app.getHttpServer())
      .get('/reservedCommunityTypes')
      .set('Cookie', cookies)
      .expect(401);
    expect(res.body.message).toBe('Traffic not from a known source');
  });
});
