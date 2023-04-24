import { Test, TestingModule } from "@nestjs/testing"
import { AwsS3FileUploader } from "./aws-s3-file-uploader"

// Cypress brings in Chai types for the global expect, but we want to use jest
// expect here so we need to re-declare it.
// see: https://github.com/cypress-io/cypress/issues/1319#issuecomment-593500345
declare const expect: jest.Expect

let uploader: AwsS3FileUploader

describe("AwsS3FileUploader", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsS3FileUploader],
    }).compile()
    uploader = await module.resolve(AwsS3FileUploader)
  })

  it("should be defined", () => {
    expect(uploader).toBeDefined()
  })
})
