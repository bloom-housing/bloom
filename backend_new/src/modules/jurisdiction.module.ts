import { Module } from '@nestjs/common';
import { JurisdictionController } from '../controllers/jurisdiction.controller';
import { JurisdictionService } from '../services/jurisdiction.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JurisdictionController],
  providers: [JurisdictionService],
  exports: [JurisdictionService],
})
export class JurisdictionModule {}
