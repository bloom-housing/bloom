import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { ListingsList } from "../../../../src/components/browse/map/ListingsList"
import { useListingsMapContext } from "../../../../src/components/browse/map/ListingsMapContext"
import { getMapListings } from "../../../../src/lib/helpers"

const paginationMock = jest.fn()

// These mocks enable us to just test the branching logic in ListingsList without worrying about the internal implementation of the children, which are tested separately
jest.mock("../../../../src/components/browse/map/ListingsMapContext", () => ({
  useListingsMapContext: jest.fn(),
}))

jest.mock("../../../../src/lib/helpers", () => ({
  getMapListings: jest.fn((listings) => (
    <div data-testid="map-listings">count:{listings.length}</div>
  )),
}))

jest.mock("../../../../src/components/browse/map/Pagination", () => ({
  Pagination: (props) => {
    paginationMock(props)
    return <nav aria-label="Listings list pagination">pagination</nav>
  },
}))

jest.mock("@bloom-housing/ui-components", () => {
  const actual = jest.requireActual("@bloom-housing/ui-components")

  return {
    ...actual,
    LoadingOverlay: ({ isLoading, children }) => (
      <div data-testid="loading-overlay" data-loading={String(isLoading)}>
        {children}
      </div>
    ),
    InfoCard: ({ title, subtitle, children }) => (
      <div>
        <div>{title}</div>
        <div>{subtitle}</div>
        {children}
      </div>
    ),
  }
})

describe("ListingsList", () => {
  const baseContext = {
    searchResults: {
      listings: [{ id: "listing-1" }],
      markers: [{ id: "marker-1" }],
      currentPage: 1,
      lastPage: 2,
      totalItems: 1,
    },
    onPageChange: jest.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.notificationsSignUpUrl
    ;(useListingsMapContext as jest.Mock).mockReturnValue(baseContext)
  })

  it("renders listings content when listings exist", () => {
    render(<ListingsList />)

    expect(getMapListings).toHaveBeenCalledWith(baseContext.searchResults.listings)
    expect(screen.getByTestId("map-listings")).toHaveTextContent("count:1")
  })

  it("shows no-visible-listings state when map has markers but list is empty", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue({
      ...baseContext,
      searchResults: {
        ...baseContext.searchResults,
        listings: [],
        markers: [{ id: "marker-1" }],
      },
    })

    render(<ListingsList />)

    expect(screen.getByRole("heading", { name: t("t.noVisibleListings") })).toBeInTheDocument()
    expect(screen.getByText(t("t.tryChangingArea"))).toBeInTheDocument()
  })

  it("shows no-matching-listings state when both list and markers are empty", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue({
      ...baseContext,
      searchResults: {
        ...baseContext.searchResults,
        listings: [],
        markers: [],
      },
    })

    render(<ListingsList />)

    expect(screen.getByRole("heading", { name: t("t.noMatchingListings") })).toBeInTheDocument()
    expect(screen.getByText(t("t.tryRemovingFilters"))).toBeInTheDocument()
  })

  it("renders pagination when lastPage is non-zero", () => {
    render(<ListingsList />)

    expect(screen.getByRole("navigation", { name: "Listings list pagination" })).toBeInTheDocument()
    expect(paginationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPage: 1,
        lastPage: 2,
        onPageChange: baseContext.onPageChange,
      })
    )
  })

  it("hides pagination when lastPage is zero", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue({
      ...baseContext,
      searchResults: {
        ...baseContext.searchResults,
        lastPage: 0,
      },
    })

    render(<ListingsList />)

    expect(screen.queryByRole("navigation", { name: "Listings list pagination" })).toBeNull()
  })
})
