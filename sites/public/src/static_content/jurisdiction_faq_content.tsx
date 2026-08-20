import Markdown from "markdown-to-jsx"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FaqContent } from "../patterns/FrequentlyAskedQuestions"

// A field an admin has emptied is how a piece of a document is hidden, so it is dropped rather than
// rendered as an empty block. A document with nothing left to show returns null, and the caller
// falls back to the generic content this repository bundles.
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
          answer: hasText(item.answerHtml) ? <Markdown>{item.answerHtml}</Markdown> : null,
        })),
    }))
    .filter((category) => category.faqs.length > 0)

  return categories.length ? { categories } : null
}
