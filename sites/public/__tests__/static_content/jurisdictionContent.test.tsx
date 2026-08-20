import React from "react"
import { render, screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getJurisdictionFaqContent } from "../../src/static_content/jurisdiction_faq_content"
import {
  getJurisdictionFooterLinksContent,
  getJurisdictionFooterTextContent,
} from "../../src/static_content/jurisdiction_footer_content"
import { getJurisdictionResourcesContent } from "../../src/static_content/jurisdiction_resources_content"

const content = (fields: Partial<JurisdictionContentFields>): JurisdictionContentFields =>
  fields as JurisdictionContentFields

describe("getJurisdictionFaqContent", () => {
  const faq = content({
    faq: {
      categories: [
        {
          id: "applying",
          title: "Applying",
          items: [{ id: "how", question: "How?", answerHtml: "<p>Apply online.</p>" }],
        },
      ],
    },
  })

  it("maps categories and renders the answer as rich text", () => {
    const result = getJurisdictionFaqContent(faq)

    expect(result.categories).toHaveLength(1)
    expect(result.categories[0].title).toEqual("Applying")
    expect(result.categories[0].faqs[0].question).toEqual("How?")

    render(<div>{result.categories[0].faqs[0].answer}</div>)
    expect(screen.getByText("Apply online.")).toBeInTheDocument()
  })

  it("returns null when there is nothing to show, so the bundled content stands", () => {
    expect(getJurisdictionFaqContent(null)).toBeNull()
    expect(getJurisdictionFaqContent(content({}))).toBeNull()
    expect(getJurisdictionFaqContent(content({ faq: { categories: [] } }))).toBeNull()
  })

  it("drops a category whose questions were all emptied", () => {
    const emptied = content({
      faq: {
        categories: [
          {
            id: "applying",
            title: "Applying",
            items: [{ id: "how", question: "", answerHtml: "" }],
          },
        ],
      },
    })

    expect(getJurisdictionFaqContent(emptied)).toBeNull()
  })
})

describe("getJurisdictionFooterTextContent", () => {
  it("renders each text section and keeps the logo", () => {
    const result = getJurisdictionFooterTextContent(
      content({
        footer: {
          textSectionsHtml: ["<p>A section</p>"],
          logo: { logoSrc: "/logo.svg", logoAltText: "Logo", logoUrl: "/" },
        },
      })
    )

    expect(result.logo.logoSrc).toEqual("/logo.svg")
    render(<div>{result.textSections}</div>)
    expect(screen.getByText("A section")).toBeInTheDocument()
  })

  it("drops an emptied section", () => {
    const result = getJurisdictionFooterTextContent(
      content({ footer: { textSectionsHtml: ["", "<p>Kept</p>"] } })
    )

    expect(result.textSections).toHaveLength(1)
  })

  it("returns null without sections or a logo", () => {
    expect(getJurisdictionFooterTextContent(content({ footer: { links: [] } }))).toBeNull()
    expect(getJurisdictionFooterTextContent(null)).toBeNull()
  })
})

describe("getJurisdictionFooterLinksContent", () => {
  it("maps links and keeps the copyright line, which the document does not carry", () => {
    const result = getJurisdictionFooterLinksContent(
      content({ footer: { links: [{ id: "about", text: "About", href: "/about" }] } })
    )

    expect(result.links).toEqual([{ text: "About", href: "/about" }])
    expect(result.cityString).toBeTruthy()
  })

  it("drops a link missing its text or address", () => {
    const result = getJurisdictionFooterLinksContent(
      content({
        footer: {
          links: [
            { id: "a", text: "", href: "/a" },
            { id: "b", text: "B", href: "" },
            { id: "c", text: "C", href: "/c" },
          ],
        },
      })
    )

    expect(result.links).toEqual([{ text: "C", href: "/c" }])
  })

  it("returns null when no link survives", () => {
    expect(getJurisdictionFooterLinksContent(content({ footer: { links: [] } }))).toBeNull()
  })
})

describe("getJurisdictionResourcesContent", () => {
  const sections = [
    {
      id: "immediate",
      sectionTitle: "Immediate help",
      sectionSubtitle: "Tonight",
      cards: [{ id: "shelter", title: "Shelter", href: "/shelter", contentHtml: "<p>Beds</p>" }],
    },
  ]

  it("maps sections and renders each card", () => {
    const result = getJurisdictionResourcesContent(
      content({
        resources: {
          contactCard: {
            departmentTitle: "Housing",
            description: "Call us",
            email: "help@bloom.gov",
          },
          resourceSections: sections,
        },
      })
    )

    expect(result.contactCard.departmentTitle).toEqual("Housing")
    expect(result.resourceSections[0].sectionTitle).toEqual("Immediate help")

    render(<div>{result.resourceSections[0].cards}</div>)
    expect(screen.getByText("Shelter")).toBeInTheDocument()
    expect(screen.getByText("Beds")).toBeInTheDocument()
  })

  it("leaves out a contact card whose fields were emptied", () => {
    const result = getJurisdictionResourcesContent(
      content({
        resources: {
          contactCard: { departmentTitle: "", description: "", email: "" },
          resourceSections: sections,
        },
      })
    )

    expect(result.contactCard).toBeUndefined()
    expect(result.resourceSections).toHaveLength(1)
  })

  it("returns null with no sections and no contact card", () => {
    expect(getJurisdictionResourcesContent(content({ resources: {} }))).toBeNull()
    expect(getJurisdictionResourcesContent(null)).toBeNull()
  })
})
