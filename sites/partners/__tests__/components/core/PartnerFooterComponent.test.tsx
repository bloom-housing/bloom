import React from "react"
import { render, screen } from "@testing-library/react"
import PartnersFooter from "../../../src/components/core/PartnerFooterComponent"

describe("Partner Footer Component", () => {
  it("should not render links properly in the partners footer", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2025-01-01"))
    render(<PartnersFooter />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Doorway Partners Manual" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Terms of Use" })).toBeInTheDocument()
  })
})
