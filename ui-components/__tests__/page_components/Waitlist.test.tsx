import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Waitlist } from "../../src/page_components/listing/listing_sidebar/Waitlist"

afterEach(cleanup)

const strings = {
  currentSize: "Current Size",
  openSpots: "Open Spots",
  finalSize: "Final Size",
  sectionTitle: "Section Title",
  description: "Description",
}

describe("<Waitlist>", () => {
  it("renders with an open waitlist", () => {
    const { getByText } = render(
      <Waitlist
        waitlistMaxSize={100}
        waitlistCurrentSize={40}
        waitlistOpenSpots={60}
        strings={strings}
      />
    )
    expect(getByText("Section Title")).toBeTruthy()
    expect(getByText("Current Size")).toBeTruthy()
    expect(getByText("40")).toBeTruthy()
    expect(getByText("Open Spots")).toBeTruthy()
    expect(getByText("60")).toBeTruthy()
    expect(getByText("Final Size")).toBeTruthy()
    expect(getByText("100")).toBeTruthy()
    expect(getByText("Description")).toBeTruthy()
  })
  it("renders with open spots", () => {
    const { getByText, queryByText } = render(
      <Waitlist
        waitlistMaxSize={10}
        waitlistCurrentSize={0}
        waitlistOpenSpots={10}
        strings={strings}
      />
    )
    expect(getByText("Description")).toBeTruthy()
    expect(queryByText("0")).toBeTruthy()
  })
  it("doesn't show null values", () => {
    const { queryByText } = render(
      <Waitlist
        waitlistMaxSize={10}
        waitlistCurrentSize={null}
        waitlistOpenSpots={10}
        strings={strings}
      />
    )
    expect(queryByText("0")).toBeNull()
  })
})
