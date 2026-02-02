import React from "react"
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react"
import FrequentlyAskedQuestions, {
  Questions,
  FaqCategory,
  FaqContent,
} from "../../src/patterns/FrequentlyAskedQuestions"

afterEach(cleanup)

describe("FrequentlyAskedQuestions", () => {
  describe("Questions", () => {
    const mockCategory: FaqCategory = {
      title: "Test Category",
      faqs: [
        {
          question: "What is the first question?",
          answer: "This is the first answer.",
        },
        {
          question: "What is the second question?",
          answer: "This is the second answer.",
        },
      ],
    }

    it("renders all questions", () => {
      render(<Questions category={mockCategory} />)

      expect(screen.getByText("What is the first question?")).toBeInTheDocument()
      expect(screen.getByText("What is the second question?")).toBeInTheDocument()
    })

    it("starts with all questions collapsed", () => {
      render(<Questions category={mockCategory} />)

      const buttons = screen.getAllByRole("button")
      expect(buttons[0]).toHaveAttribute("aria-expanded", "false")
      expect(buttons[1]).toHaveAttribute("aria-expanded", "false")

      expect(screen.queryByText("This is the first answer.")).not.toBeVisible()
      expect(screen.queryByText("This is the second answer.")).not.toBeVisible()
    })

    it("expands and collapses a question when clicked", () => {
      render(<Questions category={mockCategory} />)

      const firstButton = screen.getAllByRole("button")[0]

      fireEvent.click(firstButton)
      expect(firstButton).toHaveAttribute("aria-expanded", "true")
      const answerRegion = screen.getByRole("region", { name: "What is the first question?" })
      expect(answerRegion).toBeInTheDocument()
      expect(within(answerRegion).getByText("This is the first answer.")).toBeInTheDocument()

      fireEvent.click(firstButton)
      expect(firstButton).toHaveAttribute("aria-expanded", "false")
    })

    it("can expand multiple questions independently", () => {
      render(<Questions category={mockCategory} />)

      const buttons = screen.getAllByRole("button")

      fireEvent.click(buttons[0])
      fireEvent.click(buttons[1])

      expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
      expect(buttons[1]).toHaveAttribute("aria-expanded", "true")
    })

    it("has expected accessibility attributes", () => {
      render(<Questions category={mockCategory} />)

      const buttons = screen.getAllByRole("button")

      expect(buttons[0]).toHaveAttribute("id", "faq-question-0")
      expect(buttons[0]).toHaveAttribute("aria-controls", "faq-answer-0")

      expect(buttons[1]).toHaveAttribute("id", "faq-question-1")
      expect(buttons[1]).toHaveAttribute("aria-controls", "faq-answer-1")

      const regions = screen.getAllByRole("region")
      expect(regions[0]).toHaveAttribute("id", "faq-answer-0")
      expect(regions[0]).toHaveAttribute("aria-labelledby", "faq-question-0")

      expect(regions[1]).toHaveAttribute("id", "faq-answer-1")
      expect(regions[1]).toHaveAttribute("aria-labelledby", "faq-question-1")
    })

    it("renders jsx questions and answers", () => {
      const categoryWithNodes: FaqCategory = {
        title: "Test Category",
        faqs: [
          {
            question: (
              <span>
                Question with <strong>bold text</strong>
              </span>
            ),
            answer: (
              <div>
                Answer with <a href="/">link</a>
              </div>
            ),
          },
        ],
      }

      render(<Questions category={categoryWithNodes} />)

      expect(screen.getByText("bold text")).toBeInTheDocument()

      const button = screen.getByRole("button")
      fireEvent.click(button)

      expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("handles empty faqs array", () => {
      const emptyCategory: FaqCategory = {
        title: "Empty Category",
        faqs: [],
      }

      const { container } = render(<Questions category={emptyCategory} />)
      expect(container.querySelector("button")).not.toBeInTheDocument()
    })
  })
  const mockContent: FaqContent = {
    categories: [
      {
        title: "Category One",
        faqs: [
          {
            question: "Question 1A",
            answer: "Answer 1A",
          },
          {
            question: "Question 1B",
            answer: "Answer 1B",
          },
        ],
      },
      {
        title: "Category Two",
        faqs: [
          {
            question: "Question 2A",
            answer: "Answer 2A",
          },
        ],
      },
    ],
  }

  it("renders all category titles", () => {
    render(<FrequentlyAskedQuestions content={mockContent} />)

    expect(screen.getByText("Category One")).toBeInTheDocument()
    expect(screen.getByText("Category Two")).toBeInTheDocument()
  })

  it("renders all questions across all categories", () => {
    render(<FrequentlyAskedQuestions content={mockContent} />)

    expect(screen.getByText("Question 1A")).toBeInTheDocument()
    expect(screen.getByText("Question 1B")).toBeInTheDocument()
    expect(screen.getByText("Question 2A")).toBeInTheDocument()
  })

  it("expands and collapses questions in different categories independently", () => {
    render(<FrequentlyAskedQuestions content={mockContent} />)

    const buttons = screen.getAllByRole("button")

    // Expand first question in first category
    fireEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")

    // Expand first question in second category
    fireEvent.click(buttons[2])
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true")

    // Both should remain expanded
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true")
  })

  it("renders jsx category titles", () => {
    const contentWithNodeTitle: FaqContent = {
      categories: [
        {
          title: (
            <span>
              Category with <em>emphasis</em>
            </span>
          ),
          faqs: [
            {
              question: "Test question",
              answer: "Test answer",
            },
          ],
        },
      ],
    }

    render(<FrequentlyAskedQuestions content={contentWithNodeTitle} />)
    expect(screen.getByText("emphasis")).toBeInTheDocument()
  })

  it("renders multiple sections for multiple categories", () => {
    const { container } = render(<FrequentlyAskedQuestions content={mockContent} />)
    const sections = container.querySelectorAll("section")
    expect(sections).toHaveLength(2)
  })

  it("handles content with no categories", () => {
    const emptyContent: FaqContent = {
      categories: [],
    }

    const { container } = render(<FrequentlyAskedQuestions content={emptyContent} />)
    expect(container.querySelector("section")).not.toBeInTheDocument()
  })
})
