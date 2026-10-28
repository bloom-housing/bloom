import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ApplicationReviewStatusEnum,
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  RuleEnum,
} from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { ApplicationFlaggedSetService } from '../../../src/services/application-flagged-set.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { View } from '../../../src/enums/application-flagged-sets/view';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { User } from '../../../src/dtos/users/user.dto';
import { CronJobService } from '../../../src/services/cron-job.service';

describe('Testing application flagged set service', () => {
  let service: ApplicationFlaggedSetService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationFlaggedSetService,
        PrismaService,
        Logger,
        SchedulerRegistry,
        CronJobService,
      ],
    }).compile();

    service = module.get<ApplicationFlaggedSetService>(
      ApplicationFlaggedSetService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Test buildWhere', () => {
    it('should build where clause with listingId filter only', async () => {
      expect(await service.buildWhere({ listingId: 'example id' })).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
        ],
      });
    });

    it('should build where clause with listingId and view of pending', async () => {
      expect(
        await service.buildWhere({
          listingId: 'example id',
          view: View.pending,
        }),
      ).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
          {
            status: FlaggedSetStatusEnum.pending,
          },
        ],
      });
    });

    it('should build where clause with listingId and view of pending with search', async () => {
      expect(
        await service.buildWhere({
          listingId: 'example id',
          view: View.pending,
          search: 'simple search',
        }),
      ).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
          {
            status: FlaggedSetStatusEnum.pending,
          },
          {
            applications: {
              some: {
                applicant: {
                  OR: [
                    {
                      firstName: {
                        contains: 'simple search',
                        mode: 'insensitive',
                      },
                    },
                    {
                      lastName: {
                        contains: 'simple search',
                        mode: 'insensitive',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      });
    });

    it('should build where clause with listingId and view of pendingNameAndDoB', async () => {
      expect(
        await service.buildWhere({
          listingId: 'example id',
          view: View.pendingNameAndDoB,
        }),
      ).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
          {
            status: FlaggedSetStatusEnum.pending,
            rule: RuleEnum.nameAndDOB,
          },
        ],
      });
    });

    it('should build where clause with listingId and view of pendingEmail', async () => {
      expect(
        await service.buildWhere({
          listingId: 'example id',
          view: View.pendingEmail,
        }),
      ).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
          {
            status: FlaggedSetStatusEnum.pending,
            rule: RuleEnum.email,
          },
        ],
      });
    });

    it('should build where clause with listingId and view of resolved', async () => {
      expect(
        await service.buildWhere({
          listingId: 'example id',
          view: View.resolved,
        }),
      ).toEqual({
        AND: [
          {
            listingId: 'example id',
          },
          {
            status: FlaggedSetStatusEnum.resolved,
          },
        ],
      });
    });
  });

  describe('Test metaDataQueryBuilder', () => {
    it('should build meta data helper query with status and rule arguments present', async () => {
      prisma.applicationFlaggedSet.count = jest.fn().mockResolvedValue(1);
      expect(
        await service.metaDataQueryBuilder(
          'example id',
          FlaggedSetStatusEnum.pending,
          RuleEnum.email,
        ),
      ).toEqual(1);
      expect(prisma.applicationFlaggedSet.count).toHaveBeenCalledWith({
        where: {
          listingId: 'example id',
          status: FlaggedSetStatusEnum.pending,
          rule: RuleEnum.email,
        },
      });
    });

    it('should build meta data helper query without status or rule arguments', async () => {
      prisma.applicationFlaggedSet.count = jest.fn().mockResolvedValue(1);
      expect(await service.metaDataQueryBuilder('example id')).toEqual(1);
      expect(prisma.applicationFlaggedSet.count).toHaveBeenCalledWith({
        where: {
          listingId: 'example id',
        },
      });
    });
  });

  describe('Test list', () => {
    it('should get a list of flagged sets when view is pendingEmail', async () => {
      const mockCount = jest
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2);
      prisma.applicationFlaggedSet.count = mockCount;
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id',
        },
      ]);
      expect(
        await service.list({
          listingId: 'example id',
          view: View.pendingEmail,
        }),
      ).toEqual({
        items: [
          {
            id: 'example id',
          },
        ],
        meta: {
          currentPage: 1,
          itemCount: 1,
          itemsPerPage: 1,
          totalItems: 1,
          totalPages: 1,
          totalFlagged: 2,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledWith({
        include: {
          listings: true,
          applications: {
            include: {
              applicant: true,
            },
          },
        },
        where: {
          AND: [
            {
              listingId: 'example id',
            },
            {
              status: FlaggedSetStatusEnum.pending,
              rule: RuleEnum.email,
            },
          ],
        },
        orderBy: {
          id: OrderByEnum.DESC,
        },
        skip: 0,
      });

      expect(prisma.applicationFlaggedSet.count).toHaveBeenNthCalledWith(1, {
        where: {
          AND: [
            {
              listingId: 'example id',
            },
            {
              status: FlaggedSetStatusEnum.pending,
              rule: RuleEnum.email,
            },
          ],
        },
      });

      expect(prisma.applicationFlaggedSet.count).toHaveBeenNthCalledWith(2, {
        where: {
          listingId: 'example id',
          status: FlaggedSetStatusEnum.pending,
        },
      });
    });

    it('should return the first page if count is more than number of listings', async () => {
      const mockCount = jest
        .fn()
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(2);
      prisma.applicationFlaggedSet.count = mockCount;
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id',
        },
        {
          id: 'example id 2',
        },
      ]);
      expect(
        await service.list({
          listingId: 'example id',
          view: View.pendingEmail,
          limit: 100,
          page: 2,
        }),
      ).toEqual({
        items: [
          {
            id: 'example id',
          },
          {
            id: 'example id 2',
          },
        ],
        meta: {
          currentPage: 1,
          itemCount: 2,
          itemsPerPage: 2,
          totalItems: 2,
          totalPages: 1,
          totalFlagged: 2,
        },
      });
    });
  });

  describe('Test findOne', () => {
    it('should get a flagged set', async () => {
      prisma.applicationFlaggedSet.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      expect(await service.findOne('example id')).toEqual({
        id: 'example id',
      });

      expect(prisma.applicationFlaggedSet.findUnique).toHaveBeenCalledWith({
        include: {
          applications: {
            include: {
              applicant: true,
            },
          },
          listings: true,
        },
        where: {
          id: 'example id',
        },
      });
    });

    it('should error getting a flagged set that does not exist', async () => {
      prisma.applicationFlaggedSet.findUnique = jest
        .fn()
        .mockResolvedValue(null);
      await expect(
        async () => await service.findOne('example id'),
      ).rejects.toThrowError(
        'applicationFlaggedSetId example id was requested but not found',
      );

      expect(prisma.applicationFlaggedSet.findUnique).toHaveBeenCalledWith({
        include: {
          applications: {
            include: {
              applicant: true,
            },
          },
          listings: true,
        },
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('Test resetConfirmationAlert', () => {
    it('should update showConfirmationAlert', async () => {
      prisma.applicationFlaggedSet.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      expect(await service.resetConfirmationAlert('example id')).toEqual({
        success: true,
      });

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });

      expect(prisma.applicationFlaggedSet.update).toHaveBeenCalledWith({
        data: {
          showConfirmationAlert: false,
        },
        where: {
          id: 'example id',
        },
      });
    });

    it('should error updating showConfirmationAlert for flagged set that does not exist', async () => {
      prisma.applicationFlaggedSet.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      await expect(
        async () => await service.resetConfirmationAlert('example id'),
      ).rejects.toThrowError(
        'applicationFlaggedSet example id was requested but not found',
      );

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('Test meta', () => {
    it('should grab meta data', async () => {
      const mockCount = jest
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(3);

      prisma.applicationFlaggedSet.count = mockCount;
      prisma.applications.count = jest.fn().mockResolvedValueOnce(12);

      expect(await service.meta({ listingId: 'example id' })).toEqual({
        totalCount: 12,
        totalResolvedCount: 1,
        totalPendingCount: 3,
      });

      expect(prisma.applicationFlaggedSet.count).toHaveBeenNthCalledWith(1, {
        where: {
          listingId: 'example id',
          status: FlaggedSetStatusEnum.resolved,
        },
      });

      expect(prisma.applicationFlaggedSet.count).toHaveBeenNthCalledWith(2, {
        where: {
          listingId: 'example id',
          status: FlaggedSetStatusEnum.pending,
        },
      });
    });
  });

  describe('Test findOrThrow', () => {
    it('should return true for flagged set that exists', async () => {
      prisma.applicationFlaggedSet.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      expect(await service.findOrThrow('example id')).toEqual(true);

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });
    });

    it('should error getting a flagged set that does not exist', async () => {
      prisma.applicationFlaggedSet.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      await expect(
        async () => await service.findOrThrow('example id'),
      ).rejects.toThrowError(
        'applicationFlaggedSet example id was requested but not found',
      );

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('Test resolve', () => {
    it('should error trying to resolve flagged set on open listing', async () => {
      prisma.applicationFlaggedSet.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
        listings: {
          id: 'listing id',
          status: ListingsStatusEnum.active,
        },
      });
      await expect(
        async () =>
          await service.resolve(
            {
              afsId: 'example id',
              status: FlaggedSetStatusEnum.resolved,
              applications: [],
            },
            {
              id: 'user id',
            } as unknown as User,
          ),
      ).rejects.toThrowError(
        'Listing listing id must be closed before resolving any duplicates',
      );

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          AND: [
            {
              id: 'example id',
            },
          ],
        },
        include: {
          listings: true,
          applications: {
            where: {
              id: {
                in: [],
              },
            },
          },
        },
      });
    });

    it('should resolve flagged set to pending', async () => {
      prisma.applicationFlaggedSet.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
        listings: {
          id: 'listing id',
          status: ListingsStatusEnum.closed,
        },
        applications: [
          {
            id: 'app id 1',
          },
          {
            id: 'app id 2',
          },
        ],
      });
      prisma.applications.updateMany = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      expect(
        await service.resolve(
          {
            afsId: 'example id',
            status: FlaggedSetStatusEnum.pending,
            applications: [
              {
                id: 'app id 1',
              },
              {
                id: 'app id 2',
              },
            ],
          },
          {
            id: 'user id',
          } as unknown as User,
        ),
      ).toEqual({
        id: 'example id',
        applications: [
          {
            id: 'app id 1',
          },
          {
            id: 'app id 2',
          },
        ],
      });

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          AND: [
            {
              id: 'example id',
            },
            {
              applications: {
                some: {
                  id: {
                    in: ['app id 1', 'app id 2'],
                  },
                },
              },
            },
          ],
        },
        include: {
          listings: true,
          applications: {
            where: {
              id: {
                in: ['app id 1', 'app id 2'],
              },
            },
          },
        },
      });

      expect(prisma.applications.updateMany).toHaveBeenNthCalledWith(1, {
        data: {
          reviewStatus: ApplicationReviewStatusEnum.pendingAndValid,
          markedAsDuplicate: false,
        },
        where: {
          id: {
            in: ['app id 1', 'app id 2'],
          },
        },
      });

      expect(prisma.applications.updateMany).toHaveBeenNthCalledWith(2, {
        data: {
          reviewStatus: ApplicationReviewStatusEnum.pending,
          markedAsDuplicate: false,
        },
        where: {
          applicationFlaggedSet: {
            some: {
              id: 'example id',
            },
          },
          id: {
            notIn: ['app id 1', 'app id 2'],
          },
        },
      });

      expect(prisma.applicationFlaggedSet.update).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
        data: {
          resolvedTime: expect.anything(),
          status: FlaggedSetStatusEnum.pending,
          showConfirmationAlert: false,
          userAccounts: {
            connect: {
              id: 'user id',
            },
          },
        },
      });
    });

    it('should resolve flagged set to resolved', async () => {
      prisma.applicationFlaggedSet.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
        listings: {
          id: 'listing id',
          status: ListingsStatusEnum.closed,
        },
        applications: [
          {
            id: 'app id 1',
          },
          {
            id: 'app id 2',
          },
        ],
      });
      prisma.applications.updateMany = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      expect(
        await service.resolve(
          {
            afsId: 'example id',
            status: FlaggedSetStatusEnum.resolved,
            applications: [
              {
                id: 'app id 1',
              },
              {
                id: 'app id 2',
              },
            ],
          },
          {
            id: 'user id',
          } as unknown as User,
        ),
      ).toEqual({
        id: 'example id',
        applications: [
          {
            id: 'app id 1',
          },
          {
            id: 'app id 2',
          },
        ],
      });

      expect(prisma.applicationFlaggedSet.findFirst).toHaveBeenCalledWith({
        where: {
          AND: [
            {
              id: 'example id',
            },
            {
              applications: {
                some: {
                  id: {
                    in: ['app id 1', 'app id 2'],
                  },
                },
              },
            },
          ],
        },
        include: {
          listings: true,
          applications: {
            where: {
              id: {
                in: ['app id 1', 'app id 2'],
              },
            },
          },
        },
      });

      expect(prisma.applications.updateMany).toHaveBeenNthCalledWith(1, {
        data: {
          reviewStatus: ApplicationReviewStatusEnum.valid,
          markedAsDuplicate: false,
        },
        where: {
          id: {
            in: ['app id 1', 'app id 2'],
          },
        },
      });

      expect(prisma.applications.updateMany).toHaveBeenNthCalledWith(2, {
        data: {
          reviewStatus: ApplicationReviewStatusEnum.duplicate,
          markedAsDuplicate: true,
        },
        where: {
          applicationFlaggedSet: {
            some: {
              id: 'example id',
            },
          },
          id: {
            notIn: ['app id 1', 'app id 2'],
          },
        },
      });

      expect(prisma.applicationFlaggedSet.update).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
        data: {
          resolvedTime: expect.anything(),
          status: FlaggedSetStatusEnum.resolved,
          showConfirmationAlert: true,
          userAccounts: {
            connect: {
              id: 'user id',
            },
          },
        },
      });
    });
  });

  describe('Test processDuplicates', () => {
    beforeAll(() => {
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.cronJob.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });
    });
    it('should process only one listing when listingId is passed in', async () => {
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.cronJob.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      const listingID = randomUUID();
      prisma.listings.findMany = jest.fn().mockResolvedValue([]);
      await service.processDuplicates(listingID);
      expect(prisma.listings.findMany).toBeCalledWith({
        select: {
          afsLastRunAt: true,
          id: true,
          name: true,
        },
        where: {
          AND: [
            {
              OR: [
                {
                  afsLastRunAt: {
                    equals: null,
                  },
                },
                {
                  afsLastRunAt: {
                    lte: expect.objectContaining({
                      isEnum: false,
                      isList: false,
                      modelName: 'Listings',
                      name: 'lastApplicationUpdateAt',
                      typeName: 'DateTime',
                    }),
                  },
                },
              ],
            },
          ],
          id: listingID,
          lastApplicationUpdateAt: {
            not: null,
          },
        },
      });
    });

    it('should process all eligible listings when listingId is not passed in', async () => {
      prisma.listings.findMany = jest.fn().mockResolvedValue([]);
      await service.processDuplicates();
      expect(prisma.listings.findMany).toBeCalledWith({
        select: {
          afsLastRunAt: true,
          id: true,
          name: true,
        },
        where: {
          AND: [
            {
              OR: [
                {
                  afsLastRunAt: {
                    equals: null,
                  },
                },
                {
                  afsLastRunAt: {
                    lte: expect.objectContaining({
                      isEnum: false,
                      isList: false,
                      modelName: 'Listings',
                      name: 'lastApplicationUpdateAt',
                      typeName: 'DateTime',
                    }),
                  },
                },
              ],
            },
          ],
          id: undefined,
          lastApplicationUpdateAt: {
            not: null,
          },
        },
      });
    });

    it('should process all eligible listings last run excluded when forced is passed in', async () => {
      const listingID = randomUUID();
      prisma.listings.findMany = jest.fn().mockResolvedValue([]);
      await service.processDuplicates(listingID, true);
      expect(prisma.listings.findMany).toBeCalledWith({
        select: {
          afsLastRunAt: true,
          id: true,
          name: true,
        },
        where: {
          AND: [{}],
          id: listingID,
          lastApplicationUpdateAt: {
            not: null,
          },
        },
      });
    });
  });
});
