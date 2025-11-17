import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from '../../../src/services/app.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { CronJobService } from '../../../src/services/cron-job.service';

describe('Testing app service', () => {
  let service: AppService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        PrismaService,
        Logger,
        SchedulerRegistry,
        CronJobService,
      ],
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
});
