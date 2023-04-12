import { Test, TestingModule } from "@nestjs/testing"
import { CloudinaryFileService } from "./cloudinary-file.service"
import { FileServiceProvider } from "./file-service.provider"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

process.env.cloudinaryCloudName = "exygy"
process.env.cloudinaryUploadPreset = "test"
let provider: FileServiceProvider

describe("FileServiceProvider", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileServiceProvider],
    }).compile()
    provider = await module.resolve(FileServiceProvider)
  })

  it("should be defined", () => {
    expect(provider).toBeDefined()
  })

  it("should return Cloudinary file service", () => {
    const service = provider.getService()
    expect(service).toBeDefined()
    expect(service).toBeInstanceOf(CloudinaryFileService)
  })
})
