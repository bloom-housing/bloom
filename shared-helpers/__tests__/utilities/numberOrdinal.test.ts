import { cleanup } from "@testing-library/react"
import { numberOrdinal } from "../../src/utilities/numberOrdinal"

afterEach(cleanup)

describe("numberOrdinal", () => {
  it("should properly apply th suffix", () => {
    expect(numberOrdinal(12)).toBe("12th")
  })
  it("should properly apply st suffix", () => {
    expect(numberOrdinal(1)).toBe("1st")
  })
  it("should properly apply nd suffix", () => {
    expect(numberOrdinal(2)).toBe("2nd")
  })
  it("should properly apply rd suffix", () => {
    expect(numberOrdinal(3)).toBe("3rd")
  })
})
