import { Module } from '@nestjs/common';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';
import { PermissionModule } from './permission.module';

@Module({
  imports: [PermissionModule],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
