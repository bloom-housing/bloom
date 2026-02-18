import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { IdDTO } from '../../../src/dtos/shared/id.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';
import { ModificationEnum } from '../../../src/enums/shared/modification-enum';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { UserViews } from '../../../src/enums/user/view-enum';
import { ApplicationService } from '../../../src/services/application.service';
import { CronJobService } from '../../../src/services/cron-job.service';
import { EmailService } from '../../../src/services/email.service';
import { GeocodingService } from '../../../src/services/geocoding.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { SendGridService } from '../../../src/services/sendgrid.service';
import { TranslationService } from '../../../src/services/translation.service';
import { UserService } from '../../../src/services/user.service';
import { passwordToHash } from '../../../src/utilities/password-helpers';
import { SnapshotCreateService } from '../../../src/services/snapshot-create.service';
import { PublicUserUpdate } from 'src/dtos/users/public-user-update.dto';

describe('Testing user service', () => {
  let service: UserService;
  let prisma: PrismaService;
  let emailService: EmailService;
  let applicationService: ApplicationService;

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

  const SendGridServiceMock = {
    send: jest.fn(),
  };
  const googleTranslateServiceMock = {
    isConfigured: () => true,
    fetch: jest.fn(),
  };
  const LoggerServiceMock = {
    warn: jest.fn(),
    error: jest.fn(),
  };

  const canOrThrowMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        PrismaService,
        EmailService,
        ConfigService,
        SendGridService,
        TranslationService,
        JurisdictionService,
        ApplicationService,
        GeocodingService,
        SchedulerRegistry,
        CronJobService,
        SnapshotCreateService,
        {
          provide: SendGridService,
          useValue: SendGridServiceMock,
        },
        {
          provide: GoogleTranslateService,
          useValue: googleTranslateServiceMock,
        },
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: canOrThrowMock,
          },
        },
        {
          provide: Logger,
          useValue: LoggerServiceMock,
        },
        {
          provide: ApplicationService,
          useValue: {
            removePII: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    applicationService = module.get<ApplicationService>(ApplicationService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('list', () => {
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
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      prisma.userAccounts.count = jest.fn().mockResolvedValue(6);

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
          totalItems: 6,
          totalPages: 2,
        },
      });

      expect(prisma.userAccounts.findMany).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        skip: 5,
        take: 5,
        where: {
          AND: [
            {
              OR: [
                {
                  OR: [
                    {
                      firstName: {
                        contains: 'search',
                        mode: 'insensitive',
                      },
                    },
                    {
                      lastName: {
                        contains: 'search',
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
                {
                  OR: [
                    {
                      firstName: {
                        contains: 'value',
                        mode: 'insensitive',
                      },
                    },
                    {
                      lastName: {
                        contains: 'value',
                        mode: 'insensitive',
                      },
                    },
                  ],
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

    it("shouldn't return users from list() when single characters are used", async () => {
      const date = new Date();
      const mockedValue = mockUserSet(0, date);
      prisma.userAccounts.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.userAccounts.count = jest.fn().mockResolvedValue(0);

      expect(
        await service.list(
          {
            search: 'a b',
            page: 1,
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
          currentPage: 1,
          itemCount: 0,
          itemsPerPage: 5,
          totalItems: 0,
          totalPages: 0,
        },
      });

      expect(prisma.userAccounts.findMany).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        skip: 0,
        take: 5,
        where: {
          AND: [
            {
              OR: [
                {
                  email: {
                    contains: 'a b',
                    mode: 'insensitive',
                  },
                },
                {
                  listings: {
                    some: {
                      name: {
                        contains: 'a b',
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

    it('should return first page if params are more than count', async () => {
      const date = new Date();
      const mockedValue = mockUserSet(3, date);
      prisma.userAccounts.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.userAccounts.count = jest.fn().mockResolvedValue(3);

      expect(
        await service.list(
          {
            page: 2,
            limit: 5,
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
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        skip: 0,
        take: 5,
        where: {
          AND: [],
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return user from findOne() when id present', async () => {
      const date = new Date();
      const mockedValue = mockUser(3, date);
      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(mockedValue);

      expect(await service.findOne('example Id')).toEqual(mockedValue);

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      ).rejects.toThrowError('user id: example Id was requested but not found');

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: 'example Id',
        },
      });
    });
  });

  describe('createConfirmationToken', () => {
    it('should encode a confirmation token correctly', () => {
      process.env.APP_SECRET = 'SOME-LONG-SECRET-KEY';
      const id = randomUUID();
      const res = service.createConfirmationToken(id, 'example@email.com');
      expect(res).not.toBeNull();
      const decoded = verify(res, 'SOME-LONG-SECRET-KEY') as IdDTO;
      expect(decoded.id).toEqual(id);
    });
  });

  describe('getPublicConfirmationUrl', () => {
    it('should build public confirmation url', () => {
      const res = service.getPublicConfirmationUrl(
        'https://www.example.com',
        'tokenExample',
      );
      expect(res).toEqual('https://www.example.com?token=tokenExample');
    });
    it('should build public confirmation url with query params', () => {
      const res = service.getPublicConfirmationUrl(
        'https://www.example.com?redirectUrl=redirect&listingId=123',
        'tokenExample',
      );
      expect(res).toEqual(
        'https://www.example.com?token=tokenExample&redirectUrl=redirect&listingId=123',
      );
    });
    it('should return undefined when url is undefined', () => {
      const res = service.getPublicConfirmationUrl(undefined, 'tokenExample');
      expect(res).toEqual(undefined);
    });
  });

  describe('getPartnersConfirmationUrl', () => {
    it('should build partner confirmation url', () => {
      const res = service.getPartnersConfirmationUrl(
        'https://www.example.com',
        'tokenExample',
      );
      expect(res).toEqual(
        'https://www.example.com/users/confirm?token=tokenExample',
      );
    });
  });

  describe('jurisdictionMismatch', () => {
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
  });

  describe('findUserOrError', () => {
    it('should find user by id and include joins', async () => {
      const id = randomUUID();
      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
      });
      const res = await service.findUserOrError({ userId: id }, UserViews.full);
      expect(res).toEqual({ id });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
    });

    it('should find user by id and include only jurisdictions joins', async () => {
      const id = randomUUID();
      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
      });
      const res = await service.findUserOrError({ userId: id }, UserViews.base);
      expect(res).toEqual({ id });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
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
      const res = await service.findUserOrError(
        { email: email },
        UserViews.full,
      );
      expect(res).toEqual({ email });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      const res = await service.findUserOrError({ userId: id });
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
      const res = await service.findUserOrError({ email: email });
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
        async () => await service.findUserOrError({ email: email }),
      ).rejects.toThrowError(
        'user email: example@email.com was requested but not found',
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });
  });

  describe('connectUserWithExistingApplications', () => {
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
  });

  describe('setHitConfirmationUrl', () => {
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
  });

  describe('isUserConfirmationTokenValid', () => {
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
  });

  describe('forgotPassword', () => {
    it('should set resetToken when public user on public site', async () => {
      const id = randomUUID();
      const email = 'email@example.com';

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        jurisdictions: [{ publicUrl: 'http://localhost:3000' }],
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
        resetToken: 'example reset token',
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        id,
      });
      emailService.forgotPassword = jest.fn();

      await service.forgotPassword({ email, appUrl: 'http://localhost:3000' });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
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

    it('should not set resetToken when public user on partner site', async () => {
      const id = randomUUID();
      const email = 'email@example.com';

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        jurisdictions: [{ publicUrl: 'http://localhost:3000' }],
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
        resetToken: 'example reset token',
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
      emailService.forgotPassword = jest.fn();

      await service.forgotPassword({
        email,
        appUrl: process.env.PARTNERS_PORTAL_URL,
      });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
    });

    it('should set resetToken when partner user on partner site', async () => {
      const id = randomUUID();
      const email = 'email@example.com';

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        userRoles: { isAdmin: true },
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
        resetToken: 'example reset token',
      });
      emailService.forgotPassword = jest.fn();

      await service.forgotPassword({
        email,
        appUrl: process.env.PARTNERS_PORTAL_URL,
      });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
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

    it('should not set resetToken when partner user on public site', async () => {
      const id = randomUUID();
      const email = 'email@example.com';

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        userRoles: { isAdmin: true },
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
        resetToken: 'example reset token',
      });
      emailService.forgotPassword = jest.fn();

      await service.forgotPassword({
        email,
        appUrl: 'http://localhost:3000',
      });
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
    });

    it('should error when trying to set resetToken on nonexistent user', async () => {
      const email = 'email@example.com';

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.forgotPassword({ email }),
      ).rejects.toThrowError(
        'user email: email@example.com was requested but not found',
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
        },
      });

      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
    });
  });

  describe('resendConfirmation', () => {
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
      emailService.welcome = jest.fn();

      await service.resendConfirmation({ email }, true);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
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

      emailService.invitePartnerUser = jest.fn();

      await service.resendConfirmation({ email }, false);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
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
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
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
        'user email: email@example.com was requested but not found',
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email,
          id: undefined,
        },
      });

      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user without userRoles', async () => {
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

      await service.delete(id, {
        id: 'requestingUser id',
        userRoles: { isAdmin: true },
      } as unknown as User);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        include: {
          jurisdictions: true,
          userRoles: true,
        },
      });
      expect(prisma.userAccounts.delete).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
      expect(prisma.userRoles.delete).toHaveBeenCalledTimes(0);

      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.delete,
        {
          id,
        },
      );
    });

    it('should delete user with userRoles', async () => {
      const id = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        userRoles: { isAdmin: true },
      });
      prisma.userAccounts.delete = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userRoles.delete = jest.fn().mockResolvedValue({
        id,
      });

      await service.delete(id, {
        id: 'requestingUser id',
        userRoles: { isAdmin: true },
      } as unknown as User);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        include: {
          jurisdictions: true,
          userRoles: true,
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

      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.delete,
        {
          id,
        },
      );
    });

    it('should error when trying to delete nonexistent user', async () => {
      const id = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.delete = jest.fn().mockResolvedValue(null);
      prisma.userRoles.delete = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.delete(id, {
            id: 'requestingUser id',
            userRoles: { isAdmin: true },
          } as unknown as User),
      ).rejects.toThrowError(`user id: ${id} was requested but not found`);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        where: {
          id,
        },
        include: {
          jurisdictions: true,
          userRoles: true,
        },
      });

      expect(prisma.userAccounts.delete).not.toHaveBeenCalled();
      expect(prisma.userRoles.delete).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user without updating password or email', async () => {
      const id = randomUUID();
      const jurisId = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });
      prisma.$transaction = jest
        .fn()
        .mockImplementation((callBack) => callBack(prisma));

      const mockUserUpdate: PublicUserUpdate = {
        id,
        firstName: 'first name',
        middleName: 'middle name',
        lastName: 'last name',
        dob: new Date(),
        email: 'test@email.com',
        jurisdictions: [{ id: jurisId }],
        agreedToTermsOfService: true,
      };

      await service.update(mockUserUpdate, {
        headers: { jurisdictionname: 'juris 1' },
        user: {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
      } as unknown as Request);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });

      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: mockUserUpdate.firstName,
          middleName: mockUserUpdate.middleName,
          lastName: mockUserUpdate.lastName,
          email: mockUserUpdate.email,
          dob: mockUserUpdate.dob,
          agreedToTermsOfService: true,
          jurisdictions: { connect: [{ id: jurisId }] },
        }),
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
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
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });
      prisma.$transaction = jest
        .fn()
        .mockImplementation((callBack) => callBack(prisma));

      const mockPublicUserUpdate: PublicUserUpdate = {
        id,
        firstName: 'first name',
        lastName: 'last name',
        dob: new Date(),
        email: 'updated@email.com',
        jurisdictions: [{ id: jurisId } as any],
        password: 'new password',
        currentPassword: 'current password',
        agreedToTermsOfService: true,
      };

      await service.update(mockPublicUserUpdate, {
        headers: { jurisdictionname: 'juris 1' },
        user: {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
      } as unknown as Request);

      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });

      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: mockPublicUserUpdate.firstName,
          lastName: mockPublicUserUpdate.lastName,
          passwordHash: expect.anything(),
          passwordUpdatedAt: expect.anything(),
          agreedToTermsOfService: true,
          jurisdictions: {
            connect: [
              {
                id: jurisId,
              },
            ],
          },
        }),
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
          passwordHash: expect.anything(),
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
          await service.update(
            {
              id,
              firstName: 'first name',
              lastName: 'last name',
              jurisdictions: [{ id: jurisId } as any],
              password: 'new password',
              agreedToTermsOfService: true,
            } as PublicUserUpdate,
            {
              headers: { jurisdictionname: 'juris 1' },
              user: {
                id: 'requestingUser id',
                userRoles: { isAdmin: true },
              } as unknown as User,
            } as unknown as Request,
          ),
      ).rejects.toThrowError(`userID ${id}: request missing currentPassword`);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalledWith();
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
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
          await service.update(
            {
              id,
              firstName: 'first name',
              lastName: 'last name',
              jurisdictions: [{ id: jurisId } as any],
              password: 'new password',
              currentPassword: 'new password',
              agreedToTermsOfService: true,
            } as PublicUserUpdate,
            {
              headers: { jurisdictionname: 'juris 1' },
              user: {
                id: 'requestingUser id',
                userRoles: { isAdmin: true },
              } as unknown as User,
            } as unknown as Request,
          ),
      ).rejects.toThrowError(
        `userID ${id}: incoming password doesn't match stored password`,
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalledWith();
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
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
      emailService.changeEmail = jest.fn();
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      prisma.$transaction = jest
        .fn()
        .mockImplementation((callBack) => callBack(prisma));

      const mockUserUpdate: PublicUserUpdate = {
        id,
        firstName: 'first name',
        lastName: 'last name',
        dob: new Date(),
        email: 'updated@email.com',
        jurisdictions: [{ id: jurisId } as any],
        newEmail: 'new@email.com',
        appUrl: 'https://www.example.com',
        agreedToTermsOfService: true,
      };

      await service.update(mockUserUpdate, {
        headers: { jurisdictionname: 'juris 1' },
        user: {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
      } as unknown as Request);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });

      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: mockUserUpdate.firstName,
          lastName: mockUserUpdate.lastName,
          confirmationToken: expect.anything(),
          agreedToTermsOfService: true,
          jurisdictions: {
            connect: [{ id: jurisId }],
          },
        }),
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(emailService.changeEmail).toHaveBeenCalled();
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
        },
      });
    });

    it('should update connected listings to a user', async () => {
      const id = randomUUID();
      const jurisId = randomUUID();
      const listingA = randomUUID();
      const listingB = randomUUID();
      const listingC = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
        id,
        listings: [{ id: listingA }, { id: listingB }],
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      prisma.$transaction = jest
        .fn()
        .mockImplementation((callBack) => callBack(prisma));

      await service.update(
        {
          id,
          firstName: 'first name',
          lastName: 'last name',
          jurisdictions: [{ id: jurisId } as any],
          agreedToTermsOfService: true,
          listings: [{ id: listingA }, { id: listingC }],
        } as PublicUserUpdate,
        {
          headers: { jurisdictionname: 'juris 1' },
          user: {
            id: 'requestingUser id',
            userRoles: { isAdmin: true },
          } as unknown as User,
        } as unknown as Request,
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledTimes(3);
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          listings: {
            connect: [
              {
                id: listingC,
              },
            ],
            disconnect: [
              {
                id: listingB,
              },
            ],
          },
        },
        where: {
          id,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          jurisdictions: {
            connect: [
              {
                id: jurisId,
              },
            ],
          },
        },
        where: {
          id,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: 'first name',
          lastName: 'last name',
          agreedToTermsOfService: true,
        }),
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.update,
        {
          id,
          jurisdictionId: jurisId,
        },
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
          listing: {
            connect: [{ id: listingA }, { id: listingB }],
          },
        },
      });
    });

    it('should error when trying to update nonexistent user', async () => {
      const id = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.update(
            {
              id,
              firstName: 'first name',
              lastName: 'last name',
              jurisdictions: [{ id: randomUUID() } as any],
              agreedToTermsOfService: true,
            } as PublicUserUpdate,
            {
              headers: { jurisdictionname: 'juris 1' },
              user: {
                id: 'requestingUser id',
                userRoles: { isAdmin: true },
              } as unknown as User,
            } as unknown as Request,
          ),
      ).rejects.toThrowError(`user id: ${id} was requested but not found`);
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id,
        },
      });

      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(canOrThrowMock).not.toHaveBeenCalledWith();
    });
  });

  describe('create', () => {
    it('should create a partner user with no existing user present', async () => {
      const jurisId = randomUUID();
      const id = randomUUID();

      prisma.userAccounts.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.create = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });
      emailService.invitePartnerUser = jest.fn();
      await service.createPartnerUser(
        {
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          agreedToTermsOfService: true,
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: jurisId }],
          userRoles: {
            isAdmin: true,
          },
        },
        {
          headers: { jurisdictionname: 'juris 1' },
          user: {
            id: 'requestingUser id',
            userRoles: { isAdmin: true },
          } as unknown as User,
        } as unknown as Request,
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      expect(emailService.invitePartnerUser).toHaveBeenCalledTimes(1);
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.confirm,
        {
          id: undefined,
        },
      );
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
      prisma.userAccountSnapshot.create = jest.fn().mockResolvedValue({ id });

      await service.createPartnerUser(
        {
          firstName: 'Partner User firstName',
          lastName: 'Partner User lastName',
          agreedToTermsOfService: true,
          email: 'partnerUser@email.com',
          jurisdictions: [{ id: jurisId }],
          userRoles: {
            isPartner: true,
          },
          listings: [{ id: 'listing id' }],
        },
        {
          headers: { jurisdictionname: 'juris 1' },
          user: {
            id: 'requestingUser id',
            userRoles: { isAdmin: true },
          } as unknown as User,
        } as unknown as Request,
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        } as unknown as User,
        'user',
        permissionActions.confirm,
        {
          id: undefined,
        },
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: id,
          confirmationToken: expect.anything(),
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
          await service.createPartnerUser(
            {
              firstName: 'Partner User firstName',
              lastName: 'Partner User lastName',
              agreedToTermsOfService: true,
              email: 'partnerUser@email.com',
              jurisdictions: [{ id: jurisId }],
              userRoles: {
                isPartner: true,
              },
              listings: [{ id: 'listing id' }],
            },
            {
              headers: { jurisdictionname: 'juris 1' },
              user: {
                id: 'requestingUser id',
                userRoles: { isAdmin: true },
              } as unknown as User,
            } as unknown as Request,
          ),
      ).rejects.toThrowError('emailInUse');
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email: 'partnerUser@email.com',
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(prisma.userAccounts.create).not.toHaveBeenCalled();
      expect(canOrThrowMock).toHaveBeenCalledWith(
        {
          id: 'requestingUser id',
          userRoles: { isAdmin: true },
        },
        'user',
        permissionActions.confirm,
        {
          id: undefined,
        },
      );
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
      await service.createPublicUser(
        {
          firstName: 'public User firstName',
          lastName: 'public User lastName',
          password: 'Abcdef12345!',
          passwordConfirmation: 'Abcdef12345!',
          agreedToTermsOfService: true,
          dob: new Date('2000-01-01'),
          email: 'publicUser@email.com',
          jurisdictions: [{ id: jurisId } as any],
        },
        false,
        {
          headers: { jurisdictionname: 'juris 1' },
          user: {
            id: 'requestingUser id',
            userRoles: { isAdmin: true },
          } as unknown as User,
        } as unknown as Request,
      );
      expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          email: 'publicUser@email.com',
        },
      });
      expect(prisma.userAccounts.create).toHaveBeenCalledWith({
        data: {
          dob: expect.anything(),
          passwordHash: expect.anything(),
          email: 'publicUser@email.com',
          firstName: 'public User firstName',
          lastName: 'public User lastName',
          listings: undefined,
          middleName: undefined,
          jurisdictions: {
            connect: [{ id: expect.anything() }],
          },
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
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
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });
  });

  describe('isUserRoleChangeAllowed', () => {
    it('should allow admin to promote to admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isAdmin: true } } as unknown as User,
        { isAdmin: true },
      );
      expect(res).toEqual(true);
    });

    it('should allow admin to promote to jurisdictional admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isAdmin: true } } as unknown as User,
        { isJurisdictionalAdmin: true },
      );
      expect(res).toEqual(true);
    });

    it('should allow admin to promote to partner', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isAdmin: true } } as unknown as User,
        { isPartner: true },
      );
      expect(res).toEqual(true);
    });
    it('should allow admin to promote to support admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isAdmin: true } } as unknown as User,
        { isSupportAdmin: true },
      );
      expect(res).toEqual(true);
    });

    it('should allow admin to demote', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isAdmin: true } } as unknown as User,
        {},
      );
      expect(res).toEqual(true);
    });

    it('should disallow juris admin to promote to jurisdictional admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isJurisdictionalAdmin: true } } as unknown as User,
        { isAdmin: true },
      );
      expect(res).toEqual(false);
    });

    it('should allow juris admin to promote to jurisdictional admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isJurisdictionalAdmin: true } } as unknown as User,
        { isJurisdictionalAdmin: true },
      );
      expect(res).toEqual(true);
    });

    it('should allow juris admin to promote to partner', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isJurisdictionalAdmin: true } } as unknown as User,
        { isPartner: true },
      );
      expect(res).toEqual(true);
    });

    it('should allow juris admin to demote', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isJurisdictionalAdmin: true } } as unknown as User,
        {},
      );
      expect(res).toEqual(true);
    });

    it('should disallow partner to promote to jurisdictional admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isPartner: true } } as unknown as User,
        { isAdmin: true },
      );
      expect(res).toEqual(false);
    });

    it('should disallow partner to promote to jurisdictional admin', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isPartner: true } } as unknown as User,
        { isJurisdictionalAdmin: true },
      );
      expect(res).toEqual(false);
    });

    it('should disallow partner to promote to partner', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isPartner: true } } as unknown as User,
        { isPartner: true },
      );
      expect(res).toEqual(false);
    });

    it('should disallow partner to demote', () => {
      const res = service.isUserRoleChangeAllowed(
        { userRoles: { isPartner: true } } as unknown as User,
        {},
      );
      expect(res).toEqual(false);
    });
  });

  describe('requestSingleUseCode', () => {
    it('should request single use code but user does not exist', async () => {
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();
      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      const res = await service.requestSingleUseCode(
        {
          email: 'example@exygy.com',
        },
        { headers: { jurisdictionname: 'juris 1' } } as unknown as Request,
      );

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(emailService.sendSingleUseCode).not.toHaveBeenCalled();
      expect(res).toEqual({
        success: true,
      });
    });

    it('should fail because user password is outdated', async () => {
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();

      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
        id,
        email: 'example@exygy.com',
        passwordValidForDays: 100,
        passwordUpdatedAt: new Date(0),
        jurisdictions: [],
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        id,
        allowSingleUseCodeLogin: true,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      await expect(
        async () =>
          await service.requestSingleUseCode(
            {
              email: 'example@exygy.com',
            },
            { headers: { jurisdictionname: 'juris 1' } } as unknown as Request,
          ),
      ).rejects.toThrowError(
        `user ${id} attempted to login, but password is no longer valid`,
      );

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(emailService.sendSingleUseCode).not.toHaveBeenCalled();
    });

    it('should request single use code but jurisdiction does not exist', async () => {
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();
      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
        id,
        passwordUpdatedAt: new Date(),
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      await expect(
        async () =>
          await service.requestSingleUseCode(
            {
              email: 'example@exygy.com',
            },
            { headers: { jurisdictionname: 'juris 1' } } as unknown as Request,
          ),
      ).rejects.toThrowError('Jurisidiction juris 1 does not exists');

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
          allowSingleUseCodeLogin: true,
          name: true,
        },
        where: {
          name: 'juris 1',
        },
        orderBy: {
          allowSingleUseCodeLogin: OrderByEnum.DESC,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(emailService.sendSingleUseCode).not.toHaveBeenCalled();
    });

    it('should request single use code but jurisdictionname was not sent', async () => {
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();
      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
        id,
        passwordUpdatedAt: new Date(),
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        id,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      await expect(
        async () =>
          await service.requestSingleUseCode(
            {
              email: 'example@exygy.com',
            },
            {} as unknown as Request,
          ),
      ).rejects.toThrowError(
        'jurisdictionname is missing from the request headers',
      );

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(prisma.userAccounts.update).not.toHaveBeenCalled();
      expect(emailService.sendSingleUseCode).not.toHaveBeenCalled();
    });

    it('should successfully request single use code when previous code is still valid', async () => {
      process.env.MFA_CODE_LENGTH = '5';
      process.env.MFA_CODE_VALID = '60000';
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();
      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
        id,
        singleUseCode: '00000',
        singleUseCodeUpdatedAt: new Date(),
        passwordUpdatedAt: new Date(),
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        id,
        allowSingleUseCodeLogin: true,
        name: 'juris 1',
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      const res = await service.requestSingleUseCode(
        {
          email: 'example@exygy.com',
        },
        { headers: { jurisdictionname: 'juris 1' } } as unknown as Request,
      );

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
          allowSingleUseCodeLogin: true,
          name: true,
        },
        where: {
          name: 'juris 1',
        },
        orderBy: {
          allowSingleUseCodeLogin: OrderByEnum.DESC,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          singleUseCode: '00000',
          singleUseCodeUpdatedAt: expect.anything(),
        },
        where: {
          id,
        },
      });
      expect(emailService.sendSingleUseCode).toHaveBeenCalled();
      expect(res.success).toEqual(true);
    });
    it('should successfully request single use code when previous code is outdated', async () => {
      const id = randomUUID();
      emailService.sendSingleUseCode = jest.fn();
      prisma.userAccounts.findFirst = jest.fn().mockResolvedValue({
        id,
        singleUseCode: '00000',
        passwordUpdatedAt: new Date(),
        singleUseCodeUpdatedAt: new Date(
          new Date().getTime() - Number(process.env.MFA_CODE_VALUE) * 2,
        ),
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        id,
        allowSingleUseCodeLogin: true,
        name: 'juris 1',
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        id,
      });

      const res = await service.requestSingleUseCode(
        {
          email: 'example@exygy.com',
        },
        { headers: { jurisdictionname: 'juris 1' } } as unknown as Request,
      );

      expect(prisma.userAccounts.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'example@exygy.com',
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
          allowSingleUseCodeLogin: true,
          name: true,
        },
        where: {
          name: 'juris 1',
        },
        orderBy: {
          allowSingleUseCodeLogin: OrderByEnum.DESC,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          singleUseCode: expect.not.stringMatching('00000'),
          singleUseCodeUpdatedAt: expect.anything(),
        },
        where: {
          id,
        },
      });
      expect(emailService.sendSingleUseCode).toHaveBeenCalled();
      expect(res.success).toEqual(true);
    });
  });

  describe('modifyFavoriteListings', () => {
    it('should add a listing to favorite listings', async () => {
      const userId = randomUUID();
      const listingId = randomUUID();

      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        listingId,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        userId,
      });

      await service.modifyFavoriteListings(
        {
          id: listingId,
          action: ModificationEnum.add,
        },
        {
          id: userId,
        } as unknown as User,
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        where: {
          id: listingId,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          favoriteListings: {
            connect: { id: listingId },
          },
        },
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: userId,
        },
      });
    });

    it('should remove a listing from favorite listings', async () => {
      const userId = randomUUID();
      const listingId = randomUUID();

      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        listingId,
      });
      prisma.userAccounts.update = jest.fn().mockResolvedValue({
        userId,
      });

      await service.modifyFavoriteListings(
        {
          id: listingId,
          action: ModificationEnum.remove,
        },
        {
          id: userId,
        } as unknown as User,
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        where: {
          id: listingId,
        },
      });
      expect(prisma.userAccounts.update).toHaveBeenCalledWith({
        data: {
          favoriteListings: {
            disconnect: { id: listingId },
          },
        },
        include: {
          jurisdictions: true,
          listings: true,
          userRoles: true,
          favoriteListings: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: userId,
        },
      });
    });

    it('should throw a not found error when listing does not exist', async () => {
      const userId = randomUUID();
      const listingId = randomUUID();

      prisma.listings.findUnique = jest.fn().mockResolvedValue(null);
      prisma.userAccounts.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.modifyFavoriteListings(
            {
              id: listingId,
              action: ModificationEnum.add,
            },
            {
              id: userId,
            } as unknown as User,
          ),
      ).rejects.toThrowError(
        `listingId ${listingId} was requested but not found`,
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        where: {
          id: listingId,
        },
      });
      expect(prisma.userAccounts.update).not.toHaveBeenCalledWith();
    });
  });

  describe('deleteAfterInactivity', () => {
    it('should not run if USERS_DAYS_TILL_EXPIRY does not exist', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = null;
      const response = await service.deleteAfterInactivity();
      expect(response).toEqual({ success: false });
      expect(LoggerServiceMock.warn).toBeCalledWith(
        'USERS_DAYS_TILL_EXPIRY variable is not set so deleteAfterInactivity will not run',
      );
    });
    it('should not run if USERS_DAYS_TILL_EXPIRY is not a number', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = 'not a number';
      const response = await service.deleteAfterInactivity();
      expect(response).toEqual({ success: false });
      expect(LoggerServiceMock.warn).toBeCalledWith(
        'USERS_DAYS_TILL_EXPIRY variable is not set so deleteAfterInactivity will not run',
      );
    });
    it('should delete users for all inactive user', async () => {
      // This test goes through all possible options
      //  has or has not been warned of deletion
      //  has or doesn't have applications
      //  has or doesn't have roles (public vs partner user)
      prisma.userAccounts.findMany = jest.fn().mockResolvedValue([
        { id: 'userId1', wasWarnedOfDeletion: true },
        { id: 'userId2', wasWarnedOfDeletion: false },
        { id: 'userId3', wasWarnedOfDeletion: true },
        {
          id: 'userId4',
          wasWarnedOfDeletion: true,
          userRoles: { isAdmin: true },
        },
      ]);
      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 'application1' }, { id: 'application2' }])
        .mockResolvedValueOnce([
          { id: 'application3' },
          { id: 'application4' },
        ]);

      prisma.userRoles.delete = jest.fn().mockResolvedValue({});
      prisma.userAccounts.delete = jest.fn().mockResolvedValue({});
      process.env.USERS_DAYS_TILL_EXPIRY = '1095';
      const response = await service.deleteAfterInactivity();
      expect(response).toEqual({ success: true });
      expect(prisma.userAccounts.delete).toBeCalledWith({
        where: { id: 'userId1' },
      });
      expect(LoggerServiceMock.warn).toBeCalledWith(
        'Unable to delete user userId2 because they have not been warned by email',
      );
      expect(prisma.userAccounts.delete).toBeCalledWith({
        where: { id: 'userId3' },
      });
      expect(applicationService.removePII).toBeCalledWith('application1');
      expect(applicationService.removePII).toBeCalledWith('application2');
      expect(prisma.userAccounts.delete).toBeCalledWith({
        where: { id: 'userId4' },
      });
    });
  });

  describe('warnUserOfDeletionCronJob', () => {
    it('should not run if USERS_DAYS_TILL_EXPIRY does not exist', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = null;
      const response = await service.warnUserOfDeletionCronJob();
      expect(response).toEqual({ success: false });
      expect(LoggerServiceMock.warn).toBeCalledWith(
        'USERS_DAYS_TILL_EXPIRY not set so warnUserOfDeletion cron job not run',
      );
    });
    it('should not run if USERS_DAYS_TILL_EXPIRY is not a number', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = 'not a number';
      const response = await service.warnUserOfDeletionCronJob();
      expect(response).toEqual({ success: false });
      expect(LoggerServiceMock.warn).toBeCalledWith(
        'USERS_DAYS_TILL_EXPIRY not set so warnUserOfDeletion cron job not run',
      );
    });
    it('should send warn email for all expired public users', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = '1095';
      jest.useFakeTimers().setSystemTime(new Date('2025-11-22T12:25:00.000Z'));
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'id1' }, { id: 'id2' }]);
      prisma.userAccounts.update = jest.fn().mockResolvedValue({});
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({});
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({});
      prisma.cronJob.create = jest.fn().mockResolvedValue({});
      prisma.cronJob.update = jest.fn().mockResolvedValue({});
      emailService.warnOfAccountRemoval = jest.fn();
      prisma.userAccounts.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'id1' });
      prisma.userAccountSnapshot.create = jest
        .fn()
        .mockResolvedValue({ id: 'id1' });

      const response = await service.warnUserOfDeletionCronJob();
      expect(prisma.userAccounts.findMany).toBeCalledWith({
        include: {
          jurisdictions: true,
        },
        where: {
          lastLoginAt: { lte: new Date('2022-12-23T12:25:00.000Z') },
          userRoles: null,
          wasWarnedOfDeletion: false,
        },
      });
      expect(prisma.userAccounts.update).toBeCalledWith({
        data: {
          wasWarnedOfDeletion: true,
        },
        where: {
          id: 'id1',
        },
      });
      expect(prisma.userAccounts.update).toBeCalledWith({
        data: {
          wasWarnedOfDeletion: true,
        },
        where: {
          id: 'id2',
        },
      });
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: 'id1',
        },
      });
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledTimes(2);
      expect(emailService.warnOfAccountRemoval).toBeCalledWith({ id: 'id1' });
      expect(emailService.warnOfAccountRemoval).toBeCalledWith({ id: 'id2' });
      expect(response).toEqual({ success: true });
    });
    it('should not update user if email failed', async () => {
      process.env.USERS_DAYS_TILL_EXPIRY = '1095';
      jest.useFakeTimers().setSystemTime(new Date('2025-11-22T12:25:00.000Z'));
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'id1' }, { id: 'id2' }]);
      prisma.userAccounts.update = jest.fn().mockResolvedValue({});
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({});
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({});
      prisma.cronJob.create = jest.fn().mockResolvedValue({});
      prisma.cronJob.update = jest.fn().mockResolvedValue({});
      emailService.warnOfAccountRemoval = jest
        .fn()
        .mockResolvedValueOnce({})
        .mockRejectedValue('error sending email');
      prisma.userAccounts.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'id1' });
      prisma.userAccountSnapshot.create = jest
        .fn()
        .mockResolvedValue({ id: 'id1' });

      const response = await service.warnUserOfDeletionCronJob();
      expect(prisma.userAccounts.findMany).toBeCalledWith({
        include: {
          jurisdictions: true,
        },
        where: {
          lastLoginAt: { lte: new Date('2022-12-23T12:25:00.000Z') },
          userRoles: null,
          wasWarnedOfDeletion: false,
        },
      });
      expect(emailService.warnOfAccountRemoval).toBeCalledTimes(2);
      expect(prisma.userAccounts.update).toBeCalledTimes(1);
      expect(prisma.userAccounts.update).toBeCalledWith({
        data: {
          wasWarnedOfDeletion: true,
        },
        where: {
          id: 'id1',
        },
      });
      expect(LoggerServiceMock.error).toBeCalledWith(
        'warnUserOfDeletion email failed for user id2',
      );
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledWith({
        data: {
          originalId: 'id1',
        },
      });
      expect(prisma.userAccountSnapshot.create).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ success: true });
    });
  });
});
