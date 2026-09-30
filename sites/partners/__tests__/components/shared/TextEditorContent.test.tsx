import React from "react"
import { render } from "@testing-library/react"
import { TextEditorContent } from "../../../src/components/shared/TextEditor"

describe("<TextEditorContent>", () => {
  it("renders stored HTML as written, without markdown rules rewriting it", () => {
    const { container } = render(
      <TextEditorContent asHtml content="<p>#1 priority is applying early</p>" />
    )

    expect(container.textContent).toEqual("#1 priority is applying early")
    expect(container.querySelector("h1")).toBeNull()
  })

  it("keeps underscores inside a word rather than reading them as emphasis", () => {
    const { container } = render(
      <TextEditorContent asHtml content="<p>Use form HUD-52517_rev_2</p>" />
    )

    expect(container.textContent).toEqual("Use form HUD-52517_rev_2")
    expect(container.querySelector("em")).toBeNull()
  })

  it("does not turn a markdown image in stored text into a request for it", () => {
    const { container } = render(
      <TextEditorContent asHtml content="<p>Apply ![](https://example.test/p.png) online</p>" />
    )

    expect(container.querySelector("img")).toBeNull()
  })

  it("renders a list the editor produced", () => {
    const { container } = render(
      <TextEditorContent asHtml content="<ol><li><p>one</p></li><li><p>two</p></li></ol>" />
    )

    expect(container.querySelectorAll("li")).toHaveLength(2)
  })

  // Listing rich text may legitimately be markdown, so the default is unchanged.
  it("parses as markdown unless asked for HTML", () => {
    const { container } = render(<TextEditorContent content="# A heading" />)

    expect(container.querySelector("h1")).not.toBeNull()
  })
})
