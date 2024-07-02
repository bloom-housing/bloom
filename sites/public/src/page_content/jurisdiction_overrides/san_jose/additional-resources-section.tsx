import { t, InfoCardGrid, MarkdownSection } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import RenderIf from "../../../RenderIf"
import Resource from "../../../Resource"

// Import Markdown resource cards:
import doorwayPortal from "./resources/doorwayPortal.md"
import alaCounty from "./resources/alaCounty.md"
import sfCounty from "./resources/sfCounty.md"
import smCounty from "./resources/smCounty.md"
import affordableHousingSCC from "./resources/affordableHousingSCC.md"
import affordableHousingSJ from "./resources/affordableHousingSJ.md"
import section8 from "./resources/section8.md"
import homelessHotline from "./resources/homelessHotline.md"
import housingChoices from "./resources/housingChoices.md"
import unitedWay211 from "./resources/unitedWay211.md"
import sidebarContent from "./resources/sidebar.md"

export const AdditionalResourcesSection = () => {
  return (
    <section className="md:px-5">
      <article className="markdown max-w-5xl m-auto md:flex">
        <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
          <MarkdownSection>
            <InfoCardGrid
              title={t("additionalResources.doorwayPortal.title")}
              subtitle={t("additionalResources.doorwayPortal.description")}
            >
              <Resource>{doorwayPortal}</Resource>
              <Resource>{alaCounty}</Resource>
              <Resource>{sfCounty}</Resource>
              <Resource>{smCounty}</Resource>
            </InfoCardGrid>
            <InfoCardGrid
              title={t("additionalResources.sccAffordableHousing.title")}
              subtitle={t("additionalResources.sccAffordableHousing.description")}
            >
              <Resource>{affordableHousingSCC}</Resource>
              <Resource>{affordableHousingSJ}</Resource>
              <Resource>{section8}</Resource>
            </InfoCardGrid>
            <InfoCardGrid title={t("additionalResources.cityRegionResources.title")}>
              <Resource>{homelessHotline}</Resource>
              <Resource>{housingChoices}</Resource>
              <Resource>{unitedWay211}</Resource>
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
              {sidebarContent.toString()}
            </Markdown>
          </MarkdownSection>
        </aside>
      </article>
    </section>
  )
}
