import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

const multiCategoryFaq = {
  faq: {
    categories: [
      {
        id: "applying",
        title: "How do I apply?",
        items: [
          {
            id: "documents",
            question: "What documents do I need?",
            answerHtml: "<p>Apply through this site.</p>",
          },
        ],
      },
      {
        id: "next-steps",
        title: "What happens after I apply?",
        items: [
          {
            id: "timeline",
            question: "How long does review take?",
            answerHtml: "<p>You'll hear back within two weeks.</p>",
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

  describe("table of contents", () => {
    it("renders a link for each FAQ question, pointing to its section", () => {
      renderFaq(multiCategoryFaq)

      const applyingHeading = screen.getByRole("heading", { name: "How do I apply?" })
      const nextStepsHeading = screen.getByRole("heading", { name: "What happens after I apply?" })

      expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument()
      const applyingLink = screen.getByRole("link", { name: "How do I apply?" })
      const nextStepsLink = screen.getByRole("link", { name: "What happens after I apply?" })

      expect(applyingLink).toHaveAttribute("href", `#${applyingHeading.closest("section")?.id}`)
      expect(nextStepsLink).toHaveAttribute("href", `#${nextStepsHeading.closest("section")?.id}`)
    })

    it("navigates to the correct question's section when a link is clicked", async () => {
      renderFaq(multiCategoryFaq)

      const nextStepsHeading = screen.getByRole("heading", { name: "What happens after I apply?" })
      const nextStepsSectionId = nextStepsHeading.closest("section")?.id
      const nextStepsLink = screen.getByRole("link", { name: "What happens after I apply?" })

      await userEvent.click(nextStepsLink)

      expect(window.location.hash).toBe(`#${nextStepsSectionId}`)
    })
  })
})
