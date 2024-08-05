import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { LotteryController } from '../controllers/lottery.controller';
import { LotteryService } from '../services/lottery.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { EmailModule } from './email.module';

@Module({
  imports: [
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
