import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import {
  ACCESS_TOKEN_AVAILABLE_NAME,
  ACCESS_TOKEN_AVAILABLE_OPTIONS,
  AuthService,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  TOKEN_COOKIE_NAME,
} from '../../../src/services/auth.service';
import { UserService } from '../../../src/services/user.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { SmsService } from '../../../src/services/sms.service';
import {
  generateSalt,
  hashPassword,
  passwordToHash,
} from '../../../src/utilities/password-helpers';
import { MfaType } from '../../../src/enums/mfa/mfa-type-enum';
import { EmailService } from '../../../src/services/email.service';
import { SendGridService } from '../../../src/services/sendgrid.service';
import { TranslationService } from '../../../src/services/translation.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { PermissionService } from '../../../src/services/permission.service';

describe('Testing auth service', () => {
  let authService: AuthService;
  let smsService: SmsService;
  let prisma: PrismaService;
  const sendMfaCodeMock = jest.fn();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: EmailService,
          useValue: {
            sendMfaCode: sendMfaCodeMock,
          },
        },
        ConfigService,
        PrismaService,
        SendGridService,
        TranslationService,
        JurisdictionService,
        SmsService,
        MailService,
        GoogleTranslateService,
        PermissionService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    smsService = module.get<SmsService>(SmsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a signed string when generating a new accessToken', () => {
    const id = randomUUID();
    const token = authService.generateAccessToken(
      {
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 100,
        email: 'example@exygy.com',
        firstName: 'Exygy',
        lastName: 'User',
        jurisdictions: [
          {
            id: randomUUID(),
          },
        ],
        agreedToTermsOfService: false,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      false,
    );
    expect(token).toEqual(
      sign(
        {
          sub: id,
          expiresIn: 86400000 / 24,
        },
        process.env.APP_SECRET,
      ),
    );
  });

  it('should return a signed string when generating a new refreshToken', () => {
    const id = randomUUID();
    const token = authService.generateAccessToken(
      {
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 100,
        email: 'example@exygy.com',
        firstName: 'Exygy',
        lastName: 'User',
        jurisdictions: [
          {
            id: randomUUID(),
          },
        ],
        agreedToTermsOfService: false,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      true,
    );
    expect(token).toEqual(
      sign(
        {
          sub: id,
          expiresIn: 86400000,
        },
        process.env.APP_SECRET,
      ),
    );
  });

  it('should set credentials when no incoming refresh token', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    await authService.setCredentials(response as unknown as Response, {
      passwordUpdatedAt: new Date(),
      passwordValidForDays: 100,
      email: 'example@exygy.com',
      firstName: 'Exygy',
      lastName: 'User',
      jurisdictions: [
        {
          id: randomUUID(),
        },
      ],
      agreedToTermsOfService: false,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        activeAccessToken: expect.anything(),
        activeRefreshToken: expect.anything(),
      },
      where: {
        id,
      },
    });

    expect(response.cookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      expect.anything(),
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.anything(),
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should set credentials with incoming refresh token and user exists', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });
    prisma.userAccounts.count = jest.fn().mockResolvedValue(1);

    await authService.setCredentials(
      response as unknown as Response,
      {
        passwordUpdatedAt: new Date(),
        passwordValidForDays: 100,
        email: 'example@exygy.com',
        firstName: 'Exygy',
        lastName: 'User',
        jurisdictions: [
          {
            id: randomUUID(),
          },
        ],
        agreedToTermsOfService: false,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'refreshToken',
    );

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        activeAccessToken: expect.anything(),
        activeRefreshToken: expect.anything(),
      },
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.count).toHaveBeenCalledWith({
      where: {
        id,
        activeRefreshToken: 'refreshToken',
      },
    });

    expect(response.cookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      expect.anything(),
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.anything(),
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should error when trying to set credentials with incoming refresh token and user does not exist', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });
    prisma.userAccounts.count = jest.fn().mockResolvedValue(0);

    await expect(
      async () =>
        await authService.setCredentials(
          response as unknown as Response,
          {
            passwordUpdatedAt: new Date(),
            passwordValidForDays: 100,
            email: 'example@exygy.com',
            firstName: 'Exygy',
            lastName: 'User',
            jurisdictions: [
              {
                id: randomUUID(),
              },
            ],
            agreedToTermsOfService: false,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          'refreshToken',
        ),
    ).rejects.toThrowError(
      `User ${id} was attempting to use outdated token refreshToken to generate new tokens`,
    );

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        activeAccessToken: null,
        activeRefreshToken: null,
      },
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.count).toHaveBeenCalledWith({
      where: {
        id,
        activeRefreshToken: 'refreshToken',
      },
    });

    expect(response.clearCookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.clearCookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should error when trying to set credentials,but user id not passed in', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });
    prisma.userAccounts.count = jest.fn().mockResolvedValue(0);

    await expect(
      async () =>
        await authService.setCredentials(
          response as unknown as Response,
          {
            passwordUpdatedAt: new Date(),
            passwordValidForDays: 100,
            email: 'example@exygy.com',
            firstName: 'Exygy',
            lastName: 'User',
            jurisdictions: [
              {
                id: randomUUID(),
              },
            ],
            agreedToTermsOfService: false,
            id: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          'refreshToken',
        ),
    ).rejects.toThrowError(`no user found`);

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();

    expect(prisma.userAccounts.count).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();
  });

  it('should error when trying to clear credentials,but user id not passed in', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    await expect(
      async () =>
        await authService.clearCredentials(response as unknown as Response, {
          passwordUpdatedAt: new Date(),
          passwordValidForDays: 100,
          email: 'example@exygy.com',
          firstName: 'Exygy',
          lastName: 'User',
          jurisdictions: [
            {
              id: randomUUID(),
            },
          ],
          agreedToTermsOfService: false,
          id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    ).rejects.toThrowError(`no user found`);

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();

    expect(response.clearCookie).not.toHaveBeenCalled();
  });

  it('should clear credentials when user exists', async () => {
    const id = randomUUID();
    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    await authService.clearCredentials(response as unknown as Response, {
      passwordUpdatedAt: new Date(),
      passwordValidForDays: 100,
      email: 'example@exygy.com',
      firstName: 'Exygy',
      lastName: 'User',
      jurisdictions: [
        {
          id: randomUUID(),
        },
      ],
      agreedToTermsOfService: false,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        activeAccessToken: null,
        activeRefreshToken: null,
      },
      where: {
        id,
      },
    });

    expect(response.clearCookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.clearCookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should request mfa code through email', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id: id,
      mfaEnabled: true,
      passwordHash: await passwordToHash('abcdef'),
      email: 'example@exygy.com',
      phoneNumberVerified: false,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    const res = await authService.requestMfaCode({
      email: 'example@exygy.com',
      password: 'abcdef',
      mfaType: MfaType.email,
    });

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'example@exygy.com',
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        mfaCode: expect.anything(),
        mfaCodeUpdatedAt: expect.anything(),
      },
      where: {
        id,
      },
    });
    expect(sendMfaCodeMock).toHaveBeenCalled();
    expect(res).toEqual({
      email: 'example@exygy.com',
      phoneNumberVerified: false,
    });
  });

  it('should request mfa code through sms', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id: id,
      mfaEnabled: true,
      passwordHash: await passwordToHash('abcdef'),
      email: 'example@exygy.com',
      phoneNumberVerified: false,
      phoneNumber: '520-781-8711',
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });
    smsService.client.messages.create = jest
      .fn()
      .mockResolvedValue({ success: true });

    const res = await authService.requestMfaCode({
      email: 'example@exygy.com',
      password: 'abcdef',
      mfaType: MfaType.sms,
    });

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'example@exygy.com',
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        mfaCode: expect.anything(),
        mfaCodeUpdatedAt: expect.anything(),
        phoneNumber: '520-781-8711',
      },
      where: {
        id,
      },
    });
    expect(sendMfaCodeMock).not.toHaveBeenCalled();
    expect(smsService.client.messages.create).toHaveBeenCalledWith({
      body: expect.anything(),
      from: expect.anything(),
      to: '520-781-8711',
    });
    expect(res).toEqual({
      phoneNumber: '520-781-8711',
      phoneNumberVerified: false,
    });
  });

  it('should error when trying to request mfa code, but mfa disabled', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id: id,
      mfaEnabled: false,
      passwordHash: await hashPassword('abcdef', generateSalt()),
      email: 'example@exygy.com',
      phoneNumberVerified: false,
      phoneNumber: '520-781-8711',
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id: id,
    });

    await expect(
      async () =>
        await await authService.requestMfaCode({
          email: 'example@exygy.com',
          password: 'abcdef',
          mfaType: MfaType.sms,
        }),
    ).rejects.toThrowError(
      'user example@exygy.com requested an mfa code, but has mfa disabled',
    );

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should error when trying to request mfa code, but incorrect password', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id: id,
      mfaEnabled: true,
      passwordHash: await hashPassword('abcdef', generateSalt()),
      email: 'example@exygy.com',
      phoneNumberVerified: false,
      phoneNumber: '520-781-8711',
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id: id,
    });

    await expect(
      async () =>
        await await authService.requestMfaCode({
          email: 'example@exygy.com',
          password: 'abcdef123',
          mfaType: MfaType.sms,
        }),
    ).rejects.toThrowError(
      'user example@exygy.com requested an mfa code, but provided incorrect password',
    );

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should generate mfa code', () => {
    expect(authService.generateMfaCode().length).toEqual(
      Number(process.env.MFA_CODE_LENGTH),
    );
  });

  it('should update password when correct token passed in', async () => {
    const id = randomUUID();
    const token = sign(
      {
        id,
      },
      process.env.APP_SECRET,
    );
    const response = {
      cookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({ id });

    await authService.updatePassword(
      {
        password: 'abcdef',
        passwordConfirmation: 'abcdef',
        token,
      },
      response as unknown as Response,
    );

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      where: {
        resetToken: token,
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        passwordHash: expect.anything(),
        passwordUpdatedAt: expect.anything(),
        resetToken: null,
      },
      where: {
        id,
      },
    });

    expect(response.cookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      expect.anything(),
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.anything(),
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should error when trying to update password, but there is an id mismatch', async () => {
    const id = randomUUID();
    const token = sign(
      {
        id,
      },
      process.env.APP_SECRET,
    );
    const secondId = randomUUID();
    const secondToken = sign(
      {
        id: secondId,
      },
      process.env.APP_SECRET,
    );

    const response = {
      cookie: jest.fn(),
    };
    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id: secondId });
    prisma.userAccounts.findFirst = jest
      .fn()
      .mockResolvedValue({ id: secondId, resetToken: secondToken });

    await expect(
      async () =>
        await authService.updatePassword(
          {
            password: 'abcdef',
            passwordConfirmation: 'abcdef',
            token,
          },
          response as unknown as Response,
        ),
    ).rejects.toThrowError(
      `resetToken ${token} does not match user ${secondId}'s reset token (${secondToken})`,
    );

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should confirm user no email no password', async () => {
    const id = randomUUID();
    const token = sign(
      {
        id,
      },
      process.env.APP_SECRET,
    );
    prisma.userAccounts.findUnique = jest
      .fn()
      .mockResolvedValue({ id, confirmationToken: token });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    await authService.confirmUser(
      {
        token,
      },
      response,
    );

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        confirmedAt: expect.anything(),
        confirmationToken: null,
      },
      where: {
        id,
      },
    });

    expect(response.cookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      expect.anything(),
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.anything(),
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });

  it('should confirm user with email and password', async () => {
    const id = randomUUID();
    const token = sign(
      {
        id,
        email: 'example@exygy.com',
      },
      process.env.APP_SECRET,
    );
    prisma.userAccounts.findUnique = jest
      .fn()
      .mockResolvedValue({ id, confirmationToken: token });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    await authService.confirmUser(
      {
        token,
        password: 'abcdef',
      },
      response,
    );

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        confirmedAt: expect.anything(),
        confirmationToken: null,
        email: 'example@exygy.com',
        passwordHash: expect.anything(),
        passwordUpdatedAt: expect.anything(),
      },
      where: {
        id,
      },
    });

    expect(response.cookie).toHaveBeenCalledWith(
      TOKEN_COOKIE_NAME,
      expect.anything(),
      AUTH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      expect.anything(),
      REFRESH_COOKIE_OPTIONS,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );
  });
});
