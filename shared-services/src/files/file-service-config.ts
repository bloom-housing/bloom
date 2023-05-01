// This should be updated along with .env.template for the partners and public sites.
export enum FileServiceTypeEnum {
  cloudinary = "cloudinary",
  aws_s3 = "aws_s3",
}

export class CloudinaryFileServiceConfig {
  cloudinaryCloudName: string
  cloudinaryUploadPreset: string
}

export class AwsS3FileServiceConfig {
  bucketName: string
  accessKey: string
  secretKey: string
  region: string
}

export class FileServiceConfig {
  fileServiceType: FileServiceTypeEnum
  cloudinaryConfig?: CloudinaryFileServiceConfig
  awsS3Config?: AwsS3FileServiceConfig
}

export class FileProviderConfig {
  publicService: FileServiceConfig
  privateService: FileServiceConfig
}
