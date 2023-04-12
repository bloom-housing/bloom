import { CloudinaryFileService } from "./cloudinary-file.service"
import { CloudinaryFileUploader } from "./cloudinary-file-uploader"
import { FileServiceInterface } from "./file-service.interface"
import { FileConfig, FileServiceTypeEnum } from "./file-config"

export class FileServiceProvider {
  service: FileServiceInterface

  private configure(): FileConfig {
    const fileConfig: FileConfig = {
      fileServiceType: FileServiceTypeEnum.cloudinary,
      cloudinaryConfig: {
        cloudinaryCloudName: process.env.cloudinaryCloudName || "",
        cloudinaryUploadPreset: process.env.cloudinarySignedPreset || "",
      },
    }
    return fileConfig
  }

  private create(): void {
    const fileConfig = this.configure()
    switch (fileConfig.fileServiceType) {
      case FileServiceTypeEnum.cloudinary:
        this.service = new CloudinaryFileService(
          new CloudinaryFileUploader(),
          fileConfig.cloudinaryConfig
        )
        break
      default:
        throw new Error("Unknown file service type")
    }
  }

  public getService(): FileServiceInterface {
    if (this.service === undefined) {
      this.create()
    }
    return this.service
  }
}
