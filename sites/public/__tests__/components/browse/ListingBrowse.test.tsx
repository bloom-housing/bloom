import React from "react"
import { setupServer } from "msw/lib/node"
import dayjs from "dayjs"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlag,
  FeatureFlagEnum,
  MarketingTypeEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingBrowse, TabsIndexEnum } from "../../../src/components/browse/ListingBrowse"
import { mockNextRouter } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("<ListingBrowse>", () => {
  it("shows empty state, open listings", () => {
    render(
      <ListingBrowse
        listings={[]}
        tab={TabsIndexEnum.open}
        jurisdiction={jurisdiction}
        multiselectData={[]}
      />
    )
    expect(
      screen.queryAllByRole("heading", {
        level: 2,
        name: /no listings currently have open applications/i,
      })
    ).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  it("shows empty state, closed listings", () => {
    render(
      <ListingBrowse
        listings={[]}
        tab={TabsIndexEnum.closed}
        jurisdiction={jurisdiction}
        multiselectData={[]}
      />
    )
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: /no listings currently have closed applications/i,
      })
    ).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  it("shows empty state, open listings with filters", () => {
    // const { replaceMock } = mockNextRouter({ bedroomTypes: "fiveBdrm" })
    render(
      <ListingBrowse
        listings={[]}
        tab={TabsIndexEnum.open}
        jurisdiction={jurisdiction}
        multiselectData={[]}
        areFiltersActive={true}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /no matching listings with open applications/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/try removing some of your filters or show all listings./i)
    ).toBeInTheDocument()

    // const showAllButton = screen.getByRole("button", { name: /^Show all listings$/i })
    // expect(showAllButton).toBeInTheDocument()

    // await userEvent.click(showAllButton)
    // await waitFor(() => {
    //   expect(replaceMock).toBeCalledWith("/")
    // })
  })

  it("shows empty state, closed listings with filters", () => {
    // const { replaceMock } = mockNextRouter({ bedroomTypes: "fiveBdrm" })
    render(
      <ListingBrowse
        listings={[]}
        tab={TabsIndexEnum.closed}
        jurisdiction={jurisdiction}
        multiselectData={[]}
        areFiltersActive={true}
      />
    )

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /no matching listings with closed applications/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/try removing some of your filters or show all listings./i)
    ).toBeInTheDocument()

    // const showAllButton = screen.getByRole("button", { name: /^Show all listings$/i })
    // expect(showAllButton).toBeInTheDocument()

    // await userEvent.click(showAllButton)
    // await waitFor(() => {
    //   expect(replaceMock).toBeCalledWith("/")
    // })
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
          multiselectData={[]}
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

      expect(unitType).toHaveTextContent("1 bed")
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
          multiselectData={[]}
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
          multiselectData={[]}
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

      expect(unitType).toHaveTextContent("Studio - 1 bed")
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
          multiselectData={[]}
        />
      )

      const listingName = screen.getByRole("heading", { level: 2, name: /archer studios/i })
      expect(listingName).toBeInTheDocument()

      const listingCard = listingName.parentElement.parentElement
      expect(within(listingCard).queryByRole("table")).not.toBeInTheDocument()
    })
  })

  it("shows multiple open listings without pagination", () => {
    render(
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
        multiselectData={[]}
      />
    )
    expect(screen.queryByText("No listings currently have open applications.")).toBeNull()
    expect(screen.getByText("ListingA")).toBeDefined()
    expect(screen.getByText("ListingB")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
  })

  describe("show proper pagination navigation data", () => {
    it("show only next button when on first page", async () => {
      const { pushMock } = mockNextRouter()

      render(
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
          multiselectData={[]}
        />
      )
      expect(screen.queryByText("No listings currently have open applications.")).toBeNull()
      expect(screen.getByText("ListingA")).toBeDefined()
      expect(screen.getByText("ListingB")).toBeDefined()
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

      render(
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
          multiselectData={[]}
        />
      )
      expect(screen.queryByText("No listings currently have open applications.")).toBeNull()
      expect(screen.getByText("ListingA")).toBeDefined()
      expect(screen.getByText("ListingB")).toBeDefined()
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

      render(
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
          multiselectData={[]}
        />
      )
      expect(screen.queryByText("No listings currently have open applications.")).toBeNull()
      expect(screen.getByText("ListingA")).toBeDefined()
      expect(screen.getByText("ListingB")).toBeDefined()

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

  it("opens filter drawer and applies selections to url on submit", async () => {
    const { pushMock } = mockNextRouter()
    const filterEnabledJurisdiction = {
      ...jurisdiction,
      featureFlags: [
        ...jurisdiction.featureFlags,
        {
          name: FeatureFlagEnum.enableListingFiltering,
          active: true,
        } as FeatureFlag,
      ],
    }
    render(
      <ListingBrowse
        listings={[
          { ...listing, name: "ListingA" },
          { ...listing, name: "ListingB" },
        ]}
        tab={TabsIndexEnum.open}
        jurisdiction={filterEnabledJurisdiction}
        paginationData={{
          currentPage: 2,
          totalPages: 3,
          itemsPerPage: 2,
          totalItems: 6,
          itemCount: 2,
        }}
        multiselectData={[]}
      />
    )
    const filterButton = screen.getByRole("button", { name: "Filter" })
    expect(filterButton).toBeInTheDocument()
    fireEvent.click(filterButton)

    expect(screen.getByLabelText("Close")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1, name: "Filter" })).toBeInTheDocument()

    expect(screen.getByRole("group", { name: "Confirmed listings" })).toBeInTheDocument()
    expect(screen.getByLabelText("Only show listings confirmed by property")).toBeInTheDocument()
    const isVerifiedCheckbox = screen.getByRole("checkbox", {
      name: "Only show listings confirmed by property",
    })
    expect(isVerifiedCheckbox).not.toBeChecked()
    fireEvent.click(isVerifiedCheckbox)
    expect(isVerifiedCheckbox).toBeChecked()

    expect(screen.getByRole("group", { name: "Availability" })).toBeInTheDocument()
    expect(screen.getByLabelText("Units available")).toBeInTheDocument()
    const unitsAvailableCheckbox = screen.getByRole("checkbox", { name: "Units available" })
    expect(unitsAvailableCheckbox).not.toBeChecked()
    fireEvent.click(unitsAvailableCheckbox)
    expect(unitsAvailableCheckbox).toBeChecked()

    expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
    expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
    const apartmentCheckbox = screen.getByRole("checkbox", { name: "Apartment" })
    expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
    const townhomeCheckbox = screen.getByRole("checkbox", { name: "Townhome" })
    expect(apartmentCheckbox).not.toBeChecked()
    expect(townhomeCheckbox).not.toBeChecked()
    fireEvent.click(apartmentCheckbox)
    fireEvent.click(townhomeCheckbox)
    expect(apartmentCheckbox).toBeChecked()
    expect(townhomeCheckbox).toBeChecked()

    expect(screen.getByRole("group", { name: "Rent" })).toBeInTheDocument()
    expect(screen.getByLabelText("Min rent")).toBeInTheDocument()
    const minRentField = screen.getByRole("textbox", { name: "Min rent" })
    expect(screen.getByLabelText("Max rent")).toBeInTheDocument()
    const maxRentField = screen.getByRole("textbox", { name: "Max rent" })
    expect(minRentField).toHaveValue("")
    expect(maxRentField).toHaveValue("")
    await waitFor(async () => {
      await userEvent.type(minRentField, "500.00")
      await userEvent.type(maxRentField, "900.00")
    })
    expect(minRentField).toHaveValue("500.00")
    expect(maxRentField).toHaveValue("900.00")

    expect(screen.getByLabelText("Listing name")).toBeInTheDocument()
    expect(screen.getByText("Enter full or partial listing name")).toBeInTheDocument()
    const listingNameField = screen.getByRole("textbox", { name: "Listing name" })
    expect(listingNameField).toHaveValue("")
    await waitFor(async () => {
      await userEvent.type(listingNameField, "Test Search")
    })
    expect(listingNameField).toHaveValue("Test Search")

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    const showMatchingButton = screen.getByRole("button", { name: "Show matching listings" })
    expect(showMatchingButton).toBeInTheDocument()
    fireEvent.click(showMatchingButton)
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/listings?isVerified=true&availabilities=unitsAvailable&homeTypes=apartment,townhome&monthlyRent=500.00-900.00&name=Test Search"
      )
    })
  })
  it("shows under construction listings at the top", () => {
    render(
      <ListingBrowse
        listings={[
          {
            ...listing,
            name: "ListingA",
            marketingType: MarketingTypeEnum.comingSoon,
            publishedAt: dayjs(new Date()).subtract(5, "days").toDate(),
          },
          {
            ...listing,
            name: "ListingB",
            marketingType: MarketingTypeEnum.marketing,
            publishedAt: dayjs(new Date()).subtract(1, "days").toDate(),
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
        multiselectData={[]}
      />
    )
    const itemA = screen.getByText("ListingA")
    const itemB = screen.getByText("ListingB")
    // Expects B follows A
    expect(itemA.compareDocumentPosition(itemB)).toEqual(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
