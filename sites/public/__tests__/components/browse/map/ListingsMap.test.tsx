import React from "react"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { ListingsMap } from "../../../../src/components/browse/map/ListingsMap"
import { useListingsMapContext } from "../../../../src/components/browse/map/ListingsMapContext"

const mapRecenterMock = jest.fn()

// These mocks enable us to just test the branching logic in ListingsMap without worrying about the internal implementation of the children, which are tested separately
jest.mock("../../../../src/components/browse/map/ListingsMapContext", () => ({
  useListingsMapContext: jest.fn(),
}))

jest.mock("@vis.gl/react-google-maps", () => ({
  Map: (props) => <div data-testid="google-map">{props.children}</div>,
}))

jest.mock("../../../../src/components/browse/map/MapControl", () => ({
  MapControl: () => <div>map-control</div>,
}))

jest.mock("../../../../src/components/browse/map/MapRecenter", () => ({
  MapRecenter: (props) => {
    mapRecenterMock(props)
    return <div>map-recenter</div>
  },
}))

jest.mock("../../../../src/components/browse/map/MapClusterer", () => ({
  MapClusterer: () => <div>map-clusterer</div>,
}))

describe("ListingsMap", () => {
  const setVisibleMarkers = jest.fn()
  const setIsLoading = jest.fn()
  const setIsFirstBoundsLoad = jest.fn()

  const setInfoWindowIndex = jest.fn()

  const buildContext = (overrides = {}) => ({
    searchResults: {
      listings: [],
      markers: [
        { id: "marker-1", lat: 37.77, lng: -122.41 },
        { id: "marker-2", lat: 37.78, lng: -122.42 },
      ],
      currentPage: 1,
      lastPage: 1,
      totalItems: 2,
    },
    googleMapsMapId: "test-map-id",
    visibleMarkers: [{ id: "marker-1", key: 0, coordinate: { lat: 37.77, lng: -122.41 } }],
    setVisibleMarkers,
    setIsLoading,
    searchFilter: { bedrooms: null },
    isFirstBoundsLoad: true,
    setIsFirstBoundsLoad,
    isDesktop: true,
    isLoading: false,
    infoWindowIndex: null,
    setInfoWindowIndex,
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useListingsMapContext as jest.Mock).mockReturnValue(buildContext())
  })

  it("renders map wrapper content with skip link and heading", () => {
    render(<ListingsMap />)

    expect(screen.getByRole("link", { name: t("t.skipMapOfListings") })).toHaveAttribute(
      "href",
      "#listingsList"
    )
    expect(screen.getByRole("heading", { name: t("t.listingsMap") })).toBeInTheDocument()
    expect(screen.getByTestId("google-map")).toBeInTheDocument()
  })

  it("passes undefined visible marker count when there are no visible markers", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(buildContext({ visibleMarkers: null }))

    render(<ListingsMap />)

    expect(mapRecenterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visibleMapMarkers: undefined,
      })
    )
  })
})
