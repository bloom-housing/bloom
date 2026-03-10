import { ApplicationController } from '../controllers/application.controller';
import { ApplicationExporterModule } from './application-exporter.module';
import { ApplicationService } from '../services/application.service';
import { CronJobModule } from './cron-job.module';
import { EmailModule } from './email.module';
import { GeocodingService } from '../services/geocoding.service';
import { ListingModule } from './listing.module';
import { Logger, Module } from '@nestjs/common';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { SnapshotCreateModule } from './snapshot-create.module';
import { UnitTypeModule } from './unit-type.module';

@Module({
  imports: [
    ApplicationExporterModule,
    CronJobModule,
    EmailModule,
    ListingModule,
    MultiselectQuestionModule,
    PermissionModule,
    PrismaModule,
    SnapshotCreateModule,
    UnitTypeModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, GeocodingService, Logger],
  exports: [ApplicationService],
})
export class ApplicationModule {}
