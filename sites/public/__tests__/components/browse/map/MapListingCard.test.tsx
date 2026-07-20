import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MapListingCard } from "../../../../src/components/browse/map/MapListingCard"
import {
  ListingsMapContext,
  ListingsMapContextValue,
} from "../../../../src/components/browse/map/ListingsMapContext"
import {
  getListingStackedGroupTableData,
  getListingStackedTableData,
  isFeatureFlagOn,
} from "../../../../src/lib/helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

// These mocks enable us to just test the branching logic in MapListingCard without worrying about the internal implementation of the children, which are tested separately
jest.mock("@bloom-housing/shared-helpers", () => {
  const React = require("react")

  return {
    imageUrlFromListing: jest.fn(() => ["/images/mock-listing.jpg"]),
    oneLineAddress: jest.fn(() => "123 Test Street"),
    ClickableCard: ({ children, className }) => (
      <div className={className} data-testid="clickable-card">
        {children}
      </div>
    ),
  }
})

jest.mock("../../../../src/lib/helpers", () => ({
  getListingStackedGroupTableData: jest.fn(() => []),
  getListingStackedTableData: jest.fn(() => []),
  isFeatureFlagOn: jest.fn(() => false),
}))

jest.mock("../../../../src/components/listing/listing_sections/MainDetails", () => ({
  getListingTags: jest.fn(() => []),
}))

describe("MapListingCard", () => {
  const mockContextValue: ListingsMapContextValue = {
    bedrooms: [],
    bathrooms: [],
    jurisdictions: [],
    multiselectData: [],
    searchResults: { listings: [], markers: [], currentPage: 1, lastPage: 1, totalItems: 0 },
    listView: false,
    setListView: jest.fn(),
    isDesktop: true,
    isLoading: false,
    setIsLoading: jest.fn(),
    visibleMarkers: [],
    setVisibleMarkers: jest.fn(),
    isFirstBoundsLoad: true,
    setIsFirstBoundsLoad: jest.fn(),
    setFilterDrawerOpen: jest.fn(),
    filterCount: 0,
    onPageChange: jest.fn(),
    infoWindowIndex: null,
    setInfoWindowIndex: jest.fn(),
    activeFeatureFlags: [],
  }

  const renderWithContext = (ui: React.ReactElement) =>
    render(<ListingsMapContext.Provider value={mockContextValue}>{ui}</ListingsMapContext.Provider>)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(isFeatureFlagOn as jest.Mock).mockReturnValue(false)
  })

  it("renders core listing content and uses units summarized table data", () => {
    renderWithContext(<MapListingCard listing={listing} index={0} />)

    expect(screen.getByRole("heading", { name: listing.name })).toBeInTheDocument()
    expect(screen.getByText("123 Test Street")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: /picture of the building/i })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
    expect(getListingStackedTableData).toHaveBeenCalledWith(listing.unitsSummarized)
  })

  it("renders close button in force mobile view and triggers onClose", () => {
    const onClose = jest.fn()
    renderWithContext(
      <MapListingCard listing={listing} index={0} forceMobileView={true} onClose={onClose} />
    )

    fireEvent.click(screen.getByRole("button", { name: /close/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not render a units preview table when no units or unit groups exist", () => {
    const listingWithoutUnits = {
      ...listing,
      units: [],
      unitGroups: [],
    }

    renderWithContext(<MapListingCard listing={listingWithoutUnits} index={0} />)

    expect(screen.queryByRole("table")).not.toBeInTheDocument()
    expect(getListingStackedTableData).not.toHaveBeenCalled()
    expect(getListingStackedGroupTableData).not.toHaveBeenCalled()
  })
})
