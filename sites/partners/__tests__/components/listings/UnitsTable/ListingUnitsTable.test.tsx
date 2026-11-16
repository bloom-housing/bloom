import React from "react"
import { createEvent, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { t } from "@bloom-housing/ui-components"
import { unit, unitTypes } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  AmiChart,
  Unit,
  UnitAccessibilityPriorityTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingUnitsTable } from "../../../../src/components/listings/UnitsTable/ListingUnitsTable"
import { TableDataRow } from "../../../../src/components/shared/DataTable"

const [studioType, oneBdrmType, twoBdrmType] = unitTypes
const bondChart = { id: "chart-bond", name: "2026 Bond" } as AmiChart
const hudChart = { id: "chart-hud", name: "2026 CRA-HUD" } as AmiChart

const makeUnit = (overrides: Partial<Unit>): Unit => ({ ...unit, ...overrides })

const unitA = makeUnit({
  id: "a",
  number: "10",
  unitTypes: oneBdrmType,
  amiChart: bondChart,
  amiPercentage: "30.0",
  monthlyRent: "1200",
  sqFeet: "600",
  accessibilityPriorityType: UnitAccessibilityPriorityTypeEnum.mobility,
})
const unitB = makeUnit({
  id: "b",
  number: "2",
  unitTypes: studioType,
  amiChart: hudChart,
  amiPercentage: "50",
  monthlyRent: "900",
  sqFeet: "400",
  accessibilityPriorityType: undefined,
})
const unitC = makeUnit({
  id: "c",
  number: "4A",
  unitTypes: twoBdrmType,
  amiChart: undefined,
  amiPercentage: "80",
  monthlyRent: undefined,
  sqFeet: "1050",
  accessibilityPriorityType: UnitAccessibilityPriorityTypeEnum.hearing,
})
const units = [unitA, unitB, unitC]

const NUMBER_COLUMN = 0
const RENT_COLUMN = 4
const SQFEET_COLUMN = 5

const queryClient = new QueryClient()

const renderTable = (tableUnits: Unit[] = units) => {
  const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault())
  const actionsCell = (row: TableDataRow) => <span>{`action-${row.id as string}`}</span>
  const view = (list: Unit[]) => (
    <QueryClientProvider client={queryClient}>
      <form onSubmit={onSubmit}>
        <ListingUnitsTable units={list} actionsCell={actionsCell} id={"unitTable"} />
      </form>
    </QueryClientProvider>
  )
  const result = render(view(tableUnits))
  return { ...result, onSubmit, rerenderWith: (list: Unit[]) => result.rerender(view(list)) }
}

const columnValues = (columnIndex: number) =>
  within(screen.getByRole("table"))
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[columnIndex].textContent)

const search = (value: string) =>
  fireEvent.change(screen.getByTestId("column-search-global-search"), { target: { value } })

const openDrawer = async () => {
  fireEvent.click(screen.getByRole("button", { name: t("t.filter") }))
  return screen.findByRole("dialog")
}

const applyDrawer = async (dialog: HTMLElement) => {
  fireEvent.click(within(dialog).getByRole("button", { name: t("t.filter") }))
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
}

const studioCheckbox = (dialog: HTMLElement) =>
  within(dialog).getByRole("checkbox", { name: t("listings.unitTypes.studio") })

const rangeInput = (
  dialog: HTMLElement,
  bound: "minimum" | "maximum",
  title = t("listings.unit.rent")
) => within(dialog).getByRole("spinbutton", { name: `${t(`t.${bound}`)} ${title}` })

const filterByStudio = async () => {
  const dialog = await openDrawer()
  fireEvent.click(studioCheckbox(dialog))
  await applyDrawer(dialog)
}

describe("ListingUnitsTable", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()

  beforeEach(() => {
    queryClient.clear()
  })

  it("renders every unit with sortable data columns", () => {
    renderTable()

    expect(screen.getByRole("table")).toHaveAttribute("id", "unitTable")
    expect(within(screen.getByRole("table")).getAllByRole("columnheader")).toHaveLength(8)
    expect(columnValues(NUMBER_COLUMN)).toEqual(["10", "2", "4A"])
    ;[
      "number",
      "unitType",
      "amiChart",
      "amiPercentage",
      "monthlyRent",
      "sqFeet",
      "accessibilityPriorityType",
    ].forEach((id) => expect(screen.getByTestId(`sort-button-${id}`)).toBeInTheDocument())
    expect(screen.getByText("action-a")).toBeInTheDocument()
    expect(screen.queryByText(t("listings.unit.filtersApplied"))).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: t("t.clearAllFilters") })).not.toBeInTheDocument()
  })

  it("sorts unit numbers naturally", () => {
    renderTable()

    fireEvent.click(screen.getByTestId("sort-button-number"))
    expect(columnValues(NUMBER_COLUMN)).toEqual(["2", "4A", "10"])
    fireEvent.click(screen.getByTestId("sort-button-number"))
    expect(columnValues(NUMBER_COLUMN)).toEqual(["10", "4A", "2"])
    fireEvent.click(screen.getByTestId("sort-button-number"))
    expect(columnValues(NUMBER_COLUMN)).toEqual(["10", "2", "4A"])
  })

  it("sorts rent numerically with empty values first ascending and last descending", () => {
    renderTable()

    fireEvent.click(screen.getByTestId("sort-button-monthlyRent"))
    expect(columnValues(RENT_COLUMN)).toEqual(["", "$900", "$1200"])
    fireEvent.click(screen.getByTestId("sort-button-monthlyRent"))
    expect(columnValues(RENT_COLUMN)).toEqual(["$1200", "$900", ""])
  })

  it("sorts square footage numerically", () => {
    renderTable()

    fireEvent.click(screen.getByTestId("sort-button-sqFeet"))
    expect(columnValues(SQFEET_COLUMN)).toEqual(["400", "600", "1050"])
    fireEvent.click(screen.getByTestId("sort-button-sqFeet"))
    expect(columnValues(SQFEET_COLUMN)).toEqual(["1050", "600", "400"])
  })

  it("searches displayed text from the first character", async () => {
    renderTable()

    search("9")
    await waitFor(() => expect(columnValues(NUMBER_COLUMN)).toEqual(["2"]), { timeout: 2000 })

    search("1 bed")
    await waitFor(() => expect(columnValues(NUMBER_COLUMN)).toEqual(["10"]), { timeout: 2000 })

    search("n/a")
    await waitFor(() => expect(columnValues(NUMBER_COLUMN)).toEqual(["2"]), { timeout: 2000 })
  })

  it("filters rows from the drawer and clears all filters", async () => {
    renderTable()

    await filterByStudio()
    expect(columnValues(NUMBER_COLUMN)).toEqual(["2"])
    expect(screen.getByText(t("listings.unit.filtersApplied"))).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: t("t.clearAllFilters") }))
    expect(columnValues(NUMBER_COLUMN)).toEqual(["10", "2", "4A"])
    expect(screen.queryByText(t("listings.unit.filtersApplied"))).not.toBeInTheDocument()
  })

  it("filters by a square footage range", async () => {
    renderTable()

    const dialog = await openDrawer()
    fireEvent.change(rangeInput(dialog, "minimum", t("listings.unit.sqft")), {
      target: { value: "1000" },
    })
    await applyDrawer(dialog)

    expect(columnValues(NUMBER_COLUMN)).toEqual(["4A"])
  })

  it("blocks applying a minimum above the maximum", async () => {
    renderTable()

    const dialog = await openDrawer()
    fireEvent.change(rangeInput(dialog, "minimum"), { target: { value: "2000" } })
    fireEvent.change(rangeInput(dialog, "maximum"), { target: { value: "1000" } })
    fireEvent.click(within(dialog).getByRole("button", { name: t("t.filter") }))

    expect(within(dialog).getByText(t("errors.minGreaterThanMaxRentError"))).toBeInTheDocument()
    expect(within(dialog).getByText(t("errors.maxLessThanMinRentError"))).toBeInTheDocument()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("clears the drawer fields without applying or closing", async () => {
    renderTable()

    const dialog = await openDrawer()
    const studio = studioCheckbox(dialog)
    fireEvent.click(studio)
    expect(studio).toBeChecked()

    fireEvent.click(within(dialog).getByRole("button", { name: t("listingFilters.clear") }))
    expect(studio).not.toBeChecked()
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await applyDrawer(dialog)
    expect(screen.queryByText(t("listings.unit.filtersApplied"))).not.toBeInTheDocument()
  })

  it("shows the applied filters when the drawer is reopened", async () => {
    renderTable()

    await filterByStudio()
    const dialog = await openDrawer()
    expect(studioCheckbox(dialog)).toBeChecked()
    expect(
      within(dialog).getByRole("checkbox", { name: t("listings.unitTypes.oneBdrm") })
    ).not.toBeChecked()
  })

  it("drops checked values that disappear when units change", async () => {
    const { rerenderWith } = renderTable()

    await filterByStudio()
    expect(columnValues(NUMBER_COLUMN)).toEqual(["2"])

    rerenderWith([unitA, unitC])
    await waitFor(() => expect(columnValues(NUMBER_COLUMN)).toEqual(["10", "4A"]))
    expect(screen.queryByText(t("listings.unit.filtersApplied"))).not.toBeInTheDocument()
  })

  it("moves focus to the filter button after clearing all filters", async () => {
    renderTable()

    await filterByStudio()
    fireEvent.click(screen.getByRole("button", { name: t("t.clearAllFilters") }))
    expect(screen.getByRole("button", { name: t("t.filter") })).toHaveFocus()
  })

  it("discards unapplied changes when the drawer is closed", async () => {
    renderTable()

    let dialog = await openDrawer()
    fireEvent.click(studioCheckbox(dialog))
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())

    dialog = await openDrawer()
    expect(studioCheckbox(dialog)).not.toBeChecked()
    expect(screen.queryByText(t("listings.unit.filtersApplied"))).not.toBeInTheDocument()
  })

  it("reopens with empty fields after clearing all filters", async () => {
    renderTable()

    await filterByStudio()
    fireEvent.click(screen.getByRole("button", { name: t("t.clearAllFilters") }))

    const dialog = await openDrawer()
    expect(studioCheckbox(dialog)).not.toBeChecked()
  })

  it("hides a range error while editing and shows it again on blur", async () => {
    renderTable()

    const dialog = await openDrawer()
    const error = t("errors.minGreaterThanMaxRentError")

    fireEvent.change(rangeInput(dialog, "minimum"), { target: { value: "2000" } })
    fireEvent.blur(rangeInput(dialog, "minimum"))
    fireEvent.change(rangeInput(dialog, "maximum"), { target: { value: "1000" } })
    fireEvent.blur(rangeInput(dialog, "maximum"))
    expect(within(dialog).getByText(error)).toBeInTheDocument()

    fireEvent.change(rangeInput(dialog, "maximum"), { target: { value: "1" } })
    expect(within(dialog).queryByText(error)).not.toBeInTheDocument()

    fireEvent.blur(rangeInput(dialog, "maximum"))
    expect(within(dialog).getByText(error)).toBeInTheDocument()
  })

  it("never submits a surrounding form", async () => {
    const { onSubmit } = renderTable()

    const dialog = await openDrawer()
    fireEvent.click(within(dialog).getByRole("button", { name: t("listingFilters.clear") }))
    fireEvent.click(studioCheckbox(dialog))
    await applyDrawer(dialog)
    fireEvent.click(screen.getByRole("button", { name: t("t.clearAllFilters") }))

    const input = screen.getByTestId("column-search-global-search")
    const enter = createEvent.keyDown(input, { key: "Enter" })
    fireEvent(input, enter)

    expect(enter.defaultPrevented).toBe(true)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
