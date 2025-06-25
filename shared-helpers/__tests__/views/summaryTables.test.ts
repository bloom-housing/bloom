import { cleanup } from "@testing-library/react"
import { UnitSummary, UnitTypeEnum, UnitGroupSummary } from "../../src/types/backend-swagger"
import {
  mergeSummaryRows,
  stackedUnitSummariesTable,
  mergeGroupSummaryRows,
  stackedUnitGroupsSummariesTable,
} from "../../src/views/summaryTables"

afterEach(cleanup)

// The backend won't accept null in the type, even though that's the data that is actually being generated, so I'm casting in order to test against realistic data
const defaultUnit = {
  id: "a",
  createdAt: new Date(),
  updatedAt: new Date(),
  numBedrooms: null as unknown,
  name: null as unknown,
}
const defaultUnitSummary = {
  unitTypes: defaultUnit,
  minIncomeRange: { min: null as unknown, max: null as unknown },
  occupancyRange: { min: null as unknown, max: null as unknown },
  rentAsPercentIncomeRange: { min: null as unknown, max: null as unknown },
  rentRange: { min: null as unknown, max: null as unknown },
  totalAvailable: null as unknown,
  areaRange: { min: null as unknown, max: null as unknown },
} as UnitSummary

const defaultUnitGroupSummary = {
  unitTypes: [],
  rentRange: { min: null as unknown, max: null as unknown },
  rentAsPercentIncomeRange: { min: null as unknown, max: null as unknown },
  unitVacancies: 0,
  openWaitlist: false,
  amiPercentageRange: { min: null as unknown, max: null as unknown },
} as UnitGroupSummary

const rentNoRanges = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "150", max: "150" },
    rentRange: { min: "1200", max: "1200" },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "150", max: "150" },
    rentRange: { min: "1200", max: "1200" },
  },
]

const rentRanges = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "140", max: "150" },
    rentRange: { min: "1400", max: "1500" },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "120", max: "130" },
    rentRange: { min: "1200", max: "1300" },
  },
]

const percentageRentNoRanges = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
]

const percentageRent = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 5, max: 10 },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 15, max: 20 },
  },
]

const mixedRentUnits = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 20, max: 30 },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 3,
      name: UnitTypeEnum.threeBdrm,
    },
    minIncomeRange: { min: "0", max: "0" },
    rentAsPercentIncomeRange: { min: 10, max: 15 },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
    minIncomeRange: { min: "50", max: "60" },
    rentRange: { min: "450", max: "750" },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 2,
      name: UnitTypeEnum.twoBdrm,
    },
    minIncomeRange: { min: "50", max: "50" },
    rentRange: { min: "400", max: "700" },
  },
]

const noRentData = [
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
  },
  {
    ...defaultUnitSummary,
    unitTypes: {
      ...defaultUnit,
      numBedrooms: 1,
      name: UnitTypeEnum.oneBdrm,
    },
  },
]

// Test data for unit groups
const groupRentNoRanges = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1200" },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1200" },
  },
]

const groupRentRanges = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1400", max: "1500" },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "1200", max: "1300" },
  },
]

const groupPercentageRentNoRanges = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 30, max: 30 },
  },
]

const groupPercentageRent = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 5, max: 10 },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 15, max: 20 },
  },
]

const groupMixedRentUnits = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 20, max: 30 },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 3,
        name: UnitTypeEnum.threeBdrm,
      },
    ],
    rentAsPercentIncomeRange: { min: 10, max: 15 },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
    rentRange: { min: "450", max: "750" },
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 2,
        name: UnitTypeEnum.twoBdrm,
      },
    ],
    rentRange: { min: "400", max: "700" },
  },
]

const groupNoRentData = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
  },
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
    ],
  },
]

const groupMultipleUnitTypes = [
  {
    ...defaultUnitGroupSummary,
    unitTypes: [
      {
        ...defaultUnit,
        numBedrooms: 1,
        name: UnitTypeEnum.oneBdrm,
      },
      {
        ...defaultUnit,
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
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should merge unit groups with just $ rent and ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupRentRanges)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "$1,200 to $1,500" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should merge unit groups with just % rent and no ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupPercentageRentNoRanges)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "30% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should merge unit groups with just % rent and ranges", () => {
    expect(stackedUnitGroupsSummariesTable(groupPercentageRent)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "5% to 20% of income" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should merge unit groups with both $ and % units", () => {
    expect(stackedUnitGroupsSummariesTable(groupMixedRentUnits)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "% of income, or up to $750" },
        unitType: { cellSubText: "", cellText: "1 bed - 3 beds" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should merge unit groups with no rent data", () => {
    expect(stackedUnitGroupsSummariesTable(groupNoRentData)).toEqual([
      {
        rent: { cellSubText: "", cellText: "n/a" },
        unitType: { cellSubText: "", cellText: "1 bed" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should handle multiple unit types in a single group", () => {
    expect(stackedUnitGroupsSummariesTable(groupMultipleUnitTypes)).toEqual([
      {
        rent: { cellSubText: "per month", cellText: "$1,200 to $1,500" },
        unitType: { cellSubText: "", cellText: "1 bed - 2 beds" },
        availability: { cellText: "Not available" },
      },
    ])
  })
  it("should show availability text for open waitlist", () => {
    const openWaitlistGroup = [
      {
        ...defaultUnitGroupSummary,
        unitTypes: [
          {
            ...defaultUnit,
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
        availability: { cellText: "Open Waitlist" },
      },
    ])
  })
  it("should show availability text for vacant units", () => {
    const vacantUnitsGroup = [
      {
        ...defaultUnitGroupSummary,
        unitTypes: [
          {
            ...defaultUnit,
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
          cellText: "3 Vacant Units",
        },
      },
    ])
  })
  it("should show coming soon text when isComingSoon is true", () => {
    const comingSoonGroup = [
      {
        ...defaultUnitGroupSummary,
        unitTypes: [
          {
            ...defaultUnit,
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
        availability: { cellText: "Under Construction" },
      },
    ])
  })
})
