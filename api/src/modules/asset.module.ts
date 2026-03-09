import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { PermissionModule } from './permission.module';
import { S3Module } from './s3.module';

@Module({
  imports: [PermissionModule, S3Module],
  controllers: [AssetController],
  providers: [AssetService, CloudinaryService, ConfigService],
  exports: [AssetService],
})
export class AssetModule {}
