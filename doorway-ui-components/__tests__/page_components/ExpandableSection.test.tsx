import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { ExpandableSection } from "../../src/page_components/listing/listing_sidebar/ExpandableSection"

afterEach(cleanup)

describe("<ExpandableSection>", () => {
  it("renders expected text and expandable content", () => {
    const { getByText, queryByText } = render(
      <ExpandableSection
        content={"What To Expect Content"}
        expandableContent={"What To Expect Expandable Content"}
        strings={{
          title: "Title",
          readMore: "read more",
          readLess: "read less",
        }}
      />
    )
    expect(getByText("What To Expect Content")).toBeTruthy()
    expect(queryByText("What To Expect Expandable Content")).toBeFalsy()
    fireEvent.click(getByText("read more"))
    expect(getByText("What To Expect Expandable Content")).toBeTruthy()
  })
})
