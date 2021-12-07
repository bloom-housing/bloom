import React from "react"
import { cleanup } from "@testing-library/react"
import { occupancyTable, getOccupancyDescription } from "../src/occupancyFormatting"
import { t } from "@bloom-housing/ui-components"
import { Listing, UnitsSummarized, UnitType } from "@bloom-housing/backend-core/types"

const testListing: Listing = {} as Listing
testListing.unitsSummarized = {
  unitTypes: [
    {
      name: "threeBdrm",
      numBedrooms: 3,
    },
    {
      name: "twoBdrm",
      numBedrooms: 2,
    },
    {
      name: "SRO",
      numBedrooms: 1,
    },
  ],
  byUnitType: [
    {
      unitType: {
        name: "threeBdrm",
        numBedrooms: 3,
      },
      minIncomeRange: {
        min: "10",
        max: "20",
      },
      occupancyRange: {
        min: 2,
        max: 6,
      },
      rentAsPercentIncomeRange: {
        min: 15,
        max: 60,
      },
      rentRange: {
        min: "250",
        max: "350",
      },
      totalAvailable: 8,
      areaRange: {
        min: 5,
        max: 60,
      },
    },
    {
      unitType: {
        name: "twoBdrm",
        numBedrooms: 2,
      },
      minIncomeRange: {
        min: "10",
        max: "20",
      },
      occupancyRange: {
        min: 1,
        max: null,
      },
      rentAsPercentIncomeRange: {
        min: 15,
        max: 60,
      },
      rentRange: {
        min: "250",
        max: "350",
      },
      totalAvailable: 8,
      areaRange: {
        min: 5,
        max: 60,
      },
    },
    {
      unitType: {
        name: "SRO",
        numBedrooms: 1,
      },
      minIncomeRange: {
        min: "10",
        max: "20",
      },
      occupancyRange: {
        min: 2,
        max: 1,
      },
      rentAsPercentIncomeRange: {
        min: 15,
        max: 60,
      },
      rentRange: {
        min: "250",
        max: "350",
      },
      totalAvailable: 8,
      areaRange: {
        min: 5,
        max: 60,
      },
    },
  ],
} as UnitsSummarized

afterEach(cleanup)

describe("occupancy formatting helper", () => {
  it("properly creates occupany table", () => {
    expect(occupancyTable(testListing)).toStrictEqual([
      {
        occupancy: "2-6 people",
        unitType: <strong>3 BR</strong>,
      },
      {
        occupancy: "at least 1 person",
        unitType: <strong>2 BR</strong>,
      },
      {
        occupancy: "1 person",
        unitType: <strong>SRO</strong>,
      },
    ])
  })
  it("properly creates occupany description for some SRO", () => {
    expect(getOccupancyDescription(testListing)).toBe(t("listings.occupancyDescriptionSomeSro"))
  })
  it("properly creates occupany description for no SRO", () => {
    const testListing2 = testListing
    testListing2.unitsSummarized.unitTypes = [
      {
        name: "threeBdrm",
        numBedrooms: 3,
      },
      {
        name: "twoBdrm",
        numBedrooms: 2,
      },
    ] as UnitType[]
    expect(getOccupancyDescription(testListing2)).toBe(t("listings.occupancyDescriptionNoSro"))
  })
  it("properly creates occupany description for all SRO", () => {
    const testListing3 = testListing
    testListing3.unitsSummarized.unitTypes = [
      {
        name: "SRO",
        numBedrooms: 1,
      },
    ] as UnitType[]
    expect(getOccupancyDescription(testListing3)).toBe(t("listings.occupancyDescriptionAllSro"))
  })
})
