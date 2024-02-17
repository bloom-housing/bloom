import { cleanup } from "@testing-library/react"
import { cloudinaryPdfFromId, pdfUrlFromListingEvents } from "../src/utilities/pdfs"
import { ListingEvent, ListingEventsTypeEnum } from "../src/types/backend-swagger"

afterEach(cleanup)

describe("pdfs helpers", () => {
  it("should format cloudinary url", () => {
    expect(cloudinaryPdfFromId("1234", "exygy")).toBe(
      `https://res.cloudinary.com/exygy/image/upload/1234.pdf`
    )
  })
  it("should return correct pdf url for event if event type exists and file is cloudinary type", () => {
    const listingEvents = [
      {
        type: ListingEventsTypeEnum.lotteryResults,
        assets: { fileId: "1234", label: "cloudinaryPDF" },
      },
      { type: ListingEventsTypeEnum.openHouse, assets: { fileId: "5678", label: "cloudinaryPDF" } },
    ] as ListingEvent[]
    expect(
      pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.lotteryResults, "exygy")
    ).toBe(`https://res.cloudinary.com/exygy/image/upload/1234.pdf`)
  })
  it("should return null if event type exists but is not cloudinary type", () => {
    const listingEvents = [
      { type: ListingEventsTypeEnum.lotteryResults, assets: { fileId: "1234" } },
    ] as ListingEvent[]
    expect(
      pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.lotteryResults, "exygy")
    ).toBe(null)
  })
  it("should return null if no event of type exists", () => {
    const listingEvents = [
      { type: ListingEventsTypeEnum.lotteryResults },
      { type: ListingEventsTypeEnum.openHouse },
    ] as ListingEvent[]
    expect(
      pdfUrlFromListingEvents(listingEvents, ListingEventsTypeEnum.publicLottery, "exygy")
    ).toBe(null)
  })
})
