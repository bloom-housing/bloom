import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingsList } from "../../../../src/components/browse/map/ListingsList"
import { useListingsMapContext } from "../../../../src/components/browse/map/ListingsMapContext"
import { getMapListings } from "../../../../src/lib/helpers"

const paginationMock = jest.fn()
const tIfExistsMock = jest.fn()

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

jest.mock("@bloom-housing/shared-helpers", () => ({
  tIfExists: (key: string) => tIfExistsMock(key),
  BloomCard: ({ title, children }) => (
    <div data-testid="bloom-card">
      <div data-testid="bloom-card-title">{title}</div>
      {children}
    </div>
  ),
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
    tIfExistsMock.mockReturnValue(null)
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

  describe("info cards", () => {
    it("shows notifications card when notificationsSignUpUrl is set", () => {
      ;(useListingsMapContext as jest.Mock).mockReturnValue({
        ...baseContext,
        notificationsSignUpUrl: "https://example.com/sign-up",
      })

      render(<ListingsList />)

      expect(screen.getByTestId("bloom-card-title")).toHaveTextContent(t("welcome.signUp"))
      expect(screen.getByRole("link", { name: t("welcome.signUpToday") })).toHaveAttribute(
        "href",
        "https://example.com/sign-up"
      )
    })

    it("links notifications card to /account/notifications when enableCustomListingNotifications flag is on", () => {
      ;(useListingsMapContext as jest.Mock).mockReturnValue({
        ...baseContext,
        activeFeatureFlags: [FeatureFlagEnum.enableCustomListingNotifications],
      })

      render(<ListingsList />)

      expect(screen.getByRole("link", { name: t("welcome.signUpToday") })).toHaveAttribute(
        "href",
        "/account/notifications"
      )
    })

    it("shows resources card when enableResources flag is on", () => {
      ;(useListingsMapContext as jest.Mock).mockReturnValue({
        ...baseContext,
        activeFeatureFlags: [FeatureFlagEnum.enableResources],
      })

      render(<ListingsList />)

      expect(screen.getByTestId("bloom-card-title")).toHaveTextContent(
        t("welcome.seeMoreOpportunitiesTruncated")
      )
      expect(
        screen.getByRole("link", { name: t("welcome.viewAdditionalHousingTruncated") })
      ).toHaveAttribute("href", "/additional-resources")
    })

    it("shows additional resources card when enableAdditionalResources flag is on", () => {
      ;(useListingsMapContext as jest.Mock).mockReturnValue({
        ...baseContext,
        activeFeatureFlags: [FeatureFlagEnum.enableAdditionalResources],
      })

      render(<ListingsList />)

      expect(screen.getByTestId("bloom-card-title")).toHaveTextContent(
        t("resources.additionalResourcesTitle")
      )
      expect(screen.getByRole("link", { name: t("welcome.learnMore") })).toHaveAttribute(
        "href",
        t("resources.additionalResourcesLink")
      )
    })

    it("shows no info cards when no flags or url are set", () => {
      render(<ListingsList />)

      expect(screen.queryByTestId("bloom-card")).not.toBeInTheDocument()
    })

    it("renders dynamic additional cards from locale translations", () => {
      tIfExistsMock.mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          "listingResource.additionalCard1.title": "Looking for housing elsewhere?",
          "listingResource.additionalCard1.link": "https://example.com",
          "listingResource.additionalCard1.linkLabel": "See Listings",
        }
        return translations[key] ?? null
      })

      render(<ListingsList />)

      expect(screen.getByTestId("bloom-card-title")).toHaveTextContent(
        "Looking for housing elsewhere?"
      )
      expect(screen.getByRole("link", { name: "See Listings" })).toHaveAttribute(
        "href",
        "https://example.com"
      )
    })

    it("renders multiple dynamic additional cards when multiple locale keys exist", () => {
      tIfExistsMock.mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          "listingResource.additionalCard1.title": "Card One Title",
          "listingResource.additionalCard1.link": "https://example.com/one",
          "listingResource.additionalCard1.linkLabel": "Go to One",
          "listingResource.additionalCard2.title": "Card Two Title",
          "listingResource.additionalCard2.link": "https://example.com/two",
          "listingResource.additionalCard2.linkLabel": "Go to Two",
        }
        return translations[key] ?? null
      })

      render(<ListingsList />)

      const cards = screen.getAllByTestId("bloom-card-title")
      expect(cards).toHaveLength(2)
      expect(cards[0]).toHaveTextContent("Card One Title")
      expect(cards[1]).toHaveTextContent("Card Two Title")
    })
  })
})
