import React from "react"
import { render, cleanup } from "@testing-library/react"
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
})
