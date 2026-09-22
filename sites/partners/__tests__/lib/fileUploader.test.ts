import axios from "axios"
import { AssetsService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fileUploader } from "../../src/lib/helpers"

jest.mock("axios")
jest.mock("@bloom-housing/shared-helpers/src/types/backend-swagger", () => ({
  ...jest.requireActual("@bloom-housing/shared-helpers/src/types/backend-swagger"),
  AssetsService: jest.fn(),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const MockedAssetsService = AssetsService as jest.MockedClass<typeof AssetsService>

const file = new File(["x"], "logo.png", { type: "image/png" })

// The callback fires from inside a floating promise, so the assertions wait for it.
const uploadAndWait = async () => {
  const setFileUploadData = jest.fn()
  await fileUploader({ file, setFileUploadData, setProgressValue: jest.fn() })
  await new Promise((resolve) => process.nextTick(resolve))
  return setFileUploadData.mock.calls[0][0]
}

describe("fileUploader", () => {
  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.useS3FileStorage
  })

  it("reports the bare storage key alongside the s3 url", async () => {
    process.env.useS3FileStorage = "TRUE"
    MockedAssetsService.mockImplementation(
      () =>
        ({
          createS3UploadUrl: jest.fn().mockResolvedValue({
            fileId: "9f1c2e3a-7b4d-4c1e-9a2f-5d6e7f8a9b0c",
            uploadUrl: "https://bloom-public.s3.us-west-2.amazonaws.com/signed",
            publicUrl:
              "https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a-7b4d-4c1e-9a2f-5d6e7f8a9b0c",
          }),
        } as unknown as AssetsService)
    )
    mockedAxios.request.mockResolvedValue({})

    const reported = await uploadAndWait()

    expect(reported.fileId).toEqual("9f1c2e3a-7b4d-4c1e-9a2f-5d6e7f8a9b0c")
    // id stays the full url, because the listing photo path stores it verbatim.
    expect(reported.id).toEqual(
      "https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a-7b4d-4c1e-9a2f-5d6e7f8a9b0c"
    )
    expect(reported.url).toEqual(reported.id)
  })

  it("tells the user when an s3 upload fails, rather than reporting nothing", async () => {
    process.env.useS3FileStorage = "TRUE"
    MockedAssetsService.mockImplementation(
      () =>
        ({
          createS3UploadUrl: jest.fn().mockResolvedValue({
            fileId: "9f1c2e3a",
            uploadUrl: "https://bloom-public.s3.us-west-2.amazonaws.com/signed",
            publicUrl: "https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a",
          }),
        } as unknown as AssetsService)
    )
    mockedAxios.request.mockRejectedValue(new Error("network"))
    const alerted = jest.spyOn(window, "alert").mockImplementation()
    const setFileUploadData = jest.fn()
    const setProgressValue = jest.fn()

    await fileUploader({ file, setFileUploadData, setProgressValue })
    await new Promise((resolve) => process.nextTick(resolve))

    expect(alerted).toHaveBeenCalled()
    expect(setProgressValue).toHaveBeenLastCalledWith(0)
    expect(setFileUploadData).not.toHaveBeenCalled()
    alerted.mockRestore()
  })

  it("reports the cloudinary public id as the storage key", async () => {
    MockedAssetsService.mockImplementation(
      () =>
        ({
          createPresignedUploadMetadata: jest.fn().mockResolvedValue({ signature: "sig" }),
        } as unknown as AssetsService)
    )
    mockedAxios.request.mockResolvedValue({ data: { public_id: "dev/bloom_logo" } })

    const reported = await uploadAndWait()

    expect(reported.fileId).toEqual("dev/bloom_logo")
    expect(reported.id).toEqual("dev/bloom_logo")
  })
})
