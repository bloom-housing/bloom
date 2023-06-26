import { Module } from '@nestjs/common';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';
import { GoogleTranslateService } from '../services/google-translate.service';

@Module({
  imports: [],
  controllers: [ListingController],
  providers: [
    ListingService,
    PrismaService,
    TranslationService,
    GoogleTranslateService,
  ],
  exports: [ListingService, PrismaService],
})
export class ListingModule {}
