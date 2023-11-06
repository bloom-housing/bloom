import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { PrismaModule } from './prisma.module';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';
import { EmailModule } from './email.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, HttpModule, EmailModule],
  controllers: [ListingController],
  providers: [
    ListingService,
    TranslationService,
    GoogleTranslateService,
    ConfigService,
  ],
  exports: [ListingService],
})
export class ListingModule {}