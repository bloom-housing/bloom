/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { useMap } from "@vis.gl/react-google-maps"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { ListingViews } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getBoundsZoomLevel } from "../../../../src/lib/helpers"
import { MapClusterer, fitBounds } from "../../../../src/components/browse/map/MapClusterer"

// These mocks enable us to just test the branching logic in MapClusterer without worrying about the internal implementation of the children, which are tested separately
jest.mock("@vis.gl/react-google-maps", () => ({
  useMap: jest.fn(),
  InfoWindow: ({ children }) => <div>{children}</div>,
}))

jest.mock("@googlemaps/markerclusterer", () => ({
  MarkerClusterer: jest.fn().mockImplementation(() => ({
    clearMarkers: jest.fn(),
    addMarkers: jest.fn(),
  })),
  SuperClusterAlgorithm: jest.fn().mockImplementation(() => ({})),
}))

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

jest.mock("lodash/debounce", () => ({
  __esModule: true,
  default: (callback) => {
    const debounced = (...args) => callback(...args)
    debounced.cancel = jest.fn()
    return debounced
  },
}))

jest.mock("../../../../src/lib/helpers", () => ({
  getBoundsZoomLevel: jest.fn(() => 13),
}))

jest.mock("../../../../src/components/browse/map/MapMarker", () => ({
  MapMarker: ({ marker, onClick }) => (
    <button aria-label={`Map marker ${marker.key}`} onClick={() => onClick(marker)}>
      marker {marker.key}
    </button>
  ),
}))

jest.mock("../../../../src/components/browse/map/MapListingCard", () => ({
  MapListingCard: ({ listing }) => <div>{listing?.name}</div>,
}))

describe("fitBounds", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    const listingsMap = document.createElement("div")
    listingsMap.id = "listings-map"
    Object.defineProperty(listingsMap, "clientWidth", {
      value: 1000,
      configurable: true,
    })
    document.body.appendChild(listingsMap)
    ;(window as any).google = {
      maps: {
        LatLngBounds: jest.fn().mockImplementation(() => ({
          extend: jest.fn(),
        })),
      },
    }
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("returns early when map is not available", () => {
    expect(() => fitBounds(null as any, [])).not.toThrow()
  })

  it("does not fit bounds when there are no visible markers and continueIfEmpty is false", () => {
    const map = {
      getBounds: jest.fn(() => ({ contains: jest.fn(() => false) })),
      fitBounds: jest.fn(),
      setZoom: jest.fn(),
    }
    const setIsFirstBoundsLoad = jest.fn()
    const mapMarkers = [{ id: "m1", coordinate: { lat: 1, lng: 1 }, key: 0 }] as any

    fitBounds(map as any, mapMarkers, false, setIsFirstBoundsLoad)

    expect(map.fitBounds).not.toHaveBeenCalled()
    expect(map.setZoom).not.toHaveBeenCalled()
    expect(setIsFirstBoundsLoad).not.toHaveBeenCalled()
  })

  it("fits bounds and sets zoom for a single marker", () => {
    const map = {
      getBounds: jest.fn(() => ({ contains: jest.fn(() => false) })),
      fitBounds: jest.fn(),
      setZoom: jest.fn(),
    }
    const setIsFirstBoundsLoad = jest.fn()
    const mapMarkers = [{ id: "m1", coordinate: { lat: 37.77, lng: -122.41 }, key: 0 }] as any

    fitBounds(map as any, mapMarkers, true, setIsFirstBoundsLoad)

    expect(map.fitBounds).toHaveBeenCalledWith(expect.any(Object), 50)
    expect(getBoundsZoomLevel).toHaveBeenCalled()
    expect(map.setZoom).toHaveBeenCalledWith(6)
    expect(setIsFirstBoundsLoad).toHaveBeenCalledWith(false)
  })
})

describe("MapClusterer", () => {
  const mapMarkers = [
    { id: "listing-1", key: 0, coordinate: { lat: 37.77, lng: -122.41 } },
    { id: "listing-2", key: 1, coordinate: { lat: 37.78, lng: -122.42 } },
  ] as any

  const buildProps = (overrides = {}) => ({
    mapMarkers,
    infoWindowIndex: null as any,
    setInfoWindowIndex: jest.fn(),
    visibleMarkers: [],
    setVisibleMarkers: jest.fn(),
    setIsLoading: jest.fn(),
    searchFilter: {} as any,
    isFirstBoundsLoad: false,
    setIsFirstBoundsLoad: jest.fn(),
    isDesktop: true,
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useMap as jest.Mock).mockReturnValue(null)
    ;(useRouter as jest.Mock).mockReturnValue({ locale: "es" })
  })

  it("renders one marker button per map marker", () => {
    const listingsService = { retrieve: jest.fn() }

    render(
      <AuthContext.Provider value={{ listingsService } as any}>
        <MapClusterer {...buildProps()} />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("button", { name: "Map marker 0" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Map marker 1" })).toBeInTheDocument()
  })

  it("falls back to english listing retrieval when localized request fails", async () => {
    const setInfoWindowIndex = jest.fn()
    const listingsService = {
      retrieve: jest
        .fn()
        .mockRejectedValueOnce(new Error("localized failure"))
        .mockResolvedValueOnce({
          id: "listing-1",
          name: "Listing One",
          jurisdictions: { id: "jurisdiction-1" },
        }),
    }

    render(
      <AuthContext.Provider value={{ listingsService } as any}>
        <MapClusterer {...buildProps({ setInfoWindowIndex })} />
      </AuthContext.Provider>
    )

    await userEvent.click(screen.getByRole("button", { name: "Map marker 0" }))

    await waitFor(() => {
      expect(listingsService.retrieve).toHaveBeenNthCalledWith(
        1,
        { id: "listing-1", view: ListingViews.base },
        { headers: { language: "es" } }
      )
      expect(listingsService.retrieve).toHaveBeenNthCalledWith(
        2,
        { id: "listing-1", view: ListingViews.base },
        { headers: { language: "en" } }
      )
      expect(setInfoWindowIndex).toHaveBeenCalledWith(0)
    })
  })
})
