import { t } from "@bloom-housing/ui-components"
import ResourceCard from "../components/resources/ResourceCard"
import { ResourceCards } from "../components/resources/Resources"

export const getGenericResourcesContent = (): ResourceCards => {
  const mockCard = (
    <ResourceCard
      title={t("resources.mockCardTitle")}
      href="/"
      content={t("resources.mockCardDescription")}
    />
  )
  const mockCardNoLink = (
    <ResourceCard
      title={t("resources.mockCardTitle")}
      content={t("resources.mockCardDescription")}
    />
  )
  return {
    contactCard: {
      description: t("resources.contactDescription"),
      email: t("resources.contactEmail"),
      departmentTitle: t("resources.contactInfo"),
    },
    resourceSections: [
      {
        sectionTitle: t("resources.immediateHousingTitle"),
        sectionSubtitle: t("resources.immediateHousingSubtitle"),
        cards: [
          ...Array.from({ length: 15 }, () => mockCard),
          ...Array.from({ length: 15 }, () => mockCardNoLink),
        ],
      },
      {
        sectionTitle: t("resources.housingProgramsTitle"),
        cards: [
          ...Array.from({ length: 15 }, () => mockCard),
          ...Array.from({ length: 15 }, () => mockCardNoLink),
        ],
      },
    ],
  }
}
