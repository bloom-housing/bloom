import React from "react"
import { addTranslation } from "@bloom-housing/ui-components"
import { mockNextRouter, render, screen } from "../testUtils"
import { SiteEyebrow } from "../../src/patterns/SiteEyebrow"
import { getJurisdictionEyebrowImageContent } from "../../src/static_content/jurisdiction_eyebrow_image"

jest.mock("../../src/static_content/jurisdiction_eyebrow_image", () => ({
  getJurisdictionEyebrowImageContent: jest.fn(),
}))

beforeEach(() => {
  mockNextRouter()
  ;(getJurisdictionEyebrowImageContent as jest.Mock).mockReturnValue({})
})

afterEach(() => {
  addTranslation({ nav: { eyebrow: { link: "" } } })
  addTranslation({ nav: { eyebrow: { text: "" } } })
  addTranslation({ nav: { eyebrow: { url: "" } } })
})

describe("SiteEyebrow", () => {
  it("should not display anything if nothing exists", () => {
    const res = render(<SiteEyebrow />)
    expect(res.container).toBeEmptyDOMElement()
  })

  it("should display the logo when it exists", () => {
    ;(getJurisdictionEyebrowImageContent as jest.Mock).mockReturnValue({
      logoSrc: "/images/default-housing-logo.svg",
    })

    render(<SiteEyebrow />)
    expect(screen.getByRole("img", { name: "Jurisdiction logo" })).toBeInTheDocument()
  })

  it("should display text when it exists", () => {
    addTranslation({ nav: { eyebrow: { text: "Eyebrow text" } } })

    render(<SiteEyebrow />)

    expect(screen.getByText("Eyebrow text")).toBeInTheDocument()

    expect(screen.queryByRole("img", { name: "Jurisdiction logo" })).not.toBeInTheDocument()
  })

  it("should display url when it exists", () => {
    addTranslation({ nav: { eyebrow: { url: "https://portal1.example.com" } } })

    render(<SiteEyebrow />)

    expect(screen.getByRole("link", { name: "https://portal1.example.com" })).toHaveAttribute(
      "href",
      "https://portal1.example.com"
    )
  })

  it("should display link for url when both exist", () => {
    addTranslation({ nav: { eyebrow: { link: "Eyebrow link" } } })
    addTranslation({ nav: { eyebrow: { url: "https://portal1.example.com" } } })

    render(<SiteEyebrow />)

    expect(screen.getByRole("link", { name: "Eyebrow link" })).toHaveAttribute(
      "href",
      "https://portal1.example.com"
    )
  })

  it("should display everything when all exist", () => {
    ;(getJurisdictionEyebrowImageContent as jest.Mock).mockReturnValue({
      logoSrc: "/images/default-housing-logo.svg",
    })

    addTranslation({ nav: { eyebrow: { link: "Eyebrow link" } } })
    addTranslation({ nav: { eyebrow: { text: "Eyebrow text" } } })
    addTranslation({ nav: { eyebrow: { url: "https://portal1.example.com" } } })

    render(<SiteEyebrow />)

    expect(screen.getByRole("img", { name: "Jurisdiction logo" })).toBeInTheDocument()
    expect(screen.getByText("Eyebrow text")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Eyebrow link" })).toHaveAttribute(
      "href",
      "https://portal1.example.com"
    )
  })
})
