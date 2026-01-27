import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationFlaggedSetModule } from './application-flagged-set.module';
import { CronJobModule } from './cron-job.module';
import { EmailModule } from './email.module';
import { MultiselectQuestionModule } from './multiselect-question.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { ListingCsvExporterService } from '../services/listing-csv-export.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { TranslationService } from '../services/translation.service';

@Module({
  imports: [
    ApplicationFlaggedSetModule,
    CronJobModule,
    EmailModule,
    HttpModule,
    MultiselectQuestionModule,
    PermissionModule,
    PrismaModule,
  ],
  controllers: [ListingController],
  providers: [
    ConfigService,
    GoogleTranslateService,
    ListingService,
    ListingCsvExporterService,
    Logger,
    TranslationService,
  ],
  exports: [ListingService],
})
export class ListingModule {}
