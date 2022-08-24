import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { ExpandableText } from "../../src/actions/ExpandableText"

afterEach(cleanup)

describe("<ExpandableText>", () => {
  it("renders full text if below max length", () => {
    const content = "This is a sentence that has 42 characters!"
    const { getByText, queryByText } = render(
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }}>{content}</ExpandableText>
    )
    expect(getByText(content)).not.toBeNull()
    expect(queryByText("...")).toBeNull()
  })

  it("renders cutoff point if text is above max length", () => {
    const content = "This is a sentence that has 42 characters!"
    const { getByText } = render(
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }} maxLength={30}>
        {content}
      </ExpandableText>
    )
    expect(getByText(`${content.substring(0, 30)}...`)).not.toBeNull()
  })

  it("if cutoff point is a space, move cutoff point one index to the left", () => {
    const content = "This is a sentence that has 42 characters!"
    const { getByText } = render(
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }} maxLength={8}>
        {content}
      </ExpandableText>
    )
    expect(getByText(`${content.substring(0, 7)}...`)).not.toBeNull()
  })

  it("cuts off mid-word if the text has no spaces", () => {
    const content = "Thissentencehasnospacesatall."
    const { getByText } = render(
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }} maxLength={8}>
        {content}
      </ExpandableText>
    )
    expect(getByText(`${content.substring(0, 8)}...`)).not.toBeNull()
  })

  it("hitting the expand/contract button adds and removes the extra characters", () => {
    const content = "This is a sentence that has 42 characters!"
    const { getByText, queryByText } = render(
      <ExpandableText strings={{ readMore: "More", readLess: "Less" }} maxLength={30}>
        {content}
      </ExpandableText>
    )
    expect(queryByText(content)).toBeNull()
    expect(getByText(`${content.substring(0, 30)}...`)).not.toBeNull()

    // Expand the text
    const expandButton = getByText("More")
    expect(expandButton).toBeTruthy()
    fireEvent.click(expandButton)

    // Assert text expanded
    expect(queryByText(content)).not.toBeNull()
    const expandButtonRemoved = queryByText("More")
    expect(expandButtonRemoved).toBeNull()

    // Contract the text
    const contractButton = getByText("Less")
    expect(contractButton).toBeTruthy()
    fireEvent.click(contractButton)

    // Assert text contracted
    const contractButtonRemoved = queryByText("Less")
    expect(contractButtonRemoved).toBeNull()
    expect(queryByText(content)).toBeNull()
    expect(getByText(`${content.substring(0, 30)}...`)).not.toBeNull()
  })
})
