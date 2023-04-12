import { Test, TestingModule } from "@nestjs/testing"
import { CloudinaryFileUploader } from "./cloudinary-file-uploader"
import { CloudinaryFileService } from "./cloudinary-file.service"
import { FileServiceProvider } from "./file-service.provider"
import { CloudinaryConfig } from "./file-config"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let service: CloudinaryFileService
const cloudinaryFileUploaderMock = {
  uploadCloudinaryFile: () => {
    return new Promise(function (resolve) {
      resolve("fileId")
    })
  },
}
const cloudinaryConfig: CloudinaryConfig = {
  cloudinaryCloudName: "exygy",
  cloudinaryUploadPreset: "test",
}

describe("CloudinaryFileService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryFileService,
        {
          provide: CloudinaryFileUploader,
          useValue: cloudinaryFileUploaderMock,
        },
        FileServiceProvider,
        {
          provide: CloudinaryConfig,
          useValue: cloudinaryConfig,
        },
      ],
    }).compile()
    service = await module.resolve(CloudinaryFileService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should return download url for photo", () => {
    const url = service.getDownloadUrlForPhoto("12345")
    const expectedUrl = "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/12345.jpg"
    expect(url).toEqual(expectedUrl)
  })

  it("should return download url for photo with size", () => {
    const url = service.getDownloadUrlForPhoto("12345", 600)
    const expectedUrl = "https://res.cloudinary.com/exygy/image/upload/w_600,c_limit,q_65/12345.jpg"
    expect(url).toEqual(expectedUrl)
  })

  it("should return download url for pdf", () => {
    const url = service.getDownloadUrlForPdf("12345")
    const expectedUrl = "https://res.cloudinary.com/exygy/image/upload/12345.pdf"
    expect(url).toEqual(expectedUrl)
  })

  it("should return id for putFile", async () => {
    const callbackFn = (value: number) => {
      return value + 1
    }
    const id = await service.putFile("file", new File(["content"], "filename"), callbackFn)
    const expectedId = "fileId"
    expect(id).toEqual(expectedId)
  })
})
