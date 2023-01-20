import React from "react"
import Markdown from "markdown-to-jsx"
import { t, InfoCardGrid, MarkdownSection } from "@bloom-housing/ui-components"
import RenderIf from "../../../RenderIf"
import Resource from "../../../Resource"
import HowItWorks from "./resources/HowItWorks.md"
import SMCHousingSearch from "./resources/SMCHousingSearch.md"
import HavenConnect from "./resources/HavenConnect.md"
import AffordableRentalHousingList from "./resources/AffordableRentalHousingList.md"
import HIPHousing from "./resources/HIPHousing.md"
import HAotCoSM from "./resources/HAotCoSM.md"
import CIH from "./resources/CIH.md"
import BayArea211 from "./resources/BayArea211.md"
import ProjectSentinel from "./resources/ProjectSentinel.md"
import HousingChoices from "./resources/HousingChoices.md"
import sidebarContent from "./resources/sidebar.md"

export const AdditionalResourcesSection = () => {
  return (
    <section className="md:px-5">
      <article className="markdown max-w-5xl m-auto md:flex">
        <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
          <MarkdownSection>
            <InfoCardGrid
              title={t("additionalResources.rentals")}
              subtitle={t("additionalResources.rentalsDescription")}
            >
              <Resource>{HowItWorks}</Resource>
              <Resource>{SMCHousingSearch}</Resource>
              <Resource>{HavenConnect}</Resource>
              <Resource>{AffordableRentalHousingList}</Resource>
            </InfoCardGrid>
            <InfoCardGrid
              title={t("additionalResources.sharedHousing")}
              subtitle={t("additionalResources.sharedHousingDescription")}
            >
              <Resource>{HIPHousing}</Resource>
            </InfoCardGrid>
            <InfoCardGrid
              title={t("additionalResources.otherResources")}
              subtitle={t("additionalResources.otherResourcesDescription")}
            >
              <Resource>{HAotCoSM}</Resource>
              <Resource>{CIH}</Resource>
              <Resource>{BayArea211}</Resource>
              <Resource>{ProjectSentinel}</Resource>
              <Resource>{HousingChoices}</Resource>
            </InfoCardGrid>
          </MarkdownSection>
        </div>
        <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
          <MarkdownSection>
            <Markdown
              options={{
                overrides: {
                  h4: {
                    component: ({ children, ...props }) => (
                      <h4 {...props} className="text__underline-weighted">
                        {children}
                      </h4>
                    ),
                  },
                  RenderIf,
                },
              }}
            >
              {sidebarContent}
            </Markdown>
          </MarkdownSection>
        </aside>
      </article>
    </section>
  )
}

export default AdditionalResourcesSection
