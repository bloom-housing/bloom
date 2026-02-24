import { t } from "@bloom-housing/ui-components"
import ResourceCard from "../components/resources/ResourceCard"
import { ResourceCards } from "../components/resources/Resources"

export const getGenericResourcesContent = (): ResourceCards => {
  const mockTitle = "Lorem Ipsum"
  const mockDescription =
    "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  const mockCard = <ResourceCard title={mockTitle} href="/" content={mockDescription} />
  const mockCardNoLink = <ResourceCard title={mockTitle} content={mockDescription} />
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
