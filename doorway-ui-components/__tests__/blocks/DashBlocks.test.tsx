import React from "react"
import { render, cleanup } from "@testing-library/react"
import { DashBlocks } from "../../src/blocks/DashBlocks"

afterEach(cleanup)

describe("<DashBlocks>", () => {
  it("renders without error", () => {
    const { getByText } = render(<DashBlocks>Children go here</DashBlocks>)
    expect(getByText("Children go here")).not.toBeNull()
  })
})
