import fs from 'fs';
import { join } from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from '../../../src/services/app.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { CronJobService } from '../../../src/services/cron-job.service';

describe('Testing app service', () => {
  let service: AppService;
  let prisma: PrismaService;
  let cronJobService: CronJobService;

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
    cronJobService = module.get<CronJobService>(CronJobService);
  });

  it('should return a successDTO with success true', async () => {
    prisma.$queryRaw = jest.fn().mockResolvedValue(1);
    expect(await service.healthCheck()).toEqual({
      success: true,
    });
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });

  describe('clearTempFiles', () => {
    beforeEach(() => {
      cronJobService.markCronJobAsStarted = jest.fn().mockResolvedValue(null);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should delete non-.git files and return success', async () => {
      jest
        .spyOn(fs.promises, 'readdir')
        .mockResolvedValue(['file1.csv', 'file2.zip', '.gitkeep'] as any);
      const rmSpy = jest.spyOn(fs.promises, 'rm').mockResolvedValue(undefined);

      const result = await service.clearTempFiles();

      expect(result).toEqual({ success: true });
      expect(rmSpy).toHaveBeenCalledTimes(2);
      expect(rmSpy).toHaveBeenCalledWith(
        join(process.cwd(), 'src/temp/', 'file1.csv'),
        { recursive: true },
      );
      expect(rmSpy).toHaveBeenCalledWith(
        join(process.cwd(), 'src/temp/', 'file2.zip'),
        { recursive: true },
      );
      expect(rmSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('.gitkeep'),
        expect.anything(),
      );
    });

    it('should skip deletion and return success when temp dir is empty', async () => {
      jest.spyOn(fs.promises, 'readdir').mockResolvedValue([] as any);
      const rmSpy = jest.spyOn(fs.promises, 'rm').mockResolvedValue(undefined);

      const result = await service.clearTempFiles();

      expect(result).toEqual({ success: true });
      expect(rmSpy).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when readdir fails', async () => {
      jest
        .spyOn(fs.promises, 'readdir')
        .mockRejectedValue(new Error('ENOENT: no such file or directory'));

      await expect(service.clearTempFiles()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException when rm fails', async () => {
      jest
        .spyOn(fs.promises, 'readdir')
        .mockResolvedValue(['file1.csv'] as any);
      jest
        .spyOn(fs.promises, 'rm')
        .mockRejectedValue(new Error('EACCES: permission denied'));

      await expect(service.clearTempFiles()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
