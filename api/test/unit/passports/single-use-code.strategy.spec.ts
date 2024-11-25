import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { passwordToHash } from '../../../src/utilities/password-helpers';
import { SingleUseCodeStrategy } from '../../../src/passports/single-use-code.strategy';
import { LoginViaSingleUseCode } from '../../../src/dtos/auth/login-single-use-code.dto';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';

describe('Testing single-use-code strategy', () => {
  let strategy: SingleUseCodeStrategy;
  let prisma: PrismaService;
  beforeAll(async () => {
    process.env.MFA_CODE_VALID = '60000';
    process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS = '5';
    process.env.AUTH_LOCK_LOGIN_COOLDOWN = '1800000';
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingleUseCodeStrategy, PrismaService],
    }).compile();

    strategy = module.get<SingleUseCodeStrategy>(SingleUseCodeStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should fail because user does not exist', async () => {
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(
      `user example@exygy.com attempted to log in, but does not exist`,
    );

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });
    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail because user is locked out', async () => {
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 10,
      agreedToTermsOfService: true,
    });
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`Failed login attempts exceeded.`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });
    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if no singleUseCode is stored', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCodeUpdatedAt: new Date(),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`Unauthorized Exception`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if no singleUseCodeUpdatedAt is stored', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`Unauthorized Exception`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if no singleUseCode is sent', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`Unauthorized Exception`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if singleUseCode is incorrect', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv1',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`singleUseCodeUnauthorized`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        singleUseCode: 'zyxwv',
        singleUseCodeUpdatedAt: expect.anything(),
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 1,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if singleUseCode is expired', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(0),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`singleUseCodeUnauthorized`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        singleUseCode: 'zyxwv',
        singleUseCodeUpdatedAt: expect.anything(),
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 1,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if jurisdiction does not exist', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(0),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`Jurisidiction juris 1 does not exists`);

    expect(prisma.userAccounts.findFirst).not.toHaveBeenCalled();

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should fail if jurisdiction is missing from header', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(0),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(
      `jurisdictionname is missing from the request headers`,
    );

    expect(prisma.userAccounts.findFirst).not.toHaveBeenCalled();

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();

    expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
  });

  it('should fail if agreedToTermsOfService is false', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(),
      agreedToTermsOfService: false,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`User ${id} has not accepted the terms of service`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should succeed', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(),
      agreedToTermsOfService: true,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await strategy.validate(request as unknown as Request);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        singleUseCode: null,
        singleUseCodeUpdatedAt: expect.anything(),
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });

  it('should succeed when agreeing to terms of service', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('Abcdef12345!'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      singleUseCode: 'zyxwv',
      singleUseCodeUpdatedAt: new Date(),
      agreedToTermsOfService: false,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      allowSingleUseCodeLogin: true,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        singleUseCode: 'zyxwv',
        agreedToTermsOfService: true,
      } as LoginViaSingleUseCode,
      headers: { jurisdictionname: 'juris 1' },
    };

    await strategy.validate(request as unknown as Request);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: 'example@exygy.com',
      },
    });

    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        singleUseCode: null,
        singleUseCodeUpdatedAt: expect.anything(),
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });

    expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: 'juris 1',
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
  });
});
