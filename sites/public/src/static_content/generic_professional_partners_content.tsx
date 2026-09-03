import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import Link from "next/link"
import { FaqCategory, FaqContent } from "../patterns/FrequentlyAskedQuestions"

export const getGenericProfessionalPartnersContent = (): FaqContent => {
  const faqContentSection: FaqCategory = {
    title: t("professionalPartners.genericHeading"),
    faqs: [
      {
        question: t("professionalPartners.whatIsHousingPortal"),
        answer: (
          <Markdown>{`${t("content.genericParagraph")} ${t("content.genericParagraph")} ${t(
            "content.genericParagraph"
          )}`}</Markdown>
        ),
      },
      {
        question: t("professionalPartners.whatIsTheRole"),
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
    ],
  }

  return {
    categories: [faqContentSection, faqContentSection],
  }
}
