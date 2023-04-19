export enum FileServiceTypeEnum {
  cloudinary = "cloudinary",
}

export class CloudinaryFileServiceConfig {
  cloudinaryCloudName: string
  cloudinaryUploadPreset: string
}

export class FileServiceConfig {
  fileServiceType: FileServiceTypeEnum
  cloudinaryConfig: CloudinaryFileServiceConfig
}

export class FileProviderConfig {
  publicService: FileServiceConfig
  privateService: FileServiceConfig
}
