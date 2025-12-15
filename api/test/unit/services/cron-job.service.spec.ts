import { PrismaService } from '../../../src/services/prisma.service';
import { CronJobService } from '../../../src/services/cron-job.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { randomUUID } from 'crypto';

describe('Testing app service', () => {
  let service: CronJobService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronJobService, PrismaService, Logger, SchedulerRegistry],
    }).compile();

    service = module.get<CronJobService>(CronJobService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  const sampleName = 'SAMPLE_NAME';
  it('should create new cronjob entry if none is present', async () => {
    prisma.cronJob.findFirst = jest.fn().mockResolvedValue(null);
    prisma.cronJob.create = jest.fn().mockResolvedValue(true);

    await service.markCronJobAsStarted(sampleName);

    expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
      where: {
        name: sampleName,
      },
    });
    expect(prisma.cronJob.create).toHaveBeenCalledWith({
      data: {
        lastRunDate: expect.anything(),
        name: sampleName,
      },
    });
  });

  it('should update cronjob entry if one is present', async () => {
    prisma.cronJob.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });
    prisma.cronJob.update = jest.fn().mockResolvedValue(true);

    await service.markCronJobAsStarted(sampleName);

    expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
      where: {
        name: sampleName,
      },
    });
    expect(prisma.cronJob.update).toHaveBeenCalledWith({
      data: {
        lastRunDate: expect.anything(),
      },
      where: {
        id: expect.anything(),
      },
    });
  });
});
