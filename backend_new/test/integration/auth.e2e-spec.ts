import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import cookieParser from 'cookie-parser';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { MfaType } from '../../src/enums/mfa/mfa-type-enum';
import {
  ACCESS_TOKEN_AVAILABLE_NAME,
  REFRESH_COOKIE_NAME,
  TOKEN_COOKIE_NAME,
} from '../../src/services/auth.service';
import { SmsService } from '../../src/services/sms.service';
import { RequestMfaCode } from '../../src/dtos/mfa/request-mfa-code.dto';
import { UpdatePassword } from '../../src/dtos/auth/update-password.dto';
import { Confirm } from '../../src/dtos/auth/confirm.dto';

describe('Auth Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let smsService: SmsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    smsService = moduleFixture.get<SmsService>(SmsService);
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

  it('should login successfully as mfaEnabled user', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaCode: 'abcdef',
        mfaEnabled: true,
        confirmedAt: new Date(),
      }),
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
        mfaCode: storedUser.mfaCode,
        mfaType: MfaType.email,
      } as Login)
      .expect(201);

    expect(res.body).toEqual({
      success: true,
    });

    const cookies = res.headers['set-cookie'].map(
      (cookie) => cookie.split('=')[0],
    );

    expect(cookies).toContain(TOKEN_COOKIE_NAME);
    expect(cookies).toContain(REFRESH_COOKIE_NAME);
    expect(cookies).toContain(ACCESS_TOKEN_AVAILABLE_NAME);

    const loggedInUser = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(loggedInUser.lastLoginAt).not.toBeNull();
    expect(loggedInUser.mfaCode).toBeNull();
    expect(loggedInUser.activeAccessToken).not.toBeNull();
    expect(loggedInUser.activeRefreshToken).not.toBeNull();
  });

  it('should login successfully as non mfa user', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    expect(res.body).toEqual({
      success: true,
    });

    const cookies = res.headers['set-cookie'].map(
      (cookie) => cookie.split('=')[0],
    );

    expect(cookies).toContain(TOKEN_COOKIE_NAME);
    expect(cookies).toContain(REFRESH_COOKIE_NAME);
    expect(cookies).toContain(ACCESS_TOKEN_AVAILABLE_NAME);

    const loggedInUser = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(loggedInUser.lastLoginAt).not.toBeNull();
    expect(loggedInUser.mfaCode).toBeNull();
    expect(loggedInUser.activeAccessToken).not.toBeNull();
    expect(loggedInUser.activeRefreshToken).not.toBeNull();
  });

  it('should logout successfully', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);

    const resLogOut = await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Cookie', resLogIn.headers['set-cookie'])
      .expect(200);

    expect(resLogOut.body).toEqual({
      success: true,
    });

    const cookies = resLogOut.headers['set-cookie'].map(
      (cookie) => cookie.split('=')[0],
    );

    expect(cookies).toContain(TOKEN_COOKIE_NAME);
    expect(cookies).toContain(REFRESH_COOKIE_NAME);
    expect(cookies).toContain(ACCESS_TOKEN_AVAILABLE_NAME);

    const loggedInUser = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(loggedInUser.lastLoginAt).not.toBeNull();
    expect(loggedInUser.mfaCode).toBeNull();
    expect(loggedInUser.activeAccessToken).toBeNull();
    expect(loggedInUser.activeRefreshToken).toBeNull();
  });

  it('should request mfaCode', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: true,
        confirmedAt: new Date(),
        phoneNumber: '111-111-1111',
        phoneNumberVerified: true,
      }),
    });
    smsService.client.messages.create = jest
      .fn()
      .mockResolvedValue({ success: true });

    const res = await request(app.getHttpServer())
      .post('/auth/request-mfa-code')
      .send({
        email: storedUser.email,
        password: 'abcdef',
        mfaType: MfaType.sms,
      } as RequestMfaCode)
      .expect(201);

    expect(res.body).toEqual({
      phoneNumber: '111-111-1111',
      phoneNumberVerified: true,
    });

    expect(smsService.client.messages.create).toHaveBeenCalledWith({
      body: expect.anything(),
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '111-111-1111',
    });

    const user = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(user.mfaCode).not.toBeNull();
    expect(user.mfaCodeUpdatedAt).not.toBeNull();
  });

  it('should update password', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: true,
        phoneNumber: '111-111-1111',
        phoneNumberVerified: true,
      }),
    });

    const token = sign(
      {
        id: storedUser.id,
      },
      process.env.APP_SECRET,
    );

    await prisma.userAccounts.update({
      data: {
        resetToken: token,
      },
      where: {
        id: storedUser.id,
      },
    });

    const res = await request(app.getHttpServer())
      .put('/auth/update-password')
      .send({
        email: storedUser.email,
        password: 'abcdef123',
        passwordConfirmation: 'abcdef123',
        token,
      } as UpdatePassword)
      .expect(200);

    expect(res.body).toEqual({
      success: true,
    });

    const user = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(user.resetToken).toBeNull();
    expect(user.passwordHash).not.toEqual(storedUser.passwordHash);
  });

  it('should confirm user', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: true,
        phoneNumber: '111-111-1111',
        phoneNumberVerified: true,
      }),
    });

    const token = sign(
      {
        id: storedUser.id,
      },
      process.env.APP_SECRET,
    );

    await prisma.userAccounts.update({
      data: {
        confirmationToken: token,
      },
      where: {
        id: storedUser.id,
      },
    });

    const res = await request(app.getHttpServer())
      .put('/auth/confirm')
      .send({
        token,
      } as Confirm)
      .expect(200);

    expect(res.body).toEqual({
      success: true,
    });

    const user = await prisma.userAccounts.findUnique({
      where: {
        id: storedUser.id,
      },
    });

    expect(user.confirmationToken).toBeNull();
    expect(user.confirmedAt).not.toBeNull();

    const cookies = res.headers['set-cookie'].map(
      (cookie) => cookie.split('=')[0],
    );

    expect(cookies).toContain(TOKEN_COOKIE_NAME);
    expect(cookies).toContain(REFRESH_COOKIE_NAME);
    expect(cookies).toContain(ACCESS_TOKEN_AVAILABLE_NAME);
  });

  it('should fail request new token when cookie not sent', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/requestNewToken')
      .expect(400);
    expect(res.body.message).toBe('No refresh token sent with request');
  });

  it('should successfully request new token', async () => {
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: storedUser.email,
        password: 'abcdef',
      } as Login)
      .expect(201);
    await request(app.getHttpServer())
      .get('/auth/requestNewToken')
      .set('Cookie', resLogIn.headers['set-cookie'])
      .expect(200);
  });
});
