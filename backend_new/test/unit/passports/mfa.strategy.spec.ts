import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { MfaStrategy } from '../../../src/passports/mfa.strategy';
import { MfaType } from '../../../src/enums/mfa/mfa-type-enum';
import { Login } from '../../../src/dtos/auth/login.dto';
import { passwordToHash } from '../../../src/utilities/password-helpers';

describe('Testing mfa strategy', () => {
  let strategy: MfaStrategy;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MfaStrategy, PrismaService],
    }).compile();

    strategy = module.get<MfaStrategy>(MfaStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should fail because user does not exist', async () => {
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
  });

  it('should fail because user is locked out', async () => {
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: randomUUID(),
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 10,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
  });

  it('should fail because user is not confirmed', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: null,
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(
      `user ${id} attempted to login, but is not confirmed`,
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
  });

  it('should fail because password is outdated', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 0,
      passwordUpdatedAt: new Date(0),
      userRoles: { isAdmin: true },
    });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(
      `user ${id} attempted to login, but password is no longer valid`,
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
  });

  it('should fail because user password is invalid', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef123'),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
        failedLoginAttemptsCount: 1,
        lastLoginAt: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should succeed if not an mfa user', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: false,
      phoneNumberVerified: false,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
        mfaCode: null,
        mfaCodeUpdatedAt: null,
        phoneNumberVerified: null,
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });
  });

  it('should fail if no mfaCode is stored', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCodeUpdatedAt: new Date(),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
  });

  it('should fail if no mfaCodeUpdatedAt is stored', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
  });

  it('should fail if no mfaCode is sent', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaType: MfaType.sms,
      } as Login,
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
  });

  it('should fail if no mfaCode is incorrect', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv1',
        mfaType: MfaType.sms,
      } as Login,
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`mfaUnauthorized`);

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
        mfaCode: 'zyxwv',
        mfaCodeUpdatedAt: expect.anything(),
        phoneNumberVerified: false,
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 1,
      },
      where: {
        id,
      },
    });
  });

  it('should fail if no mfaCode is expired', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(0),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
    };

    await expect(
      async () => await strategy.validate(request as unknown as Request),
    ).rejects.toThrowError(`mfaUnauthorized`);

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
        mfaCode: 'zyxwv',
        mfaCodeUpdatedAt: expect.anything(),
        phoneNumberVerified: false,
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 1,
      },
      where: {
        id,
      },
    });
  });

  it('should succeed and set phoneNumberVerified', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.sms,
      } as Login,
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
        mfaCode: null,
        mfaCodeUpdatedAt: expect.anything(),
        phoneNumberVerified: true,
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });
  });

  it('should succeed and leave phoneNumberVerified false', async () => {
    const id = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id: id,
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 0,
      confirmedAt: new Date(),
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      userRoles: { isAdmin: false },
      passwordHash: await passwordToHash('abcdef'),
      mfaEnabled: true,
      phoneNumberVerified: false,
      mfaCode: 'zyxwv',
      mfaCodeUpdatedAt: new Date(),
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({ id });

    const request = {
      body: {
        email: 'example@exygy.com',
        password: 'abcdef',
        mfaCode: 'zyxwv',
        mfaType: MfaType.email,
      } as Login,
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
        mfaCode: null,
        mfaCodeUpdatedAt: expect.anything(),
        phoneNumberVerified: false,
        lastLoginAt: expect.anything(),
        failedLoginAttemptsCount: 0,
      },
      where: {
        id,
      },
    });
  });
});
