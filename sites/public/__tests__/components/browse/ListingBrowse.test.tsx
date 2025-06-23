import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingBrowse, TabsIndexEnum } from "../../../src/components/browse/ListingBrowse"
import { mockNextRouter } from "../../testUtils"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlagEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("<ListingBrowse>", () => {
  it("shows empty state, open listings", () => {
    render(<ListingBrowse listings={[]} tab={TabsIndexEnum.open} jurisdiction={jurisdiction} />)
    expect(screen.getByText("No listings currently have open applications.")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  it("shows empty state, closed listings", () => {
    render(<ListingBrowse listings={[]} tab={TabsIndexEnum.closed} jurisdiction={jurisdiction} />)
    expect(screen.getByText("No listings currently have closed applications.")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  describe("listing unit previews", () => {
    it("render units preview table", () => {
      render(
        <ListingBrowse
          listings={[listing]}
          tab={TabsIndexEnum.open}
          paginationData={{
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 2,
            totalItems: 2,
            itemCount: 2,
          }}
          jurisdiction={jurisdiction}
        />
      )

      const listingName = screen.getByRole("heading", { level: 2, name: /archer studios/i })
      expect(listingName).toBeInTheDocument()

      const listingCard = listingName.parentElement.parentElement
      const unitsTable = within(listingCard).getByRole("table")

      expect(unitsTable).toBeInTheDocument()
      const headAndBody = within(unitsTable).getAllByRole("rowgroup")
      expect(headAndBody).toHaveLength(2)
      const [head, body] = headAndBody

      const columnHeaders = within(head).getAllByRole("columnheader")
      expect(columnHeaders).toHaveLength(3)

      expect(columnHeaders[0]).toHaveTextContent("Unit Type")
      expect(columnHeaders[1]).toHaveTextContent("Minimum Income")
      expect(columnHeaders[2]).toHaveTextContent("Rent")

      const rows = within(body).getAllByRole("row")
      expect(rows).toHaveLength(1)
      // Validate first row
      const [unitType, minIncome, rent] = within(rows[0]).getAllByRole("cell")

      expect(unitType).toHaveTextContent("1 BR")
      expect(minIncome).toHaveTextContent("$150")
      expect(minIncome).toHaveTextContent("per month")
      expect(rent).toHaveTextContent("% of income, or up to $1,200")
      expect(rent).toHaveTextContent("per month")
    })

    it("render no unit preview table", () => {
      render(
        <ListingBrowse
          listings={[
            {
              ...listing,
              units: [],
            },
          ]}
          tab={TabsIndexEnum.open}
          paginationData={{
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 2,
            totalItems: 2,
            itemCount: 2,
          }}
          jurisdiction={jurisdiction}
        />
      )

      const listingName = screen.getByRole("heading", { level: 2, name: /archer studios/i })
      expect(listingName).toBeInTheDocument()

      const listingCard = listingName.parentElement.parentElement
      expect(within(listingCard).queryByRole("table")).not.toBeInTheDocument()
    })

    it("render unit groups preview table", () => {
      render(
        <ListingBrowse
          listings={[
            {
              ...listing,
              unitGroups: [
                {
                  id: "1d4971f5-b651-430c-9a2f-4655534f1bda",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  maxOccupancy: 4,
                  minOccupancy: 1,
                  floorMin: 1,
                  floorMax: 4,
                  totalCount: 2,
                  totalAvailable: null,
                  bathroomMin: 1,
                  bathroomMax: 3,
                  openWaitlist: true,
                  sqFeetMin: 340,
                  sqFeetMax: 725,
                  unitGroupAmiLevels: [
                    {
                      id: "8025f0c3-4103-4321-8261-da536e489572",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      amiPercentage: 20,
                      monthlyRentDeterminationType:
                        EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent,
                      percentageOfIncomeValue: null,
                      flatRentValue: 1500,
                      amiChart: {
                        id: "cf8574bb-599f-40fa-9468-87c1e16be898",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        items: [],
                        name: "Divine Orchard",
                        jurisdictions: {
                          id: "e674b260-d26f-462a-9090-abaabe939cae",
                          name: "Bloomington",
                        },
                      },
                    },
                  ],
                  unitTypes: [
                    {
                      id: "d20ada5f-3b33-4ec6-86b8-ce9412bb8844",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      name: UnitTypeEnum.studio,
                      numBedrooms: 0,
                    },
                    {
                      id: "a7195b0a-2311-494c-9765-7304a3637312",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      name: UnitTypeEnum.oneBdrm,
                      numBedrooms: 1,
                    },
                  ],
                },
              ],
              unitGroupsSummarized: {
                unitGroupSummary: [
                  {
                    unitTypes: [
                      {
                        id: "d20ada5f-3b33-4ec6-86b8-ce9412bb8844",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: UnitTypeEnum.studio,
                        numBedrooms: 0,
                      },
                      {
                        id: "a7195b0a-2311-494c-9765-7304a3637312",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: UnitTypeEnum.oneBdrm,
                        numBedrooms: 1,
                      },
                    ],
                    rentRange: {
                      min: "$1500",
                      max: "$1500",
                    },
                    amiPercentageRange: {
                      min: 20,
                      max: 20,
                    },
                    openWaitlist: true,
                    unitVacancies: null,
                    bathroomRange: {
                      min: 1,
                      max: 3,
                    },
                    floorRange: {
                      min: 1,
                      max: 4,
                    },
                    sqFeetRange: {
                      min: 340,
                      max: 725,
                    },
                  },
                ],
                householdMaxIncomeSummary: {
                  columns: {
                    householdSize: "householdSize",
                  },
                  rows: [],
                },
              },
            },
          ]}
          tab={TabsIndexEnum.open}
          paginationData={{
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 2,
            totalItems: 2,
            itemCount: 2,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "",
                active: true,
                jurisdictions: [],
                name: FeatureFlagEnum.enableUnitGroups,
              },
            ],
          }}
        />
      )

      const listingName = screen.getByRole("heading", { level: 2, name: /archer studios/i })
      expect(listingName).toBeInTheDocument()

      const listingCard = listingName.parentElement.parentElement
      const unitsTable = within(listingCard).getByRole("table")

      expect(unitsTable).toBeInTheDocument()
      const headAndBody = within(unitsTable).getAllByRole("rowgroup")
      expect(headAndBody).toHaveLength(2)
      const [head, body] = headAndBody

      const columnHeaders = within(head).getAllByRole("columnheader")
      expect(columnHeaders).toHaveLength(3)

      expect(columnHeaders[0]).toHaveTextContent("Unit Type")
      expect(columnHeaders[1]).toHaveTextContent("Rent")
      expect(columnHeaders[2]).toHaveTextContent("Availability")

      const rows = within(body).getAllByRole("row")
      expect(rows).toHaveLength(1)
      // Validate first row
      const [unitType, rent, availability] = within(rows[0]).getAllByRole("cell")

      expect(unitType).toHaveTextContent("Studio - 1 BR")
      expect(rent).toHaveTextContent("$1,500per month")
      expect(availability).toHaveTextContent("Open Waitlist")
    })

    it("render no unit groups preview table", () => {
      render(
        <ListingBrowse
          listings={[
            {
              ...listing,
              units: [],
              unitGroups: [],
            },
          ]}
          tab={TabsIndexEnum.open}
          paginationData={{
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: 2,
            totalItems: 2,
            itemCount: 2,
          }}
          jurisdiction={{
            ...jurisdiction,
            featureFlags: [
              ...jurisdiction.featureFlags,
              {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "",
                active: true,
                jurisdictions: [],
                name: FeatureFlagEnum.enableUnitGroups,
              },
            ],
          }}
        />
      )

      const listingName = screen.getByRole("heading", { level: 2, name: /archer studios/i })
      expect(listingName).toBeInTheDocument()

      const listingCard = listingName.parentElement.parentElement
      expect(within(listingCard).queryByRole("table")).not.toBeInTheDocument()
    })
  })

  it("shows multiple open listings without pagination", () => {
    const view = render(
      <ListingBrowse
        listings={[
          { ...listing, name: "ListingA" },
          { ...listing, name: "ListingB" },
        ]}
        tab={TabsIndexEnum.open}
        paginationData={{
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: 2,
          totalItems: 2,
          itemCount: 2,
        }}
        jurisdiction={jurisdiction}
      />
    )
    expect(view.queryByText("No listings currently have open applications.")).toBeNull()
    expect(view.getByText("ListingA")).toBeDefined()
    expect(view.getByText("ListingB")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
  })

  describe("show proper pagination navigation data", () => {
    it("show only next button when on first page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 1,
            totalPages: 2,
            itemsPerPage: 2,
            totalItems: 4,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()
      expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
      const nextPageButton = screen.getByRole("button", { name: /next/i })
      expect(nextPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument()

      fireEvent.click(nextPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=2" })
      })
    })

    it("show only previous button when on last page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 2,
            totalPages: 2,
            itemsPerPage: 2,
            totalItems: 4,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()
      expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
      const previousPageButton = screen.getByRole("button", { name: /previous/i })
      expect(previousPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument()

      fireEvent.click(previousPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=1" })
      })
    })

    it("show only both navigation button when on midpoint page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 2,
            totalPages: 3,
            itemsPerPage: 2,
            totalItems: 6,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()

      const previousPageButton = screen.getByRole("button", { name: /previous/i })
      expect(previousPageButton).toBeInTheDocument()
      const nextPageButton = screen.getByRole("button", { name: /next/i })
      expect(nextPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()

      fireEvent.click(nextPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=3" })
      })

      fireEvent.click(previousPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=1" })
      })
    })
  })
})
