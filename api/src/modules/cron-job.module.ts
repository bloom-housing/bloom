import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaModule } from './prisma.module';
import { CronJobService } from '../services/cron-job.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [CronJobService, Logger, SchedulerRegistry],
  exports: [CronJobService],
})
export class CronJobModule {}
