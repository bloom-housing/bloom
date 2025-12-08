import { Logger, Module } from '@nestjs/common';
import { ApplicationController } from '../controllers/application.controller';
import { ApplicationExporterModule } from './application-exporter.module';
import { ApplicationService } from '../services/application.service';
import { EmailModule } from './email.module';
import { GeocodingService } from '../services/geocoding.service';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { UnitTypeModule } from './unit-type.module';
import { CronJobModule } from './cron-job.module';

@Module({
  imports: [
    ApplicationExporterModule,
    PrismaModule,
    EmailModule,
    ListingModule,
    MultiselectQuestionModule,
    PermissionModule,
    UnitTypeModule,
    CronJobModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, GeocodingService, Logger],
  exports: [ApplicationService],
})
export class ApplicationModule {}
