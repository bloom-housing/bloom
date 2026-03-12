import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import {
  UnitSummary,
  UnitTypeEnum,
  UnitGroupSummary,
  ReviewOrderTypeEnum,
  UnitType,
} from "../../src/types/backend-swagger"
import {
  mergeSummaryRows,
  stackedUnitSummariesTable,
  mergeGroupSummaryRows,
  stackedUnitGroupsSummariesTable,
  getAvailabilityText,
  getStackedUnitTableData,
  unitSummariesTable,
} from "../../src/views/summaryTables"
import { t } from "@bloom-housing/ui-components"

// The backend won't accept null in the type, even though that's the data that is actually being generated, so I'm casting in order to test against realistic data
const defaultUnitType = {
  id: "a",
  createdAt: new Date(),
  updatedAt: new Date(),
  numBedrooms: null as unknown,
  name: null as unknown,
}

const defaultUnit = {
  id: "a",
  createdAt: new Date(),
  updatedAt: new Date(),
}
const defaultUnitTypeSummary = {
  unitTypes: defaultUnitType,
  minIncomeRange: { min: null as unknown, max: null as unknown },
  occupancyRange: { min: null as unknown, max: null as unknown },
  rentAsPercentIncomeRange: { min: null as unknown, max: null as unknown },
  rentRange: { min: null as unknown, max: null as unknown },
  totalAvailable: null as unknown,
  areaRange: { min: null as unknown, max: null as unknown },
} as UnitSummary

const defaultUnitTypeGroupSummary = {
  unitTypes: [],
  rentRange: { min: null as unknown, max: null as unknown },
  rentAsPercentIncomeRange: { min: null as unknown, max: null as unknown },
  unitVacancies: 0,
  openWaitlist: false,
  amiPercentageRange: { min: null as unknown, max: null as unknown },
} as UnitGroupSummary

const rentNoRanges = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "150", max: "150" },
    rentRange: { min: "1200", max: "1200" },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "150", max: "150" },
    rentRange: { min: "1200", max: "1200" },
  },
]

const rentRanges = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "140", max: "150" },
    rentRange: { min: "1400", max: "1500" },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "120", max: "130" },
    rentRange: { min: "1200", max: "1300" },
  },
]

const percentageRentNoRanges = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
]

const percentageRent = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 5, max: 10 },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 15, max: 20 },
  },
]

const mixedRentUnits = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 20, max: 30 },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 3,
      name: UnitTypeEnum.threeBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 10, max: 15 },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "50", max: "60" },
    rentRange: { min: "450", max: "750" },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 2,
      name: UnitTypeEnum.twoBdrm,
    },
    minIncomeRange: { min: "50", max: "50" },
    rentRange: { min: "400", max: "700" },
  },
]

const noRentData = [
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
  },
  {
    ...defaultUnitTypeSummary,
    unitTypes: {
      ...defaultUnitType,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
  },
]

// Test data for unit groups
const groupRentNoRanges = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1200" },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1200" },
  },
]

const groupRentRanges = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1400", max: "1500" },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1300" },
  },
]

const groupPercentageRentNoRanges = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
]

const groupPercentageRent = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 5, max: 10 },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 15, max: 20 },
  },
]

const groupMixedRentUnits = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 20, max: 30 },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 3,
        name: UnitTypeEnum.threeBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 10, max: 15 },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "450", max: "750" },
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 2,
        name: UnitTypeEnum.twoBdrm,
      },
    ],
    rentRange: { min: "400", max: "700" },
  },
]

const groupNoRentData = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
  },
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
  },
]

const groupMultipleUnitTypes = [
  {
    ...defaultUnitTypeGroupSummary,
    unitTypes: [
      {
        ...defaultUnitType,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
      {
        ...defaultUnitType,
        numBedrooms: 2,
        name: UnitTypeEnum.twoBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1500" },
  },
]

describe("mergeSummaryRows", () => {
  it("should merge units with just $ rent and no ranges", () => {
    expect(mergeSummaryRows(rentNoRanges)).toEqual({
      maxDollarRent: 1200,
      maxIncome: 150,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: 1200,
      minIncome: 150,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge units with just $ rent and ranges", () => {
    expect(mergeSummaryRows(rentRanges)).toEqual({
      maxDollarRent: 1500,
      maxIncome: 150,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: 1200,
      minIncome: 120,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge units with just % rent and no ranges", () => {
    expect(mergeSummaryRows(percentageRentNoRanges)).toEqual({
      maxDollarRent: null,
      maxIncome: 0,
      maxPercentageRent: 30,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minIncome: 0,
      minPercentageRent: 30,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge units with just % rent and ranges", () => {
    expect(mergeSummaryRows(percentageRent)).toEqual({
      maxDollarRent: null,
      maxIncome: 0,
      maxPercentageRent: 20,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minIncome: 0,
      minPercentageRent: 5,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge units both $ and % units", () => {
    expect(mergeSummaryRows(mixedRentUnits)).toEqual({
      maxDollarRent: 750,
      maxIncome: 60,
      maxPercentageRent: 30,
      maxUnitName: "threeBdrm",
      maxUnitType: 3,
      minDollarRent: 400,
      minIncome: 0,
      minPercentageRent: 10,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge units with no rent or income data", () => {
    expect(mergeSummaryRows(noRentData)).toEqual({
      maxDollarRent: null,
      maxIncome: null,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minIncome: null,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
})

describe("stackedUnitSummariesTable", () => {
  it("should merge units with just $ rent and no ranges", () => {
    expect(stackedUnitSummariesTable(rentNoRanges)).toEqual([
      {
        minimumIncome: { cellSubText: "per month", cellText: "$150" },
        rent: { cellSubText: "per month", cellText: "$1,200" },
        unitType: { cellSubText: "", cellText: "1 bed" },
      },
    ])
  })
  it("should merge units with just $ rent and ranges", () => {
    expect(stackedUnitSummariesTable(rentRanges)).toEqual([
      {
        minimumIncome: { cellSubText: "per month", cellText: "$120 to $150" },
        rent: { cellSubText: "per month", cellText: "$1,200 to $1,500" },
        unitType: { cellSubText: "", cellText: "1 bed" },
      },
    ])
  })
  it("should merge units with just % rent and no ranges", () => {
    expect(stackedUnitSummariesTable(percentageRentNoRanges)).toEqual([
      {
        minimumIncome: { cellSubText: "per month", cellText: "$0" },
        rent: { cellSubText: "per month", cellText: "30% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
      },
    ])
  })
  it("should merge units with just % rent and ranges", () => {
    expect(stackedUnitSummariesTable(percentageRent)).toEqual([
      {
        minimumIncome: { cellSubText: "per month", cellText: "$0" },
        rent: { cellSubText: "per month", cellText: "5% to 20% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
      },
    ])
  })
  it("should merge units both $ and % units", () => {
    expect(stackedUnitSummariesTable(mixedRentUnits)).toEqual([
      {
        minimumIncome: { cellSubText: "per month", cellText: "$0 to $60" },
        rent: { cellSubText: "per month", cellText: "% of income, or up to $750" },
        unitType: { cellSubText: "", cellText: "1 bed - 3 beds" },
      },
    ])
  })
  it("should merge units with no rent or income data", () => {
    expect(stackedUnitSummariesTable(noRentData)).toEqual([
      {
        minimumIncome: { cellSubText: "", cellText: "n/a" },
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
      },
    ])
  })
})

describe("mergeGroupSummaryRows", () => {
  it("should merge unit groups with just $ rent and no ranges", () => {
    expect(mergeGroupSummaryRows(groupRentNoRanges)).toEqual({
      maxDollarRent: 1200,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: 1200,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge unit groups with just $ rent and ranges", () => {
    expect(mergeGroupSummaryRows(groupRentRanges)).toEqual({
      maxDollarRent: 1500,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: 1200,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge unit groups with just % rent and no ranges", () => {
    expect(mergeGroupSummaryRows(groupPercentageRentNoRanges)).toEqual({
      maxDollarRent: null,
      maxPercentageRent: 30,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minPercentageRent: 30,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge unit groups with just % rent and ranges", () => {
    expect(mergeGroupSummaryRows(groupPercentageRent)).toEqual({
      maxDollarRent: null,
      maxPercentageRent: 20,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minPercentageRent: 5,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge unit groups with both $ and % units", () => {
    expect(mergeGroupSummaryRows(groupMixedRentUnits)).toEqual({
      maxDollarRent: 750,
      maxPercentageRent: 30,
      maxUnitName: "threeBdrm",
      maxUnitType: 3,
      minDollarRent: 400,
      minPercentageRent: 10,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should merge unit groups with no rent data", () => {
    expect(mergeGroupSummaryRows(groupNoRentData)).toEqual({
      maxDollarRent: null,
      maxPercentageRent: null,
      maxUnitName: "oneBdrm",
      maxUnitType: 1,
      minDollarRent: null,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
  it("should properly use first and last unit type from the array", () => {
    expect(mergeGroupSummaryRows(groupMultipleUnitTypes)).toEqual({
      maxDollarRent: 1500,
      maxPercentageRent: null,
      maxUnitName: "twoBdrm",
      maxUnitType: 2,
      minDollarRent: 1200,
      minPercentageRent: null,
      minUnitName: "oneBdrm",
      minUnitType: 1,
    })
  })
})

describe("stackedUnitGroupsSummariesTable", () => {
  it("should merge unit groups with just $ rent and no ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupRentNoRanges)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "$1,200" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should merge unit groups with just $ rent and ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupRentRanges)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "$1,200 to $1,500" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should merge unit groups with just % rent and no ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupPercentageRentNoRanges)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "30% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should merge unit groups with just % rent and ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupPercentageRent)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "5% to 20% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should merge unit groups with both $ and % units", () => {
    expect(stackedUnitGroupsSummariesTable(groupMixedRentUnits)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "% of income, or up to $750" },
        unitType: { cellSubText: "", cellText: "1 bed - 3 beds" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should merge unit groups with no rent data", () => {
    expect(stackedUnitGroupsSummariesTable(groupNoRentData)).toEqual([
      {
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should handle multiple unit types in a single group", () => {
    expect(stackedUnitGroupsSummariesTable(groupMultipleUnitTypes)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "$1,200 to $1,500" },
        unitType: { cellSubText: "", cellText: "1 bed - 2 beds" },
        availability: { cellText: "Closed waitlist" },
      },
    ])
  })
  it("should show availability text for open waitlist", () => {
    const openWaitlistGroup = [
      {
        ...defaultUnitTypeGroupSummary,
        unitTypes: [
          {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        ],
        openWaitlist: true,
      },
    ]
    expect(stackedUnitGroupsSummariesTable(openWaitlistGroup)).toEqual([
      {
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Open waitlist" },
      },
    ])
  })
  it("should show availability text for vacant units", () => {
    const vacantUnitsGroup = [
      {
        ...defaultUnitTypeGroupSummary,
        unitTypes: [
          {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        ],
        unitVacancies: 3,
      },
    ]
    expect(stackedUnitGroupsSummariesTable(vacantUnitsGroup)).toEqual([
      {
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: {
          cellText: "3 Vacant units & Closed waitlist",
        },
      },
    ])
  })
  it("should show coming soon text when isComingSoon is true", () => {
    const comingSoonGroup = [
      {
        ...defaultUnitTypeGroupSummary,
        unitTypes: [
          {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        ],
      },
    ]
    expect(stackedUnitGroupsSummariesTable(comingSoonGroup, true)).toEqual([
      {
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Under construction" },
      },
    ])
  })
})

describe("getAvailabilityText", () => {
  it("should show closed waitlist text", () => {
    expect(getAvailabilityText(defaultUnitTypeGroupSummary)).toEqual({ text: "Closed waitlist" })
  })
  it("should show open waitlist text", () => {
    expect(getAvailabilityText({ ...defaultUnitTypeGroupSummary, openWaitlist: true })).toEqual({
      text: "Open waitlist",
    })
  })
  it("should show plural units available text", () => {
    expect(
      getAvailabilityText({ ...defaultUnitTypeGroupSummary, openWaitlist: true, unitVacancies: 10 })
    ).toEqual({ text: "10 Vacant units & Open waitlist" })
  })
  it("should show singular units available text", () => {
    expect(
      getAvailabilityText({ ...defaultUnitTypeGroupSummary, openWaitlist: false, unitVacancies: 1 })
    ).toEqual({ text: "1 Vacant unit & Closed waitlist" })
  })
  it("should show under construction text", () => {
    expect(
      getAvailabilityText(
        { ...defaultUnitTypeGroupSummary, openWaitlist: true, unitVacancies: 10 },
        true
      )
    ).toEqual({ text: "Under construction" })
  })

  describe("getStackedUnitTableData", () => {
    it("returns empty values for no data", () => {
      expect(getStackedUnitTableData([], defaultUnitTypeSummary)).toEqual(
        expect.objectContaining({
          floorSection: "",
          areaRangeSection: "",
          adjustedHeaders: {},
        })
      )
    })
    it("show all headers if all have data", () => {
      const result = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            floor: 1,
            sqFeet: "550",
            number: "101",
            numBathrooms: 1,
            unitAccessibilityPriorityTypes: {
              id: "a",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: "Mobility",
            },
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
          floorRange: { min: 1, max: 1 },
          areaRange: { min: 550, max: 550 },
          minIncomeRange: { min: "150", max: "150" },
          rentRange: { min: "1200", max: "1200" },
        }
      )
      expect(result).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            accessibilityType: "listings.unit.accessibilityType",
            floor: "t.floor",
            number: "t.unit",
            sqFeet: "t.area",
            numBathrooms: "listings.bath",
          },
        })
      )
      expect(renderToString(result.barContent)).toContain("1 bed")
      expect(renderToString(result.barContent)).toContain("1 unit")
    })
    it("hide headers if no data", () => {
      const resultNoFloor = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            sqFeet: "550",
            number: "101",
            numBathrooms: 1,
            unitAccessibilityPriorityTypes: {
              id: "a",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: "Mobility",
            },
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        }
      )
      expect(resultNoFloor).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            accessibilityType: "listings.unit.accessibilityType",
            number: "t.unit",
            sqFeet: "t.area",
            numBathrooms: "listings.bath",
          },
        })
      )

      const resultNoNumber = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            sqFeet: "550",
            floor: 1,
            numBathrooms: 1,
            unitAccessibilityPriorityTypes: {
              id: "a",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: "Mobility",
            },
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        }
      )
      expect(resultNoNumber).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            accessibilityType: "listings.unit.accessibilityType",
            floor: "t.floor",
            sqFeet: "t.area",
            numBathrooms: "listings.bath",
          },
        })
      )

      const resultNoArea = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            number: "101",
            floor: 1,
            numBathrooms: 1,
            unitAccessibilityPriorityTypes: {
              id: "a",
              createdAt: new Date(),
              updatedAt: new Date(),
              name: "Mobility",
            },
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        }
      )
      expect(resultNoArea).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            accessibilityType: "listings.unit.accessibilityType",
            number: "t.unit",
            floor: "t.floor",
            numBathrooms: "listings.bath",
          },
        })
      )

      const resultNoA11y = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            sqFeet: "550",
            number: "101",
            floor: 1,
            numBathrooms: 1,
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        }
      )
      expect(resultNoA11y).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            number: "t.unit",
            floor: "t.floor",
            sqFeet: "t.area",
            numBathrooms: "listings.bath",
          },
        })
      )

      const resultNoBathrooms = getStackedUnitTableData(
        [
          {
            ...defaultUnit,
            sqFeet: "550",
            number: "101",
            floor: 1,
            unitTypes: { ...defaultUnitType, name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
          },
        ],
        {
          ...defaultUnitTypeSummary,
          unitTypes: {
            ...defaultUnitType,
            numBedrooms: 1,
            name: UnitTypeEnum.oneBdrm,
          },
        }
      )
      expect(resultNoBathrooms).toEqual(
        expect.objectContaining({
          adjustedHeaders: {
            number: "t.unit",
            floor: "t.floor",
            sqFeet: "t.area",
          },
        })
      )
    })
  })
})

describe("unitSummariesTable", () => {
  const baseUnitSummary: UnitSummary = {
    unitTypes: { name: UnitTypeEnum.oneBdrm, numBedrooms: 1 } as UnitType,
    totalAvailable: 2,
    minIncomeRange: { min: "$1,000", max: "$2,000" },
    rentRange: { min: "$500", max: "$800" },
    rentAsPercentIncomeRange: { min: null, max: null },
  }
  describe("unit type", () => {
    it("renders the unit type name as a translated string", () => {
      const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.firstComeFirstServe)
      render(rows[0].unitType.content)
      expect(screen.getByText(t("listings.unitTypes.oneBdrm"))).toBeInTheDocument()
    })
  })

  describe("minimum income", () => {
    it("renders a single value when min and max income are equal", () => {
      const samMinAndMax = {
        ...baseUnitSummary,
        minIncomeRange: { min: "$1,500", max: "$1,500" },
      }
      const rows = unitSummariesTable([samMinAndMax], ReviewOrderTypeEnum.firstComeFirstServe)
      render(rows[0].minimumIncome.content)
      expect(screen.getByText("$1,500 per month")).toBeInTheDocument()
      expect(screen.queryByText("to")).not.toBeInTheDocument()
    })

    it("renders a range when min and max income differ", () => {
      const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].minimumIncome.content)
      expect(container.textContent).toBe("$1,000 to $2,000 per month")
    })

    it("should display n/a when min income is n/a", () => {
      const summary = {
        ...baseUnitSummary,
        minIncomeRange: { min: "t.n/a", max: "t.n/a" },
      }
      const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].minimumIncome.content)
      expect(container.textContent).toBe("n/a")
    })
  })

  describe("rent", () => {
    it("renders exact rent range when min is null", () => {
      const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].rent.content)
      expect(container.textContent).toBe("$500 to $800 per month")
    })

    it("renders single rent value when rentRange min equals max", () => {
      const summary = {
        ...baseUnitSummary,
        rentRange: { min: "$600", max: "$600" },
      }
      const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].rent.content)
      expect(container.textContent).toBe("$600 per month")
    })

    it("renders percent income rent when min is set", () => {
      const summary = {
        ...baseUnitSummary,
        rentAsPercentIncomeRange: { min: 30, max: 50 },
      }
      const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].rent.content)
      expect(container.textContent).toBe("30 to 50% Income")
    })

    it("renders single percent income value when min equals max", () => {
      const summary = {
        ...baseUnitSummary,
        rentAsPercentIncomeRange: { min: 30, max: 30 },
      }
      const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].rent.content)
      expect(container.textContent).toBe("30% Income")
    })

    it("should display n/a when min is 't.n/a'", () => {
      const summary = {
        ...baseUnitSummary,
        rentRange: { min: "t.n/a", max: "t.n/a" },
      }
      const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
      const { container } = render(rows[0].rent.content)
      expect(container.textContent).toBe("n/a")
    })

    describe("availability", () => {
      it("shows vacant unit count for firstComeFirstServe with units available", () => {
        const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.firstComeFirstServe)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("2 Vacant units")
      })

      it("uses singular 'vacantUnit' when totalAvailable is 1", () => {
        const summary = { ...baseUnitSummary, totalAvailable: 1 }
        const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("1 Vacant unit")
      })

      it("shows 'waitlist open' for firstComeFirstServe when totalAvailable is 0", () => {
        const summary = { ...baseUnitSummary, totalAvailable: 0 }
        const rows = unitSummariesTable([summary], ReviewOrderTypeEnum.firstComeFirstServe)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("Open waitlist")
      })

      it("shows 'waitlist open' for waitlist review order", () => {
        const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.waitlist)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("Open waitlist")
      })

      it("shows 'waitlist open' for waitlistLottery review order", () => {
        const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.waitlistLottery)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("Open waitlist")
      })

      it("shows vacant units for lottery review order", () => {
        const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.lottery)
        const { container } = render(rows[0].availability.content)
        expect(container.textContent).toBe("2 Vacant units")
      })
    })

    it("returns an empty array when summaries is empty", () => {
      const rows = unitSummariesTable([], ReviewOrderTypeEnum.firstComeFirstServe)
      expect(rows).toEqual([])
    })

    it("handles undefined summaries gracefully", () => {
      const rows = unitSummariesTable(
        undefined as unknown as UnitSummary[],
        ReviewOrderTypeEnum.firstComeFirstServe
      )
      expect(rows).toBeUndefined()
    })

    it("maps multiple summaries and returns a row for each", () => {
      const summaries = [
        baseUnitSummary,
        { ...baseUnitSummary, unitTypes: { name: UnitTypeEnum.twoBdrm } },
      ]
      const rows = unitSummariesTable(summaries, ReviewOrderTypeEnum.firstComeFirstServe)
      expect(rows).toHaveLength(2)
    })

    it("each row has all four expected keys", () => {
      const rows = unitSummariesTable([baseUnitSummary], ReviewOrderTypeEnum.firstComeFirstServe)
      expect(rows[0]).toHaveProperty("unitType")
      expect(rows[0]).toHaveProperty("minimumIncome")
      expect(rows[0]).toHaveProperty("rent")
      expect(rows[0]).toHaveProperty("availability")
    })
  })
})
