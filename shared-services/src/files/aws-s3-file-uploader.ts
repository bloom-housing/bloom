import { AwsS3Upload } from "./AwsS3Upload"
import { v4 as uuidv4 } from "uuid"
import { S3Client } from "@aws-sdk/client-s3"

export class AwsS3FileUploader {
  /**
   * Accept a file from the Dropzone component along with data and progress state
   * setters. It will then handle uploading the file to AWS s3 using a presigned URL,
   * setting progress along the way and returning the id of the file when the upload
   * is complete.
   */
  public async uploadAwsS3File(
    client: S3Client,
    file: File,
    setProgressValue: (value: number) => void,
    bucketName: string
  ): Promise<string> {
    setProgressValue(3)
    const key = `listingPhoto-${uuidv4()}`
    await AwsS3Upload({
      client,
      file,
      key,
      onUploadProgress: (progress) => {
        setProgressValue(progress)
      },
      bucketName,
    })
    setProgressValue(100)
    return key
  }
}
