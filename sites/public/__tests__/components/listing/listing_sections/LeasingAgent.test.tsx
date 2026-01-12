import React from "react"
import { render, cleanup } from "@testing-library/react"

import {
  formatPhone,
  LeasingAgent,
} from "../../../../src/components/listing/listing_sections/LeasingAgent"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { screen } from "../../../testUtils"
import * as helpers from "../../../../src/lib/helpers"

afterEach(cleanup)

describe("<LeasingAgent>", () => {
  it("shows nothing if no content passed", () => {
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: () => true,
        }}
      >
        <LeasingAgent listing={listing} />
      </AuthContext.Provider>
    )
    expect(screen.queryByText("Leasing Agent")).toBeNull()
  })

  it("shows all content enableLeasingAgentAltText on", () => {
    const phoneNumber = "(123) 456-7890"
    jest.spyOn(helpers, "isFeatureFlagOn").mockReturnValue(true)
    render(
      <AuthContext.Provider value={{}}>
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
            managementWebsite: "https://example.com",
          }}
        />
      </AuthContext.Provider>
    )

    expect(screen.getByRole("link", { name: "Website" })).toHaveAttribute(
      "href",
      "https://example.com"
    )
    expect(screen.getByText("Agent Name")).toBeInTheDocument()
    expect(screen.getByText("Agent title")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: `Call ${phoneNumber}` })).toHaveAttribute(
      "href",
      "tel:1234567890"
    )
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:leasing@agent.com"
    )
    expect(screen.getByText("Due to high call volume you may hear a message.")).toBeInTheDocument()
    expect(screen.getByText("Address street, Address unit")).toBeInTheDocument()
    expect(screen.getByText("Address city, CA 67890")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Get directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/place/Address street, Address unit, Address city, CA 67890"
    )
    expect(screen.getByText("Office hours")).toBeInTheDocument()
    expect(screen.getByText("Leasing office hours")).toBeInTheDocument()
    expect(screen.getByText("Contact leasing agent or property manager")).toBeInTheDocument()
  })
  it("shows all content enableLeasingAgentAltText off", () => {
    const phoneNumber = "(123) 456-7890"
    jest.spyOn(helpers, "isFeatureFlagOn").mockReturnValue(false)
    render(
      <AuthContext.Provider value={{}}>
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
        />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Contact leasing agent")).toBeInTheDocument()
    expect(screen.getByText("Agent Name")).toBeInTheDocument()
    expect(screen.getByText("Agent title")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: `Call ${phoneNumber}` })).toHaveAttribute(
      "href",
      "tel:1234567890"
    )
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:leasing@agent.com"
    )
    expect(screen.getByText("Due to high call volume you may hear a message.")).toBeInTheDocument()
    expect(screen.getByText("Address street, Address unit")).toBeInTheDocument()
    expect(screen.getByText("Address city, CA 67890")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Get directions" })).toHaveAttribute(
      "href",
      "https://www.google.com/maps/place/Address street, Address unit, Address city, CA 67890"
    )
    expect(screen.getByText("Office hours")).toBeInTheDocument()
    expect(screen.getByText("Leasing office hours")).toBeInTheDocument()
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
