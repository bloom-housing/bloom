import { cleanup } from "@testing-library/react"
import { formatIncome } from "../../src/helpers/formatIncome"
import { IncomePeriod } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

describe("format income helper", () => {
  it("should format properly", () => {
    expect(formatIncome(50000, IncomePeriod.perYear, IncomePeriod.perYear)).toBe("$50,000")
    expect(formatIncome(50000, IncomePeriod.perYear, IncomePeriod.perMonth)).toBe("$4,167")
    expect(formatIncome(4167, IncomePeriod.perMonth, IncomePeriod.perYear)).toBe("$50,004")
    expect(formatIncome(4167, IncomePeriod.perMonth, IncomePeriod.perMonth)).toBe("$4,167")
  })
})
