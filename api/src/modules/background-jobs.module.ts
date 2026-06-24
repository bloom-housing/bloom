import { Module } from '@nestjs/common';
import { BackgroundJobsController } from 'src/controllers/background-jobs.controller';
import { BackgroundJobsService } from 'src/services/background-jobs.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BackgroundJobsService],
  controllers: [BackgroundJobsController],
  exports: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
