import React from "react"
import { render, cleanup } from "@testing-library/react"
import { LinkButton } from "../../src/actions/LinkButton"

afterEach(cleanup)

describe("<LinkButton>", () => {
  it("correctly passes in an external link", () => {
    const { getByText } = render(
      <LinkButton href="https://www.google.com">Button Content</LinkButton>
    )

    expect(getByText("Button Content").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com"
    )
  })

  it("correctly passes in an internal link", () => {
    const { getByText } = render(<LinkButton href="/listing/id=1">Button Content</LinkButton>)

    expect(getByText("Button Content").closest("a")?.getAttribute("href")).toBe("/listing/id=1")
  })

  it("correctly passes in an internal link with as prop", () => {
    const { getByText } = render(<LinkButton href="/listing/id=1">Button Content</LinkButton>)

    expect(getByText("Button Content").closest("a")?.getAttribute("href")).toBe("/listing/id=1")
  })
})
