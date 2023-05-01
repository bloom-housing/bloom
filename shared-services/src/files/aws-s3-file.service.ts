import { Injectable } from "@nestjs/common"
import { AwsS3FileUploader } from "./aws-s3-file-uploader"
import { AwsS3FileServiceConfig } from "./file-service-config"
import { FileServiceInterface } from "./file-service.interface"
import { S3Client } from "@aws-sdk/client-s3"

@Injectable()
export class AwsS3FileService implements FileServiceInterface {
  constructor(
    private readonly awsS3FileUploader: AwsS3FileUploader,
    private readonly awsS3FileServiceConfig: AwsS3FileServiceConfig,
    private readonly s3Client: S3Client
  ) {}

  async putFile(
    key: string,
    file: File,
    setProgressValue: (value: number) => void
  ): Promise<string> {
    const id = await this.awsS3FileUploader.uploadAwsS3File(
      this.s3Client,
      file,
      setProgressValue,
      this.awsS3FileServiceConfig.bucketName
    )
    return id
  }
  getDownloadUrlForPhoto(id: string): string {
    return this.getDownloadUrl(id)
  }
  getDownloadUrlForPdf(id: string): string {
    return this.getDownloadUrl(id)
  }

  private getDownloadUrl(id: string): string {
    return `https://${this.awsS3FileServiceConfig.bucketName}.s3.${this.awsS3FileServiceConfig.region}.amazonaws.com/${id}`
  }
}
