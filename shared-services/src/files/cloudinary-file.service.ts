import { Injectable } from "@nestjs/common"
import { cloudinaryPdfFromId, cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
import { FileServiceInterface } from "./file-service.interface"
import { CloudinaryFileUploader } from "./cloudinary-file-uploader"
import { CloudinaryConfig } from "./file-config"

@Injectable()
export class CloudinaryFileService implements FileServiceInterface {
  constructor(
    private readonly cloudinaryFileUploader: CloudinaryFileUploader,
    private readonly cloudinaryConfig: CloudinaryConfig
  ) {}

  async putFile(
    key: string,
    file: File,
    setProgressValue: (value: number) => void
  ): Promise<string> {
    const id = await this.cloudinaryFileUploader.uploadCloudinaryFile(
      file,
      setProgressValue,
      this.cloudinaryConfig.cloudinaryCloudName,
      this.cloudinaryConfig.cloudinaryUploadPreset
    )
    return id
  }
  getDownloadUrlForPhoto(id: string, size = 400): string {
    return cloudinaryUrlFromId(id, this.cloudinaryConfig.cloudinaryCloudName, size)
  }
  getDownloadUrlForPdf(id: string): string {
    return cloudinaryPdfFromId(id, this.cloudinaryConfig.cloudinaryCloudName)
  }
}
