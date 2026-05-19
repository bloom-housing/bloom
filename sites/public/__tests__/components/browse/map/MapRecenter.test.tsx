import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { useMap } from "@vis.gl/react-google-maps"
import { fitBounds } from "../../../../src/components/browse/map/MapClusterer"
import { MapRecenter } from "../../../../src/components/browse/map/MapRecenter"

jest.mock("@vis.gl/react-google-maps", () => ({
  useMap: jest.fn(),
}))

jest.mock("../../../../src/components/browse/map/MapClusterer", () => ({
  fitBounds: jest.fn(),
}))

describe("MapRecenter", () => {
  const map = { id: "map-instance" }
  const mapMarkers = [
    { id: "marker-1", lat: 37.7749, lng: -122.4194 },
    { id: "marker-2", lat: 37.7849, lng: -122.4094 },
  ] as any

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useMap as jest.Mock).mockReturnValue(map)
  })

  it("does not render when map is unavailable", () => {
    ;(useMap as jest.Mock).mockReturnValue(null)

    const { container } = render(
      <MapRecenter visibleMapMarkers={0} mapMarkers={mapMarkers} isLoading={false} />
    )

    expect(container.firstChild).toBeNull()
  })

  it("does not render when visible marker count is undefined", () => {
    const { container } = render(
      <MapRecenter
        visibleMapMarkers={undefined as unknown as number}
        mapMarkers={mapMarkers}
        isLoading={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it("does not render when all markers are already visible", () => {
    const { container } = render(
      <MapRecenter
        visibleMapMarkers={mapMarkers.length}
        mapMarkers={mapMarkers}
        isLoading={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it("does not render while loading", () => {
    const { container } = render(
      <MapRecenter visibleMapMarkers={0} mapMarkers={mapMarkers} isLoading={true} />
    )

    expect(container.firstChild).toBeNull()
  })

  it("renders recenter button and calls fitBounds with mapped markers on click", () => {
    render(<MapRecenter visibleMapMarkers={1} mapMarkers={mapMarkers} isLoading={false} />)

    const recenterButton = screen.getByRole("button")
    fireEvent.click(recenterButton)

    expect(fitBounds).toHaveBeenCalledWith(
      map,
      [
        {
          id: "marker-1",
          key: 0,
          coordinate: { lat: 37.7749, lng: -122.4194 },
        },
        {
          id: "marker-2",
          key: 1,
          coordinate: { lat: 37.7849, lng: -122.4094 },
        },
      ],
      true
    )
  })
})
