import React from "react"
import { render, screen } from "@testing-library/react"
import PartnersFooter, {
  PartnerFooterProps,
} from "../../../src/components/core/PartnerFooterComponent"

const copyRight = `Copyright @ 2025 Bay Area Housing Finance Authority. All rights reserved`

const footerData: PartnerFooterProps = {
  copyRight: copyRight,
  links: [
    {
      text: "Doorway Partners Manual",
      hrerf: "https://docs.google.com/document/d/1W4tIMtUMwz4KqdcO5f4yZi0R5AU74P3B/edit",
    },
    {
      text: "Privacy Policy",
      hrerf: "https://mtc.ca.gov/doorway-housing-portal-privacy-policy",
    },
    {
      text: "Terms of Use",
      hrerf: "https://mtc.ca.gov/doorway-housing-portal-terms-use",
    },
  ],
}

describe("Partner Footer Component", () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2025-01-01"))
  })
  it("should not render links properly in the partners footer", () => {
    render(<PartnersFooter {...footerData} />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.queryByText("Doorway Partners Manual")).toBeInTheDocument()
    expect(screen.queryByText("Privacy Polic")).toBeInTheDocument()
    expect(screen.queryByText("Terms of Use")).toBeInTheDocument()
  })
})
