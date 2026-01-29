import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/services/prisma.service';
import { AppModule } from '../../src/modules/app.module';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { AgencyQueryParams } from '../../src/dtos/agency/agency-query-params.dto';
import { stringify } from 'querystring';
import { randomUUID } from 'crypto';
import AgencyCreate from '../../src/dtos/agency/agency-create.dto';
import { AgencyUpdate } from '../../src/dtos/agency/agency-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';

describe('Agencies Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionId: string;
  let agencyAId: string;
  let cookies = '';

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

    jurisdictionId = jurisdiction.id;

    const agencyA = await prisma.agency.create({
      data: {
        name: 'Agency A',
        jurisdictions: {
          connect: {
            id: jurisdiction.id,
          },
        },
      },
    });
    agencyAId = agencyA.id;

    await prisma.agency.create({
      data: {
        name: 'Agency B',
        jurisdictions: {
          connect: {
            id: jurisdiction.id,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('list endpoint', () => {
    it('should get default list of agencies when no params are sent', async () => {
      const res = await request(app.getHttpServer())
        .get('/agency')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.items.length).toBeGreaterThanOrEqual(2);
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.anything(),
          }),
        ]),
      );
      expect(res.body.meta).toEqual(
        expect.objectContaining({
          currentPage: 1,
          itemsPerPage: 10,
        }),
      );
      expect(res.body.meta.totalItems).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(1);
      expect(res.body.meta.itemCount).toBeGreaterThanOrEqual(2);
    });

    it('should get agencies when pagination params are sent', async () => {
      const queryParams: AgencyQueryParams = {
        limit: 1,
        page: 3,
      };

      const res = await request(app.getHttpServer())
        .get(`/agency?${stringify(queryParams as any)}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.meta).toEqual(
        expect.objectContaining({
          currentPage: 3,
          itemCount: 1,
          itemsPerPage: 1,
        }),
      );
      expect(res.body.meta.totalItems).toBeGreaterThanOrEqual(2);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(2);
      expect(res.body.items).toHaveLength(1);
    });
  });

  describe('get endpoint', () => {
    it.skip('should throw error when agency is not found', async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .get(`/agency/${randomId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toBe(
        `Agency with ID: ${randomId} was not found`,
      );
    });

    it.skip('should return the agency entry by its ID', async () => {
      let res = await request(app.getHttpServer())
        .get('/agency?limit=1')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.items).toHaveLength(1);

      // eslint-disable-next-line
      const { id, createdAt, updatedAt, ...expectedData } = res.body.items[0];

      res = await request(app.getHttpServer())
        .get(`/agency/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          ...expectedData,
        }),
      );
    });
  });

  describe('create endpoint', () => {
    it('should throw error when name field is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/agency')
        .send({})
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toBe('name should not be null or undefined');
    });

    it('should throw error when jurisdiction ID is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/agency')
        .send({
          name: 'Agency C',
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toBe('A valid jurisdiction must be provided');
    });

    it('should throw error when jurisdiction is not found', async () => {
      const randomID = randomUUID();
      const res = await request(app.getHttpServer())
        .post('/agency')
        .send({
          name: 'Agency C',
          jurisdictions: {
            id: randomID,
          },
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toBe(
        `A jurisdiction with ID: ${randomID} was not found`,
      );
    });

    it('should succeed when a valid DTO is sent', async () => {
      const body: AgencyCreate = {
        name: 'Agency C',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await request(app.getHttpServer())
        .post('/agency')
        .send(body)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        name: body.name,
        jurisdictions: expect.objectContaining({
          id: body.jurisdictions.id,
        }),
      });
    });
  });

  describe('update endpoint', () => {
    it('should throw error when no agency ID is given', async () => {
      const res = await request(app.getHttpServer())
        .put('/agency')
        .send({
          name: 'Updated Name',
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toEqual('id should not be null or undefined');
    });

    it('should throw error when jurisdiction is not given', async () => {
      const res = await request(app.getHttpServer())
        .put('/agency')
        .send({
          id: agencyAId,
          name: 'Updated Name',
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toBe('A valid jurisdiction must be provided');
    });

    it('should throw error when jurisdiction is not found', async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .put('/agency')
        .send({
          id: agencyAId,
          name: 'Updated Name',
          jurisdictions: {
            id: randomId,
          },
        } as AgencyUpdate)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `A jurisdiction with ID: ${randomId} was not found`,
      );
    });

    it('should throw error when given ID does not exist', async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .put('/agency')
        .send({
          id: randomId,
          name: 'Updated Name',
          jurisdictions: {
            id: jurisdictionId,
          },
        } as AgencyUpdate)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `An agency with id: ${randomId} was not found`,
      );
    });

    it('should succeed when a valid DTO is given', async () => {
      const updateDto: AgencyUpdate = {
        name: 'Agency Updated',
        id: agencyAId,
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const res = await request(app.getHttpServer())
        .put('/agency')
        .send(updateDto)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toEqual({
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        ...updateDto,
        jurisdictions: expect.objectContaining({
          id: updateDto.jurisdictions.id,
        }),
      });
    });
  });

  describe('delete endpoint', () => {
    it('should throw error when no agency ID is given', async () => {
      const res = await request(app.getHttpServer())
        .delete('/agency')
        .send()
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toBe('A agency ID must be provided');
    });

    it('should throw error when agency ID does not exist', async () => {
      const randId = randomUUID();
      const res = await request(app.getHttpServer())
        .delete('/agency')
        .send({
          id: randId,
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toBe(
        `An agency with id: ${randId} was not found`,
      );
    });

    it('should succeed deleting a given agency entry', async () => {
      await request(app.getHttpServer())
        .delete('/agency')
        .send({
          id: agencyAId,
        } as IdDTO)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });
  });
});
