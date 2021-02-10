import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { LinkButton } from "../../src/actions/LinkButton"

afterEach(cleanup)

describe("<LinkButton>", () => {
  it("correctly passes in a link", () => {
    render(<LinkButton href="https://www.google.com">Button Content</LinkButton>)

    expect(screen.getByText("Button Content").closest("a")?.getAttribute("href")).toBe(
      "https://www.google.com"
    )
  })
})
