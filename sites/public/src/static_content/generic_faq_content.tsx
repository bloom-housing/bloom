import Markdown from "markdown-to-jsx"
import { Link } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { getJurisdictionFaqContent } from "./jurisdiction_faq_content"

export const getFaqContent = (): FaqContent => {
  const faqContentSection: FaqCategory = {
    title: t("faq.genericHeading"),
    faqs: [
      {
        question: t("faq.howDoesThisWork"),
        answer: (
          <Markdown>{`${t("content.genericParagraph")} ${t("content.genericParagraph")} ${t(
            "content.genericParagraph"
          )}`}</Markdown>
        ),
      },
      {
        question: t("faq.whatHappensNext"),
        answer: (
          <>
            {t("content.genericParagraph")}
            <ul>
              <li>List item one </li>
              <li>List item two </li>
              <li>List item three </li>
              <li>
                <Link href={"/"}>Linked list item four </Link>
              </li>
              <li>
                {`List item five demonstrates multi-line list elements: ${t(
                  "content.genericParagraph"
                )}`}
              </li>
            </ul>
          </>
        ),
      },
      {
        question: t("faq.howDoesThisFunction"),
        answer: t("content.genericParagraph"),
      },
    ],
  }
  const jurisdictionContent = getJurisdictionFaqContent()
  const genericContent = {
    categories: [faqContentSection, faqContentSection, faqContentSection],
  }
  return jurisdictionContent || genericContent
}
