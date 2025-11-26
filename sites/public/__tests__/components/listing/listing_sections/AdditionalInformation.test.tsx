import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { AdditionalInformation } from "../../../../src/components/listing/listing_sections/AdditionalInformation"

afterEach(cleanup)

describe("<AdditionalInformation>", () => {
  it("shows all content", () => {
    render(
      <AdditionalInformation
        additionalInformation={[
          {
            heading: "Additional information 1 heading",
            description: "Description for additional information 1",
          },
          {
            heading: "Additional information 2 heading",
            description: "Description for additional information 2",
          },
        ]}
      />
    )
    expect(screen.getAllByText("Additional information").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Required documents and selection criteria").length).toBeGreaterThan(
      0
    )
    expect(screen.getByText("Additional information 1 heading")).toBeDefined()
    expect(screen.getByText("Description for additional information 1")).toBeDefined()
    expect(screen.getByText("Additional information 2 heading")).toBeDefined()
    expect(screen.getByText("Description for additional information 2")).toBeDefined()
  })
  it("shows nothing if no additional information passed", () => {
    render(<AdditionalInformation additionalInformation={[]} />)
    expect(screen.queryByText("Additional information")).toBeNull()
  })
})
