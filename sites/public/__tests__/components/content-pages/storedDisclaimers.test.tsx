import React from "react"
import { screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import DisclaimerSeeds from "../../../src/components/content-pages/DisclaimerSeeds"
import DisclaimerDeprecated from "../../../src/components/content-pages/DisclaimerDeprecated"
import PrivacySeeds from "../../../src/components/content-pages/PrivacySeeds"
import PrivacyDeprecated from "../../../src/components/content-pages/PrivacyDeprecated"
import { JurisdictionContentContext } from "../../../src/lib/JurisdictionContentContext"

beforeAll(() => mockNextRouter())

const renderWith = (
  Component: React.FunctionComponent,
  content: JurisdictionContentFields | null
) =>
  render(
    <JurisdictionContentContext.Provider value={content}>
      <Component />
    </JurisdictionContentContext.Provider>
  )

const stored = (disclaimers: Record<string, string>) =>
  ({ disclaimers } as JurisdictionContentFields)

// The bundled page is several markdown headings. Counting them, rather than matching their words,
// keeps this off the shipped content.
const headings = (container: HTMLElement) => container.querySelectorAll("h2, h3, h4").length

describe.each([
  ["DisclaimerSeeds", DisclaimerSeeds, "disclaimerHtml"],
  ["DisclaimerDeprecated", DisclaimerDeprecated, "disclaimerHtml"],
  ["PrivacySeeds", PrivacySeeds, "privacyHtml"],
  ["PrivacyDeprecated", PrivacyDeprecated, "privacyHtml"],
])("%s", (_name, Component, field) => {
  it("renders the jurisdiction's text in place of the bundled page", () => {
    const { container } = renderWith(Component, stored({ [field]: "<p>Our own policy</p>" }))

    expect(screen.getByText("Our own policy")).toBeInTheDocument()
    expect(headings(container)).toEqual(0)
  })

  it("renders nothing in place of the page when the jurisdiction emptied it", () => {
    const { container: bundled } = renderWith(Component, stored({}))
    const { container: emptied } = renderWith(Component, stored({ [field]: "" }))

    expect(headings(bundled)).toBeGreaterThan(0)
    expect(headings(emptied)).toEqual(0)
  })

  it("keeps the bundled page when the jurisdiction stored nothing for it", () => {
    const { container } = renderWith(Component, stored({}))

    expect(headings(container)).toBeGreaterThan(0)
  })
})
