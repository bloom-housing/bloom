import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { PermissionModule } from './permission.module';
import { S3Service } from '../services/s3.service';

@Module({
  imports: [PermissionModule],
  controllers: [AssetController],
  providers: [AssetService, CloudinaryService, S3Service, ConfigService],
  exports: [AssetService],
})
export class AssetModule {}
