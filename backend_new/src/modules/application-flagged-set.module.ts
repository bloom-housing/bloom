import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApplicationFlaggedSetController } from '../controllers/application-flagged-set.controller';
import { ApplicationFlaggedSetService } from '../services/application-flagged-set.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApplicationFlaggedSetController],
  providers: [ApplicationFlaggedSetService, Logger, SchedulerRegistry],
  exports: [ApplicationFlaggedSetService],
})
export class ApplicationFlaggedSetModule {}
