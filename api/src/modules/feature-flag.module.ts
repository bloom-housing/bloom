import { Logger, Module } from '@nestjs/common';
import { FeatureFlagController } from '../controllers/feature-flag.controller';
import { FeatureFlagService } from '../services/feature-flag.service';
import { JurisdictionModule } from './jurisdiction.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [JurisdictionModule, PermissionModule, PrismaModule],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService, Logger],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
