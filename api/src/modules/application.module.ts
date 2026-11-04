import { Logger, Module } from '@nestjs/common';
import { ApplicationBulkUploadModule } from './application-bulk-upload.module';
import { ApplicationExporterModule } from './application-exporter.module';
import { CronJobModule } from './cron-job.module';
import { EmailModule } from './email.module';
import { ListingModule } from './listing.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { SnapshotCreateModule } from './snapshot-create.module';
import { UnitTypeModule } from './unit-type.module';
import { ApplicationController } from '../controllers/application.controller';
import { ApplicationService } from '../services/application.service';
import { GeocodingService } from '../services/geocoding.service';

@Module({
  imports: [
    ApplicationExporterModule,
    ApplicationBulkUploadModule,
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
