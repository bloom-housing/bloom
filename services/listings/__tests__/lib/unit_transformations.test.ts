import { transformUnits } from "../../src/lib/unit_transformations"
import triton from "../../listings/triton.json"
type AnyDict = { [key: string]: any }

describe("transformUnits", () => {
  const listing = triton as AnyDict

  test("returns groupped units", () => {
    const result = transformUnits(listing.units)
    expect(result.grouped.length).toEqual(2)
    expect(result.grouped[0].type).toEqual("oneBdrm")
    expect(result.grouped[0].unitSummary.occupancyRange).toEqual({ min: 1, max: 2 })
  })

  test("creates units summary", () => {
    const result = transformUnits(listing.units)
    expect(result.unitSummary.totalAvailable).toEqual(2)
    expect(result.unitSummary.minIncomeRange).toEqual({ min: 4858, max: 5992 })
    expect(result.unitSummary.reservedTypes).toEqual(["oneBdrm", "threeBdrm"])
  })
})
