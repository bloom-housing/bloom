import { Logger, Module } from '@nestjs/common';
import { ApplicationExporterModule } from './application-exporter.module';
import { ConfigService } from '@nestjs/config';
import { EmailModule } from './email.module';
import { ListingModule } from './listing.module';
import { LotteryController } from '../controllers/lottery.controller';
import { LotteryService } from '../services/lottery.service';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { CronJobModule } from './cron-job.module';

@Module({
  imports: [
    ApplicationExporterModule,
    PrismaModule,
    ListingModule,
    EmailModule,
    MultiselectQuestionModule,
    PermissionModule,
    CronJobModule,
  ],
  controllers: [LotteryController],
  providers: [LotteryService, Logger, ConfigService],
  exports: [LotteryService],
})
export class LotteryModule {}
