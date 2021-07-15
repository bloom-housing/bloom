import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { UnitTables } from "../../src/page_components/listing/UnitTables"
import Archer from "../fixtures/archer.json"
import { UnitSummary } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

const archer = Object.assign({}, Archer) as any

// copied from listings service output
const summaries: {
  byUnitType: UnitSummary[]
  byUnitTypeWithoutFloor: UnitSummary[]
  amiPercentages: string[]
  [key: string]: any
} = {
  unitTypes: ["studio"],
  reservedTypes: ["senior"],
  priorityTypes: [],
  amiPercentages: ["45.0", "30.0"],
  byUnitType: [
    {
      unitType: "studio",
      totalAvailable: 0,
      totalCount: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byUnitTypeWithoutFloor: [
    {
      unitType: "studio",
      totalAvailable: 0,
      totalCount: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byNonReservedUnitType: [
    {
      unitType: "studio",
      totalAvailable: 0,
      totalCount: 40,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: null, max: null },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byReservedType: [
    {
      reservedType: "senior",
      byUnitType: [
        {
          unitType: "studio",
          totalAvailable: 0,
          totalCount: 1,
          minIncomeRange: { min: "$2,208", max: "$2,208" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$1,104", max: "$1,104" },
          floorRange: { min: 2, max: 2 },
          areaRange: { min: 285, max: 285 },
        },
      ],
    },
  ],
  byAMI: [
    {
      percent: "45.0",
      byNonReservedUnitType: [
        {
          unitType: "studio",
          totalAvailable: 0,
          totalCount: 24,
          minIncomeRange: { min: "$2,208", max: "$2,208" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$1,104", max: "$1,104" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
      byReservedType: [
        {
          reservedType: "senior",
          byUnitType: [
            {
              unitType: "studio",
              totalAvailable: 0,
              totalCount: 1,
              minIncomeRange: { min: "$2,208", max: "$2,208" },
              occupancyRange: { min: 1, max: 2 },
              rentAsPercentIncomeRange: { min: null, max: null },
              rentRange: { min: "$1,104", max: "$1,104" },
              floorRange: { min: 2, max: 2 },
              areaRange: { min: 285, max: 285 },
            },
          ],
        },
      ],
    },
    {
      percent: "30.0",
      byNonReservedUnitType: [
        {
          unitType: "studio",
          totalAvailable: 0,
          totalCount: 16,
          minIncomeRange: { min: "$1,438", max: "$1,438" },
          occupancyRange: { min: 1, max: 2 },
          rentAsPercentIncomeRange: { min: null, max: null },
          rentRange: { min: "$719", max: "$719" },
          floorRange: { min: 2, max: 3 },
          areaRange: { min: 285, max: 285 },
        },
      ],
      byReservedType: [],
    },
  ],
  hmi: {
    columns: { householdSize: "Household Size", ami30: "30% AMI Units", ami45: "45% AMI Units" },
    rows: [
      { householdSize: 1, ami30: "$30,750", ami45: "$46,125" },
      { householdSize: 2, ami30: "$35,130", ami45: "$52,695" },
    ],
  },
}

describe("<UnitTables>", () => {
  it("renders with accordion", () => {
    const { getAllByText, getByRole, container } = render(
      <UnitTables units={archer.units} unitSummaries={summaries.byUnitType} />
    )

    // Verify that UnitTables shows the total count of units.
    const buttonHeader = getByRole("button")
    expect(buttonHeader.textContent).toContain(summaries.byUnitType[0].totalCount + " units")

    // All units have the same square-foot area minimum; find all HTML elements that include that
    // text (this should be all rows, one per unit) and make sure the total number of rows matches
    // the totalCount of units.
    expect(getAllByText(summaries.byUnitType[0].areaRange.min).length).toBe(
      summaries.byUnitType[0].totalCount
    )

    // Expect the table with one row per unit to be hidden until the button is clicked.
    expect(container.getElementsByClassName("hidden").length).toBe(1)
    fireEvent.click(getByRole("button"))
    expect(container.getElementsByClassName("hidden").length).toBe(0)
  })
  it("renders without accordion", () => {
    const { getAllByText, getByRole, container } = render(
      <UnitTables
        units={archer.units}
        unitSummaries={summaries.byUnitType}
        disableAccordion={true}
      />
    )

    // Verify that UnitTables shows the total count of units.
    const buttonHeader = getByRole("button")
    expect(buttonHeader.textContent).toContain(summaries.byUnitType[0].totalCount + " units")

    // All units have the same square-foot area minimum; find all HTML elements that include that
    // text (this should be all rows, one per unit) and make sure the total number of rows matches
    // the totalCount of units.
    expect(getAllByText(summaries.byUnitType[0].areaRange.min).length).toBe(
      summaries.byUnitType[0].totalCount
    )

    // Expect the table with one row per unit to be hidden, even if the button is clicked.
    expect(container.getElementsByClassName("hidden").length).toBe(1)
    fireEvent.click(getByRole("button"))
    expect(container.getElementsByClassName("hidden").length).toBe(1)
  })
})
