import { randomUUID } from 'crypto';
import { User } from '../../../src/dtos/users/user.dto';
import { AdvocateUserCsvExporterService } from '../../../src/services/advocate-user-csv-export.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { Agency } from '@prisma/client';
import { Request as ExpressRequest, Response } from 'express';
import { Jurisdiction } from 'src/dtos/jurisdictions/jurisdiction.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PassThrough } from 'stream';
import { ForbiddenException } from '@nestjs/common';

describe('Testing advocate user csv export service', () => {
  let service: AdvocateUserCsvExporterService;
  let prisma: PrismaService;

  const mockAdvocateUser = (
    position: number,
    date: Date,
    confirmedData: Date | null,
    isApproved: boolean,
  ): User => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      passwordUpdatedAt: date,
      passwordValidForDays: 180,
      confirmedAt: confirmedData,
      email: `exampleemail_${position}@test.com`,
      firstName: `first name ${position}`,
      lastName: `last name ${position}`,
      jurisdictions: [
        {
          id: randomUUID(),
        } as Jurisdiction,
      ],
      isAdvocate: true,
      isApproved: isApproved,
      agreedToTermsOfService: true,
      agency: {
        id: randomUUID(),
        name: `Agency ${position}`,
      } as Agency,
    };
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvocateUserCsvExporterService, PrismaService],
    }).compile();

    service = module.get<AdvocateUserCsvExporterService>(
      AdvocateUserCsvExporterService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('export file', () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
      userRoles: {
        isAdmin: true,
      },
    } as unknown as User;

    it('should throw an error for non-admin users', async () => {
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([
          mockAdvocateUser(
            0,
            new Date(1707846198724),
            new Date(1707846198724),
            true,
          ),
          mockAdvocateUser(1, new Date(1707842826559), null, false),
        ]);

      await expect(
        service.exportFile(
          {
            user: {
              ...requestingUser,
              userRoles: {
                isAdmin: false,
                isJurisdictionalAdmin: false,
              },
            },
          } as unknown as ExpressRequest,
          {} as unknown as Response,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should export file for admin user', async () => {
      prisma.userAccounts.findMany = jest
        .fn()
        .mockResolvedValue([
          mockAdvocateUser(
            0,
            new Date(1707846198724),
            new Date(1707846198724),
            true,
          ),
          mockAdvocateUser(1, new Date(1707842826559), null, false),
        ]);

      const exportResponse = await service.exportFile(
        {
          user: {
            ...requestingUser,
          },
        } as unknown as ExpressRequest,
        {} as unknown as Response,
      );

      expect(prisma.userAccounts.findMany).toBeCalledWith({
        include: {
          agency: true,
        },
        where: {
          AND: [
            {
              AND: [{ isAdvocate: true }],
            },
          ],
        },
      });

      const headerRow =
        '"First Name","Last Name","Agency","Email","Date Created","Status","Is Approved"';
      const firstUser =
        '"first name 0","last name 0","Agency 0","exampleemail_0@test.com","02-13-2024","Confirmed","Yes"';
      const secondUser =
        '"first name 1","last name 1","Agency 1","exampleemail_1@test.com","02-13-2024","Unconfirmed","No"';

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
      expect(readable).toContain(secondUser);
    });
  });
});
