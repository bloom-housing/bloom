import React from "react"
import { render, cleanup } from "@testing-library/react"
import { SiteHeader } from "../../src/headers/SiteHeader"

afterEach(cleanup)

describe("<SiteHeader>", () => {
  it("renders default state", () => {
    const { getByText, debug, getByRole } = render(
      <SiteHeader
        logoSrc="/images/logo_glyph.svg"
        notice="This is a preview of our new website."
        title="Site Title Here"
        skip="Skip to content"
      >
        Hello World
      </SiteHeader>
    )
    expect(getByText("Skip to content")).toBeTruthy()
    expect(getByText("This is a preview of our new website.")).toBeTruthy()
    expect(getByText("Site Title Here")).toBeTruthy()
  })
})
