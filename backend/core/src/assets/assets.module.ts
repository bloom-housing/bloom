import { Module } from "@nestjs/common"
import { AssetsController } from "./assets.controller"
import { AssetsService } from "./services/assets.service"
import { CloudinaryService, UploadService } from "./services/upload.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { SharedModule } from "../shared/shared.module"
import { Asset } from "./entities/asset.entity"
import { AuthModule } from "../auth/auth.module"
import { FileServiceProvider, NullFileService, AmazonS3FileService } from "../shared/uploads"

@Module({
  controllers: [AssetsController],
  providers: [
    AssetsService,
    { provide: UploadService, useClass: CloudinaryService },
    {
      provide: FileServiceProvider,
      useFactory: (): FileServiceProvider => {
        // the constructor is where we define which service to use by default
        return (
          new FileServiceProvider(process.env.ASSET_FILE_SERVICE)
            // register the null file service
            .registerFileService("null", new NullFileService())
            // register the Amazon S3 file service
            .registerFileService("s3", new AmazonS3FileService())
            // configure() will filter out the config values we actually need
            .configure(process.env, "ASSET_FS_CONFIG_")
        )
      },
    },
  ],
  imports: [TypeOrmModule.forFeature([Asset]), AuthModule, SharedModule],
})
export class AssetsModule {}
