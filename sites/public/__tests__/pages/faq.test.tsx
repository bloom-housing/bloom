import React from "react"
import { screen } from "@testing-library/react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../testUtils"
import FaqPage from "../../src/pages/faq"
import { JurisdictionContentContext } from "../../src/lib/JurisdictionContentContext"

beforeAll(() => {
  mockNextRouter()
})

const renderFaq = (content: JurisdictionContentFields | null) =>
  render(
    <JurisdictionContentContext.Provider value={content}>
      <FaqPage jurisdiction={null} />
    </JurisdictionContentContext.Provider>
  )

const storedFaq = {
  faq: {
    categories: [
      {
        id: "applying",
        title: "Applying for housing",
        items: [
          {
            id: "how",
            question: "How do I apply?",
            answerHtml: "<p>Apply through this site.</p>",
          },
        ],
      },
    ],
  },
} as JurisdictionContentFields

describe("<FaqPage>", () => {
  it("renders the jurisdiction's questions in place of the bundled ones", () => {
    renderFaq(storedFaq)

    expect(screen.getByRole("heading", { name: "Applying for housing" })).toBeInTheDocument()
    expect(screen.getByText("How do I apply?")).toBeInTheDocument()
    expect(screen.getByText("Apply through this site.")).toBeInTheDocument()
  })

  it("renders the bundled questions when the page supplied no content", () => {
    renderFaq(null)

    expect(screen.queryByRole("heading", { name: "Applying for housing" })).not.toBeInTheDocument()
    expect(screen.queryByText("How do I apply?")).not.toBeInTheDocument()
    expect(document.querySelector(".markdown")?.textContent?.trim()).not.toBe("")
  })
})
