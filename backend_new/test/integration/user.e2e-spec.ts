import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import { UserQueryParams } from '../../src/dtos/users/user-query-param.dto';

describe('User Controller Tests', () => {
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

  it('should get no users from list() when no params and no data', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/list?`)
      .expect(200);
    expect(res.body.items.length).toEqual(0);
  });

  it('should get users from list() when no params', async () => {
    const userA = await prisma.userAccounts.create({
      data: userFactory(),
    });
    const userB = await prisma.userAccounts.create({
      data: userFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/user/list?`)
      .expect(200);
    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const ids = res.body.items.map((item) => item.id);
    expect(ids).toContain(userA.id);
    expect(ids).toContain(userB.id);
  });

  it('should get users from list() when params sent', async () => {
    const userA = await prisma.userAccounts.create({
      data: userFactory({ roles: { isPartner: true }, firstName: '1110' }),
    });
    const userB = await prisma.userAccounts.create({
      data: userFactory({ roles: { isPartner: true }, firstName: '1111' }),
    });

    const queryParams: UserQueryParams = {
      limit: 2,
      page: 1,
      filter: [
        {
          isPortalUser: true,
        },
      ],
      search: '111',
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/user/list?${query}`)
      .expect(200);
    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    const ids = res.body.items.map((item) => item.id);
    expect(ids).toContain(userA.id);
    expect(ids).toContain(userB.id);
  });

  it("should error when retrieve() called with id that doesn't exist", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/user/${id}`)
      .expect(404);
    expect(res.body.message).toEqual(
      `userId ${id} was requested but not found`,
    );
  });

  it('should get user from retrieve()', async () => {
    const userA = await prisma.userAccounts.create({
      data: userFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/user/${userA.id}`)
      .expect(200);

    expect(res.body.id).toEqual(userA.id);
  });
});
