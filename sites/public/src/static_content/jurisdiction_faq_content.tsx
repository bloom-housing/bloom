import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StoredHtml } from "../components/shared/StoredHtml"
import { FaqContent } from "../patterns/FrequentlyAskedQuestions"

const hasText = (value?: string | null) => !!value?.trim()

export const getJurisdictionFaqContent = (
  content?: JurisdictionContentFields | null
): FaqContent | null => {
  const categories = (content?.faq?.categories ?? [])
    .map((category) => ({
      title: category.title,
      faqs: (category.items ?? [])
        .filter((item) => hasText(item.question) || hasText(item.answerHtml))
        .map((item) => ({
          question: item.question,
          answer: hasText(item.answerHtml) ? <StoredHtml html={item.answerHtml} /> : null,
        })),
    }))
    .filter((category) => category.faqs.length > 0)

  return categories.length ? { categories } : null
}
