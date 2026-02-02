import { Link } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"
import { getJurisdictionFaqContent } from "./jurisdiction_faq_content"

export type FaqPageItem = {
  question: React.ReactNode | string
  answer: React.ReactNode | string
}

export type FaqCategory = {
  title: React.ReactNode
  faqs: FaqPageItem[]
}

export type FaqContent = {
  categories: FaqCategory[]
}

export const getFaqContent = (): FaqContent => {
  const faqContentSection: FaqCategory = {
    title: "Title for a category of frequently asked questions",
    faqs: [
      {
        question: "How does this work?",
        answer: (
          <Markdown>
            A design approach is a general philosophy that may or may not include a guide for
            specific methods. Some are to guide the overall goal of the design. Other approaches are
            to guide the tendencies of the designer. A combination of approaches may be used if they
            don't conflict. A design approach is a general philosophy that may or may not include a
            guide for specific methods. Some are to guide the overall goal of the design. Other
            approaches are to guide the tendencies of the designer. A combination of approaches may
            be used if they don't conflict. A design approach is a general philosophy that may or
            may not include a guide for specific methods. Some are to guide the overall goal of the
            design. Other approaches are to guide the tendencies of the designer. A combination of
            approaches may be used if they don't conflict.,
          </Markdown>
        ),
      },
      {
        question: "What happens next?",
        answer: (
          <>
            Firstly, a design approach is a general philosophy that may or may not include a guide
            for specific methods. Some are to guide the overall goal of the design. Other approaches
            are to guide the tendencies of the designer. A combination of approaches may be used if
            they don't conflict.
            <ul>
              <li>List item one </li>
              <li>List item two </li>
              <li>List item three </li>
              <li>
                <Link href={"/"}>Linked list item four </Link>
              </li>
              <li>
                List item five demonstrates multi-line list elements: A design approach is a general
                philosophy that may or may not include a guide for specific methods. Some are to
                guide the overall goal of the design. Other approaches are to guide the tendencies
                of the designer. A combination of approaches may be used if they don't conflict.
              </li>
            </ul>
          </>
        ),
      },
      {
        question:
          "How does this typically function in practice, and what does the overall experience usually involve?",
        answer: (
          <Markdown>
            A design approach is a general philosophy that may or may not include a guide for
            specific methods. Some are to guide the overall goal of the design. Other approaches are
            to guide the tendencies of the designer. A combination of approaches may be used if they
            don't conflict. A design approach is a general philosophy that may or may not include a
            guide for specific methods. Some are to guide the overall goal of the design. Other
            approaches are to guide the tendencies of the designer. A combination of approaches may
            be used if they don't conflict. A design approach is a general philosophy that may or
            may not include a guide for specific methods. Some are to guide the overall goal of the
            design. Other approaches are to guide the tendencies of the designer. A combination of
            approaches may be used if they don't conflict.
          </Markdown>
        ),
      },
    ],
  }
  const jurisdictionContent = getJurisdictionFaqContent()
  const genericContent = {
    categories: [faqContentSection, faqContentSection, faqContentSection],
  }
  return jurisdictionContent || genericContent
}
