import React from "react"
import { render, cleanup } from "@testing-library/react"
import { GridItem } from "../../src/prototypes/GridItem"

afterEach(cleanup)

describe("<GridItem>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <GridItem>
        <div>Children go here</div>
      </GridItem>
    )
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { container, getByText } = render(
      <GridItem className={"custom-class"}>
        <div>Children go here</div>
      </GridItem>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
