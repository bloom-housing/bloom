import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from '../../../src/services/app.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('Testing app service', () => {
  let service: AppService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, PrismaService, Logger, SchedulerRegistry],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a successDTO with success true', async () => {
    prisma.$queryRaw = jest.fn().mockResolvedValue(1);
    expect(await service.healthCheck()).toEqual({
      success: true,
    });
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  it('should create new cronjob entry if none is present', async () => {
    prisma.cronJob.findFirst = jest.fn().mockResolvedValue(null);
    prisma.cronJob.create = jest.fn().mockResolvedValue(true);

    await service.markCronJobAsStarted();

    expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
      where: {
        name: 'TEMP_FILE_CLEAR_CRON_JOB',
      },
    });
    expect(prisma.cronJob.create).toHaveBeenCalledWith({
      data: {
        lastRunDate: expect.anything(),
        name: 'TEMP_FILE_CLEAR_CRON_JOB',
      },
    });
  });

  it('should update cronjob entry if one is present', async () => {
    prisma.cronJob.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID() });
    prisma.cronJob.update = jest.fn().mockResolvedValue(true);

    await service.markCronJobAsStarted();

    expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
      where: {
        name: 'TEMP_FILE_CLEAR_CRON_JOB',
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
