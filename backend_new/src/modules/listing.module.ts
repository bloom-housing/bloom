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

@Module({
  imports: [PrismaModule, HttpModule, EmailModule, ApplicationFlaggedSetModule],
  controllers: [ListingController],
  providers: [
    ListingService,
    TranslationService,
    GoogleTranslateService,
    ConfigService,
    Logger,
    SchedulerRegistry,
  ],
  exports: [ListingService],
})
export class ListingModule {}
