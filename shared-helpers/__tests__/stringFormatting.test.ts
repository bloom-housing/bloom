import { cleanup } from "@testing-library/react"
import { getTimeRangeString } from "../src/stringFormatting"

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
})
