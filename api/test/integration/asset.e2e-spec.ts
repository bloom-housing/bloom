import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';

describe('Asset Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';

  beforeAll(async () => {
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

  it('should create a presigned url for upload', async () => {
    const publicId = randomUUID();
    const eager = 'eager';

    const res = await request(app.getHttpServer())
      .post('/asset/presigned-upload-metadata/')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({ parametersToSign: { publicId, eager } })
      .set('Cookie', cookies)
      .expect(201);

    const createPresignedUploadMetadataResponseDto = JSON.parse(res.text);
    expect(createPresignedUploadMetadataResponseDto).toHaveProperty(
      'signature',
    );
    // we're uploading data to cloudinary so what we get back will depend on cloudinary's response.
    // at the minimum we shouldn't get null
    expect(createPresignedUploadMetadataResponseDto.signature).not.toBeNull();
  });
});
