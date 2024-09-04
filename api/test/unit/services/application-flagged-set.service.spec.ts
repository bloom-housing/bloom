import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  RuleEnum,
} from '@prisma/client';
import { ApplicationFlaggedSetService } from '../../../src/services/application-flagged-set.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { View } from '../../../src/enums/application-flagged-sets/view';
import { Application } from '../../../src/dtos/applications/application.dto';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { User } from '../../../src/dtos/users/user.dto';
import { randomUUID } from 'node:crypto';

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
      ],
    }).compile();

    service = module.get<ApplicationFlaggedSetService>(
      ApplicationFlaggedSetService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  const testApplicationInfo = (id: string) => {
    return {
      id,
      applicant: {
        emailAddress: 'example email',
        firstName: 'example first name',
        lastName: 'example last name',
        birthMonth: 9,
        birthDay: 10,
        birthYear: 2000,
      },
      householdMember: [
        {
          firstName: 'household first name 1',
          lastName: 'household last name 1',
          birthMonth: 10,
          birthDay: 14,
          birthYear: 1998,
        },
        {
          firstName: 'household first name 2',
          lastName: 'household last name 2',
          birthMonth: 11,
          birthDay: 8,
          birthYear: 1967,
        },
      ],
    } as unknown as Application;
  };

  const whereClauseForNameAndDOBTest = (id: string, listingId: string) => {
    return {
      id: {
        not: id,
      },
      status: ApplicationStatusEnum.submitted,
      listingId: listingId,
      AND: [
        {
          OR: [
            {
              householdMember: {
                some: {
                  firstName: {
                    in: [
                      'example first name',
                      'household first name 1',
                      'household first name 2',
                    ],
                    mode: 'insensitive',
                  },
                },
              },
            },
            {
              applicant: {
                firstName: {
                  in: [
                    'example first name',
                    'household first name 1',
                    'household first name 2',
                  ],
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              householdMember: {
                some: {
                  lastName: {
                    in: [
                      'example last name',
                      'household last name 1',
                      'household last name 2',
                    ],
                    mode: 'insensitive',
                  },
                },
              },
            },
            {
              applicant: {
                lastName: {
                  in: [
                    'example last name',
                    'household last name 1',
                    'household last name 2',
                  ],
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              householdMember: {
                some: {
                  birthMonth: {
                    in: [9, 10, 11],
                  },
                },
              },
            },
            {
              applicant: {
                birthMonth: {
                  in: [9, 10, 11],
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              householdMember: {
                some: {
                  birthDay: {
                    in: [10, 14, 8],
                  },
                },
              },
            },
            {
              applicant: {
                birthDay: {
                  in: [10, 14, 8],
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              householdMember: {
                some: {
                  birthYear: {
                    in: [2000, 1998, 1967],
                  },
                },
              },
            },
            {
              applicant: {
                birthYear: {
                  in: [2000, 1998, 1967],
                },
              },
            },
          ],
        },
      ],
    };
  };

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

  describe('Test buildRuleKey', () => {
    it('should build rule key when rule is email', async () => {
      expect(
        await service.buildRuleKey(
          {
            applicant: {
              emailAddress: 'email address',
            },
          } as unknown as Application,
          RuleEnum.email,
          'example id',
        ),
      ).toEqual('example id-email-email address');
    });

    it('should build rule key when rule is nameAndDOB', async () => {
      expect(
        await service.buildRuleKey(
          {
            applicant: {
              firstName: 'first name',
              lastName: 'last name',
              birthMonth: 5,
              birthDay: 6,
              birthYear: 2000,
            },
          } as unknown as Application,
          RuleEnum.nameAndDOB,
          'example id',
        ),
      ).toEqual('example id-nameAndDOB-first name-last name-5-6-2000');
    });

    it('should build rule key in lowercase when rule is nameAndDOB', async () => {
      expect(
        await service.buildRuleKey(
          {
            applicant: {
              firstName: 'FIRST Name',
              lastName: 'lAsT nAMe',
              birthMonth: 5,
              birthDay: 6,
              birthYear: 2000,
            },
          } as unknown as Application,
          RuleEnum.nameAndDOB,
          'example id',
        ),
      ).toEqual('example id-nameAndDOB-first name-last name-5-6-2000');
    });

    it('should build rule key if name does not exist', async () => {
      expect(
        await service.buildRuleKey(
          {
            applicant: {
              firstName: undefined,
              lastName: undefined,
              birthMonth: 5,
              birthDay: 6,
              birthYear: 2000,
            },
          } as unknown as Application,
          RuleEnum.nameAndDOB,
          'example id',
        ),
      ).toEqual(undefined);
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

  describe('Test markCronJobAsStarted', () => {
    it('should mark existing job as begun', async () => {
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      prisma.cronJob.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      await service.markCronJobAsStarted('AFS_CRON_JOB');

      expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'AFS_CRON_JOB',
        },
      });

      expect(prisma.cronJob.update).toHaveBeenCalledWith({
        data: {
          lastRunDate: expect.anything(),
        },
        where: {
          id: 'example id',
        },
      });
    });

    it('should create cronjob as begun', async () => {
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue(null);

      prisma.cronJob.create = jest.fn().mockResolvedValue({
        id: 'example id',
      });

      await service.markCronJobAsStarted('AFS_CRON_JOB');

      expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'AFS_CRON_JOB',
        },
      });

      expect(prisma.cronJob.create).toHaveBeenCalledWith({
        data: {
          lastRunDate: expect.anything(),
          name: 'AFS_CRON_JOB',
        },
      });
    });
  });

  describe('Test checkAgainstEmail', () => {
    it('should get matching applications based on email', async () => {
      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'example id 1' }, { id: 'example id 2' }]);

      expect(
        await service.checkAgainstEmail(
          testApplicationInfo('example id 3'),
          'example listing id',
        ),
      ).toEqual([
        {
          id: 'example id 1',
        },
        {
          id: 'example id 2',
        },
      ]);

      expect(prisma.applications.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'example id 3',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'example listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });
    });

    it('should get [] when applicant email is empty', async () => {
      prisma.applications.findMany = jest.fn();

      expect(
        await service.checkAgainstEmail(
          {
            id: 'example id 3',
          } as unknown as Application,
          'example listing id',
        ),
      ).toEqual([]);

      expect(prisma.applications.findMany).not.toHaveBeenCalled();
    });
  });

  describe('Test checkAgainstNameAndDOB', () => {
    it('should get matching applications based on nameAndDOB', async () => {
      prisma.applications.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id 1',
        },
        {
          id: 'Example id 2',
        },
      ]);

      expect(
        await service.checkAgainstNameAndDOB(
          testApplicationInfo('example id 3'),
          'example listing id',
        ),
      ).toEqual([
        {
          id: 'example id 1',
        },
        {
          id: 'Example id 2',
        },
      ]);

      expect(prisma.applications.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest(
          'example id 3',
          'example listing id',
        ),
      });
    });
  });

  describe('Test disconnectApplicationFromFlaggedSet', () => {
    it('should delete flagged set', async () => {
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      prisma.applications.update = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      await service.disconnectApplicationFromFlaggedSet(
        'example afs id',
        2,
        'example application id',
      );

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledWith({
        where: {
          id: 'example afs id',
        },
      });

      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'example application id',
        },
      });
    });

    it('should remove application from flagged set', async () => {
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      prisma.applications.update = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      await service.disconnectApplicationFromFlaggedSet(
        'example afs id',
        3,
        'example application id',
      );

      expect(prisma.applicationFlaggedSet.update).toHaveBeenCalledWith({
        where: {
          id: 'example afs id',
        },
        data: {
          applications: {
            disconnect: {
              id: 'example application id',
            },
          },
        },
      });

      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'example application id',
        },
      });
    });
  });

  describe('Test createOrConnectToFlaggedSet', () => {
    it('should create a new flagged set', async () => {
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      await service.createOrConnectToFlaggedSet(
        RuleEnum.email,
        'example rule key',
        'example listing id',
        [
          {
            id: 'example id 1',
          },
          {
            id: 'example id 2',
          },
          {
            id: 'example id 3',
          },
        ],
      );

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledWith({
        where: {
          listingId: 'example listing id',
          ruleKey: 'example rule key',
        },
      });

      expect(prisma.applicationFlaggedSet.create).toHaveBeenCalledWith({
        data: {
          rule: RuleEnum.email,
          ruleKey: 'example rule key',
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: 'example listing id',
            },
          },
          applications: {
            connect: [
              {
                id: 'example id 1',
              },
              {
                id: 'example id 2',
              },
              {
                id: 'example id 3',
              },
            ],
          },
        },
      });
    });

    it('should add applications to flagged set', async () => {
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example afs id',
        },
      ]);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue({
        id: 'example id 1',
      });

      await service.createOrConnectToFlaggedSet(
        RuleEnum.email,
        'example rule key',
        'example listing id',
        [
          {
            id: 'example id 1',
          },
          {
            id: 'example id 2',
          },
          {
            id: 'example id 3',
          },
        ],
      );

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledWith({
        where: {
          listingId: 'example listing id',
          ruleKey: 'example rule key',
        },
      });

      expect(prisma.applicationFlaggedSet.update).toHaveBeenCalledWith({
        data: {
          applications: {
            connect: [
              {
                id: 'example id 1',
              },
              {
                id: 'example id 2',
              },
              {
                id: 'example id 3',
              },
            ],
          },
          // regardless of former status the afs should be reviewed again
          status: FlaggedSetStatusEnum.pending,
          resolvedTime: null,
          resolvingUserId: null,
        },
        where: {
          id: 'example afs id',
          ruleKey: 'example rule key',
        },
      });
    });
  });

  describe('Test checkForMatchesAgainstRule', () => {
    it('should get matching applications checking against email', async () => {
      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'example id 1' }, { id: 'example id 2' }]);

      expect(
        await service.checkForMatchesAgainstRule(
          {
            id: 'example id 3',
            applicant: {
              emailAddress: 'example email',
            },
          } as unknown as Application,
          RuleEnum.email,
          'example listing id',
        ),
      ).toEqual([
        {
          id: 'example id 1',
        },
        {
          id: 'example id 2',
        },
      ]);

      expect(prisma.applications.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'example id 3',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'example listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });
    });

    it('should get matching applications checking against nameAndDOB', async () => {
      prisma.applications.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id 1',
        },
        {
          id: 'Example id 2',
        },
      ]);

      expect(
        await service.checkForMatchesAgainstRule(
          testApplicationInfo('example id 3'),
          RuleEnum.nameAndDOB,
          'example listing id',
        ),
      ).toEqual([
        {
          id: 'example id 1',
        },
        {
          id: 'Example id 2',
        },
      ]);

      expect(prisma.applications.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest(
          'example id 3',
          'example listing id',
        ),
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

  describe('Test testApplication', () => {
    it('should testApplication with no duplicates present and no existing flagged set', async () => {
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();
    });

    it('should testApplication with no duplicates present and existing flagged set for nameAndDOB', async () => {
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            applications: [
              {
                id: 'id 1',
              },
              {
                id: 'id 2',
              },
            ],
          },
        ]);
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.findMany = mockCall;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue(null);
      prisma.applications.update = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledWith({
        where: {
          id: 'found afs id',
        },
      });

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();
      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'application id',
        },
      });
    });

    it('should testApplication with no duplicates present and existing flagged set for email', async () => {
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            applications: [
              {
                id: 'id 1',
              },
              {
                id: 'id 2',
              },
            ],
          },
        ])
        .mockResolvedValueOnce([]);
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.findMany = mockCall;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue(null);
      prisma.applications.update = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledWith({
        where: {
          id: 'found afs id',
        },
      });

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledTimes(1);

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();

      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'application id',
        },
      });
    });

    it('should testApplication with duplicates present for email and no existing flagged set', async () => {
      const mockCall = jest.fn().mockResolvedValueOnce([
        {
          id: 'dup id 1',
        },
        {
          id: 'dup id 2',
        },
      ]);
      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'new afs id',
      });

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenCalledTimes(2);

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledTimes(3);

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        where: {
          listingId: 'listing id',
          ruleKey: 'listing id-email-example email',
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(3, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).toHaveBeenCalledWith({
        data: {
          rule: RuleEnum.email,
          ruleKey: 'listing id-email-example email',
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: 'listing id',
            },
          },
          applications: {
            connect: [
              {
                id: 'dup id 1',
              },
              {
                id: 'dup id 2',
              },
              {
                id: 'application id',
              },
            ],
          },
        },
      });
    });

    it('should testApplication with duplicates present for email and existing flagged set is correct', async () => {
      const mockCall = jest.fn().mockResolvedValueOnce([
        {
          id: 'dup id 1',
        },
        {
          id: 'dup id 2',
        },
      ]);
      prisma.applications.findMany = mockCall;
      const mockFindManyCall = jest
        .fn()
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            ruleKey: 'listing id-email-example email',
          },
        ])
        .mockResolvedValueOnce([]);
      prisma.applicationFlaggedSet.findMany = mockFindManyCall;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenCalledTimes(2);

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledTimes(2);

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();
    });

    it('should testApplication with duplicates present for email and existing flagged set is incorrect', async () => {
      const mockCall = jest.fn().mockResolvedValueOnce([
        {
          id: 'dup id 1',
        },
        {
          id: 'dup id 2',
        },
      ]);

      const mockFindMany = jest
        .fn()
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            ruleKey: 'a different rule key',
            applications: [
              {
                id: 'id 1',
              },
              {
                id: 'id 2',
              },
            ],
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = mockFindMany;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'new afs id',
      });
      prisma.applications.update = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenCalledTimes(2);

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledWith({
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledWith({
        where: {
          listingId: 'listing id',
          ruleKey: 'listing id-email-example email',
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenCalledTimes(3);

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledWith({
        where: {
          id: 'found afs id',
        },
      });

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).toHaveBeenCalledWith({
        data: {
          rule: RuleEnum.email,
          ruleKey: 'listing id-email-example email',
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: 'listing id',
            },
          },
          applications: {
            connect: [
              {
                id: 'dup id 1',
              },
              {
                id: 'dup id 2',
              },
              {
                id: 'application id',
              },
            ],
          },
        },
      });

      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'application id',
        },
      });
    });

    it('should testApplication with duplicates present for nameAndDOB and no existing flagged set', async () => {
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'dup id 1',
          },
          {
            id: 'dup id 2',
          },
        ]);

      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'new afs id',
      });

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).toHaveBeenCalledWith({
        data: {
          rule: RuleEnum.nameAndDOB,
          ruleKey:
            'listing id-nameAndDOB-example first name-example last name-9-10-2000',
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: 'listing id',
            },
          },
          applications: {
            connect: [
              {
                id: 'dup id 1',
              },
              {
                id: 'dup id 2',
              },
              {
                id: 'application id',
              },
            ],
          },
        },
      });
    });

    it('should testApplication with duplicates present for nameAndDOB and existing flagged set is correct', async () => {
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'dup id 1',
          },
          {
            id: 'dup id 2',
          },
        ]);

      const mockFlaggedSetCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            ruleKey:
              'listing id-nameAndDOB-example first name-example last name-9-10-2000',
          },
        ]);

      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = mockFlaggedSetCall;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'new afs id',
      });

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();
    });

    it('should testApplication with duplicates present for nameAndDOB and existing flagged set is incorrect', async () => {
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'dup id 1',
          },
          {
            id: 'dup id 2',
          },
        ]);

      const mockFlaggedSetCall = jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: 'found afs id',
            ruleKey: 'a different ruleKey',
            applications: [
              {
                id: '1',
              },
              {
                id: '2',
              },
            ],
          },
        ])
        .mockResolvedValueOnce([]);

      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = mockFlaggedSetCall;
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue({
        id: 'new afs id',
      });
      prisma.applications.update = jest.fn().mockResolvedValue(null);

      await service.testApplication(
        testApplicationInfo('application id'),
        'listing id',
      );

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(3, {
        where: {
          listingId: 'listing id',
          ruleKey:
            'listing id-nameAndDOB-example first name-example last name-9-10-2000',
        },
      });

      expect(prisma.applicationFlaggedSet.delete).toHaveBeenCalledWith({
        where: {
          id: 'found afs id',
        },
      });

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).toHaveBeenCalledWith({
        data: {
          rule: RuleEnum.nameAndDOB,
          ruleKey:
            'listing id-nameAndDOB-example first name-example last name-9-10-2000',
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: 'listing id',
            },
          },
          applications: {
            connect: [
              {
                id: 'dup id 1',
              },
              {
                id: 'dup id 2',
              },
              {
                id: 'application id',
              },
            ],
          },
        },
      });

      expect(prisma.applications.update).toHaveBeenCalledWith({
        data: {
          markedAsDuplicate: false,
          reviewStatus: ApplicationReviewStatusEnum.valid,
        },
        where: {
          id: 'application id',
        },
      });
    });
  });

  describe('Test process', () => {
    it('should process listing', async () => {
      process.env.DUPLICATES_CLOSE_DATE = null;
      const mockCall = jest
        .fn()
        .mockResolvedValueOnce([
          {
            ...testApplicationInfo('application id'),
            listingId: 'listing id',
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      prisma.applications.findMany = mockCall;
      prisma.applicationFlaggedSet.findMany = jest.fn().mockResolvedValue([]);
      prisma.applicationFlaggedSet.delete = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.update = jest.fn().mockResolvedValue(null);
      prisma.applicationFlaggedSet.create = jest.fn().mockResolvedValue(null);
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.cronJob.update = jest.fn().mockResolvedValue({
        id: 'example id',
      });
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: 'listing id',
          afsLastRunAt: new Date(),
        },
      ]);
      prisma.listings.update = jest.fn().mockResolvedValue(null);

      await service.process();

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(1, {
        where: {
          listingId: 'listing id',
          updatedAt: {
            gte: expect.anything(),
          },
        },
        include: {
          applicant: true,
          householdMember: true,
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(2, {
        select: {
          id: true,
        },
        where: {
          id: {
            not: 'application id',
          },
          status: ApplicationStatusEnum.submitted,
          listingId: 'listing id',
          applicant: {
            emailAddress: 'example email',
          },
        },
      });

      expect(prisma.applications.findMany).toHaveBeenNthCalledWith(3, {
        select: {
          id: true,
        },
        where: whereClauseForNameAndDOBTest('application id', 'listing id'),
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(1, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.email,
        },
      });

      expect(prisma.applicationFlaggedSet.findMany).toHaveBeenNthCalledWith(2, {
        include: {
          applications: true,
        },
        where: {
          listingId: 'listing id',
          applications: {
            some: {
              id: 'application id',
            },
          },
          rule: RuleEnum.nameAndDOB,
        },
      });

      expect(prisma.applicationFlaggedSet.delete).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.update).not.toHaveBeenCalled();

      expect(prisma.applicationFlaggedSet.create).not.toHaveBeenCalled();

      expect(prisma.listings.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          afsLastRunAt: true,
        },
        where: {
          lastApplicationUpdateAt: {
            not: null,
          },
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
                    lte: prisma.listings.fields.lastApplicationUpdateAt,
                  },
                },
              ],
            },
          ],
        },
      });

      expect(prisma.listings.update).toHaveBeenCalledWith({
        where: {
          id: 'listing id',
        },
        data: {
          afsLastRunAt: expect.anything(),
        },
      });
    });
  });

  describe('Test processDuplicates', () => {
    it('should process only one listing when listingId is passed in', async () => {
      process.env.DUPLICATES_CLOSE_DATE = '2024-06-28 00:00 -08:00';
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
                  closedAt: {
                    gte: new Date('2024-06-28T08:00:00.000Z'),
                  },
                },
                {
                  closedAt: null,
                },
              ],
            },
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
      process.env.DUPLICATES_CLOSE_DATE = '2024-06-28 00:00 -08:00';
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
                  closedAt: {
                    gte: new Date('2024-06-28T08:00:00.000Z'),
                  },
                },
                {
                  closedAt: null,
                },
              ],
            },
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
      process.env.DUPLICATES_CLOSE_DATE = '2024-06-28 00:00 -08:00';
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
          AND: [
            {
              OR: [
                {
                  closedAt: {
                    gte: new Date('2024-06-28T08:00:00.000Z'),
                  },
                },
                {
                  closedAt: null,
                },
              ],
            },
            {},
          ],
          id: listingID,
          lastApplicationUpdateAt: {
            not: null,
          },
        },
      });
    });
  });
});
