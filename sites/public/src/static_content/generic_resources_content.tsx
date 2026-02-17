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
        cards: Array.from({ length: 30 }, () => mockCard),
      },
      {
        sectionTitle: t("resources.housingProgramsTitle"),
        cards: Array.from({ length: 30 }, () => mockCard),
      },
    ],
  }
}
