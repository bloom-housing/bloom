export enum FileServiceTypeEnum {
  cloudinary = "cloudinary",
}

export class CloudinaryConfig {
  cloudinaryCloudName: string
  cloudinaryUploadPreset: string
}

export class FileConfig {
  fileServiceType: FileServiceTypeEnum
  cloudinaryConfig: CloudinaryConfig
}
