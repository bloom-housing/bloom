import { Module } from '@nestjs/common';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';

@Module({
  imports: [],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
