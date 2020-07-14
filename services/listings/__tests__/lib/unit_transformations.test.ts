import { transformUnits } from "../../src/lib/unit_transformations"
import { amiCharts } from "../../src/lib/ami_charts"
import triton from "../../listings/triton-test.json"
type AnyDict = { [key: string]: any }

describe("transformUnits", () => {
  const listing = triton as AnyDict

  test("returns non-reserved summaries", () => {
    const result = transformUnits(listing.units, amiCharts)
    expect(result.unitTypes.length).toEqual(2)
    expect(result.byNonReservedUnitType[0].unitType).toEqual("oneBdrm")
    expect(result.byNonReservedUnitType[0].occupancyRange).toEqual({ min: 1, max: 2 })
  })

  test("returns summaries by AMI", () => {
    const result = transformUnits(listing.units, amiCharts)
    expect(result.amiPercentages.length).toEqual(1)
    expect(result.byAMI[0].percent).toEqual(result.amiPercentages[0])
    expect(result.byAMI[0].byNonReservedUnitType[1].unitType).toEqual("threeBdrm")
    expect(result.byAMI[0].byNonReservedUnitType[1].occupancyRange).toEqual({ min: 5, max: 7 })
  })

  /*test("creates units summary", () => {
    const result = transformUnits(listing.units)
    expect(result.unitSummary.totalAvailable).toEqual(2)
    expect(result.unitSummary.minIncomeRange).toEqual({ min: 4858, max: 5992 })
    expect(result.unitSummary.reservedTypes).toEqual(["oneBdrm", "threeBdrm"])
  })*/
})
