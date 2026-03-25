import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/lib/node"
import userEvent from "@testing-library/user-event"
import {
  amiChart1,
  amiCharts,
  unit,
  unitTypes,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  AmiChart,
  Jurisdiction,
  UnitAccessibilityPriorityTypeEnum,
  UnitType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render, screen, waitFor, within } from "../../../testUtils"
import UnitForm from "../../../../src/components/listings/PaperListingForm/UnitForm"
import { TempUnit } from "../../../../src/lib/listings/formTypes"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

const tempUnit: TempUnit = {
  ...unit,
}

const jurisdictionData = {
  id: "123",
  visibleAccessibilityPriorityTypes: [
    UnitAccessibilityPriorityTypeEnum.mobility,
    UnitAccessibilityPriorityTypeEnum.hearing,
    UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
  ],
}

const defaultUnitFormProps = {
  amiCharts: amiCharts as unknown as AmiChart[],
  amiChartsLoading: false,
  unitTypes: unitTypes as unknown as UnitType[],
  unitTypesLoading: false,
  jurisdictionData: jurisdictionData as unknown as Jurisdiction,
  jurisdictionLoading: false,
}

const waitForFormLoad = async () => {
  await screen.findByRole("option", { name: "Studio" })
}

describe("UnitForm", () => {
  server.use(
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
        {...defaultUnitFormProps}
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
    const unitTypeSelector = screen.getByRole("combobox", { name: /unit type/i })
    expect(unitTypeSelector).toBeInTheDocument()
    expect(within(unitTypeSelector).getAllByRole("option")).toHaveLength(8)
    expect(within(unitTypeSelector).getByRole("option", { name: /unit type/i })).toBeInTheDocument()
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

    expect(screen.getByLabelText("Square footage")).toBeInTheDocument()

    // Minimum occupancy selector
    const minOccupancySelector = screen.getByRole("combobox", { name: "Minimum occupancy" })
    expect(minOccupancySelector).toBeInTheDocument()
    expect(within(minOccupancySelector).getAllByRole("option")).toHaveLength(12)
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

    const amiChartSelector = screen.getByRole("combobox", { name: /ami chart/i })
    expect(amiChartSelector).toBeInTheDocument()
    expect(within(amiChartSelector).getAllByRole("option")).toHaveLength(3)
    expect(within(amiChartSelector).getByRole("option", { name: /ami chart/i })).toBeInTheDocument()
    // These values are populated by the amiCharts api call
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI" })).toBeInTheDocument()
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI 2" })).toBeInTheDocument()

    const amiChartPercentageSelector = screen.getByRole("combobox", { name: /percentage of ami/i })
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
      within(priorityTypeSelector).getByRole("option", { name: "Mobility" })
    ).toBeInTheDocument()
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Hearing" })
    ).toBeInTheDocument()
    expect(
      within(priorityTypeSelector).getByRole("option", { name: "Mobility and hearing" })
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
        {...defaultUnitFormProps}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={tempUnit}
      />
    )

    // Wait for API calls to finish
    await screen.findByRole("option", { name: "Mock AMI" })

    const amiChartSelector = screen.getByRole("combobox", { name: /ami chart/i })
    expect(amiChartSelector).toBeInTheDocument()
    expect(within(amiChartSelector).getAllByRole("option")).toHaveLength(3)
    expect(within(amiChartSelector).getByRole("option", { name: /ami chart/i })).toBeInTheDocument()
    // These values are populated by the amiCharts api call
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI" })).toBeInTheDocument()
    expect(within(amiChartSelector).getByRole("option", { name: "Mock AMI 2" })).toBeInTheDocument()

    const amiChartPercentageSelector = screen.getByRole("combobox", { name: /percentage of ami/i })
    // Selector is disabled and No options are available until a chart is selected
    expect(amiChartPercentageSelector).toBeDisabled()
    expect(within(amiChartPercentageSelector).getAllByRole("option")).toHaveLength(1)

    // Select the AMI chart and wait for the API call to populate the dropdown
    await userEvent.selectOptions(amiChartSelector, "Mock AMI")
    await screen.findByRole("option", { name: "30" })

    const newAmiChartPercentageSelector = screen.getByRole("combobox", {
      name: /percentage of ami/i,
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

  it("should show fixed amount fields when selecting fixed amount", async () => {
    render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={undefined}
      />
    )

    await waitForFormLoad()

    await userEvent.click(screen.getByRole("radio", { name: "Fixed amount" }))

    expect(
      screen.getByLabelText(/minimum monthly income|monthly minimum income/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/monthly rent/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/income rent/i)).not.toBeInTheDocument()
  })

  it("should show percent of income fields when selecting % of income", async () => {
    render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={undefined}
      />
    )

    await waitForFormLoad()

    await userEvent.click(screen.getByRole("radio", { name: "% of income" }))

    expect(screen.getByLabelText(/income rent/i)).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/minimum monthly income|monthly minimum income/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/monthly rent/i)).not.toBeInTheDocument()
  })

  it("should not close drawer on save & exit when form is invalid", async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()

    render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={onClose}
        onSubmit={onSubmit}
        draft={true}
        nextId={12}
        defaultUnit={undefined}
      />
    )

    await waitForFormLoad()

    await userEvent.click(screen.getByRole("button", { name: "Save & exit" }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getAllByText("This field is required")).toHaveLength(2)
  })

  it("should close drawer on cancel", async () => {
    const onClose = jest.fn()

    render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={onClose}
        onSubmit={jest.fn()}
        draft={true}
        nextId={1}
        defaultUnit={tempUnit}
      />
    )

    await waitForFormLoad()

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onClose).toHaveBeenCalledWith(false, false, null)
  })

  it("should prepopulate fields and show copy button when editing non-draft unit", async () => {
    const prepopulatedUnit = {
      ...tempUnit,
      number: "A-101",
      sqFeet: "321",
      monthlyIncomeMin: "2208.0",
      monthlyRent: "1104.0",
      unitTypes: unitTypes[0],
    } as TempUnit

    render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        draft={false}
        nextId={1}
        defaultUnit={prepopulatedUnit}
      />
    )

    await waitForFormLoad()

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "Unit number" })).toHaveValue("A-101")
      expect(screen.getByRole("combobox", { name: /unit type/i })).toHaveValue(unitTypes[0].id)
      expect(screen.getByLabelText(/square footage/i)).toHaveValue(321)
      expect(screen.getByLabelText(/minimum monthly income|monthly minimum income/i)).toHaveValue(
        2208
      )
      expect(screen.getByLabelText(/monthly rent/i)).toHaveValue(1104)
    })

    expect(screen.getByRole("button", { name: "Make a copy" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument()
  })

  it("should retain copied data when reopened as draft", async () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()
    const prepopulatedUnit = {
      ...tempUnit,
      number: "B-202",
      sqFeet: "456",
      monthlyIncomeMin: "3200.0",
      monthlyRent: "1600.0",
      unitTypes: unitTypes[1],
    } as TempUnit

    const { rerender } = render(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={onClose}
        onSubmit={onSubmit}
        draft={false}
        nextId={20}
        defaultUnit={prepopulatedUnit}
      />
    )

    await waitForFormLoad()

    await userEvent.click(screen.getByRole("button", { name: "Make a copy" }))

    const copiedUnit = onClose.mock.calls[0][2]

    rerender(
      <UnitForm
        {...defaultUnitFormProps}
        onClose={onClose}
        onSubmit={onSubmit}
        draft={true}
        nextId={21}
        defaultUnit={copiedUnit}
      />
    )

    await waitForFormLoad()

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "Unit number" })).toHaveValue("B-202")
      expect(screen.getByRole("combobox", { name: /unit type/i })).toHaveValue(unitTypes[1].id)
      expect(screen.getByLabelText(/square footage/i)).toHaveValue(456)
      expect(screen.getByLabelText(/minimum monthly income|monthly minimum income/i)).toHaveValue(
        3200
      )
      expect(screen.getByLabelText(/monthly rent/i)).toHaveValue(1600)
    })

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Make a copy" })).not.toBeInTheDocument()
  })
})
