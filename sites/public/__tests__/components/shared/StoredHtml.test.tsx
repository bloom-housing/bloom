import React from "react"
import { render } from "@testing-library/react"
import { StoredHtml } from "../../../src/components/shared/StoredHtml"

describe("<StoredHtml>", () => {
  // The editor wraps a list item's content in a paragraph, which needs rules markdown output does
  // not, so this has its own stylesheet rather than reusing .bloom-markdown.
  it("carries its own stylesheet class", () => {
    const { container } = render(<StoredHtml html="<ol><li><p>one</p></li></ol>" />)

    expect(container.firstChild).toHaveClass("stored-html")
  })

  it("sets the html rather than escaping it", () => {
    const { container } = render(
      <StoredHtml html="<ol><li><p>one</p></li><li><p>two</p></li></ol>" />
    )

    expect(container.querySelectorAll("li")).toHaveLength(2)
    expect(container.querySelector("ol")).toBeInTheDocument()
  })
})
