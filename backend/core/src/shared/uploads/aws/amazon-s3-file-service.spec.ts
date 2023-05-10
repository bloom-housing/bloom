import { Readable } from "stream"
import { AmazonS3FileService } from "./amazon-s3-file-service"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { mockClient } from "aws-sdk-client-mock"
import "aws-sdk-client-mock-jest"

describe("AmazonS3FileService", () => {
  const mockS3Client = mockClient(S3Client)
  mockS3Client.on(PutObjectCommand).resolves({
    ETag: "some-unused-value",
  })

  it("should be configured with a valid config", () => {
    const service = new AmazonS3FileService()
    const config = {
      region: "us-west-1",
      bucket: "bucket",
      url_format: "public",
    }

    service.configure(config)

    expect(service.isConfigured).toBe(true)
    expect(service.config).toEqual(config)
  })

  it("should error with invalid config", () => {
    const service = new AmazonS3FileService()
    const config = {
      region: null,
      bucket: null,
      url_format: "invalid",
    }

    expect(() => {
      service.configure(config)
    }).toThrow("region")

    config.region = "us-west-1"

    expect(() => {
      service.configure(config)
    }).toThrow("bucket")

    config.bucket = "bucket"

    expect(() => {
      service.configure(config)
    }).toThrow("url_format")
  })

  it("should return expected values from putFile", async () => {
    const service = new AmazonS3FileService()

    const bucket = "bucket"

    service.configure({
      region: "us-west-1",
      bucket: bucket,
      url_format: "public",
    })

    const data = Buffer.from("file-contents")

    const upload = {
      name: "file.txt",
      contentType: "text/plain",
      size: data.length,
      contents: Readable.from(data),
    }

    const result = await service.putFile("test", "file-key-or-label", upload)

    expect(mockS3Client).toHaveReceivedCommand(PutObjectCommand)
    expect(mockS3Client).toHaveReceivedCommandTimes(PutObjectCommand, 1)
    expect(mockS3Client).toHaveReceivedCommandWith(PutObjectCommand, {
      Bucket: bucket,
      ContentLength: upload.size,
      Body: upload.contents,
    })

    // we don't need to check the exact results
    expect(result).toHaveProperty("id")
    expect(result).toHaveProperty("url")
  })

  it("should return expected results from generateDownloadUrl", async () => {
    const service = new AmazonS3FileService()

    const region = "us-west-1"
    const bucket = "bucket"
    const path = "path/to/file.ext"

    service.configure({
      region: region,
      bucket: bucket,
      url_format: "public",
    })

    const id = `s3:${region}:${bucket}:${path}`
    const url = await service.generateDownloadUrl(id)

    // We don't want to be too strict with the pattern matching
    // Just make sure the right pieces are there where they should be
    expect(url.startsWith("https://")).toBe(true)
    expect(url).toMatch(region)
    expect(url).toMatch(bucket)
    expect(url.endsWith(path)).toBe(true)
  })
})
