import React from "react"
import { render, screen } from "@testing-library/react"
import { Map } from "../../../src/views/components/Map"

type MockProps = {
  children?: React.ReactNode
  [key: string]: unknown
}

const mapboxMapMock = jest.fn()
const googleMapMock = jest.fn()
const apiProviderMock = jest.fn()

jest.mock("@vis.gl/react-mapbox", () => {
  const React = require("react")
  return {
    Map: (props: MockProps) => {
      mapboxMapMock(props)
      return <div data-testid="mapbox-map">{props.children}</div>
    },
    Marker: (props: MockProps) => <div data-testid="mapbox-marker">{props.children}</div>,
  }
})

jest.mock("@vis.gl/react-google-maps", () => {
  const React = require("react")
  return {
    APIProvider: (props: MockProps) => {
      apiProviderMock(props)
      return <div data-testid="google-api-provider">{props.children}</div>
    },
    Map: (props: MockProps) => {
      googleMapMock(props)
      return <div data-testid="google-map">{props.children}</div>
    },
    AdvancedMarker: (props: MockProps) => <div data-testid="google-marker">{props.children}</div>,
  }
})

const intersectionObserverMock = (callback: (entries: { isIntersecting: boolean }[]) => void) => ({
  observe: () => callback([{ isIntersecting: true }]),
  unobserve: () => null,
  disconnect: () => null,
})

const address = {
  city: "San Francisco",
  state: "CA",
  street: "548 Market St",
  zipCode: "94104",
  latitude: 37.789,
  longitude: -122.401,
}

const GOOGLE_ENV = {
  googleMapsApiKey: "test-google-key",
  googleMapsMapId: "test-google-map-id",
}

const MAP_ENV_KEYS = ["mapBoxToken", "MAPBOX_TOKEN", "googleMapsApiKey", "googleMapsMapId"]

const ORIGINAL_ENV = process.env

const applyEnv = (overrides: Record<string, string | undefined> = {}) => {
  const vars = { mapBoxToken: "test-mapbox-token", ...overrides }
  process.env = { ...ORIGINAL_ENV }
  MAP_ENV_KEYS.forEach((key) => delete process.env[key])
  Object.entries(vars).forEach(([key, value]) => {
    if (value !== undefined) process.env[key] = value
  })
}

describe("<Map>", () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    applyEnv()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("renders the mapbox map when only the mapbox token is configured", () => {
    render(<Map address={address} listingName="Test Listing" />)

    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument()
    expect(mapboxMapMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mapboxAccessToken: "test-mapbox-token",
        initialViewState: expect.objectContaining({
          latitude: address.latitude,
          longitude: address.longitude,
        }),
      })
    )
  })

  it("renders the listing name and address overlay", () => {
    render(<Map address={address} listingName="Test Listing" />)

    expect(screen.getByRole("heading", { name: "Test Listing" })).toBeInTheDocument()
    expect(screen.getByText("548 Market St", { exact: false })).toBeInTheDocument()
  })

  it("renders nothing when no address is given", () => {
    const { container } = render(<Map listingName="Test Listing" />)

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when the address has no coordinates", () => {
    const addressWithoutCoordinates = { ...address, latitude: undefined, longitude: undefined }

    const { container } = render(<Map address={addressWithoutCoordinates} />)

    expect(container).toBeEmptyDOMElement()
  })

  it("renders no map when no map provider is configured", () => {
    applyEnv({ mapBoxToken: undefined })

    render(<Map address={address} listingName="Test Listing" />)

    expect(screen.queryByTestId("mapbox-map")).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Test Listing" })).toBeInTheDocument()
  })

  it("renders the google map when both google variables are configured", () => {
    applyEnv(GOOGLE_ENV)

    render(<Map address={address} />)

    expect(screen.getByTestId("google-map")).toBeInTheDocument()
    expect(screen.queryByTestId("mapbox-map")).not.toBeInTheDocument()
    expect(apiProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: "test-google-key" })
    )
    expect(googleMapMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mapId: "test-google-map-id",
        defaultCenter: { lat: address.latitude, lng: address.longitude },
      })
    )
  })

  it("falls back to mapbox when only the google api key is configured", () => {
    applyEnv({ googleMapsApiKey: "test-google-key" })

    render(<Map address={address} />)

    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument()
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
  })

  it("falls back to mapbox when only the google map id is configured", () => {
    applyEnv({ googleMapsMapId: "test-google-map-id" })

    render(<Map address={address} />)

    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument()
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
  })

  it("uses mapbox for custom pin positioning even when google is configured", () => {
    applyEnv(GOOGLE_ENV)

    render(<Map address={address} enableCustomPinPositioning={true} setLatLong={jest.fn()} />)

    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument()
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument()
  })

  it("renders the google pin image", () => {
    applyEnv(GOOGLE_ENV)

    render(<Map address={address} />)

    expect(screen.getByRole("img", { name: "Listing pin" })).toHaveAttribute(
      "src",
      "/images/map-pin.svg"
    )
  })
})
