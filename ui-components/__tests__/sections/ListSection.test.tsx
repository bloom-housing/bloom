import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListSection } from "../../src/sections/ListSection"

afterEach(cleanup)

describe("<ListSection>", () => {
  it("renders default state", () => {
    const { getByText } = render(
      <ListSection title={"Title"} subtitle={"Subtitle"}>
        Children go here
      </ListSection>
    )
    expect(getByText("Children go here")).toBeTruthy()
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
  })
})
