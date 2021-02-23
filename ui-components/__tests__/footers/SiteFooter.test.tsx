import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SiteFooter } from "../../src/footers/SiteFooter"

afterEach(cleanup)

describe("<SiteFooter>", () => {
  it("renders children", () => {
    const { getByText } = render(<SiteFooter>Footer Content</SiteFooter>)
    expect(getByText("Footer Content")).not.toBeNull()
  })
})
