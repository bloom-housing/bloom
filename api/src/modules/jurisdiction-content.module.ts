import { Module } from '@nestjs/common';
import { JurisdictionContentController } from '../controllers/jurisdiction-content.controller';
import { JurisdictionContentService } from '../services/jurisdiction-content.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [JurisdictionContentController],
  providers: [JurisdictionContentService],
  exports: [JurisdictionContentService],
})
export class JurisdictionContentModule {}
