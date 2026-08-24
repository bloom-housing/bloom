import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ResourceCards } from "../components/resources/Resources"
import ResourceCard from "../components/resources/ResourceCard"
import { StoredHtml } from "../components/shared/StoredHtml"
import { FaqContent } from "../patterns/FrequentlyAskedQuestions"
import { asList, hasText } from "./contentHelpers"
import { FooterContent, FooterLinks } from "./generic_footer_content"

export const getStoredFaqContent = (
  content?: JurisdictionContentFields | null
): FaqContent | null => {
  if (!Array.isArray(content?.faq?.categories)) return null

  const categories = content.faq.categories
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

  return { categories }
}

export const getStoredFooterTextContent = (
  content?: JurisdictionContentFields | null
): Partial<FooterContent> => {
  const footer = content?.footer
  const stored: Partial<FooterContent> = {}

  if (Array.isArray(footer?.textSectionsHtml)) {
    stored.textSections = footer.textSectionsHtml
      .filter(hasText)
      .map((section, index) => <StoredHtml key={index} html={section} />)
  }

  if (footer?.logo) {
    stored.logo = hasText(footer.logo.logoSrc)
      ? {
          logoSrc: footer.logo.logoSrc,
          logoAltText: footer.logo.logoAltText,
          logoUrl: footer.logo.logoUrl,
        }
      : undefined
  }

  return stored
}

export const getStoredFooterLinksContent = (
  content?: JurisdictionContentFields | null
): Partial<FooterLinks> => {
  const links = content?.footer?.links
  if (!Array.isArray(links)) return {}

  return {
    links: links
      .filter((link) => hasText(link.text) && hasText(link.href))
      .map((link) => ({ text: link.text, href: link.href })),
  }
}

export const getStoredResourcesContent = (
  content?: JurisdictionContentFields | null
): Partial<ResourceCards> => {
  const resources = content?.resources
  const stored: Partial<ResourceCards> = {}

  if (Array.isArray(resources?.resourceSections)) {
    stored.resourceSections = resources.resourceSections
      .map((section) => ({
        sectionTitle: section.sectionTitle,
        sectionSubtitle: section.sectionSubtitle,
        cards: asList(section.cards)
          .filter((card) => hasText(card.title) && hasText(card.contentHtml))
          .map((card) => (
            <ResourceCard
              key={card.id}
              title={card.title}
              href={hasText(card.href) ? card.href : undefined}
              content={<StoredHtml html={card.contentHtml} />}
            />
          )),
      }))
      .filter((section) => section.cards.length > 0)
  }

  if (resources?.contactCard) {
    const card = resources.contactCard
    const contactCard = {
      departmentTitle: hasText(card.departmentTitle) ? card.departmentTitle : undefined,
      description: hasText(card.description) ? card.description : undefined,
      email: hasText(card.email) ? card.email : undefined,
    }
    stored.contactCard = Object.values(contactCard).some(Boolean) ? contactCard : undefined
  }

  return stored
}
