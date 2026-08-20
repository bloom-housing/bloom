import Markdown from "markdown-to-jsx"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ResourceCards } from "../components/resources/Resources"
import ResourceCard from "../components/resources/ResourceCard"

const hasText = (value?: string | null) => !!value?.trim()

export const getJurisdictionResourcesContent = (
  content?: JurisdictionContentFields | null
): ResourceCards | null => {
  const resources = content?.resources
  if (!resources) return null

  const resourceSections = (resources.resourceSections ?? [])
    .map((section) => ({
      sectionTitle: section.sectionTitle,
      sectionSubtitle: section.sectionSubtitle,
      cards: (section.cards ?? [])
        .filter((card) => hasText(card.title) || hasText(card.contentHtml))
        .map((card) => (
          <ResourceCard
            key={card.id}
            title={card.title}
            href={hasText(card.href) ? card.href : undefined}
            content={hasText(card.contentHtml) ? <Markdown>{card.contentHtml}</Markdown> : ""}
          />
        )),
    }))
    .filter((section) => section.cards.length > 0 || hasText(section.sectionTitle))

  const contactCard = {
    departmentTitle: hasText(resources.contactCard?.departmentTitle)
      ? resources.contactCard.departmentTitle
      : undefined,
    description: hasText(resources.contactCard?.description)
      ? resources.contactCard.description
      : undefined,
    email: hasText(resources.contactCard?.email) ? resources.contactCard.email : undefined,
  }
  const hasContactCard = Object.values(contactCard).some(Boolean)

  if (!resourceSections.length && !hasContactCard) return null

  return {
    contactCard: hasContactCard ? contactCard : undefined,
    resourceSections,
  }
}
