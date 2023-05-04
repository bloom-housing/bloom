import React from "react"
import { render, cleanup } from "@testing-library/react"
import { FormCard } from "../../src/blocks/FormCard"
import Heading from "../../src/text/Heading"

afterEach(cleanup)

describe("<FormCard>", () => {
  it("can render with a header", () => {
    const { getByText } = render(
      <FormCard header={<Heading>Header Text</Heading>}>Children go here</FormCard>
    )
    expect(getByText("Header Text")).not.toBeNull()
  })
  it("can apply a custom class", () => {
    const { container } = render(<FormCard className={"custom-class"}>Children go here</FormCard>)
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
