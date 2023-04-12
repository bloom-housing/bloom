import { CloudinaryUpload } from "@bloom-housing/ui-components"
import { AssetsService } from "@bloom-housing/backend-core/types"

export class CloudinaryFileUploader {
  /**
   * Accept a file from the Dropzone component along with data and progress state
   * setters. It will then handle obtaining a signature from the backend and
   * uploading the file to Cloudinary, setting progress along the way and the
   * id/url of the file when the upload is complete.
   */
  public async uploadCloudinaryFile(
    file: File,
    setProgressValue: (value: number) => void,
    cloudName: string,
    uploadPreset: string
  ): Promise<string> {
    setProgressValue(1)
    const timestamp = Math.round(new Date().getTime() / 1000)
    const tag = "browser_upload"
    const assetsService = new AssetsService()
    const params = {
      timestamp,
      tags: tag,
      upload_preset: uploadPreset,
    }
    const resp = await assetsService.createPresignedUploadMetadata({
      body: { parametersToSign: params },
    })
    const signature = resp.signature
    setProgressValue(3)
    const response = await CloudinaryUpload({
      signature,
      apiKey: process.env.cloudinaryKey,
      timestamp,
      file,
      onUploadProgress: (progress) => {
        setProgressValue(progress)
      },
      cloudName,
      uploadPreset,
      tag,
    })
    setProgressValue(100)
    return response.data.public_id
  }
}
