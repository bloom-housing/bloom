import { Module } from '@nestjs/common';
import { ListingController } from '../controllers/listing.controller';
import { ListingService } from '../services/listing.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [ListingController],
  providers: [ListingService, PrismaService],
  exports: [ListingService, PrismaService],
})
export class ListingModule {}
