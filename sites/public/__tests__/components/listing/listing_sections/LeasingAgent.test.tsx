import React from "react"
import { render, cleanup } from "@testing-library/react"

import {
  formatPhone,
  LeasingAgent,
} from "../../../../src/components/listing/listing_sections/LeasingAgent"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"

afterEach(cleanup)

describe("<LeasingAgent>", () => {
  it("shows nothing if no content passed", () => {
    const view = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => true,
        }}
      >
        <LeasingAgent listing={listing} jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    )
    expect(view.queryByText("Leasing Agent")).toBeNull()
  })

  it("shows all content enableLeasingAgentAltText on", () => {
    const phoneNumber = "(123) 456-7890"
    const view = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => true,
        }}
      >
        <LeasingAgent
          listing={{
            ...listing,
            listingsLeasingAgentAddress: {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              city: "Address city",
              street: "Address street",
              street2: "Address unit",
              zipCode: "67890",
              state: "CA",
              latitude: 1,
              longitude: 2,
            },
            leasingAgentEmail: "leasing@agent.com",
            leasingAgentName: "Agent Name",
            leasingAgentOfficeHours: "Leasing office hours",
            leasingAgentPhone: phoneNumber,
            leasingAgentTitle: "Agent title",
          }}
          jurisdiction={jurisdiction}
        />
      </AuthContext.Provider>
    )
    expect(view.getByText("Contact leasing agent or property manager")).toBeDefined()
    expect(view.getByText("Agent Name")).toBeDefined()
    expect(view.getByText("Agent title")).toBeDefined()
    expect(view.getByRole("link", { name: `Call ${phoneNumber}` })).toHaveAttribute(
      "href",
      "tel:1234567890"
    )
    expect(view.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:leasing@agent.com")
    expect(view.getByText("Due to high call volume you may hear a message.")).toBeDefined()
    expect(view.getByText("Address street, Address unit")).toBeDefined()
    expect(view.getByText("Address city, CA 67890")).toBeDefined()
    expect(view.getByRole("link", { name: "Get directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/place/Address street, Address unit, Address city, CA 67890"
    )
    expect(view.getByText("Office hours")).toBeDefined()
    expect(view.getByText("Leasing office hours")).toBeDefined()
  })
  it("shows all content enableLeasingAgentAltText off", () => {
    const phoneNumber = "(123) 456-7890"
    const view = render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => false,
        }}
      >
        <LeasingAgent
          listing={{
            ...listing,
            listingsLeasingAgentAddress: {
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              city: "Address city",
              street: "Address street",
              street2: "Address unit",
              zipCode: "67890",
              state: "CA",
              latitude: 1,
              longitude: 2,
            },
            leasingAgentEmail: "leasing@agent.com",
            leasingAgentName: "Agent Name",
            leasingAgentOfficeHours: "Leasing office hours",
            leasingAgentPhone: phoneNumber,
            leasingAgentTitle: "Agent title",
          }}
          jurisdiction={jurisdiction}
        />
      </AuthContext.Provider>
    )
    expect(view.getByText("Contact leasing agent")).toBeDefined()
    expect(view.getByText("Agent Name")).toBeDefined()
    expect(view.getByText("Agent title")).toBeDefined()
    expect(view.getByRole("link", { name: `Call ${phoneNumber}` })).toHaveAttribute(
      "href",
      "tel:1234567890"
    )
    expect(view.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:leasing@agent.com")
    expect(view.getByText("Due to high call volume you may hear a message.")).toBeDefined()
    expect(view.getByText("Address street, Address unit")).toBeDefined()
    expect(view.getByText("Address city, CA 67890")).toBeDefined()
    expect(view.getByRole("link", { name: "Get directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/place/Address street, Address unit, Address city, CA 67890"
    )
    expect(view.getByText("Office hours")).toBeDefined()
    expect(view.getByText("Leasing office hours")).toBeDefined()
  })
})

describe("formatPhone", () => {
  it("removes dashes", () => {
    expect(formatPhone("123-456-7890")).toBe("1234567890")
  })
  it("removes parentheses", () => {
    expect(formatPhone("(123)4567890")).toBe("1234567890")
  })
  it("removes spaces", () => {
    expect(formatPhone("123 456 7890")).toBe("1234567890")
  })
})
