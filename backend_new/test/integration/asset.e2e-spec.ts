import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { AppModule } from '../../src//modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';

describe('Asset Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    const schedulerRegistry =
      moduleFixture.get<SchedulerRegistry>(SchedulerRegistry);
    // we stop the cron job since we don't want the cron job to run during tests
    schedulerRegistry.getCronJob('AFS_CRON_JOB').stop();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should create a presigned url for upload', async () => {
    const publicId = randomUUID();
    const eager = 'eager';
    const res = await request(app.getHttpServer())
      .post('/assets/presigned-upload-metadata/')
      .send({ parametersToSign: { publicId, eager } })
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
