import { CloudinaryFileService } from "./cloudinary-file.service"
import { CloudinaryFileUploader } from "./cloudinary-file-uploader"
import { FileServiceInterface } from "./file-service.interface"
import {
  CloudinaryFileServiceConfig,
  FileProviderConfig,
  FileServiceTypeEnum,
} from "./file-service-config"

export class FileServiceProvider {
  static publicUploadService: FileServiceInterface
  static privateUploadService: FileServiceInterface

  public static configure(fileProviderConfig: FileProviderConfig): void {
    this.validate(fileProviderConfig)
    switch (fileProviderConfig.publicService.fileServiceType) {
      case FileServiceTypeEnum.cloudinary:
        this.publicUploadService = new CloudinaryFileService(
          new CloudinaryFileUploader(),
          fileProviderConfig.publicService.cloudinaryConfig
        )
        break
      default:
        throw new Error("Unknown file service type for public service")
    }
    switch (fileProviderConfig.privateService.fileServiceType) {
      case FileServiceTypeEnum.cloudinary:
        this.privateUploadService = new CloudinaryFileService(
          new CloudinaryFileUploader(),
          fileProviderConfig.privateService.cloudinaryConfig
        )
        break
      default:
        throw new Error("Unknown file service type for private service")
    }
  }

  private static validate(fileProviderConfig: FileProviderConfig): void {
    if (this.privateUploadService !== undefined || this.publicUploadService !== undefined) {
      console.log("File service is already configured")
      return
    }
    if (fileProviderConfig.publicService === undefined) {
      throw new Error("Public service not defined")
    }
    if (fileProviderConfig.privateService === undefined) {
      throw new Error("Private service not defined")
    }
    if (
      fileProviderConfig.privateService.fileServiceType !== FileServiceTypeEnum.cloudinary ||
      fileProviderConfig.publicService.fileServiceType !== FileServiceTypeEnum.cloudinary
    ) {
      throw new Error("Only supported file service is cloudinary")
    }
    if (fileProviderConfig.publicService.cloudinaryConfig === undefined) {
      throw new Error("Public service cloudinary config should be specified")
    }
    if (fileProviderConfig.privateService.cloudinaryConfig === undefined) {
      throw new Error("Private service cloudinary config should be specified")
    }
    this.validateCloudinaryConfig(fileProviderConfig.publicService.cloudinaryConfig)
    this.validateCloudinaryConfig(fileProviderConfig.privateService.cloudinaryConfig)
  }

  private static validateCloudinaryConfig(
    cloudinaryFileServiceConfig: CloudinaryFileServiceConfig
  ): void {
    if (
      cloudinaryFileServiceConfig.cloudinaryCloudName === undefined ||
      cloudinaryFileServiceConfig.cloudinaryCloudName === ""
    ) {
      throw new Error("Cloudinary cloud name should be specified")
    }
  }

  public static getPublicUploadService(): FileServiceInterface {
    return this.publicUploadService
  }

  public static getPrivateUploadService(): FileServiceInterface {
    return this.privateUploadService
  }
}
