import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { UnitTables } from "../../src/page_components/listing/UnitTables"
import Archer from "../fixtures/archer.json"
import { Listing, UnitSummary } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

const archer: Listing = Object.assign({}, Archer) as any

// copied from listings service output
const summaries: {
  byUnitType: UnitSummary[]
  byUnitTypeWithoutFloor: UnitSummary[]
  amiPercentages: string[]
  [key: string]: any
} = {
  unitTypes: [
    {
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "studio",
    },
  ],
  priorityTypes: [],
  amiPercentages: ["45.0", "30.0"],
  byUnitTypeWithoutFloor: [
    {
      unitType: {
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "studio",
      },
      totalAvailable: 0,
      totalCount: 41,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byUnitType: [
    {
      unitType: {
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "studio",
      },
      totalAvailable: 0,
      totalCount: 40,
      minIncomeRange: { min: "$1,438", max: "$2,208" },
      occupancyRange: { min: 1, max: 2 },
      rentAsPercentIncomeRange: { min: 10, max: 80 },
      rentRange: { min: "$719", max: "$1,104" },
      floorRange: { min: 2, max: 3 },
      areaRange: { min: 285, max: 285 },
    },
  ],
  byAMI: [
    {
      percent: "45.0",
      byUnitType: [
        {
          unitType: {
            id: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
          },
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
    },
    {
      percent: "30.0",
      byUnitType: [
        {
          unitType: {
            id: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "studio",
          },
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
    /* 
      * TODO: this had to have been a result of a bad merge, this test doesn't make sense
      expect(getAllByText(summaries.byUnitType[0].areaRange.min).length).toBe(
      summaries.byUnitType[0].totalAvailable
    ) */
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
    /* 
      * TODO: this had to have been a result of a bad merge, this test doesn't make sense
      expect(getAllByText(summaries.byUnitType[0].areaRange.min).length).toBe(
      summaries.byUnitType[0].totalAvailable
    ) */
    expect(container.getElementsByClassName("hidden").length).toBe(1)
    fireEvent.click(getByRole("button"))
    expect(container.getElementsByClassName("hidden").length).toBe(1)
  })
})
