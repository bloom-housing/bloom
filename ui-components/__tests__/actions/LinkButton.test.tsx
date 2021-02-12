import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { LinkButton } from "../../src/actions/LinkButton"

afterEach(cleanup)

describe("<LinkButton>", () => {
  it("correctly passes in an external link", () => {
    render(<LinkButton href="https://www.google.com">Button Content</LinkButton>)

    expect(screen.getByText("Button Content").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com"
    )
  })

  it("correctly passes in an internal link", () => {
    render(<LinkButton href={`listing/id=1`}>Button Content</LinkButton>)

    expect(screen.getByText("Button Content").closest("a")?.getAttribute("href")).toBe(
      "/listing/id=1"
    )
  })

  it("correctly passes in an internal link with as prop", () => {
    render(
      <LinkButton href={`listing/id=1`} as={`/listing/1/listing-slug-abcdef`}>
        Button Content
      </LinkButton>
    )

    expect(screen.getByText("Button Content").closest("a")?.getAttribute("href")).toBe(
      "/listing/1/listing-slug-abcdef"
    )
  })
})
