import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import PropertyCreate from '../../src/dtos/properties/property-create.dto';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { PropertyQueryParams } from '../../src/dtos/properties/property-query-params.dto';
import { stringify } from 'qs';
import { randomUUID } from 'crypto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { Compare } from '../../src/dtos/shared/base-filter.dto';

describe('Properties Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;
  let jurisdictionBId: string;
  let cookies = '';

  const mockProperties: PropertyCreate[] = [
    {
      name: 'Woodside Apartments',
      description:
        'An old apartment units complex in a silent part of the town',
      url: 'https://properties.com/woodside_apartments',
      urlTitle: 'Woodside Apt.',
    },
    {
      name: 'Blue Creek Apartments',
      description:
        'A modern and small apartment unit complex ion the southern hill',
      url: 'https://properties.com/blue_creek_apartments',
      urlTitle: 'Blue Creek Apt.',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();

    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const jurisdictionB = await prisma.jurisdictions.create({
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

    jurisdictionAId = jurisdictionA.id;
    jurisdictionBId = jurisdictionB.id;

    await prisma.properties.create({
      data: {
        ...mockProperties[0],
        jurisdictions: {
          connect: {
            id: jurisdictionA.id,
          },
        },
      },
    });
    await prisma.properties.create({
      data: {
        ...mockProperties[1],
        jurisdictions: {
          connect: {
            id: jurisdictionB.id,
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
    it('should get default properties list from endpoint when no params are set', async () => {
      const res = await request(app.getHttpServer())
        .get('/properties')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.items.length).toBeGreaterThanOrEqual(2);

      // The two expected properties might not be in the response because other tests could add more properties and
      // make it so there are more than 10 meaning these two properties might be on page 2
      expect(res.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.anything(),
            description: expect.anything(),
            url: expect.anything(),
            urlTitle: expect.anything(),
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

    it('should get listings when pagination params are sent', async () => {
      const queryParams: PropertyQueryParams = {
        limit: 1,
        page: 3,
      };

      const res = await request(app.getHttpServer())
        .get(`/properties?${stringify(queryParams as any)}`)
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

    it('should get listings matching the search param', async () => {
      const queryParams = {
        search: 'Creek',
      };

      const res = await request(app.getHttpServer())
        .get(`/properties?${stringify(queryParams as any)}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items.pop()).toEqual(
        expect.objectContaining(mockProperties[1]),
      );
    });

    it('should get listings matching the jurisdiction filters', async () => {
      let queryParams: PropertyQueryParams = {
        filter: [
          {
            $comparison: Compare.IN,
            jurisdiction: jurisdictionBId,
          },
        ],
      };

      let res = await request(app.getHttpServer())
        .get(`/properties?${stringify(queryParams as any)}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items.pop()).toEqual(
        expect.objectContaining(mockProperties[1]),
      );

      queryParams = {
        filter: [
          {
            $comparison: Compare.IN,
            jurisdiction: jurisdictionAId,
          },
        ],
      };

      res = await request(app.getHttpServer())
        .get(`/properties?${stringify(queryParams as any)}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.meta).toEqual({
        currentPage: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
      });

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items.pop()).toEqual(
        expect.objectContaining(mockProperties[0]),
      );
    });
  });

  describe('get endpoint', () => {
    it('should throw error when invalid property id is given', async () => {
      const propertyId = randomUUID();
      const res = await request(app.getHttpServer())
        .get(`/properties/${propertyId}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toBe(
        `property with id ${propertyId} was requested but not found`,
      );
    });

    it('should return property by id', async () => {
      let res = await request(app.getHttpServer())
        .get('/properties?limit=1')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.items).toHaveLength(1);

      // eslint-disable-next-line
      const { id, createdAt, updatedAt, ...expectedData } = res.body.items[0];

      res = await request(app.getHttpServer())
        .get(`/properties/${id}`)
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
    it('should fail on empty request body', async () => {
      const res = await request(app.getHttpServer())
        .post('/properties')
        .send({})
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toBe('name should not be null or undefined');
    });

    it('should fail when no name field is missing', async () => {
      const body: Partial<PropertyCreate> = {
        description:
          'A small villa placed with a beautiful view of the Toluca Lake',
        url: 'https://properties.com/brookhaven_villa',
        urlTitle: 'Brookhaven',
      };
      const res = await request(app.getHttpServer())
        .post('/properties')
        .send(body)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toBe('name should not be null or undefined');
    });

    it('should succeed when only a name and jurisdiction is given', async () => {
      const res = await request(app.getHttpServer())
        .post('/properties')
        .send({
          name: 'Vineta Apartments',
          jurisdictions: { id: jurisdictionAId },
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'Vineta Apartments',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        description: null,
        url: null,
        urlTitle: null,
        jurisdictions: expect.objectContaining({
          id: jurisdictionAId,
        }),
      });
    });

    it('should succeed when full body is passed', async () => {
      const body: PropertyCreate = {
        name: 'Rotfront Villa',
        description: 'An old house in brutalist architectural style',
        url: 'https://example.com/rotfront_villa',
        urlTitle: 'Rotfront',
        jurisdictions: { id: jurisdictionAId },
      };
      const res = await request(app.getHttpServer())
        .post('/properties')
        .send(body)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        ...body,
        jurisdictions: expect.objectContaining({
          id: body.jurisdictions.id,
        }),
      });
    });
  });

  describe('update endpoint', () => {
    it('should throw an error when no property ID is given', async () => {
      const res = await request(app.getHttpServer())
        .put('/properties')
        .send({
          name: 'Updated Name',
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toEqual('id should not be null or undefined');
    });

    it('should throw error when an given ID does not exist', async () => {
      const randId = randomUUID();
      const res = await request(app.getHttpServer())
        .put('/properties')
        .send({
          id: randId,
          name: 'Updated Name',
          jurisdictions: { id: jurisdictionAId },
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toEqual(
        `Property with id ${randId} was not found`,
      );
    });

    it('should update a property', async () => {
      const newListing = await prisma.properties.create({
        data: {
          name: 'Test name',
          description: 'Test description',
          url: 'https://test.com',
          urlTitle: 'Test URL Title',
        },
      });

      const updateDto = {
        name: 'Updated Name',
        description: 'Updated demo',
        url: 'https://updated.com',
        urlTitle: 'Updated URL title',
        jurisdictions: { id: jurisdictionAId },
      };

      const res = await request(app.getHttpServer())
        .put('/properties')
        .send({ ...updateDto, id: newListing.id })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body).toEqual({
        id: newListing.id,
        createdAt: newListing.createdAt.toISOString(),
        updatedAt: expect.anything(),
        ...updateDto,
        jurisdictions: expect.objectContaining({
          id: updateDto.jurisdictions.id,
        }),
      });
    });
  });

  describe('delete endpoint', () => {
    it('should throw an error when no property ID is given', async () => {
      const res = await request(app.getHttpServer())
        .delete('/properties')
        .send({})
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toHaveLength(1);
      expect(res.body.message[0]).toBe('id should not be null or undefined');
    });

    it('should throw error when an given ID does not exist', async () => {
      const randId = randomUUID();
      const res = await request(app.getHttpServer())
        .delete('/properties')
        .send({
          id: randId,
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(400);

      expect(res.body.message).toBe(`Property with id ${randId} was not found`);
    });

    it('should delete the given entry by ID', async () => {
      const tempProperty = await prisma.properties.create({
        data: {
          name: 'Property to delete',
          jurisdictions: {
            connect: {
              id: jurisdictionBId,
            },
          },
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/properties/${tempProperty.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.name).toBe(tempProperty.name);

      await request(app.getHttpServer())
        .delete('/properties')
        .send({
          id: tempProperty.id,
        })
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
    });
  });
});
