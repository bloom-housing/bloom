import React from "react"
import { render, cleanup } from "@testing-library/react"
import { InfoCardGrid } from "../../src/sections/InfoCardGrid"

afterEach(cleanup)

describe("<InfoCardGrid>", () => {
  it("renders default state", () => {
    const { getByText } = render(<InfoCardGrid title={"Title"}>Children go here</InfoCardGrid>)
    expect(getByText("Children go here")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText } = render(
      <InfoCardGrid title={"Title"} subtitle={"Subtitle"}>
        Children go here
      </InfoCardGrid>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
  })
})
