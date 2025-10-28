import { cleanup } from "@testing-library/react"
import { getTimeRangeString, getCurrencyRange } from "../src/utilities/stringFormatting"

afterEach(cleanup)

describe("stringFormatting helpers", () => {
  describe("getTimeRangeString", () => {
    it("formats different parameters as a time range", () => {
      expect(getTimeRangeString(new Date(2018, 8, 10, 10), new Date(2018, 8, 18, 11))).toBe(
        "10:00am - 11:00am"
      )
    })
    it("formats different parameters as one time", () => {
      expect(getTimeRangeString(new Date(2018, 8, 10, 10), new Date(2018, 8, 18, 10))).toBe(
        "10:00am"
      )
    })
  })
  describe("getCurrencyRange", () => {
    it("with just min", () => {
      expect(getCurrencyRange(10, null)).toBe("$10")
    })
    it("with just max", () => {
      expect(getCurrencyRange(null, 10)).toBe("$10")
    })
    it("with the same values", () => {
      expect(getCurrencyRange(100, 100)).toBe("$100")
    })
    it("with a range", () => {
      expect(getCurrencyRange(100, 200)).toBe("$100 – $200")
    })
    it("with NaN", () => {
      expect(getCurrencyRange(NaN, 100)).toBe("$100")
    })
    it("with neither", () => {
      expect(getCurrencyRange(null, null)).toBe("")
    })
  })
})
