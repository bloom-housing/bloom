import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { setupServer } from "msw/lib/node"
import React from "react"
import { AuthProvider } from "@bloom-housing/shared-helpers"
import {
  amiCharts,
  unitGroup,
  unitTypes,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter } from "../../../testUtils"
import { FormProviderWrapper } from "../../applications/sections/helpers"
import { TempUnitGroup } from "../../../../src/lib/listings/formTypes"
import UnitGroupForm from "../../../../src/components/listings/PaperListingForm/UnitGroupForm"

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
    expect(screen.getByLabelText(/1 bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/2 bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/3 bedroom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/4 bedroom/i)).toBeInTheDocument()

    // Details Section
    expect(screen.getByLabelText(/Affordable Unit Group Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minimum occupancy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max occupancy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Min square footage/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max square footage/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minimum floor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Maximum floor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Min number of bathrooms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max number of bathrooms/)).toBeInTheDocument()

    // Availability Section
    expect(screen.getByRole("heading", { level: 2, name: /availability/i })).toBeInTheDocument()

    expect(screen.getByLabelText(/Unit group vacancies/i)).toBeInTheDocument()
    expect(screen.getByText(/Waitlist status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Open$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Closed/i)).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Eligibility" })).toBeInTheDocument()

    // Eligibility Section
    expect(screen.getByRole("heading", { level: 2, name: "Eligibility" })).toBeInTheDocument()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add AMI level" }))
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

    await userEvent.click(addAmiButton)

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
    const percentageOption = within(drawerContainer).getByLabelText(/% of income/i)
    expect(fixedAmountOption).toBeInTheDocument()
    expect(percentageOption).toBeInTheDocument()

    await userEvent.click(fixedAmountOption)
    expect(within(drawerContainer).getByLabelText(/monthly rent/i)).toBeInTheDocument()

    await userEvent.click(percentageOption)
    expect(within(drawerContainer).getAllByLabelText(/% of income/i)).toHaveLength(2)
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

    const rows = within(headerAndBody[1]).getAllByRole("row")
    expect(rows).toHaveLength(2)

    const [
      amiChartRowOne,
      amiLevelRowOne,
      rentDeterminationRowOne,
      monthlyRentRowOne,
      actionsRowOne,
    ] = within(rows[0]).getAllByRole("cell")

    expect(amiChartRowOne).toHaveTextContent("Mock AMI")
    expect(amiLevelRowOne).toHaveTextContent("30%")
    expect(rentDeterminationRowOne).toHaveTextContent(/fixed amount/i)
    expect(monthlyRentRowOne).toHaveTextContent("$1500")
    expect(within(actionsRowOne).getByRole("button", { name: /edit/i })).toBeInTheDocument()
    expect(within(actionsRowOne).getByRole("button", { name: /delete/i })).toBeInTheDocument()

    const [
      amiChartRowTwo,
      amiLevelRowTwo,
      rentDeterminationRowTwo,
      monthlyRentRowTwo,
      actionsRowTwo,
    ] = within(rows[1]).getAllByRole("cell")

    expect(amiChartRowTwo).toHaveTextContent("Mock AMI")
    expect(amiLevelRowTwo).toHaveTextContent("10%")
    expect(rentDeterminationRowTwo).toHaveTextContent(/% of income/i)
    expect(monthlyRentRowTwo).toHaveTextContent("20%")
    expect(within(actionsRowTwo).getByRole("button", { name: /edit/i })).toBeInTheDocument()
    expect(within(actionsRowTwo).getByRole("button", { name: /delete/i })).toBeInTheDocument()
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

    await userEvent.click(editButton)
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

  describe("ami levels table delete functionality", () => {
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

      await userEvent.click(deleteButton)

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

      await userEvent.click(confirmDeleteButton)

      rows = within(headAndBody[1]).getAllByRole("row")
      expect(rows).toHaveLength(1)

      deleteButton = within(rows[0]).getByRole("button", { name: /delete/i })
      expect(deleteButton).toBeInTheDocument()

      await userEvent.click(deleteButton)

      deleteModalHeader = screen.getByRole("heading", {
        level: 1,
        name: /delete this ami level/i,
      })
      expect(deleteModalHeader).toBeInTheDocument()

      deleteModalContainer = deleteModalHeader.parentElement.parentElement
      confirmDeleteButton = within(deleteModalContainer).getByRole("button", {
        name: /delete/i,
      })

      await userEvent.click(confirmDeleteButton)

      expect(screen.queryByRole("table")).not.toBeInTheDocument()
    })

    it("should discard deletion process on modal cancel click", async () => {
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

      const headAndBody = within(amiTable).getAllByRole("rowgroup")
      expect(headAndBody).toHaveLength(2)

      const rows = within(headAndBody[1]).getAllByRole("row")
      expect(rows).toHaveLength(1)

      const deleteButton = within(rows[0]).getByRole("button", { name: /delete/i })
      expect(deleteButton).toBeInTheDocument()

      await userEvent.click(deleteButton)

      let deleteModalHeader = screen.getByRole("heading", {
        level: 1,
        name: /delete this ami level/i,
      })
      expect(deleteModalHeader).toBeInTheDocument()

      const closeModalButton = within(deleteModalHeader.parentElement).getByRole("button")
      expect(closeModalButton).toBeInTheDocument()

      await userEvent.click(closeModalButton)

      // Verify that the table still exists, i.e no rows have been removed
      expect(screen.getByRole("table")).toBeInTheDocument()

      // Repeat the deletion process
      await userEvent.click(deleteButton)

      deleteModalHeader = screen.getByRole("heading", {
        level: 1,
        name: /delete this ami level/i,
      })
      expect(deleteModalHeader).toBeInTheDocument()

      const cancelButton = within(deleteModalHeader.parentElement.parentElement).getByRole(
        "button",
        { name: /cancel/i }
      )
      await userEvent.click(cancelButton)

      // Verify that the table still exists, i.e no rows have been removed
      expect(screen.getByRole("table")).toBeInTheDocument()
    })
  })

  it("should show errors when saved before any data input", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={null}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    expect(await screen.findByLabelText(/studio/i)).toBeInTheDocument()

    const saveAndExitButton = screen.getByRole("button", { name: /save & exit/i })
    expect(saveAndExitButton).toBeInTheDocument()
    await userEvent.click(saveAndExitButton)

    expect(await screen.findByText(/this field is required/i))
  })

  it("should show errors on invalid inputs", async () => {
    render(
      <AuthProvider>
        <FormProviderWrapper>
          <UnitGroupForm
            onClose={jest.fn()}
            onSubmit={jest.fn()}
            defaultUnitGroup={null}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    // ----------------------------- Occupancy Section -----------------------------
    const minOccupancyInput = screen.getByLabelText("Minimum occupancy")
    const maxOccupancyInput = screen.getByLabelText("Max occupancy")

    expect(minOccupancyInput).toBeInTheDocument()
    expect(maxOccupancyInput).toBeInTheDocument()

    await userEvent.selectOptions(minOccupancyInput, "7")
    await userEvent.selectOptions(maxOccupancyInput, "1")

    expect(
      await screen.findByText(/Occupancy must be greater than or equal to/i)
    ).toBeInTheDocument()

    // ----------------------------- Square Footage Section -----------------------------
    const minSqftInput = screen.getByRole("spinbutton", {
      name: /min square footage/i,
    })
    const maxSqftInput = screen.getByRole("spinbutton", {
      name: /max square footage/i,
    })

    expect(minSqftInput).toBeInTheDocument()
    expect(maxSqftInput).toBeInTheDocument()

    await userEvent.type(minSqftInput, "100")
    await userEvent.type(maxSqftInput, "50")

    expect(
      await screen.findByText(
        /minimum square footage must be less than or equal to max square footage/i
      )
    ).toBeInTheDocument()
    expect(
      await screen.findByText(
        /max square footage must be greater than or equal to minimum square footage/i
      )
    ).toBeInTheDocument()

    // ----------------------------- Floor Section -----------------------------
    const minFloorInput = screen.getByRole("combobox", {
      name: /minimum floor/i,
    })
    const maxFloorInput = screen.getByRole("combobox", {
      name: /maximum floor/i,
    })

    expect(minFloorInput).toBeInTheDocument()
    expect(maxFloorInput).toBeInTheDocument()

    await userEvent.selectOptions(minFloorInput, "3")
    await userEvent.selectOptions(maxFloorInput, "1")

    expect(await screen.findByText(/floor must be greater than or equal to/i)).toBeInTheDocument()

    // ----------------------------- Bathroom Section -----------------------------
    const minBathroomsInput = screen.getByRole("combobox", {
      name: /min number of bathrooms/i,
    })
    const maxBathroomsInput = screen.getByRole("combobox", {
      name: /max number of bathrooms/i,
    })

    expect(minBathroomsInput).toBeInTheDocument()
    expect(maxBathroomsInput).toBeInTheDocument()

    await userEvent.selectOptions(minBathroomsInput, "4")
    await userEvent.selectOptions(maxBathroomsInput, "1")

    expect(
      await screen.findByText(
        /minimum number of bathrooms must be less than or equal to max number of bathrooms/i
      )
    ).toBeInTheDocument()
    expect(
      await screen.findByText(
        /max number of bathrooms must be greater than or equal to minimum number of bathrooms/i
      )
    ).toBeInTheDocument()

    const addAmiButton = screen.getByRole("button", { name: /add ami level/i })
    expect(addAmiButton).toBeInTheDocument()

    await userEvent.click(addAmiButton)

    const drawerHeader = screen.getByRole("heading", { level: 1, name: /add ami level/i })
    expect(drawerHeader).toBeInTheDocument()

    const drawerContainer = drawerHeader.parentElement.parentElement

    const saveButton = within(drawerContainer).getByRole("button", { name: /save/i })
    expect(saveButton).toBeInTheDocument()
    await userEvent.click(saveButton)

    expect(await within(drawerContainer).findAllByText(/this field is required/i)).toHaveLength(3)
  })

  it("should callback form with proper values", async () => {
    const mockSubmit = jest.fn()

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
            onSubmit={mockSubmit}
            defaultUnitGroup={null}
            draft={true}
            nextId={1}
          />
        </FormProviderWrapper>
      </AuthProvider>
    )

    const studioButton = await screen.findByLabelText(/studio/i)
    expect(studioButton).toBeInTheDocument()
    await userEvent.click(studioButton)

    const quantityInput = screen.getByRole("spinbutton", {
      name: /affordable unit group quantity/i,
    })

    await userEvent.type(quantityInput, "4")

    // ----------------------------- Occupancy Section -----------------------------
    const minOccupancyInput = screen.getByRole("combobox", {
      name: /minimum occupancy/i,
    })
    const maxOccupancyInput = screen.getByRole("combobox", {
      name: /max occupancy/i,
    })

    expect(minOccupancyInput).toBeInTheDocument()
    expect(maxOccupancyInput).toBeInTheDocument()

    await userEvent.selectOptions(minOccupancyInput, "1")
    await userEvent.selectOptions(maxOccupancyInput, "4")

    // ----------------------------- Square Footage Section -----------------------------
    const minSqftInput = screen.getByRole("spinbutton", {
      name: /min square footage/i,
    })
    const maxSqftInput = screen.getByRole("spinbutton", {
      name: /max square footage/i,
    })

    expect(minSqftInput).toBeInTheDocument()
    expect(maxSqftInput).toBeInTheDocument()

    await userEvent.type(minSqftInput, "380")
    await userEvent.type(maxSqftInput, "720")

    // ----------------------------- Floor Section -----------------------------
    const minFloorInput = screen.getByRole("combobox", {
      name: /minimum floor/i,
    })
    const maxFloorInput = screen.getByRole("combobox", {
      name: /maximum floor/i,
    })

    expect(minFloorInput).toBeInTheDocument()
    expect(maxFloorInput).toBeInTheDocument()

    await userEvent.selectOptions(minFloorInput, "1")
    await userEvent.selectOptions(maxFloorInput, "8")

    // ----------------------------- Bathroom Section -----------------------------
    const minBathroomsInput = screen.getByRole("combobox", {
      name: /min number of bathrooms/i,
    })
    const maxBathroomsInput = screen.getByRole("combobox", {
      name: /max number of bathrooms/i,
    })

    expect(minBathroomsInput).toBeInTheDocument()
    expect(maxBathroomsInput).toBeInTheDocument()

    await userEvent.selectOptions(minBathroomsInput, "1")
    await userEvent.selectOptions(maxBathroomsInput, "2")

    const vacanciesInput = screen.getByRole("spinbutton", { name: /unit group vacancies/i })
    await userEvent.type(vacanciesInput, "3")

    const openWaitlistOption = screen.getByRole("radio", { name: /^open$/i })
    await userEvent.click(openWaitlistOption)

    // ---------------------- AMI DRAWER SECTION -------------------------

    const addAmiButton = screen.getByRole("button", { name: /add ami level/i })
    expect(addAmiButton).toBeInTheDocument()

    await userEvent.click(addAmiButton)

    const drawerHeader = screen.getByRole("heading", { level: 1, name: /add ami level/i })
    expect(drawerHeader).toBeInTheDocument()

    const drawerContainer = drawerHeader.parentElement.parentElement

    expect(
      within(drawerContainer).getByRole("heading", { level: 2, name: /^ami level$/i })
    ).toBeInTheDocument()

    const amiChartInput = within(drawerContainer).getByRole("combobox", { name: /ami chart/i })
    expect(amiChartInput).toBeInTheDocument()

    await userEvent.selectOptions(amiChartInput, "Mock AMI")

    const amiPercentageInput = within(drawerContainer).getByRole("combobox", {
      name: /percentage of ami/i,
    })
    expect(amiPercentageInput).toBeInTheDocument()
    await userEvent.selectOptions(amiPercentageInput, "30")

    const fixedAmountOption = within(drawerContainer).getByRole("radio", { name: /fixed amount/i })
    expect(fixedAmountOption).toBeInTheDocument()
    await userEvent.click(fixedAmountOption)

    const monthlyRentInput = within(drawerContainer).getByRole("spinbutton", {
      name: /monthly rent/i,
    })
    expect(monthlyRentInput).toBeInTheDocument()
    await userEvent.type(monthlyRentInput, "1500")

    const saveButton = within(drawerContainer).getByRole("button", { name: /save/i })
    expect(saveButton).toBeInTheDocument()
    await userEvent.click(saveButton)

    expect(await screen.findByRole("table")).toBeInTheDocument()

    const saveAndExitButton = screen.getByRole("button", { name: /save & exit/i })
    expect(saveAndExitButton).toBeInTheDocument()
    await userEvent.click(saveAndExitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          bathroomMax: "2",
          bathroomMin: "1",
          floorMax: "8",
          floorMin: "1",
          maxOccupancy: "4",
          minOccupancy: "1",
          openWaitlist: true,
          sqFeetMax: "720",
          sqFeetMin: "380",
          tempId: 1,
          totalAvailable: "3",
          totalCount: "4",
          unitGroupAmiLevels: [
            expect.objectContaining({
              amiChart: expect.objectContaining({
                id: "4e64914b-3169-4d6f-a8ef-d4b11b34ebcd",
                name: "Mock AMI",
              }),
              amiPercentage: "30",
              flatRentValue: "1500",
              monthlyRentDeterminationType: "flatRent",
              tempId: 1,
            }),
          ],
          unitTypes: [
            expect.objectContaining({
              name: "studio",
              numBedrooms: 0,
            }),
          ],
        })
      )
    })
  })
})
