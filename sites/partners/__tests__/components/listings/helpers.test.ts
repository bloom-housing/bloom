import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { getValidFutureScheduledDate } from "../../../src/components/listings/helpers"

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
