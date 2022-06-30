import React from "react"
import { cleanup } from "@testing-library/react"
import { occupancyTable } from "../src/occupancyFormatting"
import { Listing, UnitType, UnitGroup } from "@bloom-housing/backend-core/types"

const unitTypeStudio = { name: "studio", numBedrooms: 0 } as UnitType
const unitTypeOneBdrm = { name: "oneBdrm", numBedrooms: 1 } as UnitType
const unitTypeTwoBdrm = { name: "twoBdrm", numBedrooms: 2 } as UnitType
const unitTypeThreeBdrm = { name: "threeBdrm", numBedrooms: 3 } as UnitType
const unitTypeFourBdrm = { name: "fourBdrm", numBedrooms: 4 } as UnitType

const unitGroups: Omit<
  UnitGroup,
  "id" | "listing" | "openWaitlist" | "amiLevels" | "listingId"
>[] = [
  {
    unitType: [unitTypeStudio, unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 2,
  },
  {
    unitType: [unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 3,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 2,
    maxOccupancy: 6,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 2,
    maxOccupancy: undefined,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: undefined,
    maxOccupancy: 2,
  },
  {
    unitType: [unitTypeFourBdrm],
    minOccupancy: 1,
    maxOccupancy: undefined,
  },
  {
    unitType: [unitTypeTwoBdrm],
    minOccupancy: 1,
    maxOccupancy: 1,
  },
  {
    unitType: [unitTypeThreeBdrm],
    minOccupancy: 3,
    maxOccupancy: 3,
  },
  {
    unitType: [unitTypeFourBdrm],
    minOccupancy: undefined,
    maxOccupancy: undefined,
  },
  {
    unitType: [unitTypeTwoBdrm, unitTypeOneBdrm],
    minOccupancy: 1,
    maxOccupancy: 7,
  },
]

const testListing: Listing = {} as Listing
testListing.unitGroups = unitGroups as UnitGroup[]
afterEach(cleanup)

describe("occupancy formatting helpers", () => {
  describe("occupancyTable", () => {
    it("properly creates occupancy table", () => {
      expect(occupancyTable(testListing)).toStrictEqual([
        {
          occupancy: "1-2 people",
          unitType: <strong>Studio, 1 BR</strong>,
        },
        {
          occupancy: "1-3 people",
          unitType: <strong>1 BR</strong>,
        },
        {
          occupancy: "1-7 people",
          unitType: <strong>1 BR, 2 BR</strong>,
        },
        {
          occupancy: "2-6 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "at least 2 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "at most 2 people",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "1 person",
          unitType: <strong>2 BR</strong>,
        },
        {
          occupancy: "3 people",
          unitType: <strong>3 BR</strong>,
        },
        {
          occupancy: "at least 1 person",
          unitType: <strong>4 BR</strong>,
        },
      ])
    })
  })
})
