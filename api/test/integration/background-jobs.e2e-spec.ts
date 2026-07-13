import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BackgroundJobStatusEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';

describe('Background Jobs Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';
  let listingId: string;
  let jurisdictionId: string;
  let storedUserId: string;

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
    storedUserId = storedUser.id;

    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({ email: storedUser.email, password: 'Abcdef12345!' })
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const listingData = await listingFactory(jurisdiction.id, prisma);
    const listing = await prisma.listings.create({ data: listingData });
    listingId = listing.id;
    jurisdictionId = jurisdiction.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /jobs', () => {
    afterEach(async () => {
      await prisma.backgroundJob.deleteMany({ where: { listingId } });
    });

    it('should create and return a background job with processing status', async () => {
      const res = await request(app.getHttpServer())
        .post('/jobs')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send({ listingId, inputS3Key: 'test-s3-key' })
        .expect(201);

      expect(res.body).toMatchObject({
        listingId,
        requestedByUserId: storedUserId,
        status: BackgroundJobStatusEnum.processing,
        inputS3Key: 'test-s3-key',
      });
      expect(res.body.id).toBeDefined();
    });

    it('should return 409 when an active job already exists for the listing', async () => {
      await prisma.backgroundJob.create({
        data: {
          listingId,
          requestedByUserId: storedUserId,
          inputS3Key: 'uploads/existing.csv',
          status: BackgroundJobStatusEnum.processing,
        },
      });

      const res = await request(app.getHttpServer())
        .post('/jobs')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send({ listingId, inputS3Key: 'test-s3-key' })
        .expect(409);

      expect(res.body.message).toBe(
        `Listing with ID: ${listingId} has a currently running job assigned`,
      );
    });

    it('should return 401 when passkey header is missing', async () => {
      await request(app.getHttpServer())
        .post('/jobs')
        .set('Cookie', cookies)
        .send({ listingId, inputS3Key: 'test-s3-key' })
        .expect(401);
    });

    it('should return 401 when passkey header is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/jobs')
        .set({ passkey: 'wrong-key' })
        .set('Cookie', cookies)
        .send({ listingId, inputS3Key: 'test-s3-key' })
        .expect(401);
    });

    it('should return 400 when required body fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/jobs')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send({})
        .expect(400);
    });

    it('should return 400 when listingId is not a valid UUID', async () => {
      await request(app.getHttpServer())
        .post('/jobs')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send({ listingId: 'not-a-uuid', inputS3Key: 'test-s3-key' })
        .expect(400);
    });
  });

  describe('GET /jobs', () => {
    let seededJobId: string;

    beforeAll(async () => {
      const seededJob = await prisma.backgroundJob.create({
        data: {
          listingId,
          requestedByUserId: storedUserId,
          inputS3Key: 'test-s3-key',
          status: BackgroundJobStatusEnum.processing,
        },
      });
      seededJobId = seededJob.id;
    });

    afterAll(async () => {
      await prisma.backgroundJob.deleteMany({ where: { listingId } });
    });

    it('should return the active job for a listing', async () => {
      const res = await request(app.getHttpServer())
        .get('/jobs')
        .query({ listingId })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toMatchObject({
        id: seededJobId,
        listingId,
        status: BackgroundJobStatusEnum.processing,
        inputS3Key: 'test-s3-key',
      });
    });

    it('should return null when no active job exists for the listing', async () => {
      const listingData = await listingFactory(jurisdictionId, prisma);
      const newListing = await prisma.listings.create({ data: listingData });

      await prisma.backgroundJob.createMany({
        data: [
          {
            listingId: newListing.id,
            status: BackgroundJobStatusEnum.completed,
            requestedByUserId: storedUserId,
            inputS3Key: 'test-s3-key',
          },
          {
            listingId: newListing.id,
            status: BackgroundJobStatusEnum.failed,
            requestedByUserId: storedUserId,
            inputS3Key: 'test-s3-key',
          },
        ],
      });

      const res = await request(app.getHttpServer())
        .get('/jobs')
        .query({ listingId: newListing.id })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toBeEmpty();
    });

    it('should return 401 when JWT cookie is missing', async () => {
      await request(app.getHttpServer())
        .get('/jobs')
        .query({ listingId })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(401);
    });
  });

  describe('GET /jobs/:jobId', () => {
    let seededJobId: string;

    beforeAll(async () => {
      const seededJob = await prisma.backgroundJob.create({
        data: {
          listingId,
          requestedByUserId: storedUserId,
          inputS3Key: 'test-s3-key',
          status: BackgroundJobStatusEnum.processing,
        },
      });
      seededJobId = seededJob.id;
    });

    afterAll(async () => {
      await prisma.backgroundJob.deleteMany({ where: { listingId } });
    });

    it('should return a background job by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/jobs/${seededJobId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toMatchObject({
        id: seededJobId,
        listingId,
        status: BackgroundJobStatusEnum.processing,
        inputS3Key: 'test-s3-key',
      });
    });

    it('should return 404 when job does not exist', async () => {
      const nonExistentId = randomUUID();

      const res = await request(app.getHttpServer())
        .get(`/jobs/${nonExistentId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toBe(
        `Job with id: ${nonExistentId} was not found`,
      );
    });
  });

  describe('GET /jobs/active', () => {
    let seededJobId: string;

    beforeAll(async () => {
      const seededJob = await prisma.backgroundJob.create({
        data: {
          listingId,
          requestedByUserId: storedUserId,
          inputS3Key: 'test-s3-key',
          status: BackgroundJobStatusEnum.processing,
        },
      });
      seededJobId = seededJob.id;
    });

    afterAll(async () => {
      await prisma.backgroundJob.deleteMany({ where: { listingId } });
    });

    it('should return error when user does not have permissions', async () => {
      const nonAdminUser = await prisma.userAccounts.create({
        data: await userFactory({ mfaEnabled: false, confirmedAt: new Date() }),
      });

      const resLogIn = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({ email: nonAdminUser.email, password: 'Abcdef12345!' })
        .expect(201);

      const nonAdminCookies = resLogIn.headers['set-cookie'];

      await request(app.getHttpServer())
        .get('/jobs/active')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', nonAdminCookies)
        .expect(403);

      await prisma.userAccounts.delete({ where: { id: nonAdminUser.id } });
    });

    it('should return true when an active jobs exists in the database', async () => {
      const res = await request(app.getHttpServer())
        .get('/jobs/active')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toBe(true);
    });

    it('should return false when no active jobs exists in the database', async () => {
      await prisma.backgroundJob.update({
        where: { id: seededJobId },
        data: { status: BackgroundJobStatusEnum.completed },
      });

      const res = await request(app.getHttpServer())
        .get('/jobs/active')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toBe(false);
    });
  });
});
