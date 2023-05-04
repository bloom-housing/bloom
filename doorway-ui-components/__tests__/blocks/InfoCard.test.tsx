import React from "react"
import { render, cleanup } from "@testing-library/react"
import { InfoCard } from "../../src/blocks/InfoCard"

afterEach(cleanup)

describe("<InfoCard>", () => {
  it("can apply a link", () => {
    const { getByText } = render(
      <InfoCard title={"Info Card Title"} externalHref={"https://www.google.com"}>
        Children go here
      </InfoCard>
    )
    expect(getByText("Info Card Title").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com"
    )
  })

  it("can apply a custom class", () => {
    const { container } = render(
      <InfoCard title={"Info Card Title"} className={"custom-class"}>
        Children go here
      </InfoCard>
    )
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })

  it("if children are JSX, render as inputted", () => {
    const { container } = render(
      <InfoCard title={"Info Card Title"} className={"custom-class"}>
        <div>Children go here</div>
      </InfoCard>
    )
    expect(container.getElementsByClassName("markdown").length).toBe(0)
  })

  it("if children are a string, render as Markdown", () => {
    const { container } = render(
      <InfoCard title={"Info Card Title"} className={"custom-class"}>
        {"Children go here"}
      </InfoCard>
    )
    expect(container.getElementsByClassName("markdown").length).toBe(1)
  })
})
