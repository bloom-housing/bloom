import React from "react"
import { render, cleanup } from "@testing-library/react"
import { FieldSection } from "../../src/prototypes/FieldSection"

afterEach(cleanup)

describe("<FieldSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <FieldSection>
        <div>Children go here</div>
      </FieldSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { container, getByText } = render(
      <FieldSection title={"Title"} className={"custom-class"} tinted={true} insetGrid={true}>
        <div>Children go here</div>
      </FieldSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
    expect(container.getElementsByClassName("custom-class").length).toBe(1)
  })
})
