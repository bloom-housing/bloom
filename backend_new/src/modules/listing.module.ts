import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { PrismaModule } from './prisma.module';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { ApplicationFlaggedSetModule } from './application-flagged-set.module';

@Module({
  imports: [PrismaModule, HttpModule, ApplicationFlaggedSetModule],
  controllers: [ListingController],
  providers: [ListingService, TranslationService, GoogleTranslateService],
  exports: [ListingService],
})
export class ListingModule {}
