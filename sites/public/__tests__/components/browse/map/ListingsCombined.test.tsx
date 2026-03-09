import React from "react"
import { render, screen } from "@testing-library/react"
import { useApiIsLoaded } from "@vis.gl/react-google-maps"
import { ListingsCombined } from "../../../../src/components/browse/map/ListingsCombined"
import { useListingsMapContext } from "../../../../src/components/browse/map/ListingsMapContext"

const listingsListMock = jest.fn()

// These mocks enable us to just test the branching logic in ListingsCombined without worrying about the internal implementation of the children, which are tested separately
jest.mock("@vis.gl/react-google-maps", () => ({
  useApiIsLoaded: jest.fn(),
}))

jest.mock("../../../../src/components/browse/map/ListingsMapContext", () => ({
  useListingsMapContext: jest.fn(),
}))

jest.mock("../../../../src/components/browse/map/ListingsSearchMetadata", () => ({
  ListingsSearchMetadata: () => <div data-testid="search-metadata-stub" />,
}))

jest.mock("../../../../src/components/browse/map/ListingsMap", () => ({
  ListingsMap: () => <div data-testid="listings-map-stub" />,
}))

jest.mock("../../../../src/components/browse/map/ListingsList", () => ({
  ListingsList: (props) => {
    listingsListMock(props)
    return <div data-testid="listings-list-stub" />
  },
}))

describe("ListingsCombined", () => {
  const setInfoWindowIndex = jest.fn()

  const buildContext = (overrides = {}) => ({
    googleMapsApiKey: "test-key",
    googleMapsMapId: "test-map-id",
    listView: true,
    isDesktop: false,
    isLoading: false,
    isFirstBoundsLoad: false,
    setInfoWindowIndex,
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useApiIsLoaded as jest.Mock).mockReturnValue(true)
    ;(useListingsMapContext as jest.Mock).mockReturnValue(buildContext())
  })

  it("renders nothing until Google Maps API is loaded", () => {
    ;(useApiIsLoaded as jest.Mock).mockReturnValue(false)

    const { container } = render(<ListingsCombined />)

    expect(container.firstChild).toBeNull()
  })

  it("renders mobile list view with footer and passes loading=false by default", () => {
    render(<ListingsCombined />)

    expect(screen.getByTestId("listings-list-stub")).toBeInTheDocument()
    expect(screen.queryByTestId("listings-map-stub")).not.toBeInTheDocument()
    expect(document.getElementById("listings-list-expanded")).toBeInTheDocument()
    expect(document.getElementById("listings-outer-container")).not.toBeInTheDocument()
    expect(listingsListMock).toHaveBeenCalledWith(expect.objectContaining({ loading: false }))
  })

  it("renders mobile map view when listView is false", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        listView: false,
        isDesktop: false,
      })
    )

    render(<ListingsCombined />)

    expect(screen.getByTestId("listings-map-stub")).toBeInTheDocument()
    expect(screen.queryByTestId("listings-list-stub")).not.toBeInTheDocument()
    expect(document.getElementById("listings-list-expanded")).not.toBeInTheDocument()
    expect(document.getElementById("listings-outer-container")).not.toBeInTheDocument()
  })

  it("renders desktop combined view with map, list, and footer", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        isDesktop: true,
      })
    )

    render(<ListingsCombined />)

    expect(screen.getByTestId("listings-map-stub")).toBeInTheDocument()
    expect(screen.getByTestId("listings-list-stub")).toBeInTheDocument()
    expect(document.getElementById("listings-list")).toBeInTheDocument()
    expect(document.getElementById("listings-outer-container")).toBeInTheDocument()
  })

  it("passes loading=true to listings list when maps config exists and loading is true", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        isDesktop: true,
        isLoading: true,
        isFirstBoundsLoad: false,
      })
    )

    render(<ListingsCombined />)

    expect(listingsListMock).toHaveBeenCalledWith(expect.objectContaining({ loading: true }))
  })

  it("passes loading=true to listings list during first desktop bounds load", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        isDesktop: true,
        isLoading: false,
        isFirstBoundsLoad: true,
      })
    )

    render(<ListingsCombined />)

    expect(listingsListMock).toHaveBeenCalledWith(expect.objectContaining({ loading: true }))
  })
})
