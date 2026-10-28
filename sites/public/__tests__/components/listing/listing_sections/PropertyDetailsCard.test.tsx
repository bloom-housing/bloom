import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PropertyDetailsCard } from "../../../../src/components/listing/listing_sections/PropertyDetailsCard"

afterEach(cleanup)

describe("Testing PropertyDetailsCard", () => {
  it("renders the link with correct text and URL", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Property Details"
        linkUrl="https://example.com/property"
        linkText="Visit the property website"
      />
    )
    const link = view.getByRole("link", { name: "Visit the property website" })
    expect(link).toBeDefined()
    expect(link).toHaveAttribute("href", "https://example.com/property")
  })

  it("renders all elements together correctly", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Property Details"
        linkUrl="https://property.example.com"
        linkText="Visit the property website"
        propertyDescription="property description test"
      />
    )
    expect(view.getByText("property description test")).toBeDefined()
    const link = view.getByRole("link", { name: "Visit the property website" })
    expect(link).toHaveAttribute("href", "https://property.example.com")
  })
})
