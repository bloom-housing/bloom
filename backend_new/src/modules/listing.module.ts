import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { PrismaModule } from './prisma.module';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { ApplicationFlaggedSetModule } from './application-flagged-set.module';
import { EmailModule } from './email.module';
import { PermissionModule } from './permission.module';
import { ListingCsvExporterService } from '../services/listing-csv-export.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    EmailModule,
    ApplicationFlaggedSetModule,
    PermissionModule,
  ],
  controllers: [ListingController],
  providers: [
    ListingService,
    TranslationService,
    GoogleTranslateService,
    ConfigService,
    Logger,
    SchedulerRegistry,
    ListingCsvExporterService,
  ],
  exports: [ListingService],
})
export class ListingModule {}
