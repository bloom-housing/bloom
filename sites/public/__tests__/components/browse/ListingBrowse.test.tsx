import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingBrowse, TabsIndexEnum } from "../../../src/components/browse/ListingBrowse"
import { mockNextRouter } from "../../testUtils"
import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import userEvent from "@testing-library/user-event"

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
    expect(screen.getByText("No listings currently have open applications.")).toBeDefined()
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
    expect(screen.getByText("No listings currently have closed applications.")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
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
        multiselectData={[]}
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
          multiselectData={[]}
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
          multiselectData={[]}
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
          multiselectData={[]}
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
})
