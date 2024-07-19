import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request as ExpressRequest, Response } from 'express';
import { UserCsvExporterService } from '../../../src/services/user-csv-export.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';
import { PassThrough } from 'stream';
import { UserRole } from '../../../src/dtos/users/user-role.dto';

describe('Testing user csv export service', () => {
  let service: UserCsvExporterService;
  let prisma: PrismaService;

  const mockUser = (
    position: number,
    date: Date,
    userRoles: UserRole,
    jurisdictionId: string,
  ) => {
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
      userRoles: userRoles,
      language: LanguagesEnum.en,
      jurisdictions: [
        {
          id: jurisdictionId,
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCsvExporterService, PrismaService],
    }).compile();

    service = module.get<UserCsvExporterService>(UserCsvExporterService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('exportFile', () => {
    const jurisdiction1 = randomUUID();
    const jurisdiction2 = randomUUID();
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
      userRoles: {
        isAdmin: true,
        isJurisdictionalAdmin: false,
        isPartner: false,
      },
    } as unknown as User;

    it('should export file for admin', async () => {
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([
          mockUser(
            0,
            new Date(1707846198724),
            { isAdmin: true },
            jurisdiction1,
          ),
          mockUser(
            1,
            new Date(1707842826559),
            { isPartner: true },
            jurisdiction1,
          ),
          mockUser(
            2,
            new Date(1707842826559),
            { isPartner: true },
            jurisdiction2,
          ),
          mockUser(
            3,
            new Date(1707846198724),
            { isJurisdictionalAdmin: true },
            jurisdiction1,
          ),
        ]);
      const exportResponse = await service.exportFile(
        {
          user: {
            ...requestingUser,
            jurisdictions: [{ id: jurisdiction1 }, { id: jurisdiction2 }],
          },
        } as unknown as ExpressRequest,
        {} as unknown as Response,
      );

      expect(prisma.userAccounts.findMany).toBeCalledWith({
        include: {
          listings: true,
          userRoles: true,
        },
        where: {
          AND: [
            {
              OR: [
                {
                  userRoles: {
                    isPartner: true,
                  },
                },
                {
                  userRoles: {
                    isAdmin: true,
                  },
                },
                {
                  userRoles: {
                    isJurisdictionalAdmin: true,
                  },
                },
                {
                  userRoles: {
                    isLimitedJurisdictionalAdmin: true,
                  },
                },
              ],
            },
          ],
        },
      });

      const headerRow =
        '"First Name","Last Name","Email","Role","Date Created","Status","Listing Names","Listing Ids","Last Logged In"';
      const firstUser =
        '"first name 0","last name 0","exampleemail_0@test.com","Administrator","02-13-2024","Confirmed",,,"02-13-2024"';

      const mockedStream = new PassThrough();
      exportResponse.getStream().pipe(mockedStream);
      const readable = await new Promise((resolve) => {
        mockedStream.on('data', async (d) => {
          const value = Buffer.from(d).toString();
          mockedStream.end();
          mockedStream.destroy();
          resolve(value);
        });
      });

      expect(readable).toContain(headerRow);
      expect(readable).toContain(firstUser);
    });
    it('should export file for jurisdictionAdmin', async () => {
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([
          mockUser(
            1,
            new Date(1707842826559),
            { isPartner: true },
            jurisdiction1,
          ),
          mockUser(
            2,
            new Date(1707842826559),
            { isPartner: true },
            jurisdiction2,
          ),
          mockUser(
            3,
            new Date(1707846198724),
            { isJurisdictionalAdmin: true },
            jurisdiction1,
          ),
        ]);
      const exportResponse = await service.exportFile(
        {
          user: {
            ...requestingUser,
            jurisdictions: [{ id: jurisdiction1 }],
            userRoles: { isJurisdictionalAdmin: true },
          },
        } as unknown as ExpressRequest,
        {} as unknown as Response,
      );

      expect(prisma.userAccounts.findMany).toBeCalledWith({
        include: {
          listings: true,
          userRoles: true,
        },
        where: {
          AND: [
            {
              OR: [
                {
                  userRoles: {
                    isPartner: true,
                  },
                },
                {
                  userRoles: {
                    isJurisdictionalAdmin: true,
                  },
                },
                {
                  userRoles: {
                    isLimitedJurisdictionalAdmin: true,
                  },
                },
              ],
            },
            { jurisdictions: { some: { id: { in: [jurisdiction1] } } } },
          ],
        },
      });

      const headerRow =
        '"First Name","Last Name","Email","Role","Date Created","Status","Listing Names","Listing Ids","Last Logged In"';
      const firstUser =
        '"first name 1","last name 1","exampleemail_1@test.com","Partner","02-13-2024","Confirmed",,,"02-13-2024"';

      const mockedStream = new PassThrough();
      exportResponse.getStream().pipe(mockedStream);
      const readable = await new Promise((resolve) => {
        mockedStream.on('data', async (d) => {
          const value = Buffer.from(d).toString();
          mockedStream.end();
          mockedStream.destroy();
          resolve(value);
        });
      });

      expect(readable).toContain(headerRow);
      expect(readable).toContain(firstUser);
    });
  });
});
