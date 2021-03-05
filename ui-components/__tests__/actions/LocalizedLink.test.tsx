import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LocalizedLink } from "../../src/actions/LocalizedLink"

afterEach(cleanup)

describe("<LocalizedLink>", () => {
  it("correctly passes in an external link", () => {
    const { getByText } = render(
      <LocalizedLink href="https://www.google.com">Link Content</LocalizedLink>
    )

    expect(getByText("Link Content").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com/"
    )
  })

  it("correctly passes in an internal link", () => {
    const { getByText } = render(<LocalizedLink href={`listing/id=1`}>Link Content</LocalizedLink>)

    expect(getByText("Link Content").closest("a")?.getAttribute("href")).toBe("/listing/id=1")
  })

  it("correctly passes in an internal link with as prop", () => {
    const { getByText } = render(
      <LocalizedLink href={`listing/id=1`} as={`/listing/1/listing-slug-abcdef`}>
        Link Content
      </LocalizedLink>
    )
    expect(getByText("Link Content").closest("a")?.getAttribute("href")).toBe(
      "/listing/1/listing-slug-abcdef"
    )
  })

  it("correctly applies aria attributes", () => {
    const { getByRole } = render(
      <LocalizedLink href="https://www.google.com" aria={{ role: "text-box" }}>
        Link Content
      </LocalizedLink>
    )

    expect(getByRole("text-box")).toBeTruthy()
  })
})
