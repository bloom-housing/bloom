import { Test, TestingModule } from "@nestjs/testing"
import { CloudinaryFileService } from "./cloudinary-file.service"
import { FileProviderConfig, FileServiceTypeEnum } from "./file-service-config"
import { FileServiceProvider } from "./file-service.provider"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect
let testingModule: TestingModule
let provider: FileServiceProvider
const fileProviderConfig: FileProviderConfig = {
  publicService: {
    fileServiceType: FileServiceTypeEnum.cloudinary,
    cloudinaryConfig: {
      cloudinaryCloudName: "testCloudName",
      cloudinaryUploadPreset: "testUploadPreset",
    },
  },
  privateService: {
    fileServiceType: FileServiceTypeEnum.cloudinary,
    cloudinaryConfig: {
      cloudinaryCloudName: "testCloudName",
      cloudinaryUploadPreset: "testUploadPreset",
    },
  },
}
const incompleteFileProviderConfig: FileProviderConfig = {
  publicService: {
    fileServiceType: FileServiceTypeEnum.cloudinary,
    cloudinaryConfig: {
      cloudinaryCloudName: "",
      cloudinaryUploadPreset: "testUploadPreset",
    },
  },
  privateService: {
    fileServiceType: FileServiceTypeEnum.cloudinary,
    cloudinaryConfig: {
      cloudinaryCloudName: "testCloudName",
      cloudinaryUploadPreset: "testUploadPreset",
    },
  },
}

describe("FileServiceProvider", () => {
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [FileServiceProvider],
    }).compile()
    provider = await testingModule.resolve(FileServiceProvider)
  })

  afterEach(async () => {
    await testingModule.close()
  })

  it("should be defined", () => {
    expect(provider).toBeDefined()
  })

  it("should throw error for config missing cloud name", () => {
    expect(() => {
      FileServiceProvider.configure(incompleteFileProviderConfig)
    }).toThrow("Cloudinary cloud name should be specified")
  })

  it("should throw no errors for correct config", () => {
    FileServiceProvider.configure(fileProviderConfig)
  })

  it("should return Cloudinary file service for public service", () => {
    const service = FileServiceProvider.getPublicUploadService()
    expect(service).toBeDefined()
    expect(service).toBeInstanceOf(CloudinaryFileService)
  })

  it("should return Cloudinary file service for private service", () => {
    const service = FileServiceProvider.getPrivateUploadService()
    expect(service).toBeDefined()
    expect(service).toBeInstanceOf(CloudinaryFileService)
  })
})
