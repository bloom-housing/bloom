import { cleanup } from "@testing-library/react"
import {
  cloudinaryPdfFromId,
  getPdfUrlFromAsset,
  pdfUrlFromListingEvents,
} from "../src/utilities/pdfs"
import { ListingEvent, ListingEventsTypeEnum } from "../src/types/backend-swagger"

afterEach(cleanup)

describe("pdfs helpers", () => {
  it("should format cloudinary url", () => {
    expect(cloudinaryPdfFromId("1234", "test")).toBe(
      `https://res.cloudinary.com/test/image/upload/1234.pdf`
    )
  })

  it("should return correct pdf url for event if event type exists and file is cloudinary type", () => {
    // set CLOUDINARY_CLOUD_NAME to known value for cloudinaryPdfFromId
    const prevCloudName = process.env.CLOUDINARY_CLOUD_NAME
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    const listingEvents = [
      {
        type: ListingEventsTypeEnum.lotteryResults,
        assets: { fileId: "1234", label: "cloudinaryPDF" },
      },
      { type: ListingEventsTypeEnum.openHouse, assets: { fileId: "5678", label: "cloudinaryPDF" } },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.lotteryResults)).toBe(
      `https://res.cloudinary.com/exygy/image/upload/1234.pdf`
    )

    // change it back to previous value
    process.env.CLOUDINARY_CLOUD_NAME = prevCloudName
  })

  it.skip("should return null if event type exists but is not cloudinary type", () => {
    const listingEvents = [
      { type: ListingEventsTypeEnum.lotteryResults, assets: { fileId: "1234" } },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.lotteryResults)).toBe(null)
  })

  it("should return null if no event of type exists", () => {
    const listingEvents = [
      { type: ListingEventsTypeEnum.lotteryResults },
      { type: ListingEventsTypeEnum.openHouse },
    ] as ListingEvent[]
    expect(pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.publicLottery)).toBe(null)
  })

  it.skip("should return correct urls from AssetCreate", () => {
    const tests = [
      {
        asset: {
          fileId: "https://url.to/asset",
          label: "url",
        },
        expect: "https://url.to/asset",
      },
      {
        asset: {
          fileId: "1234",
          label: "cloudinaryPDF", // should call cloudinaryPdfFromId
        },
        cloudinaryCloudName: "exygy",
        expect: "https://res.cloudinary.com/exygy/image/upload/1234.pdf",
      },
      {
        asset: {
          fileId: "1234",
          label: "default",
        },
        expect: null,
      },
    ]

    tests.forEach((test) => {
      expect(getPdfUrlFromAsset(test.asset, test.cloudinaryCloudName)).toBe(test.expect)
    })
  })
})
