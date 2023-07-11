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
      data: jurisdictionFactory(100),
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
    await prisma.listings.create({
      data: listingFactory(10, jurisdictionAId),
    });

    await prisma.listings.create({
      data: listingFactory(50, jurisdictionAId),
    });

    const res = await request(app.getHttpServer()).get('/listings').expect(200);

    expect(res.body.meta).toEqual({
      currentPage: 1,
      itemCount: 2,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
    });

    const items = res.body.items.sort((a, b) => (a.name < b.name ? -1 : 1));

    expect(res.body.items.length).toEqual(2);
    expect(items[0].name).toEqual('name: 10');
    expect(items[1].name).toEqual('name: 50');
  });

  it('should not get listings from list endpoint when params are sent', async () => {
    const queryParams: ListingsQueryParams = {
      limit: 1,
      page: 1,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: 'name: 11,name: 51',
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
    await prisma.listings.create({
      data: listingFactory(11, jurisdictionAId),
    });
    await prisma.listings.create({
      data: listingFactory(51, jurisdictionAId),
    });

    let queryParams: ListingsQueryParams = {
      limit: 1,
      page: 1,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: 'name: 11,name: 51',
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
    expect(res.body.items[0].name).toEqual('name: 11');

    queryParams = {
      limit: 1,
      page: 2,
      view: ListingViews.base,
      filter: [
        {
          $comparison: Compare.IN,
          name: 'name: 11,name: 51',
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
    expect(res.body.items[0].name).toEqual('name: 51');
  });

  it('should get listings from retrieveListings endpoint', async () => {
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
