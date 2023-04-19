import { ListingEventType, ListingEvent } from "@bloom-housing/backend-core/types"
import {
  FileProviderConfig,
  FileServiceProvider,
  FileServiceTypeEnum,
} from "@bloom-housing/shared-services"
import { cleanup } from "@testing-library/react"
import { cloudinaryPdfFromId, pdfUrlFromListingEvents } from "../src/utilities/pdfs"

afterEach(cleanup)

describe("pdfs helpers", () => {
  beforeAll(() => {
    const fileProviderConfig: FileProviderConfig = {
      publicService: {
        fileServiceType: FileServiceTypeEnum.cloudinary,
        cloudinaryConfig: {
          cloudinaryCloudName: "exygy",
          cloudinaryUploadPreset: "testUploadPreset",
        },
      },
      privateService: {
        fileServiceType: FileServiceTypeEnum.cloudinary,
        cloudinaryConfig: {
          cloudinaryCloudName: "exygy",
          cloudinaryUploadPreset: "testUploadPreset",
        },
      },
    }
    FileServiceProvider.configure(fileProviderConfig)
  })

  it("should format cloudinary url", () => {
    expect(cloudinaryPdfFromId("1234", "test")).toBe(
      `https://res.cloudinary.com/test/image/upload/1234.pdf`
    )
  })

  it("should return correct pdf url for event if event type exists and file is cloudinary type", () => {
    const listingEvents = [
      { type: ListingEventType.lotteryResults, file: { fileId: "1234", label: "cloudinaryPDF" } },
      { type: ListingEventType.openHouse, file: { fileId: "5678", label: "cloudinaryPDF" } },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventType.lotteryResults)).toBe(
      `https://res.cloudinary.com/exygy/image/upload/1234.pdf`
    )
  })

  it("should return null if event type exists but is not cloudinary type", () => {
    const listingEvents = [
      { type: ListingEventType.lotteryResults, file: { fileId: "1234" } },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventType.lotteryResults)).toBe(null)
  })
  it("should return null if no event of type exists", () => {
    const listingEvents = [
      { type: ListingEventType.lotteryResults },
      { type: ListingEventType.openHouse },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventType.publicLottery)).toBe(null)
  })
})
