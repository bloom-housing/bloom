import { Module } from '@nestjs/common';
import { FeatureFlagController } from '../controllers/feature-flag.controller';
import { FeatureFlagService } from '../services/feature-flag.service';
import { PrismaModule } from './prisma.module';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
