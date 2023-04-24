import axios, { Method } from "axios"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

interface AwsS3UploadProps {
  client: S3Client
  file: File
  key: string
  onUploadProgress: (progress: number) => void
  bucketName: string
}

export const AwsS3Upload = async ({
  client,
  file,
  key,
  onUploadProgress,
  bucketName,
}: AwsS3UploadProps) => {
  // We first generate a signed URL and then use axios to make an HTTP request to that URL so
  // that we can pass the onUploadProgress() function to axios. This is used by clients to
  // show a progress bar for the upload and is existing behavior that we want to preserve.
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key })
  const url = await getSignedUrl(client, command, { expiresIn: 3600 })
  const data = new FormData()
  data.append("file", file)
  const response = await axiosUpload("put", url, data, onUploadProgress)
  return response
}

export const axiosUpload = async (
  method: Method,
  url: string,
  data: FormData,
  onUploadProgress: (progress: number) => void
) => {
  const response = await axios.request({
    method: method,
    url: url,
    data: data,
    onUploadProgress: (p) => {
      onUploadProgress(parseInt(((p.loaded / p.total) * 100).toFixed(0), 10))
    },
  })
  return response
}
