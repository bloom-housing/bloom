import React from "react"
import { render, cleanup } from "@testing-library/react"
import { GridSection, GridCell } from "../../src/sections/GridSection"

afterEach(cleanup)

describe("<GridSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(<GridSection>Children go here</GridSection>)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText, container } = render(
      <GridSection
        title={"Title"}
        subtitle={"Subtitle"}
        tinted={true}
        grid={true}
        columns={2}
        inset={true}
        className={"custom-class"}
        tightSpacing={true}
        reverse={true}
        separator={true}
      >
        <GridCell className={"custom-class2"}>Child1</GridCell>
        <GridCell>Child2</GridCell>
        <GridCell span={2}>Child3</GridCell>
      </GridSection>
    )
    expect(getByText("Child1")).toBeTruthy()
    expect(getByText("Child2")).toBeTruthy()
    expect(getByText("Child3")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
    expect(container.getElementsByClassName("custom-class2").length).toBe(1)
  })
})
