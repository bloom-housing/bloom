import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { Description } from "../../src/text/Description"

afterEach(cleanup)

describe("<Description>", () => {
  it("renders default state", () => {
    const { getByText } = render(<Description term={"Term"} description={"Description"} />)
    expect(getByText("Term")).toBeTruthy()
    expect(getByText("Description")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByText } = render(
      <Description term={"Term"} description={"Description"} markdown={true} />
    )
    expect(getByText("Term")).toBeTruthy()
    expect(getByText("Description")).toBeTruthy()
  })
  it("renders with markdown and description className", () => {
    const { container, getByText } = render(
      <Description
        term={"Term"}
        description={'<span title="Description Title">Description</span>'}
        dtClassName={"test-class"}
        markdown={true}
        markdownProps={{ disableParsingRawHTML: false }}
      />
    )
    expect(getByText("Term")).toBeTruthy()
    expect(getByText("Description")).toBeTruthy()
    expect(container.getElementsByClassName("test-class").length).toBe(1)
    expect(screen.getByTitle("Description Title")).toBeTruthy()
  })
})
