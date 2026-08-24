import React from "react"
import { render, screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  getStoredFaqContent,
  getStoredFooterLinksContent,
  getStoredFooterTextContent,
  getStoredResourcesContent,
} from "../../src/static_content/stored_content"

const content = (fields: Partial<JurisdictionContentFields>): JurisdictionContentFields =>
  fields as JurisdictionContentFields

describe("getStoredFaqContent", () => {
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
    const result = getStoredFaqContent(faq)

    expect(result.categories).toHaveLength(1)
    expect(result.categories[0].title).toEqual("Applying")
    expect(result.categories[0].faqs[0].question).toEqual("How?")

    render(<div>{result.categories[0].faqs[0].answer}</div>)
    expect(screen.getByText("Apply online.")).toBeInTheDocument()
  })

  it("renders stored HTML as written, without markdown rules rewriting it", () => {
    const result = getStoredFaqContent(
      content({
        faq: {
          categories: [
            {
              id: "applying",
              title: "Applying",
              items: [
                {
                  id: "a",
                  question: "Priority?",
                  answerHtml: "<p>#1 priority is applying early</p>",
                },
                { id: "b", question: "Form?", answerHtml: "<p>Use form HUD-52517_rev_2</p>" },
              ],
            },
          ],
        },
      })
    )

    const { container } = render(
      <div>
        {result.categories[0].faqs.map((faq, index) => (
          <div key={index}>{faq.answer}</div>
        ))}
      </div>
    )

    expect(screen.getByText("#1 priority is applying early")).toBeInTheDocument()
    expect(screen.getByText("Use form HUD-52517_rev_2")).toBeInTheDocument()
    expect(container.querySelector("h1")).toBeNull()
    expect(container.querySelector("em")).toBeNull()
  })

  it("does not turn a markdown image in stored text into a request for it", () => {
    const result = getStoredFaqContent(
      content({
        faq: {
          categories: [
            {
              id: "applying",
              title: "Applying",
              items: [
                {
                  id: "how",
                  question: "How?",
                  answerHtml: "<p>Apply ![](https://example.test/p.png) online</p>",
                },
              ],
            },
          ],
        },
      })
    )

    const { container } = render(<div>{result.categories[0].faqs[0].answer}</div>)

    expect(container.querySelector("img")).toBeNull()
    expect(container.querySelector("link")).toBeNull()
  })

  it("hides an item when either of its required fields was emptied", () => {
    const emptied = getStoredFaqContent(
      content({
        faq: {
          categories: [
            {
              id: "applying",
              title: "Applying",
              items: [
                { id: "a", question: "", answerHtml: "<p>Apply online.</p>" },
                { id: "b", question: "When?", answerHtml: "" },
                { id: "c", question: "Where?", answerHtml: "<p>Anywhere.</p>" },
              ],
            },
          ],
        },
      })
    )

    expect(emptied.categories[0].faqs.map((faq) => faq.question)).toEqual(["Where?"])
  })

  it("drops a category once every item in it is hidden", () => {
    const result = getStoredFaqContent(
      content({
        faq: {
          categories: [
            {
              id: "applying",
              title: "Applying",
              items: [{ id: "a", question: "How?", answerHtml: "" }],
            },
          ],
        },
      })
    )

    expect(result.categories).toEqual([])
  })

  it("falls back when the stored lists are not lists", () => {
    const malformed = content({ faq: { categories: "not a list" } } as never)

    expect(getStoredFaqContent(malformed)).toBeNull()
  })

  it("falls back when the document sets no FAQ at all", () => {
    expect(getStoredFaqContent(null)).toBeNull()
    expect(getStoredFaqContent(content({}))).toBeNull()
  })

  it("shows an empty FAQ when the jurisdiction emptied the list, rather than falling back", () => {
    expect(getStoredFaqContent(content({ faq: { categories: [] } }))).toEqual({ categories: [] })
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

    expect(getStoredFaqContent(emptied).categories).toEqual([])
  })
})

describe("getStoredFooterTextContent", () => {
  it("renders each text section and keeps the logo", () => {
    const result = getStoredFooterTextContent(
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
    const result = getStoredFooterTextContent(
      content({ footer: { textSectionsHtml: ["", "<p>Kept</p>"] } })
    )

    expect(result.textSections).toHaveLength(1)
  })

  it("sets no key for a field the document leaves alone, so that field falls back", () => {
    expect(getStoredFooterTextContent(content({ footer: { links: [] } }))).toEqual({})
    expect(getStoredFooterTextContent(null)).toEqual({})
  })

  it("falls back when the text sections field is not a list", () => {
    const malformed = content({ footer: { textSectionsHtml: "<p>Hi</p>" } } as never)

    expect(getStoredFooterTextContent(malformed)).toEqual({})
  })
})

describe("getStoredFooterLinksContent", () => {
  it("maps links", () => {
    const result = getStoredFooterLinksContent(
      content({ footer: { links: [{ id: "about", text: "About", href: "/about" }] } })
    )

    expect(result.links).toEqual([{ text: "About", href: "/about" }])
  })

  it("drops a link missing its text or address", () => {
    const result = getStoredFooterLinksContent(
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

  it("shows no links when the jurisdiction emptied the list, rather than falling back", () => {
    expect(getStoredFooterLinksContent(content({ footer: { links: [] } }))).toEqual({ links: [] })
  })
})

describe("getStoredResourcesContent", () => {
  const sections = [
    {
      id: "immediate",
      sectionTitle: "Immediate help",
      sectionSubtitle: "Tonight",
      cards: [{ id: "shelter", title: "Shelter", href: "/shelter", contentHtml: "<p>Beds</p>" }],
    },
  ]

  it("hides a card when either of its required fields was emptied", () => {
    const result = getStoredResourcesContent(
      content({
        resources: {
          resourceSections: [
            {
              id: "immediate",
              sectionTitle: "Immediate help",
              cards: [
                { id: "a", title: "", href: "/a", contentHtml: "<p>Beds</p>" },
                { id: "b", title: "Food", href: "/b", contentHtml: "" },
                { id: "c", title: "Shelter", href: "/c", contentHtml: "<p>Beds</p>" },
              ],
            },
          ],
        },
      })
    )

    expect(result.resourceSections[0].cards).toHaveLength(1)
  })

  it("drops a section once every card in it is hidden, rather than leaving a heading alone", () => {
    const result = getStoredResourcesContent(
      content({
        resources: {
          resourceSections: [
            {
              id: "immediate",
              sectionTitle: "Immediate help",
              cards: [{ id: "a", title: "Shelter", href: "/a", contentHtml: "" }],
            },
          ],
        },
      })
    )

    expect(result.resourceSections).toEqual([])
  })

  it("falls back when the stored lists are not lists", () => {
    const malformed = content({ resources: { resourceSections: "not a list" } } as never)

    expect(getStoredResourcesContent(malformed)).toEqual({})
  })

  it("maps sections and renders each card", () => {
    const result = getStoredResourcesContent(
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
    const result = getStoredResourcesContent(
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

  it("sets no key for a field the document leaves alone, so that field falls back", () => {
    expect(getStoredResourcesContent(content({ resources: {} }))).toEqual({})
    expect(getStoredResourcesContent(null)).toEqual({})
  })
})
