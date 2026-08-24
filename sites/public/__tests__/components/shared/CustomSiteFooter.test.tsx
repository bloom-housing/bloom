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

  it("keeps the bundled links when the jurisdiction only stored footer text", () => {
    renderFooter({
      footer: { textSectionsHtml: ["<p>Run by the housing office</p>"] },
    } as JurisdictionContentFields)

    expect(screen.getByText("Run by the housing office")).toBeInTheDocument()
    expect(
      screen.getAllByRole("link").some((link) => link.getAttribute("href") === "/privacy")
    ).toBe(true)
  })

  it("keeps the bundled logo when the jurisdiction only stored footer text", () => {
    renderFooter({
      footer: { textSectionsHtml: ["<p>Run by the housing office</p>"] },
    } as JurisdictionContentFields)

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/default-housing-logo.svg")
  })

  it("keeps the bundled text when the jurisdiction only stored links", () => {
    renderFooter({
      footer: { links: [{ id: "about", text: "About us", href: "/about" }] },
    } as JurisdictionContentFields)

    expect(screen.getByRole("link", { name: "About us" })).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/default-housing-logo.svg")
  })

  it("shows no links when the jurisdiction emptied its own list", () => {
    renderFooter({ footer: { links: [] } } as JurisdictionContentFields)

    expect(
      screen.queryAllByRole("link").some((link) => link.getAttribute("href") === "/privacy")
    ).toBe(false)
  })

  // Every page renders the footer, and 40 of them have no data function yet (#6594).
  it("renders the bundled footer when a page supplied none", () => {
    renderFooter(null)

    expect(screen.queryByText("Run by the housing office")).not.toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
