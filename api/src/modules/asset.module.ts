import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssetController } from '../controllers/asset.controller';
import { AssetService } from '../services/asset.service';
import { PermissionModule } from './permission.module';
import { CloudinaryService, UploadService } from '../services/upload.service';
import {
  AmazonS3FileService,
  FileServiceProvider,
  NullFileService,
} from '../services/uploads';

@Module({
  imports: [PermissionModule],
  controllers: [AssetController],
  providers: [
    AssetService,
    ConfigService,
    { provide: UploadService, useClass: CloudinaryService },
    {
      provide: FileServiceProvider,
      useFactory: (): FileServiceProvider => {
        // the constructor is where we define which service to use by default
        return (
          new FileServiceProvider(process.env.ASSET_FILE_SERVICE)
            // register the null file service
            .registerFileService('null', new NullFileService())
            // register the Amazon S3 file service
            .registerFileService('s3', new AmazonS3FileService())
            // configure() will filter out the config values we actually need
            .configure(process.env, 'ASSET_FS_CONFIG_')
        );
      },
    },
  ],
  exports: [AssetService],
})
export class AssetModule {}
