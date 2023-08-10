import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { randomUUID } from 'crypto';
import { UserUpdate } from '../../src/dtos/users/user-update.dto';

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

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should update user profile when user exists', async () => {
    const userA = await prisma.userAccounts.create({
      data: userFactory(),
    });

    const res = await request(app.getHttpServer())
      .put(`/userProfile/${userA.id}`)
      .send({
        id: userA.id,
        firstName: 'New User First Name',
        lastName: 'New User Last Name',
      } as UserUpdate)
      .expect(200);

    expect(res.body.id).toEqual(userA.id);
    expect(res.body.firstName).toEqual('New User First Name');
    expect(res.body.lastName).toEqual('New User Last Name');
  });

  it("should error when updating user profile that doesn't exist", async () => {
    await prisma.userAccounts.create({
      data: userFactory(),
    });
    const randomId = randomUUID();
    const res = await request(app.getHttpServer())
      .put(`/userProfile/${randomId}`)
      .send({
        id: randomId,
        firstName: 'New User First Name',
        lastName: 'New User Last Name',
      } as UserUpdate)
      .expect(404);

    expect(res.body.message).toEqual(
      `user ${randomId} was requested but not found`,
    );
  });
});
