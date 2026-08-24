import React from "react"
import { screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import Resources from "../../../src/components/resources/Resources"
import { JurisdictionContentContext } from "../../../src/lib/JurisdictionContentContext"

beforeAll(() => {
  mockNextRouter()
})

const renderResources = (content: JurisdictionContentFields | null) =>
  render(
    <JurisdictionContentContext.Provider value={content}>
      <Resources />
    </JurisdictionContentContext.Provider>
  )

const storedSections = {
  resources: {
    resourceSections: [
      {
        id: "immediate",
        sectionTitle: "Immediate help",
        cards: [
          {
            id: "shelter",
            title: "Emergency shelter",
            href: "/shelter",
            contentHtml: "<p>Beds tonight</p>",
          },
        ],
      },
    ],
  },
} as JurisdictionContentFields

describe("<Resources>", () => {
  it("renders the jurisdiction's sections in place of the bundled ones", () => {
    renderResources(storedSections)

    expect(screen.getByRole("heading", { name: "Immediate help" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Emergency shelter" })).toHaveAttribute(
      "href",
      "/shelter"
    )
    expect(screen.getByText("Beds tonight")).toBeInTheDocument()
    expect(screen.queryByText("Lorem Ipsum")).not.toBeInTheDocument()
  })

  it("keeps the bundled contact card when the document sets only sections", () => {
    renderResources(storedSections)

    // The card is built from translation values, which a jurisdiction overrides separately.
    expect(screen.getByRole("heading", { name: "Immediate help" })).toBeInTheDocument()
    expect(
      screen.getByText("Bloomington's Housing & Community Development Department")
    ).toBeInTheDocument()
  })

  it("renders the bundled content when the page supplied none", () => {
    renderResources(null)

    expect(screen.queryByRole("heading", { name: "Immediate help" })).not.toBeInTheDocument()
    expect(screen.getAllByText("Lorem Ipsum").length).toBeGreaterThan(0)
  })
})
