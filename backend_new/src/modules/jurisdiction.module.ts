import { Module } from '@nestjs/common';
import { JurisdictionController } from '../controllers/jurisdiction.controller';
import { JurisdictionService } from '../services/jurisdiction.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [JurisdictionController],
  providers: [JurisdictionService, PrismaService],
  exports: [JurisdictionService, PrismaService],
})
export class JurisdictionModule {}
