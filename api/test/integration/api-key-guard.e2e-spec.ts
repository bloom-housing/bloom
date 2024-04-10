import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';

describe('API Key Guard Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should succeed when correct header is present', async () => {
    await request(app.getHttpServer())
      .get('/jurisdictions')
      .set({ passkey: process.env.API_PASS_KEY })
      .expect(200);
  });

  it('should error when incorrect header is present', async () => {
    const res = await request(app.getHttpServer())
      .get('/listings')
      .set({ passkey: 'the wrong key' })
      .expect(401);
    expect(res.body.message).toBe('Traffic not from a known source');
  });

  it('should error when no header is present', async () => {
    const res = await request(app.getHttpServer()).get('/listings').expect(401);
    expect(res.body.message).toBe('Traffic not from a known source');
  });
});
