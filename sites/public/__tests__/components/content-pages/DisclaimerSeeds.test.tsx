import React from "react"
import { mockNextRouter, render } from "../../testUtils"
import DisclaimerSeeds from "../../../src/components/content-pages/DisclaimerSeeds"

beforeAll(() => mockNextRouter())

// The .md import is a raw string only because of the jest transform that mirrors webpack's
// asset/source rule. Without an assertion on the text, a transform returning the wrong thing
// still loads and nothing objects.
describe("DisclaimerSeeds", () => {
  it("renders the markdown content as markup rather than a raw string", () => {
    const { container, queryByText } = render(<DisclaimerSeeds />)
    const markdown = container.querySelector(".markdown")

    expect(markdown?.querySelectorAll("h1, h2, h3, h4").length).toBeGreaterThan(0)
    expect(queryByText("[object Object]")).not.toBeInTheDocument()
    expect(markdown?.textContent).not.toContain("## ")
  })
})
