import React from "react"
import { render, cleanup } from "@testing-library/react"
import { FooterSection } from "../../src/sections/FooterSection"

afterEach(cleanup)

describe("<FooterSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(<FooterSection>Children go here</FooterSection>)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText, container } = render(
      <FooterSection className={"custom-class"} small={true}>
        Children go here
      </FooterSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
