import React from "react"
import { render, cleanup } from "@testing-library/react"
import {
  Unit,
  UnitSummary,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UnitSummaries } from "../../../../src/components/listing/listing_sections/UnitSummaries"
import { on } from "node:events"

afterEach(cleanup)

describe("<UnitSummaries>", () => {
  it("shows no rows if null summaries", () => {
    const { queryByTestId } = render(
      <UnitSummaries disableUnitsAccordion={false} units={[]} unitSummary={null} />
    )
    expect(queryByTestId("listing-unit-summary")).toBeNull()
  })
  it("shows no rows if empty summaries", () => {
    const { queryByTestId } = render(
      <UnitSummaries disableUnitsAccordion={false} units={[]} unitSummary={[]} />
    )
    expect(queryByTestId("listing-unit-summary")).toBeNull()
  })
  const mockedSummaries: UnitSummary[] = [
    {
      unitTypes: {
        id: "id",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: UnitTypeEnum.oneBdrm,
        numBedrooms: 1,
      },
      minIncomeRange: { min: "100", max: "200" },
      occupancyRange: { min: 1, max: 2 },
      rentRange: { min: "500", max: "1000" },
      rentAsPercentIncomeRange: { min: null, max: null },
      totalAvailable: 2,
      areaRange: { min: 300, max: 350 },
      floorRange: { min: 2, max: 4 },
    },
    {
      unitTypes: {
        id: "id",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: UnitTypeEnum.twoBdrm,
        numBedrooms: 2,
      },
      minIncomeRange: { min: "300", max: "400" },
      occupancyRange: { min: 2, max: 4 },
      rentRange: { min: null, max: null },
      rentAsPercentIncomeRange: { min: 30, max: 30 },
      totalAvailable: 3,
      areaRange: { min: 500, max: 600 },
      floorRange: { min: 3, max: 5 },
    },
  ]
  const oneBed: Unit = {
    id: "id",
    createdAt: new Date(),
    updatedAt: new Date(),
    unitTypes: {
      id: "id",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: UnitTypeEnum.oneBdrm,
      numBedrooms: 1,
    },
  }
  const twoBed: Unit = {
    id: "id",
    createdAt: new Date(),
    updatedAt: new Date(),
    unitTypes: {
      id: "id",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: UnitTypeEnum.twoBdrm,
      numBedrooms: 2,
    },
  }

  it("shows expandable summaries", () => {
    const updatedOneBed = { ...oneBed, number: "101" }
    const updatedTwoBed = { ...twoBed, number: "102" }

    const mockedUnits: Unit[] = [
      updatedOneBed,
      updatedOneBed,
      updatedTwoBed,
      updatedTwoBed,
      updatedTwoBed,
    ]

    const { getAllByTestId, getAllByLabelText, getAllByText } = render(
      <UnitSummaries
        disableUnitsAccordion={false}
        units={mockedUnits}
        unitSummary={mockedSummaries}
      />
    )
    expect(getAllByTestId("listing-unit-summary").length).toBe(2)
    expect(getAllByLabelText("Collapse section").length).toBeGreaterThan(0)
    expect(getAllByText("1 BR").length).toBeGreaterThan(0)
    expect(
      getAllByText("2 units, 300 - 350 square feet, 2nd - 4th floors", { exact: false }).length
    ).toBeGreaterThan(0)
    expect(getAllByText("2 BR").length).toBeGreaterThan(0)

    expect(
      getAllByText("3 units, 500 - 600 square feet, 3rd - 5th floors", {
        exact: false,
      }).length
    ).toBeGreaterThan(0)
  })

  it("don't show summaries if there would be no table data", () => {
    const mockedUnits: Unit[] = [oneBed, oneBed, twoBed, twoBed, twoBed]

    const { getAllByTestId, queryAllByLabelText, getAllByText } = render(
      <UnitSummaries
        disableUnitsAccordion={false}
        units={mockedUnits}
        unitSummary={mockedSummaries}
      />
    )
    expect(getAllByTestId("listing-unit-summary").length).toBe(2)
    expect(queryAllByLabelText("Collapse section").length).toBe(0)
    expect(getAllByText("1 BR").length).toBeGreaterThan(0)
    expect(
      getAllByText("2 units, 300 - 350 square feet, 2nd - 4th floors", { exact: false }).length
    ).toBeGreaterThan(0)
    expect(getAllByText("2 BR").length).toBeGreaterThan(0)

    expect(
      getAllByText("3 units, 500 - 600 square feet, 3rd - 5th floors", {
        exact: false,
      }).length
    ).toBeGreaterThan(0)
  })

  it("shows disabled summaries", () => {
    const mockedUnits: Unit[] = [oneBed, oneBed, twoBed, twoBed, twoBed]

    const { getAllByTestId, getAllByText, queryByLabelText } = render(
      <UnitSummaries
        disableUnitsAccordion={true}
        units={mockedUnits}
        unitSummary={mockedSummaries}
      />
    )
    expect(getAllByTestId("listing-unit-summary").length).toBe(2)
    expect(queryByLabelText("Collapse section")).toBeNull()

    expect(getAllByText("1 BR").length).toBeGreaterThan(0)
    expect(
      getAllByText("2 units, 300 - 350 square feet, 2nd - 4th floors", { exact: false }).length
    ).toBeGreaterThan(0)
    expect(getAllByText("2 BR").length).toBeGreaterThan(0)

    expect(
      getAllByText("3 units, 500 - 600 square feet, 3rd - 5th floors", {
        exact: false,
      }).length
    ).toBeGreaterThan(0)
  })
})
