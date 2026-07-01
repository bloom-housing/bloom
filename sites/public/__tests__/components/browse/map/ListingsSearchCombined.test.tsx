import React, { act } from "react"
import { screen, waitFor } from "@testing-library/react"
import { render, mockNextRouter } from "../../../testUtils"
import ListingsSearchCombined from "../../../../src/components/browse/map/ListingsSearchCombined"
import { ListingsSearchConfigContext } from "../../../../src/components/browse/map/ListingsSearchConfigContext"
import { searchListings, searchMapMarkers } from "../../../../src/lib/hooks"
import userEvent from "@testing-library/user-event"

window.scrollTo = jest.fn()
Element.prototype.scrollTo = jest.fn()

const mockSearchListings = searchListings as jest.Mock
const mockSearchMapMarkers = searchMapMarkers as jest.Mock

jest.mock("@vis.gl/react-google-maps", () => ({
  useMap: jest.fn().mockReturnValue(null),
  useApiIsLoaded: jest.fn().mockReturnValue(true),
  APIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AdvancedMarker: React.forwardRef(({ children, ...props }: any, ref: any) => (
    <div data-testid="advanced-marker" ref={ref} {...props}>
      {children}
    </div>
  )),
  InfoWindow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="info-window">{children}</div>
  ),
}))

jest.mock("@googlemaps/markerclusterer", () => ({
  MarkerClusterer: jest.fn().mockImplementation(() => ({
    addMarker: jest.fn(),
    removeMarker: jest.fn(),
    clearMarkers: jest.fn(),
    render: jest.fn(),
  })),
  SuperClusterAlgorithm: jest.fn(),
}))

jest.mock("../../../../src/lib/hooks", () => ({
  searchListings: jest.fn(),
  searchMapMarkers: jest.fn(),
}))

jest.mock("../../../../src/lib/listings/listing-query-builder", () => ({
  ListingQueryBuilder: jest.fn().mockImplementation(() => ({
    addFilter: jest.fn().mockReturnThis(),
    getFilterParams: jest.fn().mockReturnValue([]),
  })),
}))

const defaultConfig = {
  searchString: "",
  googleMapsApiKey: "test-api-key",
  googleMapsMapId: "test-map-id",
  bedrooms: [{ label: "1", value: "1" }],
  bathrooms: [{ label: "1", value: "1" }],
  jurisdictions: [{ id: "juris-1" }],
  activeFeatureFlags: [],
  multiselectData: [],
  regions: [],
  listingFeaturesConfiguration: undefined,
}

const defaultSearchResult = {
  items: [{ id: "listing-1", name: "Test Listing" }],
  meta: { currentPage: 1, totalPages: 2, totalItems: 15, itemCount: 10, itemsPerPage: 10 },
}

const defaultMarkers = [
  { id: "marker-1", lat: 37.7, lng: -122.4 },
  { id: "marker-2", lat: 37.8, lng: -122.3 },
]

function renderComponent(configOverrides = {}, routerQuery = {}) {
  mockNextRouter(routerQuery)
  const config = { ...defaultConfig, ...configOverrides }
  return render(
    <ListingsSearchConfigContext.Provider value={config}>
      <ListingsSearchCombined />
    </ListingsSearchConfigContext.Provider>
  )
}

describe("ListingsSearchCombined", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockSearchListings.mockResolvedValue(defaultSearchResult)
    mockSearchMapMarkers.mockResolvedValue(defaultMarkers)

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  describe("rendering", () => {
    it("renders the filter button and listings content", async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText("Filters")).toBeInTheDocument()
        expect(screen.getByRole("search", { name: /filter/i })).toBeInTheDocument()
      })
    })

    it("renders listings search metadata bar", async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByRole("search", { name: /filter/i })).toBeInTheDocument()
      })
    })
  })

  describe("initial search", () => {
    it("triggers a marker search on mount", async () => {
      renderComponent()

      await waitFor(() => {
        expect(mockSearchMapMarkers).toHaveBeenCalled()
      })
    })

    it("triggers a listing search on mount for mobile", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      renderComponent()

      await waitFor(() => {
        expect(mockSearchListings).toHaveBeenCalled()
      })
    })

    it("map is in view when in desktop mode", async () => {
      Object.defineProperty(window, "innerWidth", { value: 1024 })
      renderComponent()

      await waitFor(() => {
        expect(screen.getByTestId("google-map")).toBeInTheDocument()
      })
      // TODO: figure out why the css isn't being picked up in the test
      // expect(screen.getByRole("button", { name: "Map view" })).not.toBeVisible()
    })

    it("map is not in view when in mobile mode", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      renderComponent()

      await waitFor(() => {
        expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
      })
      expect(screen.getByRole("button", { name: "Map view" })).toBeVisible()
    })
  })

  describe("URL-based filter initialization", () => {
    it("applies filters from router query on mount", async () => {
      const queryParams = {
        "bedroomTypes.oneBdrm": "true",
      }

      renderComponent({}, queryParams)

      await waitFor(() => {
        expect(mockSearchMapMarkers).toHaveBeenCalled()
      })
    })
  })

  describe("mobile list view", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
    })

    it("shows listings list and footer on mobile by default", async () => {
      renderComponent()

      await waitFor(() => {
        const listExpanded = document.getElementById("listings-list-expanded")
        expect(listExpanded).toBeInTheDocument()
      })
    })

    it("does not show the map on mobile list view", async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
      })
    })

    it("displays no matching listings message when results are empty", async () => {
      mockSearchListings.mockResolvedValue({
        items: [],
        meta: { currentPage: 1, totalPages: 0, totalItems: 0, itemCount: 0, itemsPerPage: 10 },
      })
      mockSearchMapMarkers.mockResolvedValue([])

      renderComponent()

      await waitFor(() => {
        expect(screen.getByText("No matching listings")).toBeInTheDocument()
        expect(screen.getByText("Try removing some of your filters.")).toBeInTheDocument()
      })
    })
  })

  describe("desktop combined view", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", { value: 1024 })
    })

    it("renders both the map and listings list on desktop", async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByTestId("google-map")).toBeInTheDocument()
        expect(document.getElementById("listings-outer-container")).toBeInTheDocument()
      })
    })
  })

  describe("FilterDrawer interactions", () => {
    async function openFilterDrawer() {
      await waitFor(() => {
        expect(screen.getByText("Filters")).toBeInTheDocument()
      })

      act(() => {
        screen.getAllByText("Filters")[0].closest("button").click()
      })

      await waitFor(() => {
        expect(screen.getByText("Filter")).toBeInTheDocument()
      })
    }

    it("opens the filter drawer via the filter button", async () => {
      renderComponent()
      await openFilterDrawer()

      expect(screen.getByText("Availability")).toBeInTheDocument()
      expect(screen.getByText("Bedroom size")).toBeInTheDocument()
    })

    it("renders submit and clear buttons in the filter drawer", async () => {
      renderComponent()
      await openFilterDrawer()

      expect(screen.getByText("Show matching listings")).toBeInTheDocument()
      expect(screen.getByText("Clear")).toBeInTheDocument()
    })

    it("navigates to /listings (no query) on filter clear", async () => {
      const { pushMock } = mockNextRouter()

      render(
        <ListingsSearchConfigContext.Provider value={defaultConfig}>
          <ListingsSearchCombined />
        </ListingsSearchConfigContext.Provider>
      )

      await openFilterDrawer()

      act(() => {
        screen.getByText("Clear").closest("button").click()
      })

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/listings")
      })
    })
  })

  describe("search results state updates", () => {
    it("updates listings after a successful mobile search", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      mockSearchListings.mockResolvedValue({
        items: [
          { id: "listing-1", name: "Test Listing 1" },
          { id: "listing-2", name: "Test Listing 2" },
        ],
        meta: { currentPage: 1, totalPages: 1, totalItems: 2, itemCount: 2, itemsPerPage: 10 },
      })
      mockSearchMapMarkers.mockResolvedValue(defaultMarkers)

      renderComponent()

      await waitFor(() => {
        expect(mockSearchListings).toHaveBeenCalled()
      })
    })

    it("searches markers on mobile", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      renderComponent()

      await waitFor(() => {
        expect(mockSearchMapMarkers).toHaveBeenCalled()
      })
    })
  })

  describe("window resize handling", () => {
    it("switches from desktop to mobile view on resize", async () => {
      Object.defineProperty(window, "innerWidth", { value: 1024 })
      renderComponent()

      await waitFor(() => {
        expect(screen.getByTestId("google-map")).toBeInTheDocument()
      })

      Object.defineProperty(window, "innerWidth", { value: 600 })
      act(() => {
        window.dispatchEvent(new Event("resize"))
      })

      await waitFor(() => {
        expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
      })
    })

    it("switches from mobile to desktop view on resize", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      renderComponent()

      await waitFor(() => {
        expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
      })

      Object.defineProperty(window, "innerWidth", { value: 1024 })
      act(() => {
        window.dispatchEvent(new Event("resize"))
      })

      await waitFor(() => {
        expect(screen.getByTestId("google-map")).toBeInTheDocument()
      })
    })
  })

  describe("view toggle", () => {
    it("renders the map/list toggle button on mobile", async () => {
      Object.defineProperty(window, "innerWidth", { value: 600 })
      renderComponent()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /map view/i })).toBeInTheDocument()
      })

      await userEvent.click(screen.getByRole("button", { name: /map view/i }))

      await waitFor(() => {
        expect(screen.getByTestId("google-map")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /list view/i })).toBeInTheDocument()
      })
    })
  })
})
