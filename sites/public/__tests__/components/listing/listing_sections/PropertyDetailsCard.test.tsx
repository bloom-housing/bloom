import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PropertyDetailsCard } from "../../../../src/components/listing/listing_sections/PropertyDetailsCard"

afterEach(cleanup)

describe("Testing PropertyDetailsCard", () => {
  it("renders the heading correctly", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Property details"
        linkUrl="https://example.com"
        linkText="View More"
      >
        <p>Listing content</p>
      </PropertyDetailsCard>
    )
    expect(view.getByText("Property Information")).toBeDefined()
    expect(view.getByRole("heading", { level: 2 })).toHaveTextContent("Property details")
  })

  it("renders the link with correct text and URL", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Property Details"
        linkUrl="https://example.com/property"
        linkText="Visit the property website"
      >
        <p>Listing property content</p>
      </PropertyDetailsCard>
    )
    const link = view.getByRole("link", { name: "Visit the property website" })
    expect(link).toBeDefined()
    expect(link).toHaveAttribute("href", "https://example.com/property")
  })

  it("renders the link with target _blank to open in new tab", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Property Details"
        linkUrl="https://example.com"
        linkText="Visit the property website"
      >
        <p>Listing property content</p>
      </PropertyDetailsCard>
    )
    const link = view.getByRole("link", { name: "External Link" })
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("renders all elements together correctly", () => {
    const view = render(
      <PropertyDetailsCard
        heading="Building Amenities"
        linkUrl="https://property.example.com"
        linkText="Visit the property website"
      >
        <ul>
          <li>Pool</li>
          <li>Gym</li>
          <li>Parking</li>
        </ul>
      </PropertyDetailsCard>
    )
    expect(view.getByText("Building Amenities")).toBeDefined()
    expect(view.getByText("Pool")).toBeDefined()
    expect(view.getByText("Gym")).toBeDefined()
    expect(view.getByText("Parking")).toBeDefined()
    const link = view.getByRole("link", { name: "View All Amenities" })
    expect(link).toHaveAttribute("href", "https://amenities.example.com")
    expect(link).toHaveAttribute("target", "_blank")
  })
})
