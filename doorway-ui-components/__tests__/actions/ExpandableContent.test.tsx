import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { ExpandableContent } from "../../src/actions/ExpandableContent"

afterEach(cleanup)

describe("<ExpandableContent>", () => {
  const INNER_CONTENT_CLASS = "inner-content"
  const content = <div data-testid={INNER_CONTENT_CLASS}>Sample content</div>

  it("renders content after button click", () => {
    const { getByText, queryByTestId } = render(
      <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
        {content}
      </ExpandableContent>
    )

    // Expand the content
    const expandButton = getByText("read more")
    expect(expandButton).toBeTruthy()
    fireEvent.click(expandButton)

    // Check if content exists
    expect(queryByTestId(INNER_CONTENT_CLASS)).toBeInTheDocument()
  })

  it("collapses content after button click", () => {
    const { getByText, queryByTestId } = render(
      <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
        {content}
      </ExpandableContent>
    )

    // Expand the content
    const expandButton = getByText("read more")
    expect(expandButton).toBeTruthy()
    fireEvent.click(expandButton)

    // Collapse the content
    const collapseButton = getByText("read less")
    expect(collapseButton).toBeTruthy()
    fireEvent.click(collapseButton)

    // Check if content not exists
    expect(queryByTestId(INNER_CONTENT_CLASS)).not.toBeInTheDocument()
  })
})
