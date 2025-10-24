import React from "react"
import { render, screen } from "@testing-library/react"
import PartnersFooter from "../../../src/components/core/PartnerFooterComponent"

describe("Partner Footer Component", () => {
  it("should not render links properly in the partners footer", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2025-01-01"))
    render(<PartnersFooter />)
    expect(
      screen.getByText("Copyright @ 2025 Bay Area Housing Finance Authority. All rights reserved")
    ).toBeInTheDocument()
    const partnerManualLink = screen.getByRole("link", { name: "Doorway Partners Manual" })
    const privacyPolicyLink = screen.getByRole("link", { name: "Privacy Policy" })
    const termsOfUselLink = screen.getByRole("link", { name: "Terms of Use" })

    expect(partnerManualLink).toBeInTheDocument()
    expect(partnerManualLink).toHaveAttribute(
      "href",
      "https://docs.google.com/document/d/1W4tIMtUMwz4KqdcO5f4yZi0R5AU74P3B/edit"
    )
    expect(privacyPolicyLink).toBeInTheDocument()
    expect(privacyPolicyLink).toHaveAttribute(
      "href",
      "https://mtc.ca.gov/doorway-housing-portal-privacy-policy"
    )
    expect(termsOfUselLink).toBeInTheDocument()
    expect(termsOfUselLink).toHaveAttribute(
      "href",
      "https://mtc.ca.gov/doorway-housing-portal-terms-use"
    )
  })
})
