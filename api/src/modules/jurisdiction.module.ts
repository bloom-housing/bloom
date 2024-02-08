import { Module } from '@nestjs/common';
import { JurisdictionController } from '../controllers/jurisdiction.controller';
import { JurisdictionService } from '../services/jurisdiction.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [JurisdictionController],
  providers: [JurisdictionService],
  exports: [JurisdictionService],
})
export class JurisdictionModule {}
