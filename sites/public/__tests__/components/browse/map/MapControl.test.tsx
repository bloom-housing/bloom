import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useMap } from "@vis.gl/react-google-maps"
import { t } from "@bloom-housing/ui-components"
import { MapControl } from "../../../../src/components/browse/map/MapControl"

jest.mock("@vis.gl/react-google-maps", () => ({
  useMap: jest.fn(),
}))

describe("MapControl", () => {
  const setZoom = jest.fn()
  const getZoom = jest.fn()
  const map = {
    setZoom,
    getZoom,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getZoom.mockReturnValue(10)
    ;(useMap as jest.Mock).mockReturnValue(map)
  })

  it("does not render when map is unavailable", () => {
    ;(useMap as jest.Mock).mockReturnValue(null)

    const { container } = render(<MapControl />)

    expect(container.firstChild).toBeNull()
  })

  it("renders map controls group with zoom buttons", () => {
    render(<MapControl />)

    expect(screen.getByRole("group", { name: t("t.mapControls") })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: t("t.zoomIn") })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: t("t.zoomOut") })).toBeInTheDocument()
  })

  it("zooms in and clears info window when zoom in is clicked", async () => {
    const setInfoWindowIndex = jest.fn()
    render(<MapControl setInfoWindowIndex={setInfoWindowIndex} />)

    await userEvent.click(screen.getByRole("button", { name: t("t.zoomIn") }))

    expect(setZoom).toHaveBeenCalledWith(11)
    expect(setInfoWindowIndex).toHaveBeenCalledWith(null)
  })

  it("zooms out and clears info window when zoom out is clicked", async () => {
    const setInfoWindowIndex = jest.fn()
    render(<MapControl setInfoWindowIndex={setInfoWindowIndex} />)

    await userEvent.click(screen.getByRole("button", { name: t("t.zoomOut") }))

    expect(setZoom).toHaveBeenCalledWith(9)
    expect(setInfoWindowIndex).toHaveBeenCalledWith(null)
  })

  it("zooms without calling setInfoWindowIndex when callback is not provided", async () => {
    render(<MapControl />)

    await userEvent.click(screen.getByRole("button", { name: t("t.zoomIn") }))
    await userEvent.click(screen.getByRole("button", { name: t("t.zoomOut") }))

    expect(setZoom).toHaveBeenNthCalledWith(1, 11)
    expect(setZoom).toHaveBeenNthCalledWith(2, 9)
  })
})
