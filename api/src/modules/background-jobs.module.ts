import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { S3Module } from './s3.module';
import { PermissionModule } from './permission.module';
import { BackgroundJobsController } from '../controllers/background-jobs.controller';
import { BackgroundJobsService } from '../services/background-jobs.service';
import { CronJobModule } from './cron-job.module';

@Module({
  imports: [PrismaModule, S3Module, PermissionModule, CronJobModule],
  providers: [BackgroundJobsService, Logger],
  controllers: [BackgroundJobsController],
  exports: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
