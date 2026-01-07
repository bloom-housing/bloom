import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../../src/services/prisma.service';
import { JwtStrategy } from '../../../src/passports/jwt.strategy';
import { TOKEN_COOKIE_NAME } from '../../../src/services/auth.service';

describe('Testing jwt strategy', () => {
  let strategy: JwtStrategy;
  let prisma: PrismaService;
  beforeAll(async () => {
    process.env.APP_SECRET = 'SOME-LONG-SECRET-KEY';
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, PrismaService],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should fail because user does not exist', async () => {
    const id = randomUUID();
    const token = sign(
      {
        sub: id,
      },
      process.env.APP_SECRET,
    );
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);

    const request = {
      cookies: {
        [TOKEN_COOKIE_NAME]: token,
      },
    };

    await expect(
      async () =>
        await strategy.validate(request as unknown as Request, { sub: id }),
    ).rejects.toThrowError(`user ${id} does not exist`);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: {
          include: {
            featureFlags: {
              select: {
                active: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  });

  it('should not fail because user password is outdated', async () => {
    const id = randomUUID();
    const token = sign(
      {
        sub: id,
      },
      process.env.APP_SECRET,
    );
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id,
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(0),
      activeAccessToken: token,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    const request = {
      cookies: {
        [TOKEN_COOKIE_NAME]: token,
      },
    };

    await strategy.validate(request as unknown as Request, { sub: id });

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: {
          include: {
            featureFlags: {
              select: {
                active: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should fail because stored token does not match incoming token', async () => {
    const id = randomUUID();
    const token = sign(
      {
        sub: id,
      },
      process.env.APP_SECRET,
    );
    const activeToken = randomUUID();
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id,
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      activeAccessToken: activeToken,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    const request = {
      cookies: {
        [TOKEN_COOKIE_NAME]: token,
      },
    };

    await expect(
      async () =>
        await strategy.validate(request as unknown as Request, { sub: id }),
    ).rejects.toThrowError();

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: {
          include: {
            featureFlags: {
              select: {
                active: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
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
  });

  it('should succeed user validation', async () => {
    const id = randomUUID();
    const token = sign(
      {
        sub: id,
      },
      process.env.APP_SECRET,
    );
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id,
      passwordValidForDays: 100,
      passwordUpdatedAt: new Date(),
      activeAccessToken: token,
    });

    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    const request = {
      cookies: {
        [TOKEN_COOKIE_NAME]: token,
      },
    };

    await strategy.validate(request as unknown as Request, { sub: id });

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: {
          include: {
            featureFlags: {
              select: {
                active: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });
});
