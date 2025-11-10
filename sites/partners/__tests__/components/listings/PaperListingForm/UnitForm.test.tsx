import React from "react"
import { randomUUID } from "crypto"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render, screen, within } from "../../../testUtils"
import UnitForm from "../../../../src/components/listings/PaperListingForm/UnitForm"
import { TempUnit } from "../../../../src/lib/listings/formTypes"
import {
  amiChart1,
  amiCharts,
  unit,
  unitTypes,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { rest } from "msw"
import userEvent from "@testing-library/user-event"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

const tempUnit: TempUnit = {
  ...unit,
}

describe("UnitForm", () => {
  server.use(
    rest.get("http://localhost:3100/unitTypes", (_req, res, ctx) => {
      return res(ctx.json(unitTypes))
    }),
    rest.get("http://localhost:3100/unitAccessibilityPriorityTypes", (_req, res, ctx) => {
      return res(
        ctx.json([
          { id: randomUUID(), name: "Mobility" },
          { id: randomUUID(), name: "Hearing" },
          { id: randomUUID(), name: "Mobility and Hearing" },
        ])
      )
    }),
    rest.get("http://localhost:3100/amiCharts", (_req, res, ctx) => {
      return res(ctx.json(amiCharts))
    }),
    rest.get(
      "http://localhost/api/adapter/amiCharts/4e64914b-3169-4d6f-a8ef-d4b11b34ebcd",
      (_req, res, ctx) => {
        return res(ctx.json(amiChart1))
      }
    )
  )
  it("should render the unit form without any selection", async () => {
    render(
      <UnitForm
        jurisdiction={randomUUID()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={tempUnit}
      />
    )

    await screen.findByRole("option", { name: "Studio" })

    expect(screen.getByRole("heading", { name: "Details", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Unit number" })).toBeInTheDocument()

    // Unit type dropdown selector
    const unitTypeSelector = screen.getByRole("combobox", { name: "Unit type" })
    expect(unitTypeSelector).toBeInTheDocument()
    expect(within(unitTypeSelector).getAllByRole("option")).toHaveLength(8)
    expect(within(unitTypeSelector).getByRole("option", { name: "Unit type" })).toBeInTheDocument()
    expect(within(unitTypeSelector).getByRole("option", { name: "Studio" })).toBeInTheDocument()
    expect(within(unitTypeSelector).getByRole("option", { name: "SRO" })).toBeInTheDocument()
    expect(
      within(unitTypeSelector).getByRole("option", { name: "One bedroom" })
    ).toBeInTheDocument()
    expect(
      within(unitTypeSelector).getByRole("option", { name: "Two bedroom" })
    ).toBeInTheDocument()
    expect(
      within(unitTypeSelector).getByRole("option", { name: "Three bedroom" })
    ).toBeInTheDocument()
    expect(
      within(unitTypeSelector).getByRole("option", { name: "Four bedroom" })
    ).toBeInTheDocument()
    expect(
      within(unitTypeSelector).getByRole("option", { name: "Five bedroom" })
    ).toBeInTheDocument()

    // Number of bathrooms selector
    const bathroomSelector = screen.getByRole("combobox", { name: "Number of bathrooms" })
    expect(bathroomSelector).toBeInTheDocument()
    expect(within(bathroomSelector).getAllByRole("option")).toHaveLength(7)
    expect(
      within(bathroomSelector).getByRole("option", { name: "Number of bathrooms" })
    ).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "Shared" })).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "1" })).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "2" })).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "3" })).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "4" })).toBeInTheDocument()
    expect(within(bathroomSelector).getByRole("option", { name: "5" })).toBeInTheDocument()

    // Unit floor selector
    const floorSelector = screen.getByRole("combobox", { name: "Unit floor" })
    expect(floorSelector).toBeInTheDocument()
    expect(within(floorSelector).getAllByRole("option")).toHaveLength(11)
    expect(within(floorSelector).getByRole("option", { name: "Unit floor" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "1" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "2" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "3" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "4" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "5" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "6" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "7" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "8" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "9" })).toBeInTheDocument()
    expect(within(floorSelector).getByRole("option", { name: "10" })).toBeInTheDocument()

    expect(screen.getByRole("spinbutton", { name: "Square footage" })).toBeInTheDocument()

    // Minimum occupancy selector
    const minOccupancySelector = screen.getByRole("combobox", { name: "Minimum occupancy" })
    expect(minOccupancySelector).toBeInTheDocument()
    expect(within(minOccupancySelector).getAllByRole("option")).toHaveLength(12)
    expect(
      within(minOccupancySelector).getByRole("option", { name: "Minimum occupancy" })
    ).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "1" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "2" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "3" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "4" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "5" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "6" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "7" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "8" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "9" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "10" })).toBeInTheDocument()
    expect(within(minOccupancySelector).getByRole("option", { name: "11" })).toBeInTheDocument()

    // Max occupancy selector
    const maxOccupancySelector = screen.getByRole("combobox", { name: "Max occupancy" })
    expect(maxOccupancySelector).toBeInTheDocument()
    expect(within(maxOccupancySelector).getAllByRole("option")).toHaveLength(12)
    expect(
      within(maxOccupancySelector).getByRole("option", { name: "Max occupancy" })
    ).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "1" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "2" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "3" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "4" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "5" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "6" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "7" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "8" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "9" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "10" })).toBeInTheDocument()
    expect(within(maxOccupancySelector).getByRole("option", { name: "11" })).toBeInTheDocument()

    expect(screen.getByRole("heading", { name: "Eligibility", level: 2 })).toBeInTheDocument()

    const amiChartSelector = screen.getByRole("combobox", { name: "AMI chart" })
    expect(amiChartSelector).toBeInTheDocument()
    expect(within(amiChartSelector).getAllByRole("option")).toHaveLength(3)
    expect(within(amiChartSelector).getByRole("option", { name: "AMI chart" })).toBeInTheDocument()
    // These values are populated by the amiCharts api call
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI" })).toBeInTheDocument()
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI 2" })).toBeInTheDocument()

    const amiChartPercentageSelector = screen.getByRole("combobox", { name: "Percentage of AMI" })
    // Selector is disabled and No options are available until a chart is selected
    expect(amiChartPercentageSelector).toBeDisabled()
    expect(within(amiChartPercentageSelector).getAllByRole("option")).toHaveLength(1)

    expect(screen.getByRole("columnheader", { name: "Household size" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Maximum annual income" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "1 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "2 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "3 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "4 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "5 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "6 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "7 Minimum income $" })).toBeInTheDocument()
    expect(screen.getByRole("row", { name: "8 Minimum income $" })).toBeInTheDocument()

    const rentDetermination = screen.getByRole("group", { name: "How is rent determined?" })
    expect(rentDetermination).toBeInTheDocument()
    expect(
      within(rentDetermination).getByRole("radio", { name: "Fixed amount" })
    ).toBeInTheDocument()
    expect(
      within(rentDetermination).getByRole("radio", { name: "% of income" })
    ).toBeInTheDocument()

    expect(screen.getByRole("heading", { name: "Accessibility", level: 2 })).toBeInTheDocument()

    // Accessibility priority type selector
    const priorityTypeSelector = screen.getByRole("combobox", {
      name: "Accessibility priority type",
    })
    expect(priorityTypeSelector).toBeInTheDocument()
    expect(within(priorityTypeSelector).getAllByRole("option")).toHaveLength(4)
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Accessibility priority type" })
    ).toBeInTheDocument()
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Mobility" })
    ).toBeInTheDocument()
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Hearing" })
    ).toBeInTheDocument()
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Mobility and Hearing" })
    ).toBeInTheDocument()

    // Action buttons
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save & new" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Save & exit" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should render the AMI chart options after AMI chart selection", async () => {
    render(
      <UnitForm
        jurisdiction={randomUUID()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={tempUnit}
      />
    )

    // Wait for API calls to finish
    await screen.findByRole("option", { name: "Mock AMI" })

    const amiChartSelector = screen.getByRole("combobox", { name: "AMI chart" })
    expect(amiChartSelector).toBeInTheDocument()
    expect(within(amiChartSelector).getAllByRole("option")).toHaveLength(3)
    expect(within(amiChartSelector).getByRole("option", { name: "AMI chart" })).toBeInTheDocument()
    // These values are populated by the amiCharts api call
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI" })).toBeInTheDocument()
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI 2" })).toBeInTheDocument()

    const amiChartPercentageSelector = screen.getByRole("combobox", { name: "Percentage of AMI" })
    // Selector is disabled and No options are available until a chart is selected
    expect(amiChartPercentageSelector).toBeDisabled()
    expect(within(amiChartPercentageSelector).getAllByRole("option")).toHaveLength(1)

    // Select the AMI chart and wait for the API call to populate the dropdown
    await userEvent.selectOptions(amiChartSelector, "Mock AMI")
    await screen.findByRole("option", { name: "30" })

    const newAmiChartPercentageSelector = screen.getByRole("combobox", {
      name: "Percentage of AMI",
    })
    // Selector is now enabled and has valued
    expect(newAmiChartPercentageSelector).not.toBeDisabled()
    expect(within(newAmiChartPercentageSelector).getAllByRole("option")).toHaveLength(4)
    expect(
      within(newAmiChartPercentageSelector).getByRole("option", { name: "10" })
    ).toBeInTheDocument()
    expect(
      within(newAmiChartPercentageSelector).getByRole("option", { name: "20" })
    ).toBeInTheDocument()
    expect(
      within(newAmiChartPercentageSelector).getByRole("option", { name: "30" })
    ).toBeInTheDocument()

    // Select a percentage value and fields should be populated
    await userEvent.selectOptions(newAmiChartPercentageSelector, "20")
    const minIncomeInputs = screen.getAllByRole("spinbutton", { name: "Minimum income" })
    expect(minIncomeInputs).toHaveLength(8)
    expect(minIncomeInputs[0]).toHaveValue(24000)
    expect(minIncomeInputs[1]).toHaveValue(36000)
    expect(minIncomeInputs[2]).toHaveValue(48000)
    expect(minIncomeInputs[3]).toHaveValue(60000)
    expect(minIncomeInputs[4]).toHaveValue(72000)
    expect(minIncomeInputs[5]).toHaveValue(null)
    expect(minIncomeInputs[6]).toHaveValue(null)
    expect(minIncomeInputs[7]).toHaveValue(null)
  })

  it.todo("should show fixed amount fields when selecting fixed amount")
  it.todo("should show percent of income fields when selecting % of income")
  it.todo("should save values and close drawer on save & exit")
  it.todo("should save values and not close drawer on save & exit")
  it.todo("should close drawer on cancel")
  it.todo("should prepopulate fields different buttons for editing of unit (!draft)")
  it.todo("should make a copy")
})
