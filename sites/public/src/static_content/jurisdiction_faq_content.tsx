import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StoredHtml } from "../components/shared/StoredHtml"
import { FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { asList, hasText } from "./contentHelpers"

export const getJurisdictionFaqContent = (
  content?: JurisdictionContentFields | null
): FaqContent | null => {
  const categories = asList(content?.faq?.categories)
    .map((category) => ({
      title: category.title,
      faqs: asList(category.items)
        .filter((item) => hasText(item.question) && hasText(item.answerHtml))
        .map((item) => ({
          question: item.question,
          answer: <StoredHtml html={item.answerHtml} />,
        })),
    }))
    .filter((category) => category.faqs.length > 0)

  return categories.length ? { categories } : null
}
