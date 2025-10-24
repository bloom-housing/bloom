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
      hrerf: "",
    },
    {
      text: "Privacy Policy",
      hrerf: "",
    },
    {
      text: "Terms of Use",
      hrerf: "",
    },
  ],
}

describe("Partner Footer Component", () => {
  it("should not render links properly in the partners footer", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2025-01-01"))
    render(<PartnersFooter {...footerData} />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.queryByText("Doorway Partners Manual", { selector: "a" })).toBeInTheDocument()
    expect(screen.queryByText("Privacy Policy", { selector: "a" })).toBeInTheDocument()
    expect(screen.queryByText("Terms of Use", { selector: "a" })).toBeInTheDocument()
  })
})
