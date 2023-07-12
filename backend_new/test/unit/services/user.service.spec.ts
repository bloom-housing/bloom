import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UserService } from '../../../src/services/user.service';
import { randomUUID } from 'crypto';
import { LanguagesEnum } from '@prisma/client';

describe('Testing user service', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUser = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      passwordUpdatedAt: date,
      passwordValidForDays: 180,
      confirmedAt: date,
      email: `exampleemail_${position}@test.com`,
      firstName: `first name ${position}`,
      middleName: `middle name ${position}`,
      lastName: `last name ${position}`,
      dob: date,
      listings: [],
      userRoles: { isPartner: true },
      language: LanguagesEnum.en,
      jurisdictions: [
        {
          id: randomUUID(),
        },
      ],
      mfaEnabled: false,
      lastLoginAt: date,
      failedLoginAttemptsCount: 0,
      phoneNumberVerified: true,
      agreedToTermsOfService: true,
      hitConfirmationURL: date,
      activeAccessToken: randomUUID(),
      activeRefreshToken: randomUUID(),
    };
  };

  const mockUserSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockUser(i, date));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return users from list() when no params are present', async () => {
    const date = new Date();
    const mockedValue = mockUserSet(3, date);
    prisma.userAccounts.findMany = jest.fn().mockResolvedValue(mockedValue);
    prisma.userAccounts.count = jest.fn().mockResolvedValue(3);

    expect(await service.list({}, null)).toEqual({
      items: mockedValue,
      meta: {
        currentPage: 1,
        itemCount: 3,
        itemsPerPage: 3,
        totalItems: 3,
        totalPages: 1,
      },
    });

    expect(prisma.userAccounts.findMany).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      skip: 0,
      where: {
        AND: [],
      },
    });
  });

  it('should return users from list() when params are present', async () => {
    const date = new Date();
    const mockedValue = mockUserSet(3, date);
    prisma.userAccounts.findMany = jest.fn().mockResolvedValue(mockedValue);
    prisma.userAccounts.count = jest.fn().mockResolvedValue(3);

    expect(
      await service.list(
        {
          search: 'search value',
          page: 2,
          limit: 5,
          filter: [
            {
              isPartner: true,
            },
          ],
        },
        null,
      ),
    ).toEqual({
      items: mockedValue,
      meta: {
        currentPage: 2,
        itemCount: 3,
        itemsPerPage: 5,
        totalItems: 3,
        totalPages: 1,
      },
    });

    expect(prisma.userAccounts.findMany).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      skip: 5,
      take: 5,
      where: {
        AND: [
          {
            OR: [
              {
                firstName: {
                  contains: 'search value',
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: 'search value',
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: 'search value',
                  mode: 'insensitive',
                },
              },
              {
                listings: {
                  some: {
                    name: {
                      contains: 'search value',
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          },
          {
            userRoles: {
              isPartner: true,
            },
          },
        ],
      },
    });
  });

  it('should return user from findOne() when id present', async () => {
    const date = new Date();
    const mockedValue = mockUser(3, date);
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual(mockedValue);

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        listings: true,
        jurisdictions: true,
        userRoles: true,
      },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('should error when calling findOne() when id not present', async () => {
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError('userId example Id was requested but not found');

    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      include: {
        listings: true,
        jurisdictions: true,
        userRoles: true,
      },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });
});
