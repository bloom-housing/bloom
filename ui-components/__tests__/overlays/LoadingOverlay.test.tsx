import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LoadingOverlay } from "../../src/overlays/LoadingOverlay"

afterEach(cleanup)

describe("<LoadingOverlay>", () => {
  it("renders while loading", () => {
    const { container, getByText } = render(
      <LoadingOverlay isLoading={true}>Children go here</LoadingOverlay>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("loading-overlay__spinner").length).toBe(1)
  })
  it("renders while not loading", () => {
    const { container, getByText } = render(
      <LoadingOverlay isLoading={false}>Children go here</LoadingOverlay>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("loading-overlay").length).toBe(0)
    expect(container.getElementsByClassName("loading-overlay__spinner").length).toBe(0)
  })
})
