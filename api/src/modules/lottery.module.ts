import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApplicationExporterModule } from './application-exporter.module';
import { ConfigService } from '@nestjs/config';
import { EmailModule } from './email.module';
import { ListingModule } from './listing.module';
import { LotteryController } from '../controllers/lottery.controller';
import { LotteryService } from '../services/lottery.service';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ApplicationExporterModule,
    PrismaModule,
    ListingModule,
    EmailModule,
    MultiselectQuestionModule,
    PermissionModule,
  ],
  controllers: [LotteryController],
  providers: [LotteryService, Logger, SchedulerRegistry, ConfigService],
  exports: [LotteryService],
})
export class LotteryModule {}
