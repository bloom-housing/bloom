import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import {
  getValidFutureScheduledDate,
  publishesLandUseToClosed,
} from "../../../src/components/listings/helpers"
import { EnumListingListingType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

dayjs.extend(utc)

describe("getValidFutureScheduledDate", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2026-06-15T12:00:00.000Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns false for null", () => {
    expect(getValidFutureScheduledDate(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(getValidFutureScheduledDate(undefined)).toBe(false)
  })

  it("returns false for an invalid date string", () => {
    expect(getValidFutureScheduledDate("not-a-date")).toBe(false)
  })

  it("returns false for a date in the past", () => {
    expect(getValidFutureScheduledDate("2026-06-14T00:00:00.000Z")).toBe(false)
  })

  it("returns false for today's UTC date (same day, not strictly in the future)", () => {
    expect(getValidFutureScheduledDate("2026-06-15T00:00:00.000Z")).toBe(false)
  })

  it("returns the formatted date string for a date in the future", () => {
    expect(getValidFutureScheduledDate("2026-06-16T00:00:00.000Z")).toBe("06/16/2026")
  })

  it("returns the formatted date string when passed a Date object", () => {
    expect(getValidFutureScheduledDate(new Date("2026-06-20T00:00:00.000Z"))).toBe("06/20/2026")
  })
})

describe("publishesLandUseToClosed", () => {
  const bothFlagsOn = { enableLandUse: true, enableAutopublish: true }

  it("returns true for a land use listing with a null scheduled publish date and both flags on", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        ...bothFlagsOn,
        scheduledPublishAt: null,
      })
    ).toBe(true)
  })

  it("returns true when the scheduled publish date is undefined", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        ...bothFlagsOn,
        scheduledPublishAt: undefined,
      })
    ).toBe(true)
  })

  it("returns false when a future scheduled publish date is entered", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        ...bothFlagsOn,
        scheduledPublishAt: "2099-12-31T00:00:00.000Z",
      })
    ).toBe(false)
  })

  it("returns false when a past scheduled publish date is entered", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        ...bothFlagsOn,
        scheduledPublishAt: "2020-01-01T00:00:00.000Z",
      })
    ).toBe(false)
  })

  it("returns false when enableAutopublish is off", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        enableLandUse: true,
        enableAutopublish: false,
        scheduledPublishAt: null,
      })
    ).toBe(false)
  })

  it("returns false when enableLandUse is off", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.landUse,
        enableLandUse: false,
        enableAutopublish: true,
        scheduledPublishAt: null,
      })
    ).toBe(false)
  })

  it("returns false for a regulated listing", () => {
    expect(
      publishesLandUseToClosed({
        listingType: EnumListingListingType.regulated,
        ...bothFlagsOn,
        scheduledPublishAt: null,
      })
    ).toBe(false)
  })

  it("returns false when the listing type is undefined", () => {
    expect(
      publishesLandUseToClosed({
        listingType: undefined,
        ...bothFlagsOn,
        scheduledPublishAt: null,
      })
    ).toBe(false)
  })
})
