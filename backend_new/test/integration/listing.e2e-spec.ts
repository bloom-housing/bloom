import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { stringify } from 'qs';
import { ListingsQueryParams } from '../../src/dtos/listings/listings-query-params.dto';
import { Compare } from '../../src/dtos/shared/base-filter.dto';
import { ListingOrderByKeys } from '../../src/enums/listings/order-by-enum';
import { OrderByEnum } from '../../src/enums/shared/order-by-enum';
import { ListingViews } from '../../src/enums/listings/view-enum';

describe('Listing Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jurisdictionAId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const jurisdiction = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    jurisdictionAId = jurisdiction.id;
  });

  it('should not get listings from list endpoint when no params are sent', async () => {
    const res = await request(app.getHttpServer()).get('/listings').expect(200);

    expect(res.body).toEqual({
      items: [],
      meta: {
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  it('should get listings from list endpoint when no params are sent', async () => {
    const listing1 = await listingFactory(jurisdictionAId, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const listing2 = await listingFactory(jurisdictionAId, prisma);
    const listing2Created = await prisma.listings.create({
      data: listing2,
    });

    const res = await request(app.getHttpServer()).get('/listings').expect(200);

    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: 2,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
    });

    const items = res.body.items.map((item) => item.name);

    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items).toContain(listing1Created.name);
    expect(items).toContain(listing2Created.name);
  });

  it('should not get listings from list endpoint when params are sent', async () => {
    const queryParams: ListingsQueryParams = {
      limit: 1,
      page: 1,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: 'random name',
        },
      ],
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/listings?${query}`)
      .expect(200);

    expect(res.body).toEqual({
      items: [],
      meta: {
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 1,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  it('should get listings from list endpoint when params are sent', async () => {
    const listing1 = await listingFactory(jurisdictionAId, prisma);
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    const listing2 = await listingFactory(jurisdictionAId, prisma);
    const listing2Created = await prisma.listings.create({
      data: listing2,
    });

    const orderedNames = [listing1Created.name, listing2Created.name].sort(
      (a, b) => a.localeCompare(b),
    );

    let queryParams: ListingsQueryParams = {
      limit: 1,
      page: 1,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: orderedNames.toString(),
        },
      ],
      orderBy: [ListingOrderByKeys.name],
      orderDir: [OrderByEnum.ASC],
    };
    let query = stringify(queryParams as any);

    let res = await request(app.getHttpServer())
      .get(`/listings?${query}`)
      .expect(200);

    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: 1,
      itemsPerPage: 1,
      totalItems: 2,
      totalPages: 2,
    });

    expect(res.body.items.length).toEqual(1);
    expect(res.body.items[0].name).toEqual(orderedNames[0]);

    queryParams = {
      limit: 1,
      page: 2,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: orderedNames.toString(),
        },
      ],
      orderBy: [ListingOrderByKeys.name],
      orderDir: [OrderByEnum.ASC],
    };
    query = stringify(queryParams as any);

    res = await request(app.getHttpServer())
      .get(`/listings?${query}`)
      .expect(200);

    expect(res.body.meta).toEqual({
      currentPage: 2,
      itemCount: 1,
      itemsPerPage: 1,
      totalItems: 2,
      totalPages: 2,
    });
    expect(res.body.items.length).toEqual(1);
    expect(res.body.items[0].name).toEqual(orderedNames[1]);
  });

  it('should get listings from retrieveListings endpoint', async () => {
    const listingA = await listingFactory(jurisdictionAId, prisma, {
      multiselectQuestions: [{ text: 'example a' }],
    });
    const listingACreated = await prisma.listings.create({
      data: listingA,
      include: {
        listingMultiselectQuestions: true,
      },
    });

    const listingB = await listingFactory(jurisdictionAId, prisma, {
      multiselectQuestions: [{ text: 'example b' }],
    });
    await prisma.listings.create({
      data: listingB,
      include: {
        listingMultiselectQuestions: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(
        `/listings/byMultiselectQuestion/${listingACreated.listingMultiselectQuestions[0].multiselectQuestionId}`,
      )
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual(listingA.name);
  });

  it('retrieveListings test', async () => {
    const listingA = await prisma.listings.create({
      data: listingFactory(10, jurisdictionAId),
      include: {
        listingMultiselectQuestions: true,
      },
    });
    await prisma.listings.create({
      data: listingFactory(50, jurisdictionAId),
      include: {
        listingMultiselectQuestions: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(
        `/listings/byMultiselectQuestion/${listingA.listingMultiselectQuestions[0].multiselectQuestionId}`,
      )
      .expect(200);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('name: 10');
  });
});
