import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MapMarker } from "../../../../src/components/browse/map/MapMarker"

const advancedMarkerMock = jest.fn()

jest.mock("@vis.gl/react-google-maps", () => {
  const React = require("react")

  return {
    AdvancedMarker: React.forwardRef(({ children, onClick, position }, ref) => {
      advancedMarkerMock({ onClick, position })

      return (
        <button ref={ref} onClick={onClick} data-testid="advanced-marker">
          {children}
        </button>
      )
    }),
  }
})

describe("MapMarker", () => {
  const marker = {
    id: "listing-1",
    key: 7,
    coordinate: { lat: 37.7749, lng: -122.4194 },
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders marker pin image and passes coordinate to AdvancedMarker", () => {
    render(<MapMarker marker={marker} onClick={jest.fn()} setMarkerRef={jest.fn()} />)

    expect(screen.getByRole("img", { name: "Listing pin" })).toHaveAttribute(
      "id",
      "marker-id-listing-1"
    )
    expect(advancedMarkerMock).toHaveBeenCalledWith({
      onClick: expect.any(Function),
      position: marker.coordinate,
    })
  })

  it("calls onClick with marker data when marker is clicked", () => {
    const onClick = jest.fn()
    render(<MapMarker marker={marker} onClick={onClick} setMarkerRef={jest.fn()} />)

    fireEvent.click(screen.getByTestId("advanced-marker"))

    expect(onClick).toHaveBeenCalledWith(marker)
  })

  it("calls setMarkerRef with marker element and marker key", () => {
    const setMarkerRef = jest.fn()
    render(<MapMarker marker={marker} onClick={jest.fn()} setMarkerRef={setMarkerRef} />)

    const markerElement = screen.getByTestId("advanced-marker")
    expect(setMarkerRef).toHaveBeenCalledWith(markerElement, 7)
  })
})
