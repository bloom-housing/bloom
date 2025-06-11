import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter } from "../../../testUtils"
import { render, screen, within } from "@testing-library/react"
import UnitGroupForm from "../../../../src/components/listings/PaperListingForm/UnitGroupForm"
import {
  amiCharts,
  unitGroup,
  unitTypes,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { TempUnitGroup } from "../../../../src/lib/listings/formTypes"
import { FormProviderWrapper } from "../../applications/sections/helpers"
import { rest } from "msw"
import userEvent from "@testing-library/user-event"
import { AuthProvider, unitSummariesTable } from "@bloom-housing/shared-helpers"
import { act } from "react-test-renderer"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const tempUnitGroup: TempUnitGroup = {
  ...unitGroup,
  tempId: 1,
  unitGroupAmiLevels: unitGroup.unitGroupAmiLevels.map((entry, index) => ({
    ...entry,
    tempId: index + 1,
  })),
}

server.use(
  rest.get("http://localhost:3100/unitTypes", (_req, res, ctx) => {
    return res(ctx.json(unitTypes))
  }),
  rest.get("http://localhost:3100/unitAccessibilityPriorityTypes", (_req, res, ctx) => {
    return res(ctx.json([]))
  }),
  rest.get("http://localhost:3100/amiCharts", (_req, res, ctx) => {
    return res(ctx.json(amiCharts))
  })
)

describe("<UnitGroupForm>", () => {
  it("should render the unit group form", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={{
              ...tempUnitGroup,
              unitGroupAmiLevels: [],
            }}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    expect(screen.getAllByRole("heading", { level: 2, name: /details/i })).toHaveLength(2)

    // Unit Types Section
    expect(screen.getByText(/unit type/i)).toBeInTheDocument()
    expect(await screen.findByLabelText(/studio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/one bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/two bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/three bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/four bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/five bedroom/i)).toBeInTheDocument()

    // Details Section
    expect(screen.getByLabelText(/Affordable Unit Group Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minimum Occupancy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max Occupancy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Min Square Footage/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max Square Footage/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minimum Floor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Maximum Floor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Min Number of Bathrooms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max Number of Bathrooms/)).toBeInTheDocument()

    // Availability Section
    expect(screen.getByRole("heading", { level: 2, name: /availability/i })).toBeInTheDocument()

    expect(screen.getByLabelText(/Unit Group Vacancies/i)).toBeInTheDocument()
    expect(screen.getByText(/waitlist status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^open$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/closed/i)).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: /eligibility/i })).toBeInTheDocument()

    // Eligibility Section
    expect(screen.getByRole("heading", { level: 2, name: /eligibility/i })).toBeInTheDocument()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add ami level/i }))
  })

  it("should open ami form drawer", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={tempUnitGroup}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    const addAmiButton = screen.getByRole("button", { name: /add ami level/i })
    expect(addAmiButton).toBeInTheDocument()

    await act(() => userEvent.click(addAmiButton))

    const drawerHeader = screen.getByRole("heading", { level: 1, name: /add ami level/i })
    expect(drawerHeader).toBeInTheDocument()

    const drawerContainer = drawerHeader.parentElement.parentElement

    expect(
      within(drawerContainer).getByRole("heading", { level: 2, name: /^ami level$/i })
    ).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/ami chart/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByLabelText(/percentage of ami/i)).toBeInTheDocument()
    expect(within(drawerContainer).getByText(/how is rent determined\?/i)).toBeInTheDocument()

    const fixedAmountOption = within(drawerContainer).getByLabelText(/fixed amount/i)
    const percentageOption = within(drawerContainer).getByLabelText(/\% of income/i)
    expect(fixedAmountOption).toBeInTheDocument()
    expect(percentageOption).toBeInTheDocument()

    await act(() => userEvent.click(fixedAmountOption))
    expect(within(drawerContainer).getByLabelText(/monthly rent/i)).toBeInTheDocument()

    await act(() => userEvent.click(percentageOption))
    expect(within(drawerContainer).getAllByLabelText(/\% of income/i)).toHaveLength(2)
  })

  it("should render ami charts table", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={tempUnitGroup}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    expect(await screen.findAllByText(/mock ami/i))

    const amiTable = screen.getByRole("table")
    expect(amiTable).toBeInTheDocument()

    const headerAndBody = within(amiTable).getAllByRole("rowgroup")
    expect(headerAndBody).toHaveLength(2)

    const headerColumns = within(headerAndBody[0]).getAllByRole("columnheader")
    expect(headerColumns).toHaveLength(5)
    expect(headerColumns[0]).toHaveTextContent(/ami chart/i)
    expect(headerColumns[1]).toHaveTextContent(/ami level/i)
    expect(headerColumns[2]).toHaveTextContent(/how is rent determined\?/i)
    expect(headerColumns[3]).toHaveTextContent(/monthly rent/i)
    expect(headerColumns[4]).not.toHaveTextContent()

    const rows = within(headerAndBody[1]).getAllByRole("row")
    expect(rows).toHaveLength(2)

    const rowOneData = within(rows[0]).getAllByRole("cell")
    expect(rowOneData[0]).toHaveTextContent("Mock AMI")
    expect(rowOneData[1]).toHaveTextContent("30%")
    expect(rowOneData[2]).toHaveTextContent(/fixed amount/i)
    expect(rowOneData[3]).toHaveTextContent("$1500")
    expect(within(rowOneData[4]).getByRole("button", { name: /edit/i })).toBeInTheDocument()
    expect(within(rowOneData[4]).getByRole("button", { name: /delete/i })).toBeInTheDocument()

    const rowTwoData = within(rows[1]).getAllByRole("cell")
    expect(rowTwoData[0]).toHaveTextContent("Mock AMI")
    expect(rowTwoData[1]).toHaveTextContent("10%")
    expect(rowTwoData[2]).toHaveTextContent(/\% of income/i)
    expect(rowTwoData[3]).toHaveTextContent("20%")
    expect(within(rowTwoData[4]).getByRole("button", { name: /edit/i })).toBeInTheDocument()
    expect(within(rowTwoData[4]).getByRole("button", { name: /delete/i })).toBeInTheDocument()
  })

  it("should open pre-filled drawer on edit click", async () => {
    server.use(
      rest.get(
        "http://localhost/api/adapter/amiCharts/4e64914b-3169-4d6f-a8ef-d4b11b34ebcd",
        (_req, res, ctx) => {
          return res(ctx.json(amiCharts[0]))
        }
      )
    )
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={{
              ...tempUnitGroup,
              unitGroupAmiLevels: [tempUnitGroup.unitGroupAmiLevels[0]],
            }}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    const amiTable = screen.getByRole("table")
    expect(amiTable).toBeInTheDocument()

    const editButton = within(amiTable).getByRole("button", { name: /edit/i })
    expect(editButton).toBeInTheDocument()

    await act(() => userEvent.click(editButton))
    const drawerHeader = await screen.findByRole("heading", { level: 1, name: /add ami level/i })
    expect(drawerHeader).toBeInTheDocument()

    const drawerContainer = drawerHeader.parentElement.parentElement

    expect(within(drawerContainer).getByRole("combobox", { name: /ami chart/i })).toHaveValue(
      "4e64914b-3169-4d6f-a8ef-d4b11b34ebcd"
    )
    expect(
      within(drawerContainer).getByRole("combobox", { name: /percentage of ami/i })
    ).toHaveValue("30")
    expect(within(drawerContainer).getByRole("radio", { name: /fixed amount/i })).toBeChecked()
    expect(within(drawerContainer).getByRole("radio", { name: /% of income/i })).not.toBeChecked()
    expect(within(drawerContainer).getByRole("spinbutton", { name: /monthly rent/i })).toHaveValue(
      1500
    )
  })

  it("should remove ami chart on delete click", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={tempUnitGroup}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    const amiTable = screen.getByRole("table")
    expect(amiTable).toBeInTheDocument()

    const headAndBody = within(amiTable).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)

    let rows = within(headAndBody[1]).getAllByRole("row")
    expect(rows).toHaveLength(2)

    let deleteButton = within(rows[0]).getByRole("button", { name: /delete/i })
    expect(deleteButton).toBeInTheDocument()

    await act(() => userEvent.click(deleteButton))

    let deleteModalHeader = screen.getByRole("heading", {
      level: 1,
      name: /delete this ami level/i,
    })
    expect(deleteModalHeader).toBeInTheDocument()

    let deleteModalContainer = deleteModalHeader.parentElement.parentElement
    expect(
      within(deleteModalContainer).getByText(/do you really want to delete this ami level\?/i)
    ).toBeInTheDocument()
    expect(
      within(deleteModalContainer).getByRole("button", { name: /cancel/i })
    ).toBeInTheDocument()

    let confirmDeleteButton = within(deleteModalContainer).getByRole("button", {
      name: /delete/i,
    })

    await act(() => userEvent.click(confirmDeleteButton))

    rows = within(headAndBody[1]).getAllByRole("row")
    expect(rows).toHaveLength(1)

    deleteButton = within(rows[0]).getByRole("button", { name: /delete/i })
    expect(deleteButton).toBeInTheDocument()

    await act(() => userEvent.click(deleteButton))

    deleteModalHeader = screen.getByRole("heading", {
      level: 1,
      name: /delete this ami level/i,
    })
    expect(deleteModalHeader).toBeInTheDocument()

    deleteModalContainer = deleteModalHeader.parentElement.parentElement
    confirmDeleteButton = within(deleteModalContainer).getByRole("button", {
      name: /delete/i,
    })

    await act(() => userEvent.click(confirmDeleteButton))

    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })
})
