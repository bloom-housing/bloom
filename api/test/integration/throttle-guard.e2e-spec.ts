import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { ThrottlerModule } from '@nestjs/throttler';

describe('Throttle Guard Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ThrottlerModule.forRoot([
          {
            ttl: Number('600000'),
            limit: Number('10'),
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should succeed until throttle limit is exceeded', async () => {
    let res;
    // loop as many times as the THROTTLE_LIMIT allows
    for (let i = 0; i < 10; i++) {
      res = await request(app.getHttpServer()).get('/').expect(200);
      expect(res.body).toEqual({
        success: true,
      });
    }
    res = await request(app.getHttpServer()).get('/').expect(429);
    expect(res.body.message).toBe('ThrottlerException: Too Many Requests');
  });
});
