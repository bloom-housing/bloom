import { Logger, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { MultiselectQuestionController } from '../controllers/multiselect-question.controller';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { CronJobModule } from './cron-job.module';

@Module({
  imports: [PrismaModule, PermissionModule, CronJobModule],
  controllers: [MultiselectQuestionController],
  providers: [Logger, MultiselectQuestionService, SchedulerRegistry],
  exports: [MultiselectQuestionService],
})
export class MultiselectQuestionModule {}
