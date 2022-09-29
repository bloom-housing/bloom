import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ContentAccordion } from "../../src/page_components/listing/ContentAccordion"

afterEach(cleanup)

describe("<ContentAccordion>", () => {
  const barContent = () => {
    return <>Header Content</>
  }
  const expandedContent = () => {
    return <>Expanded Content</>
  }

  it("toggles content section", () => {
    const { queryByText, getByTestId } = render(
      <ContentAccordion customBarContent={barContent()} customExpandedContent={expandedContent()} />
    )
    expect(queryByText("Header Content")).toBeTruthy()
    expect(queryByText("Expanded Content")).toBeFalsy()
    getByTestId("content-accordion-button").click()
    expect(queryByText("Header Content")).toBeTruthy()
    expect(queryByText("Expanded Content")).toBeTruthy()
  })
})
