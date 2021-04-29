import React from "react"
import { render, cleanup } from "@testing-library/react"
import { DashBlock } from "../../src/blocks/DashBlock"

afterEach(cleanup)

describe("<DashBlock>", () => {
  it("can render with children & subtitle", () => {
    const { getByText } = render(
      <DashBlock
        title={"My Applications"}
        subtitle={"Subtitle Text"}
        icon={<span className="dash-icon"></span>}
      >
        Some additional explanatory text goes here!
      </DashBlock>
    )
    expect(getByText("Some additional explanatory text goes here!")).not.toBeNull()
    expect(getByText("Subtitle Text")).not.toBeNull()
  })

  it("can apply a link", () => {
    const { getByText } = render(
      <DashBlock
        title={"My Applications"}
        href={"https://www.google.com"}
        icon={<span className="dash-icon"></span>}
      />
    )
    expect(getByText("My Applications").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com"
    )
  })
})
