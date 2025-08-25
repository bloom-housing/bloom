import React from "react"
import { cleanup } from "@testing-library/react"
import {
  occupancyTable,
  getOccupancyDescription,
  getOccupancy,
  stackedOccupancyTable,
  stackedUnitGroupsOccupancyTable,
} from "../src/views/occupancyFormatting"
import { t } from "@bloom-housing/ui-components"
import { Listing, UnitType, UnitTypeEnum, UnitsSummarized } from "../src/types/backend-swagger"
import { unitGroup } from "./testHelpers"

const testListing: Listing = {} as Listing
const unitsSummarized = {
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
      unitTypes: {
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
      unitTypes: {
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
      unitTypes: {
        name: "SRO",
        numBedrooms: 1,
      },
      minIncomeRange: {
        min: "10",
        max: "20",
      },
      occupancyRange: {
        min: 1,
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
testListing.unitsSummarized = unitsSummarized

afterEach(cleanup)

describe("occupancy formatting helper", () => {
  it("properly creates occupancy table", () => {
    expect(occupancyTable(testListing)).toStrictEqual([
      {
        occupancy: { content: "2-6 people" },
        unitType: { content: <strong>3 beds</strong> },
      },
      {
        occupancy: { content: "at least 1 person" },
        unitType: { content: <strong>2 beds</strong> },
      },
      {
        occupancy: { content: "1 person" },
        unitType: { content: <strong>SRO</strong> },
      },
    ])
  })
  it("properly creates occupancy description for some SRO", () => {
    expect(getOccupancyDescription(testListing)).toBe(t("listings.occupancyDescriptionSomeSro"))
  })
  it("properly creates occupancy description for no SRO", () => {
    const testListing2 = testListing
    testListing2.unitsSummarized = {
      ...unitsSummarized,
      unitTypes: [
        {
          name: "threeBdrm",
          numBedrooms: 3,
        },
        {
          name: "twoBdrm",
          numBedrooms: 2,
        },
      ] as UnitType[],
    }
    expect(getOccupancyDescription(testListing2)).toBe(t("listings.occupancyDescriptionNoSro"))
  })
  it("properly creates occupancy description for all SRO", () => {
    const testListing3 = testListing
    testListing3.unitsSummarized = {
      ...unitsSummarized,
      unitTypes: [
        {
          name: "SRO",
          numBedrooms: 1,
        },
      ] as UnitType[],
    }
    expect(getOccupancyDescription(testListing3)).toBe(t("listings.occupancyDescriptionAllSro"))
  })
})

describe("occupancy formatting helper stacked table", () => {
  it("properly creates occupancy table for units", () => {
    expect(stackedOccupancyTable(testListing)).toStrictEqual([
      {
        occupancy: { cellText: "2-6 people" },
        unitType: { cellText: "3 beds" },
      },
      {
        occupancy: { cellText: "at least 1 person" },
        unitType: { cellText: "2 beds" },
      },
      {
        occupancy: { cellText: "1 person" },
        unitType: { cellText: "SRO" },
      },
    ])
  })

  it("properly creates occupancy table for unit groups without duplicate unit types configurations", () => {
    testListing.unitGroups = [
      {
        ...unitGroup,
        minOccupancy: 1,
        maxOccupancy: 2,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.studio,
            numBedrooms: 0,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 1,
        maxOccupancy: 2,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 2,
        maxOccupancy: 4,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.twoBdrm,
            numBedrooms: 2,
          },
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.threeBdrm,
            numBedrooms: 3,
          },
        ],
      },
    ]
    expect(stackedUnitGroupsOccupancyTable(testListing)).toStrictEqual([
      {
        unitType: { cellText: "Studio" },
        occupancy: { cellText: "1-2 people" },
      },
      {
        unitType: { cellText: "1 bed" },
        occupancy: { cellText: "1-2 people" },
      },
      {
        unitType: { cellText: "2 beds, 3 beds" },
        occupancy: { cellText: "2-4 people" },
      },
    ])
  })

  it("properly creates occupancy table for unit groups with duplicate unit types configurations", () => {
    testListing.unitGroups = [
      {
        ...unitGroup,
        minOccupancy: 1,
        maxOccupancy: 3,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.studio,
            numBedrooms: 0,
          },
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 2,
        maxOccupancy: 4,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.studio,
            numBedrooms: 0,
          },
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 2,
        maxOccupancy: undefined,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.twoBdrm,
            numBedrooms: 2,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 3,
        maxOccupancy: undefined,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.twoBdrm,
            numBedrooms: 2,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: undefined,
        maxOccupancy: 6,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.threeBdrm,
            numBedrooms: 3,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: undefined,
        maxOccupancy: 4,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.threeBdrm,
            numBedrooms: 3,
          },
        ],
      },
      {
        ...unitGroup,
        minOccupancy: 3,
        maxOccupancy: 6,
        unitTypes: [
          {
            id: "unit_id_1",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: UnitTypeEnum.fourBdrm,
            numBedrooms: 4,
          },
        ],
      },
    ]

    expect(stackedUnitGroupsOccupancyTable(testListing)).toStrictEqual([
      {
        unitType: { cellText: "Studio, 1 bed" },
        occupancy: { cellText: "1-4 people" },
      },
      {
        unitType: { cellText: "2 beds" },
        occupancy: { cellText: "at least 2 people" },
      },
      {
        unitType: { cellText: "3 beds" },
        occupancy: { cellText: "no more than 6 people" },
      },
      {
        unitType: { cellText: "4 beds" },
        occupancy: { cellText: "3-6 people" },
      },
    ])
  })
})

describe("getOccupancy", () => {
  it("returns correctly for no data", () => {
    expect(getOccupancy(null, null)).toBe("n/a")
  })
  it("returns correctly for both min and max", () => {
    expect(getOccupancy(1, 5)).toBe("1-5 people")
  })
  it("returns correctly for just min plural", () => {
    expect(getOccupancy(2, null)).toBe("at least 2 people")
  })
  it("returns correctly for just min singular", () => {
    expect(getOccupancy(1, null)).toBe("at least 1 person")
  })
  it("returns correctly for just max plural", () => {
    expect(getOccupancy(null, 2)).toBe("no more than 2 people")
  })
  it("returns correctly for just max singular", () => {
    expect(getOccupancy(null, 1)).toBe("no more than 1 person")
  })
})
