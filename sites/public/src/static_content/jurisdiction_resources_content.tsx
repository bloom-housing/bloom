import { t } from "@bloom-housing/ui-components"
import ResourceCard from "../components/resources/ResourceCard"
import { ResourceCards } from "../components/resources/Resources"

export const getJurisdictionResourcesContent = (): ResourceCards | null => {
  return {
    resourceSections: [
      {
        sectionTitle: t("resources.immediateHousingTitle"),
        sectionSubtitle: t("help.housingHelp.immediateHousingAssistanceHeader"),
        cards: [
          <ResourceCard
            title={t("help.housingHelp.immediate.alamedaBACS")}
            href="https://www.bayareacs.org/"
            content={t("help.housingHelp.immediate.alamedaBACSinfo")}
          />,
          <ResourceCard
            title={t("help.housingHelp.immediate.alamedaOD")}
            href="https://operationdignity.org/"
            content={t("help.housingHelp.immediate.alamedaODinfo")}
          />,
          // TODO: add all other content cards here
        ],
      },
      {
        sectionTitle: t("help.housingHelp.counseling.title"),
        cards: [
          <ResourceCard
            title={t("help.housingHelp.counseling.HUD")}
            href="https://hudgov-answers.force.com/housingcounseling/"
            content={t("help.housingHelp.counseling.HUDinfo")}
          />,
          // TODO: add all other content cards here
        ],
      },
    ],
  }
}
