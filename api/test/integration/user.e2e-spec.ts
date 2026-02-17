import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import cookieParser from 'cookie-parser';
import { UserQueryParams } from '../../src/dtos/users/user-query-param.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { EmailAndAppUrl } from '../../src/dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../../src/dtos/users/confirmation-request.dto';
import { UserService } from '../../src/services/user.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import { randomName } from '../../prisma/seed-helpers/word-generator';
import { EmailService } from '../../src/services/email.service';
import { Login } from '../../src/dtos/auth/login.dto';
import { RequestMfaCode } from '../../src/dtos/mfa/request-mfa-code.dto';
import { ModificationEnum } from '../../src/enums/shared/modification-enum';
import dayjs from 'dayjs';
import { PublicUserUpdate } from '../../src/dtos/users/public-user-update.dto';
import { PublicUserCreate } from '../../src/dtos/users/public-user-create.dto';
import { PartnerUserCreate } from '../../src/dtos/users/partner-user-create.dto';

describe('User Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userService: UserService;
  let emailService: EmailService;
  let cookies = '';
  let logger: Logger;

  const invitePartnerUserMock = jest.fn();
  const testEmailService = {
    confirmation: jest.fn(),
    welcome: jest.fn(),
    invitePartnerUser: invitePartnerUserMock,
    changeEmail: jest.fn(),
    forgotPassword: jest.fn(),
    sendMfaCode: jest.fn(),
    sendCSV: jest.fn(),
    warnOfAccountRemoval: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    process.env.PARTNERS_PORTAL_URL = 'http://localhost:3001/';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(testEmailService)
      .overrideProvider(Logger)
      .useValue({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userService = moduleFixture.get<UserService>(UserService);
    emailService = moduleFixture.get<EmailService>(EmailService);
    logger = moduleFixture.get<Logger>(Logger);

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

  describe('list endpoint', () => {
    // without clearing the db between tests or test suites this is flakes because of other e2e tests
    it.skip('should get no users from list() when no params and no data', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/list?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);
      expect(res.body.items.length).toEqual(0);
    });

    it('should get users from list() when no params', async () => {
      await prisma.userAccounts.create({
        data: await userFactory(),
      });
      await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const res = await request(app.getHttpServer())
        .get(`/user/list?`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    });

    it('should get users from list() when params sent', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isPartner: true },
          firstName: '1110',
        }),
      });
      const userB = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isPartner: true },
          firstName: '1111',
        }),
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
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
      expect(res.body.items.length).toBeGreaterThanOrEqual(2);
      const ids = res.body.items.map((item) => item.id);
      expect(ids).toContain(userA.id);
      expect(ids).toContain(userB.id);
    });
  });

  describe('retrieve endpoint', () => {
    it("should error when retrieve() called with id that doesn't exist", async () => {
      const id = randomUUID();
      const res = await request(app.getHttpServer())
        .get(`/user/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(404);
      expect(res.body.message).toEqual(
        `user id: ${id} was requested but not found`,
      );
    });

    it('should get user from retrieve()', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const res = await request(app.getHttpServer())
        .get(`/user/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.id).toEqual(userA.id);
    });
  });

  describe('update endpoint', () => {
    it('should update user when user exists', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const res = await request(app.getHttpServer())
        .put(`/user/public`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as PublicUserUpdate)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.id).toEqual(userA.id);
      expect(res.body.firstName).toEqual('New User First Name');
      expect(res.body.lastName).toEqual('New User Last Name');

      const userASnapshot = await prisma.userAccountSnapshot.findFirst({
        where: {
          originalId: userA.id,
        },
      });
      expect(!!userASnapshot.id).toBe(true);
      expect(userASnapshot.firstName).toEqual(userA.firstName);
    });

    it("should error when updating user that doesn't exist", async () => {
      await prisma.userAccounts.create({
        data: await userFactory(),
      });
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .put(`/user/public`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: randomId,
          firstName: 'New User First Name',
          lastName: 'New User Last Name',
        } as PublicUserUpdate)
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `user id: ${randomId} was requested but not found`,
      );
    });
  });

  describe('delete endpoint', () => {
    it('should delete admin user when user exists', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory({ roles: { isAdmin: true } }),
      });

      const res = await request(app.getHttpServer())
        .delete(`/user`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);
    });

    it('should delete public user when user exists', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const res = await request(app.getHttpServer())
        .delete(`/user`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: userA.id,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toEqual(true);
    });

    it("should error when deleting user that doesn't exist", async () => {
      const randomId = randomUUID();
      const res = await request(app.getHttpServer())
        .delete(`/user`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: randomId,
        } as IdDTO)
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `user id: ${randomId} was requested but not found`,
      );
    });
  });

  describe('resend confirmation endpoint', () => {
    it('should resend confirmation for public when user exists', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const res = await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.success).toEqual(true);
      const mockWelcome = jest.spyOn(testEmailService, 'welcome');
      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.email).toBe(userA.email);
      expect(userPostResend.confirmationToken).not.toBeNull();
      expect(mockWelcome.mock.calls.length).toBe(1);
    });

    it('should succeed when trying to resend confirmation but not update record when user is already confirmed', async () => {
      const userA = await prisma.userAccounts.create({
        data: {
          ...(await userFactory()),
          confirmedAt: new Date(),
        },
      });

      const mockWelcome = jest.spyOn(testEmailService, 'welcome');
      const res = await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.success).toEqual(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.email).toBe(userA.email);
      expect(userPostResend.confirmationToken).toBeNull();
      expect(mockWelcome.mock.calls.length).toBe(0);
    });

    it('should error trying to resend confirmation but no user exists', async () => {
      const email = 'test@nonexistent.com';
      const mockWelcome = jest.spyOn(testEmailService, 'welcome');
      const res = await request(app.getHttpServer())
        .post(`/user/resend-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `user email: ${email} was requested but not found`,
      );
      expect(mockWelcome.mock.calls.length).toBe(0);
    });
  });

  describe('resend confirmation partners endpoint', () => {
    it('should resend partner confirmation when user exists', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });
      const mockinvitePartnerUser = jest.spyOn(
        testEmailService,
        'invitePartnerUser',
      );
      const res = await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.success).toEqual(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.email).toBe(userA.email);
      expect(userPostResend.confirmationToken).not.toBeNull();
      expect(mockinvitePartnerUser.mock.calls.length).toBe(1);
    });

    it('should succeed when trying to resend partner confirmation but not update record when user is already confirmed', async () => {
      const mockinvitePartnerUser = jest.spyOn(
        testEmailService,
        'invitePartnerUser',
      );
      const userA = await prisma.userAccounts.create({
        data: {
          ...(await userFactory()),
          confirmedAt: new Date(),
        },
      });

      const res = await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.success).toEqual(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.email).toBe(userA.email);
      expect(userPostResend.confirmationToken).toBeNull();
      expect(mockinvitePartnerUser.mock.calls.length).toBe(0);
    });

    it('should error trying to resend partner confirmation but no user exists', async () => {
      const email = 'test@nonexistent.com';
      const res = await request(app.getHttpServer())
        .post(`/user/resend-partner-confirmation/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: email,
          appUrl: 'https://www.google.com',
        } as EmailAndAppUrl)
        .set('Cookie', cookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `user email: ${email} was requested but not found`,
      );
    });
  });

  describe('verify endpoint', () => {
    it('should verify token as valid', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const confToken = userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: confToken,
          confirmedAt: null,
        },
      });
      const res = await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          token: confToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.success).toEqual(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.hitConfirmationUrl).not.toBeNull();
      expect(userPostResend.confirmationToken).toEqual(confToken);
    });

    it('should fail to verify token when incorrect user id is provided', async () => {
      const mockConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation();
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const storedConfToken = userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: storedConfToken,
          confirmedAt: null,
        },
      });

      const fakeConfToken = userService.createConfirmationToken(
        randomUUID(),
        userA.email,
      );
      const res = await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          token: fakeConfToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(undefined);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.hitConfirmationUrl).toBeNull();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'isUserConfirmationTokenValid error = ',
        expect.anything(),
      );
    });

    it('should fail to verify token when token mismatch', async () => {
      const userA = await prisma.userAccounts.create({
        data: await userFactory(),
      });

      const storedConfToken = userService.createConfirmationToken(
        userA.id,
        userA.email,
      );
      await prisma.userAccounts.update({
        where: {
          id: userA.id,
        },
        data: {
          confirmationToken: storedConfToken,
          confirmedAt: null,
        },
      });

      const fakeConfToken = userService.createConfirmationToken(
        userA.id,
        userA.email + 'x',
      );
      const res = await request(app.getHttpServer())
        .post(`/user/is-confirmation-token-valid/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          token: fakeConfToken,
        } as ConfirmationRequest)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(undefined);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.hitConfirmationUrl).toBeNull();
    });
  });

  describe('forgot password endpoint', () => {
    it('should set resetToken when forgot-password is called by public user on the public site', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const userA = await prisma.userAccounts.create({
        data: await userFactory({ jurisdictionIds: [juris.id] }),
      });

      const mockforgotPassword = jest.spyOn(testEmailService, 'forgotPassword');
      const res = await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: juris.publicUrl,
        } as EmailAndAppUrl)
        .expect(200);

      expect(res.body.success).toBe(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.resetToken).not.toBeNull();
      expect(mockforgotPassword.mock.calls.length).toBe(1);
    });

    it('should not set resetToken when forgot-password is called by public user on the partners site', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(
          `forgotPassword-jurisdiction-${randomName()}`,
        ),
      });

      const userA = await prisma.userAccounts.create({
        data: await userFactory({ jurisdictionIds: [juris.id] }),
      });

      const mockforgotPassword = jest.spyOn(testEmailService, 'forgotPassword');
      const res = await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: process.env.PARTNERS_PORTAL_URL,
        } as EmailAndAppUrl)
        .expect(200);

      expect(res.body.success).toBe(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.resetToken).toBeNull();
      expect(mockforgotPassword.mock.calls.length).toBe(0);
    });

    it('should set resetToken when forgot-password is called by partner user on the partners site', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const userA = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
          jurisdictionIds: [juris.id],
        }),
      });

      const mockforgotPassword = jest.spyOn(testEmailService, 'forgotPassword');
      const res = await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: process.env.PARTNERS_PORTAL_URL,
        } as EmailAndAppUrl)
        .expect(200);

      expect(res.body.success).toBe(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.resetToken).not.toBeNull();
      expect(mockforgotPassword.mock.calls.length).toBe(1);
    });

    it('should not set resetToken when forgot-password is called by partner user on the public site', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const userA = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
          jurisdictionIds: [juris.id],
        }),
      });

      const mockforgotPassword = jest.spyOn(testEmailService, 'forgotPassword');
      const res = await request(app.getHttpServer())
        .put(`/user/forgot-password/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          appUrl: juris.publicUrl,
        } as EmailAndAppUrl)
        .expect(200);

      expect(res.body.success).toBe(true);

      const userPostResend = await prisma.userAccounts.findUnique({
        where: {
          id: userA.id,
        },
      });

      expect(userPostResend.resetToken).toBeNull();
      expect(mockforgotPassword.mock.calls.length).toBe(0);
    });
  });

  describe('create endpoint', () => {
    it('should create public user', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const data = await applicationFactory();
      data.applicant.create.emailAddress = 'publicuser@email.com';
      const application = await prisma.applications.create({
        data,
      });

      const res = await request(app.getHttpServer())
        .post(`/user/public/`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          firstName: 'Public First Name',
          lastName: 'Public Last Name',
          password: 'Abcdef12345!',
          passwordConfirmation: 'Abcdef12345!',
          email: 'publicUser@email.com',
          emailConfirmation: 'publicUser@email.com',
          dob: new Date(),
          jurisdictions: [{ id: juris.id }],
        } as PublicUserCreate)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.firstName).toEqual('Public First Name');
      expect(res.body.jurisdictions).toEqual([
        expect.objectContaining({ id: juris.id, name: juris.name }),
      ]);
      expect(res.body.email).toEqual('publicuser@email.com');

      const applicationsOnUser = await prisma.userAccounts.findUnique({
        include: {
          applications: true,
        },
        where: {
          id: res.body.id,
        },
      });
      expect(applicationsOnUser.applications.map((app) => app.id)).toContain(
        application.id,
      );
    });
  });

  describe('invite partner endpoint', () => {
    it('should create partner user', async () => {
      const juris = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const res = await request(app.getHttpServer())
        .post(`/user/partner`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          password: 'Abcdef12345!',
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: juris.id }],
          agreedToTermsOfService: true,
          userRoles: {
            isAdmin: true,
          },
        } as PartnerUserCreate)
        .set('Cookie', cookies)
        .expect(201);

      expect(res.body.firstName).toEqual('Partner User firstName');
      expect(res.body.jurisdictions).toEqual([
        expect.objectContaining({ id: juris.id, name: juris.name }),
      ]);
      expect(res.body.email).toEqual('partneruser@email.com');
    });
  });

  describe('request single use code endpoint', () => {
    it('should request single use code successfully', async () => {
      const storedUser = await prisma.userAccounts.create({
        data: await userFactory({
          roles: { isAdmin: true },
          mfaEnabled: true,
          confirmedAt: new Date(),
          phoneNumber: '111-111-1111',
          phoneNumberVerified: true,
        }),
      });

      const jurisdiction = await prisma.jurisdictions.create({
        data: {
          name: 'single_use_code_1',
          allowSingleUseCodeLogin: true,
          rentalAssistanceDefault: 'test',
        },
      });
      emailService.sendSingleUseCode = jest.fn();

      const res = await request(app.getHttpServer())
        .post('/user/request-single-use-code')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: storedUser.email,
        } as RequestMfaCode)
        .set({ jurisdictionname: jurisdiction.name })
        .expect(201);

      expect(res.body).toEqual({ success: true });

      expect(emailService.sendSingleUseCode).toHaveBeenCalled();

      const user = await prisma.userAccounts.findUnique({
        where: {
          id: storedUser.id,
        },
      });

      expect(user.singleUseCode).not.toBeNull();
      expect(user.singleUseCodeUpdatedAt).not.toBeNull();
    });

    it('should request single use code, but user does not exist', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: {
          name: 'single_use_code_3',
          allowSingleUseCodeLogin: true,
          rentalAssistanceDefault: 'test',
        },
      });
      emailService.sendSingleUseCode = jest.fn();

      const res = await request(app.getHttpServer())
        .post('/user/request-single-use-code')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: 'thisEmailDoesNotExist@exygy.com',
        } as RequestMfaCode)
        .set({ jurisdictionname: jurisdiction.name })
        .expect(201);
      expect(res.body.success).toEqual(true);

      expect(emailService.sendSingleUseCode).not.toHaveBeenCalled();
    });
  });

  describe('modify favorite listings endpoint', () => {
    let favoriteListingsCookies = '';
    let userA;
    let jurisdictionId;
    let removeListingId;

    beforeAll(async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      jurisdictionId = jurisdiction.id;

      const removeListing = await prisma.listings.create({
        data: await listingFactory(jurisdictionId, prisma),
      });

      removeListingId = removeListing.id;

      userA = await prisma.userAccounts.create({
        data: await userFactory({
          confirmedAt: new Date(),
          favoriteListings: [removeListingId],
          mfaEnabled: false,
          password: 'Abcdef12345!',
        }),
      });

      const resLogIn = await request(app.getHttpServer())
        .post('/auth/login')
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          email: userA.email,
          password: 'Abcdef12345!',
        } as Login)
        .expect(201);

      favoriteListingsCookies = resLogIn.headers['set-cookie'];
    });

    it('should add a listing to favorite listing', async () => {
      const addListing = await prisma.listings.create({
        data: await listingFactory(jurisdictionId, prisma),
      });

      // Verify favorites endpoint
      let res = await request(app.getHttpServer())
        .get(`/user/favoriteListings/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', favoriteListingsCookies)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);

      // Favorite a new listing
      res = await request(app.getHttpServer())
        .put(`/user/modifyFavoriteListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: addListing.id,
          action: ModificationEnum.add,
        })
        .set('Cookie', favoriteListingsCookies)
        .expect(200);

      expect(res.body.favoriteListings.length).toBeGreaterThanOrEqual(2);
      const ids = res.body.favoriteListings.map((listing) => listing.id);
      expect(ids).toContain(addListing.id);

      // Verify favorites endpoint after the new favorite
      res = await request(app.getHttpServer())
        .get(`/user/favoriteListings/${userA.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', favoriteListingsCookies)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body.map((listing) => listing.id)).toContain(addListing.id);
    });

    it('should remove a listing from favorite listing', async () => {
      const res = await request(app.getHttpServer())
        .put(`/user/modifyFavoriteListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: removeListingId,
          action: ModificationEnum.remove,
        })
        .set('Cookie', favoriteListingsCookies)
        .expect(200);

      const ids = res.body.favoriteListings.map((listing) => listing.id);
      expect(ids).not.toContain(removeListingId);
    });

    it('should throw a not found error when listing does not exist', async () => {
      const invalidId = randomUUID();

      const res = await request(app.getHttpServer())
        .put(`/user/modifyFavoriteListings`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .send({
          id: invalidId,
          action: ModificationEnum.add,
        })
        .set('Cookie', favoriteListingsCookies)
        .expect(404);

      expect(res.body.message).toEqual(
        `listingId ${invalidId} was requested but not found`,
      );
    });
  });

  describe('delete after inactivity endpoint', () => {
    it('should delete user after inactivity', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = '1095';
      const publicUserStillActive = await prisma.userAccounts.create({
        data: await userFactory({
          lastLoginAt: dayjs(new Date()).subtract(60, 'days').toDate(),
          wasWarnedOfDeletion: false,
        }),
      });
      const partnerUserInactive = await prisma.userAccounts.create({
        data: await userFactory({
          lastLoginAt: dayjs(new Date()).subtract(6000, 'days').toDate(),
          wasWarnedOfDeletion: false,
          roles: { isPartner: true },
        }),
      });
      const publicUserInactiveNotWarned = await prisma.userAccounts.create({
        data: await userFactory({
          lastLoginAt: dayjs(new Date()).subtract(1100, 'days').toDate(),
          wasWarnedOfDeletion: false,
        }),
      });
      const publicUserInactiveWarned = await prisma.userAccounts.create({
        data: await userFactory({
          lastLoginAt: dayjs(new Date()).subtract(1100, 'days').toDate(),
          wasWarnedOfDeletion: true,
        }),
      });
      const data = await applicationFactory({
        userId: publicUserInactiveWarned.id,
      });
      const application = await prisma.applications.create({
        data,
      });
      await request(app.getHttpServer())
        .put(`/user/deleteInactiveUsersCronJob`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);

      const deletedUser = await prisma.userAccounts.findFirst({
        where: { id: publicUserInactiveWarned.id },
      });
      expect(deletedUser).toBeNull();

      const nonDeletedUsers = await prisma.userAccounts.findMany({
        where: {
          id: {
            in: [
              publicUserInactiveNotWarned.id,
              publicUserStillActive.id,
              partnerUserInactive.id,
            ],
          },
        },
      });
      expect(nonDeletedUsers).toHaveLength(3);
      expect(logger.warn).toBeCalledWith(
        `Unable to delete user ${publicUserInactiveNotWarned.id} because they have not been warned by email`,
      );
      // Validate PII was removed from applications
      const updatedApplication = await prisma.applications.findFirst({
        include: { applicant: true, applicationsMailingAddress: true },
        where: { id: application.id },
      });
      expect(updatedApplication.additionalPhoneNumber).toBeNull();
      expect(updatedApplication.applicant.birthDay).toBeNull();
      expect(updatedApplication.applicant.birthMonth).toBeNull();
      expect(updatedApplication.applicant.birthYear).toBeNull();
      expect(updatedApplication.applicant.firstName).toBeNull();
      expect(updatedApplication.applicant.lastName).toBeNull();
      expect(updatedApplication.applicationsMailingAddress.street).toBeNull();
      expect(updatedApplication.applicationsMailingAddress.city).not.toBeNull();
    });
  });

  describe('warnUserOfDeletionCronJob endpoint', () => {
    let userA;
    let userB;
    let userC;
    let userD;
    let userE;
    beforeAll(async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = '1095';
      // Public User that should be warned
      userA = await prisma.userAccounts.create({
        data: await userFactory({
          firstName: 'A',
          confirmedAt: new Date(),
          lastLoginAt: dayjs(new Date()).subtract(4, 'years').toDate(),
        }),
      });
      // User that has logged in recently
      userB = await prisma.userAccounts.create({
        data: await userFactory({
          firstName: 'B',
          confirmedAt: new Date(),
          lastLoginAt: dayjs(new Date()).subtract(4, 'days').toDate(),
        }),
      });
      // Partner user
      userC = await prisma.userAccounts.create({
        data: await userFactory({
          firstName: 'C',
          confirmedAt: new Date(),
          roles: { isAdmin: true },
          lastLoginAt: dayjs(new Date()).subtract(1200, 'days').toDate(),
        }),
      });
      // User that has already been warned
      userD = await prisma.userAccounts.create({
        data: await userFactory({
          firstName: 'D',
          confirmedAt: new Date(),
          lastLoginAt: dayjs(new Date()).subtract(4, 'years').toDate(),
          wasWarnedOfDeletion: true,
        }),
      });
      // Public User that should be warned in spanish
      userE = await prisma.userAccounts.create({
        data: await userFactory({
          firstName: 'E',
          confirmedAt: new Date(),
          lastLoginAt: dayjs(new Date()).subtract(4, 'years').toDate(),
          language: LanguagesEnum.es,
        }),
      });
    });
    it('should send warning email to only public users over the date', async () => {
      const mockWarnOfAccountRemoval = jest.spyOn(
        testEmailService,
        'warnOfAccountRemoval',
      );
      const res = await request(app.getHttpServer())
        .put(`/user/userWarnCronJob`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .expect(200);
      expect(res.text).toBe('{"success":true}');
      const updatedUserA = await prisma.userAccounts.findFirst({
        where: { id: userA.id },
      });
      expect(updatedUserA.wasWarnedOfDeletion).toBe(true);
      const updatedUserB = await prisma.userAccounts.findFirst({
        where: { id: userB.id },
      });
      expect(updatedUserB.wasWarnedOfDeletion).toBe(false);
      const updatedUserC = await prisma.userAccounts.findFirst({
        where: { id: userC.id },
      });
      expect(updatedUserC.wasWarnedOfDeletion).toBe(false);
      const updatedUserD = await prisma.userAccounts.findFirst({
        where: { id: userD.id },
      });
      expect(updatedUserD.wasWarnedOfDeletion).toBe(true);
      expect(mockWarnOfAccountRemoval.mock.calls.length).toBeGreaterThanOrEqual(
        2,
      );
      expect(mockWarnOfAccountRemoval).toBeCalledWith(
        expect.objectContaining({ email: userA.email, id: userA.id }),
      );
      expect(mockWarnOfAccountRemoval).toBeCalledWith(
        expect.objectContaining({
          email: userE.email,
          id: userE.id,
          language: LanguagesEnum.es,
        }),
      );
    });
  });
});
