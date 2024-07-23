import { Module } from '@nestjs/common';
import { LotteryController } from '../controllers/lottery.controller';
import { LotteryService } from '../services/lottery.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';

@Module({
  imports: [
    PrismaModule,
    ListingModule,
    MultiselectQuestionModule,
    PermissionModule,
  ],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteryModule {}
