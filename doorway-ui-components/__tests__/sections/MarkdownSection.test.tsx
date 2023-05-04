import React from "react"
import { render, cleanup } from "@testing-library/react"
import { MarkdownSection } from "../../src/sections/MarkdownSection"

afterEach(cleanup)

describe("<MarkdownSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(<MarkdownSection>Children go here</MarkdownSection>)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText } = render(
      <MarkdownSection fullwidth={true}>Children go here</MarkdownSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
  })
})
