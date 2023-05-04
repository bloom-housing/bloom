import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ContentSection } from "../../src/sections/ContentSection"

afterEach(cleanup)

describe("<ContentSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(<ContentSection>Children go here</ContentSection>)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText } = render(
      <ContentSection title={"Title"} subtitle={"Subtitle"}>
        Children go here
      </ContentSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
  })
})
