import React from "react"
import { render, cleanup } from "@testing-library/react"
import { QuantityRowSection } from "../../src/page_components/listing/listing_sidebar/QuantityRowSection"

afterEach(cleanup)

const strings = {
  currentSize: "Current Size",
  openSpots: "Open Spots",
  finalSize: "Final Size",
  sectionTitle: "Section Title",
  description: "Description",
}

describe("<QuantityRowSection>", () => {
  it("renders with an open waitlist", () => {
    const { getByText } = render(
      <QuantityRowSection
        strings={strings}
        quantityRows={[
          { amount: 100, text: "Final Size" },
          { amount: 40, text: "Current Size" },
          { amount: 60, text: "Open Spots" },
        ]}
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
      <QuantityRowSection
        quantityRows={[
          { amount: 10, text: "Final Size" },
          { amount: 0, text: "Current Size" },
          { amount: 10, text: "Open Spots" },
        ]}
        strings={strings}
      />
    )
    expect(getByText("Description")).toBeTruthy()
    expect(queryByText("0")).toBeTruthy()
  })
  it("doesn't show null values", () => {
    const { queryByText } = render(
      <QuantityRowSection
        quantityRows={[
          { amount: 10, text: "Final Size" },
          { amount: 10, text: "Open Spots" },
        ]}
        strings={strings}
      />
    )
    expect(queryByText("0")).toBeNull()
  })
})
