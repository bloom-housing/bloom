import React from "react"
import { render, screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import CustomSiteFooter from "../../../src/components/shared/CustomSiteFooter"
import { JurisdictionContentProvider } from "../../../src/lib/JurisdictionContentContext"

const renderFooter = (content: JurisdictionContentFields | null) =>
  render(
    <JurisdictionContentProvider content={content}>
      <CustomSiteFooter />
    </JurisdictionContentProvider>
  )

describe("<CustomSiteFooter>", () => {
  it("renders the jurisdiction's footer when a page supplied content", () => {
    renderFooter({
      footer: {
        textSectionsHtml: ["<p>Run by the housing office</p>"],
        links: [{ id: "about", text: "About us", href: "/about" }],
      },
    } as JurisdictionContentFields)

    expect(screen.getByText("Run by the housing office")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about")
  })

  // Every page renders the footer, and 40 of them have no data function yet (#6594).
  it("renders the bundled footer when a page supplied none", () => {
    renderFooter(null)

    expect(screen.queryByText("Run by the housing office")).not.toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
