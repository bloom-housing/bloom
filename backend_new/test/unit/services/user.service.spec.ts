import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UserService } from '../../../src/services/user.service';
import { randomUUID } from 'crypto';
import { LanguagesEnum } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { passwordToHash } from '../../../src/utilities/password-helpers';
import { IdDTO } from '../../../src/dtos/shared/id.dto';

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
              isPortalUser: true,
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
        ],
      },
    });
  });

  it('should return user from findOne() when id present', async () => {
    const date = new Date();
    const mockedValue = mockUser(3, date);
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual(mockedValue);

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        listings: true,
        jurisdictions: true,
        userRoles: true,
      },
      where: {
        id: 'example Id',
      },
    });
  });

  it('should error when calling findOne() when id not present', async () => {
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError('user example Id was requested but not found');

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        listings: true,
        jurisdictions: true,
        userRoles: true,
      },
      where: {
        id: 'example Id',
      },
    });
  });

  it('should encode a confirmation token correctly', () => {
    const id = randomUUID();
    const res = service.createConfirmationToken(id, 'example@email.com');
    expect(res).not.toBeNull();
    const decoded = verify(res, process.env.APP_SECRET) as IdDTO;
    expect(decoded.id).toEqual(id);
  });

  it('should build public confirmation url', () => {
    const res = service.getPublicConfirmationUrl('url', 'tokenExample');
    expect(res).toEqual('url?token=tokenExample');
  });

  it('should build partner confirmation url', () => {
    const res = service.getPartnersConfirmationUrl('url', 'tokenExample');
    expect(res).toEqual('url/users/confirm?token=tokenExample');
  });

  it('should verify that there is a jurisdiciton mismatch', () => {
    const res = service.jurisdictionMismatch(
      [{ id: 'id a' }],
      [{ id: 'id 1' }],
    );
    expect(res).toEqual(true);
  });

  it('should verify that there is not a jurisdiciton mismatch', () => {
    const res = service.jurisdictionMismatch(
      [{ id: 'id a' }, { id: 'id b' }],
      [{ id: 'id b' }, { id: 'id a' }],
    );
    expect(res).toEqual(false);
  });

  it('should find user by id and include joins', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    const res = await service.findUserOrError({ userId: id }, true);
    expect(res).toEqual({ id });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        id,
      },
    });
  });

  it('should find user by email and include joins', async () => {
    const email = 'example@email.com';
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      email,
    });
    const res = await service.findUserOrError({ email: email }, true);
    expect(res).toEqual({ email });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        email,
      },
    });
  });

  it('should find user by id and no joins', async () => {
    const id = randomUUID();
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    const res = await service.findUserOrError({ userId: id }, false);
    expect(res).toEqual({ id });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
  });

  it('should find user by email and no joins', async () => {
    const email = 'example@email.com';
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      email,
    });
    const res = await service.findUserOrError({ email: email }, false);
    expect(res).toEqual({ email });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
  });

  it('should throw when could not find user', async () => {
    const email = 'example@email.com';
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    await expect(
      async () => await service.findUserOrError({ email: email }, false),
    ).rejects.toThrowError(
      'user example@email.com was requested but not found',
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
  });

  it('should connect user when matching applications exist', async () => {
    const id = randomUUID();
    const email = 'example@email.com';
    prisma.applications.findMany = jest
      .fn()
      .mockReturnValue([{ id: 'app id 1' }, { id: 'app id 2' }]);

    prisma.applications.update = jest.fn().mockReturnValue(null);
    await service.connectUserWithExistingApplications(email, id);
    expect(prisma.applications.findMany).toHaveBeenCalledWith({
      where: {
        applicant: {
          emailAddress: email,
        },
        userAccounts: null,
      },
    });
    expect(prisma.applications.update).toHaveBeenNthCalledWith(1, {
      data: {
        userAccounts: {
          connect: {
            id,
          },
        },
      },
      where: {
        id: 'app id 1',
      },
    });
    expect(prisma.applications.update).toHaveBeenNthCalledWith(2, {
      data: {
        userAccounts: {
          connect: {
            id,
          },
        },
      },
      where: {
        id: 'app id 2',
      },
    });
  });

  it('should not connect user when no matching applications exist', async () => {
    const id = randomUUID();
    const email = 'example@email.com';
    prisma.applications.findMany = jest.fn().mockReturnValue([]);

    prisma.applications.update = jest.fn().mockReturnValue(null);
    await service.connectUserWithExistingApplications(email, id);
    expect(prisma.applications.findMany).toHaveBeenCalledWith({
      where: {
        applicant: {
          emailAddress: email,
        },
        userAccounts: null,
      },
    });
    expect(prisma.applications.update).not.toHaveBeenCalled();
  });

  it('should set hitConfirmationUrl', async () => {
    const id = randomUUID();
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      hitConfirmationUrl: new Date(),
    });
    await service.setHitConfirmationUrl(
      id,
      'confirmation token',
      'confirmation token',
    );
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        hitConfirmationUrl: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should throw the user missing error when trying to set hitConfirmationUrl', async () => {
    const id = null;
    await expect(
      async () =>
        await service.setHitConfirmationUrl(
          id,
          'confirmation token',
          'confirmation token',
        ),
    ).rejects.toThrowError(
      'user confirmation token confirmation token was requested but not found',
    );
  });

  it('should throw token mismatch error when trying to set hitConfirmationUrl', async () => {
    const id = randomUUID();
    await expect(
      async () =>
        await service.setHitConfirmationUrl(
          id,
          'confirmation token',
          'confirmation token different',
        ),
    ).rejects.toThrowError('tokenMissing');
  });

  it('should validate confirmationToken', async () => {
    const id = randomUUID();
    const token = service.createConfirmationToken(id, 'email@example.com');
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      confirmationToken: token,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      hitConfirmationUrl: new Date(),
    });
    await service.isUserConfirmationTokenValid({ token });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        hitConfirmationUrl: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should mark hitConfirmationUrl even though user id was not a match', async () => {
    const id = randomUUID();
    const token = service.createConfirmationToken(id, 'email@example.com');
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
      id,
      confirmationToken: token,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      hitConfirmationUrl: new Date(),
    });
    await service.isUserConfirmationTokenValid({ token });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      where: {
        confirmationToken: token,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        hitConfirmationUrl: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should silently fail when confirmation token is not valid', async () => {
    const id = randomUUID();
    const token = service.createConfirmationToken(id, 'email@example.com');
    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.update = jest.fn().mockResolvedValue(null);
    await service.isUserConfirmationTokenValid({ token });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
      where: {
        confirmationToken: token,
      },
    });
    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should set resetToken', async () => {
    const id = randomUUID();
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      resetToken: 'example reset token',
    });

    await service.forgotPassword({ email });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        resetToken: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should error when trying to set resetToken on nonexistent user', async () => {
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.forgotPassword({ email }),
    ).rejects.toThrowError(
      'user email@example.com was requested but not found',
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should resend public confirmation', async () => {
    const id = randomUUID();
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      email,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      email,
      confirmationToken: 'example confirmation token',
    });

    await service.resendConfirmation({ email }, true);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        confirmationToken: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should resend partner confirmation', async () => {
    const id = randomUUID();
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      email,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      email,
      confirmationToken: 'example confirmation token',
    });

    await service.resendConfirmation({ email }, false);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        confirmationToken: expect.anything(),
      },
      where: {
        id,
      },
    });
  });

  it('should not update confirmationToken if user is confirmed', async () => {
    const id = randomUUID();
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      email,
      confirmedAt: new Date(),
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      email,
      confirmationToken: 'example confirmation token',
    });

    await service.resendConfirmation({ email }, false);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should error when trying to resend confirmation on nonexistent user', async () => {
    const email = 'email@example.com';

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.resendConfirmation({ email }, true),
    ).rejects.toThrowError(
      'user email@example.com was requested but not found',
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should delete user', async () => {
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    prisma.userAccounts.delete = jest.fn().mockResolvedValue({
      id,
    });
    prisma.userRoles.delete = jest.fn().mockResolvedValue({
      id,
    });

    await service.delete(id);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.delete).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userRoles.delete).toHaveBeenCalledWith({
      where: {
        userId: id,
      },
    });
  });

  it('should error when trying to delete nonexistent user', async () => {
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.delete = jest.fn().mockResolvedValue(null);
    prisma.userRoles.delete = jest.fn().mockResolvedValue(null);

    await expect(async () => await service.delete(id)).rejects.toThrowError(
      `user ${id} was requested but not found`,
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.delete).not.toHaveBeenCalled();
    expect(prisma.userRoles.delete).not.toHaveBeenCalled();
  });

  it('should update user without updating password or email', async () => {
    const id = randomUUID();
    const jurisId = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    await service.update({
      id,
      firstName: 'first name',
      lastName: 'last name',
      jurisdictions: [{ id: jurisId }],
    });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        firstName: 'first name',
        lastName: 'last name',
        jurisdictions: {
          connect: [{ id: jurisId }],
        },
      },
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        id,
      },
    });
  });

  it('should update user and update password', async () => {
    const id = randomUUID();
    const jurisId = randomUUID();
    const passwordHashed = await passwordToHash('current password');

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      passwordHash: passwordHashed,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    await service.update({
      id,
      firstName: 'first name',
      lastName: 'last name',
      jurisdictions: [{ id: jurisId }],
      password: 'new password',
      currentPassword: 'current password',
    });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        firstName: 'first name',
        lastName: 'last name',
        jurisdictions: {
          connect: [{ id: jurisId }],
        },
        passwordHash: expect.anything(),
        passwordUpdatedAt: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        id,
      },
    });
  });

  it('should throw missing currentPassword error', async () => {
    const id = randomUUID();
    const jurisId = randomUUID();
    const passwordHashed = await passwordToHash('current password');

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      passwordHash: passwordHashed,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    await expect(
      async () =>
        await service.update({
          id,
          firstName: 'first name',
          lastName: 'last name',
          jurisdictions: [{ id: jurisId }],
          password: 'new password',
        }),
    ).rejects.toThrowError(`userID ${id}: request missing currentPassword`);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).not.toHaveBeenCalledWith();
  });

  it('should throw password mismatch error', async () => {
    const id = randomUUID();
    const jurisId = randomUUID();
    const passwordHashed = await passwordToHash('password');

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      passwordHash: passwordHashed,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    await expect(
      async () =>
        await service.update({
          id,
          firstName: 'first name',
          lastName: 'last name',
          jurisdictions: [{ id: jurisId }],
          password: 'new password',
          currentPassword: 'new password',
        }),
    ).rejects.toThrowError(
      `userID ${id}: incoming current password doesn't match stored password`,
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).not.toHaveBeenCalledWith();
  });

  it('should update user and email', async () => {
    const id = randomUUID();
    const jurisId = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });

    await service.update({
      id,
      firstName: 'first name',
      lastName: 'last name',
      jurisdictions: [{ id: jurisId }],
      newEmail: 'new@email.com',
      appUrl: 'www.example.com',
    });
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      data: {
        firstName: 'first name',
        lastName: 'last name',
        jurisdictions: {
          connect: [{ id: jurisId }],
        },
        confirmationToken: expect.anything(),
      },
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        id,
      },
    });
  });

  it('should error when trying to update nonexistent user', async () => {
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

    await expect(
      async () =>
        await service.update({
          id,
          firstName: 'first name',
          lastName: 'last name',
          jurisdictions: [{ id: randomUUID() }],
        }),
    ).rejects.toThrowError(`user ${id} was requested but not found`);
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id,
      },
    });

    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
  });

  it('should create a partner user with no existing user present', async () => {
    const jurisId = randomUUID();
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.create = jest.fn().mockResolvedValue({
      id,
    });
    await service.create(
      {
        firstName: 'Partner User firstName',
        lastName: 'Partner User lastName',
        password: 'example password 1',
        email: 'partnerUser@email.com',
        jurisdictions: [{ id: jurisId }],
        userRoles: {
          isAdmin: true,
        },
      },
      true,
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        email: 'partnerUser@email.com',
      },
    });
    expect(prisma.userAccounts.create).toHaveBeenCalledWith({
      data: {
        passwordHash: expect.anything(),
        email: 'partnerUser@email.com',
        firstName: 'Partner User firstName',
        lastName: 'Partner User lastName',
        mfaEnabled: true,
        jurisdictions: {
          connect: [{ id: jurisId }],
        },
        userRoles: {
          create: {
            isAdmin: true,
          },
        },
      },
    });
  });

  it('should create a partner user with existing public user present', async () => {
    const jurisId = randomUUID();
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      confirmationToken: 'token',
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
    });
    await service.create(
      {
        firstName: 'Partner User firstName',
        lastName: 'Partner User lastName',
        password: 'example password 1',
        email: 'partnerUser@email.com',
        jurisdictions: [{ id: jurisId }],
        userRoles: {
          isPartner: true,
        },
        listings: [{ id: 'listing id' }],
      },
      true,
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        email: 'partnerUser@email.com',
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      data: {
        confirmedAt: null,
        confirmationToken: 'token',
        userRoles: {
          create: {
            isPartner: true,
          },
        },
        listings: {
          connect: [{ id: 'listing id' }],
        },
      },
      where: {
        id,
      },
    });
  });

  it('should error create a partner user with existing partner user present', async () => {
    const jurisId = randomUUID();
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id,
      confirmationToken: 'token',
      userRoles: {
        isPartner: true,
      },
      jurisdictions: [{ id: jurisId }],
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.create = jest.fn().mockResolvedValue(null);
    await expect(
      async () =>
        await service.create(
          {
            firstName: 'Partner User firstName',
            lastName: 'Partner User lastName',
            password: 'example password 1',
            email: 'partnerUser@email.com',
            jurisdictions: [{ id: jurisId }],
            userRoles: {
              isPartner: true,
            },
            listings: [{ id: 'listing id' }],
          },
          true,
        ),
    ).rejects.toThrowError('emailInUse');
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        email: 'partnerUser@email.com',
      },
    });
    expect(prisma.userAccounts.update).not.toHaveBeenCalled();
    expect(prisma.userAccounts.create).not.toHaveBeenCalled();
  });

  it('should create a public user', async () => {
    const jurisId = randomUUID();
    const id = randomUUID();

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
    prisma.applications.findMany = jest
      .fn()
      .mockResolvedValue([
        { id: 'application id 1' },
        { id: 'application id 2' },
      ]);
    prisma.applications.update = jest.fn().mockResolvedValue(null);
    prisma.userAccounts.create = jest.fn().mockResolvedValue({
      id,
      email: 'publicUser@email.com',
    });
    prisma.userAccounts.update = jest.fn().mockResolvedValue({
      id,
      email: 'publicUser@email.com',
    });
    await service.create(
      {
        firstName: 'public User firstName',
        lastName: 'public User lastName',
        password: 'example password 1',
        email: 'publicUser@email.com',
        jurisdictions: [{ id: jurisId }],
      },
      false,
    );
    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      where: {
        email: 'publicUser@email.com',
      },
    });
    expect(prisma.userAccounts.create).toHaveBeenCalledWith({
      data: {
        passwordHash: expect.anything(),
        email: 'publicUser@email.com',
        firstName: 'public User firstName',
        lastName: 'public User lastName',
        mfaEnabled: false,
        jurisdictions: {
          connect: [{ id: jurisId }],
        },
      },
    });
    expect(prisma.userAccounts.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
        listings: true,
        userRoles: true,
      },
      data: {
        confirmationToken: expect.anything(),
      },
      where: {
        id: id,
      },
    });
    expect(prisma.applications.findMany).toHaveBeenCalledWith({
      where: {
        applicant: {
          emailAddress: 'publicUser@email.com',
        },
        userAccounts: null,
      },
    });
    expect(prisma.applications.update).toHaveBeenNthCalledWith(1, {
      data: {
        userAccounts: {
          connect: {
            id,
          },
        },
      },
      where: {
        id: 'application id 1',
      },
    });
    expect(prisma.applications.update).toHaveBeenNthCalledWith(2, {
      data: {
        userAccounts: {
          connect: {
            id,
          },
        },
      },
      where: {
        id: 'application id 2',
      },
    });
  });
});
