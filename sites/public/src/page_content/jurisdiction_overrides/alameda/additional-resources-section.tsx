import React from "react"
import Markdown from "markdown-to-jsx"
import { t, InfoCardGrid, MarkdownSection, Heading } from "@bloom-housing/ui-components"
import Resource from "../../../Resource"
import RenderIf from "../../../RenderIf"

// Import Markdown resource cards:
import sidebarContent from "./resources/sidebar.md"
import alaResourceFinder211 from "./resources/alaResourceFinder211.md"
import independentLiving from "./resources/independentLiving.md"
import echoHousing from "./resources/echoHousing.md"
import hrc from "./resources/hrc.md"
import depositRentalAssistance from "./resources/depositRentalAssistance.md"
import hcdDepartment from "./resources/hcdDepartment.md"
import acBoost from "./resources/acBoost.md"
import acAntiDisplacement from "./resources/acAntiDisplacement.md"
import acEmergencyRental from "./resources/acEmergencyRental.md"
import acHomeownerServices from "./resources/acHomeownerServices.md"
import acHousingPreservation from "./resources/acHousingPreservation.md"
import haAlamedaCounty from "./resources/haAlamedaCounty.md"
import haBerkley from "./resources/haBerkley.md"
import haAlamedaCity from "./resources/haAlamedaCity.md"
import haLivermore from "./resources/haLivermore.md"
import haOakland from "./resources/haOakland.md"
import oaklandHeader from "./resources/oaklandHeader.md"
import baCommunityServiceOakland from "./resources/baCommunityServiceOakland.md"
import bossCoordinatedEntry from "./resources/bossCoordinatedEntry.md"
import eocpCoordinatedEntry from "./resources/eocpCoordinatedEntry.md"
import familyFrontDoorOakland from "./resources/familyFrontDoorOakland.md"
import keepOaklandHoused from "./resources/keepOaklandHoused.md"
import northCountyHeader from "./resources/northCountyHeader.md"
import baCommunityServiceNorth from "./resources/baCommunityServiceNorth.md"
import familyFrontDoorNorth from "./resources/familyFrontDoorNorth.md"
import womensDropInCenter from "./resources/womensDropInCenter.md"
import midCountyHeader from "./resources/midCountyHeader.md"
import buildingFuturesSanLeandro from "./resources/buildingFuturesSanLeandro.md"
import buildingFuturesAlameda from "./resources/buildingFuturesAlameda.md"
import baCommunityServiceHayward from "./resources/baCommunityServiceHayward.md"
import eastCountyHeader from "./resources/eastCountyHeader.md"
import adobeServicesEast from "./resources/adobeServicesEast.md"
import adobeServicesSouth from "./resources/adobeServicesSouth.md"
import fremontFamily from "./resources/fremontFamily.md"
import southCountyHeader from "./resources/southCountyHeader.md"

export const AdditionalResourcesSection = () => {
  return (
    <section className="md:px-5">
      <article className="markdown max-w-5xl m-auto md:flex">
        <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
          <MarkdownSection>
            <InfoCardGrid
              title={t("additionalResources.immediateHousing.title")}
              subtitle={t("additionalResources.immediateHousing.description")}
            >
              <Resource>{alaResourceFinder211}</Resource>
              <Resource>{independentLiving}</Resource>
              <Resource>{echoHousing}</Resource>
              <Resource>{hrc}</Resource>
              <Resource>{depositRentalAssistance}</Resource>
            </InfoCardGrid>
            <InfoCardGrid title={t("additionalResources.alaCountyHCD.title")}>
              <Resource>{hcdDepartment}</Resource>
              <Resource>{acBoost}</Resource>
              <Resource>{acAntiDisplacement}</Resource>
              <Resource>{acEmergencyRental}</Resource>
              <Resource>{acHomeownerServices}</Resource>
              <Resource>{acHousingPreservation}</Resource>
            </InfoCardGrid>
            <InfoCardGrid
              title={t("additionalResources.alaHousingAuthorities.title")}
              subtitle={t("additionalResources.alaHousingAuthorities.description")}
            >
              <Resource>{haAlamedaCounty}</Resource>
              <Resource>{haBerkley}</Resource>
              <Resource>{haAlamedaCity}</Resource>
              <Resource>{haLivermore}</Resource>
              <Resource>{haOakland}</Resource>
            </InfoCardGrid>
            <section className="info-cards">
              <header className="info-cards__header">
                <Heading priority={2} styleType="underlineWeighted" className={"text-tiny"}>
                  {t("additionalResources.cityRegionServices.title")}
                </Heading>
                <p className="info-cards__subtitle">
                  <a href="https://docs.google.com/document/d/1U6d4KIXAFMMF8E2H-VAi3gpLy71L3Tvm/edit?usp=sharing&ouid=104857760863458372387&rtpof=true&sd=true">
                    {t("additionalResources.cityRegionServices.description")}
                  </a>
                </p>
              </header>
            </section>
            <Markdown>{oaklandHeader}</Markdown>
            <div className="info-cards__grid">
              <Resource>{baCommunityServiceOakland}</Resource>
              <Resource>{bossCoordinatedEntry}</Resource>
              <Resource>{eocpCoordinatedEntry}</Resource>
              <Resource>{familyFrontDoorOakland}</Resource>
              <Resource>{keepOaklandHoused}</Resource>
            </div>
            <Markdown
              options={{
                overrides: {
                  RenderIf,
                },
              }}
            >
              {northCountyHeader}
            </Markdown>
            <div className="info-cards__grid">
              <Resource>{baCommunityServiceNorth}</Resource>
              <Resource>{familyFrontDoorNorth}</Resource>
              <Resource>{womensDropInCenter}</Resource>
            </div>
            <Markdown
              options={{
                overrides: {
                  RenderIf,
                },
              }}
            >
              {midCountyHeader}
            </Markdown>
            <div className="info-cards__grid">
              <Resource>{buildingFuturesSanLeandro}</Resource>
              <Resource>{buildingFuturesAlameda}</Resource>
              <Resource>{baCommunityServiceHayward}</Resource>
            </div>
            <Markdown
              options={{
                overrides: {
                  RenderIf,
                },
              }}
            >
              {eastCountyHeader}
            </Markdown>
            <div className="info-cards__grid">
              <Resource>{adobeServicesEast}</Resource>
            </div>
            <Markdown
              options={{
                overrides: {
                  RenderIf,
                },
              }}
            >
              {southCountyHeader}
            </Markdown>
            <div className="info-cards__grid">
              <Resource>{adobeServicesSouth}</Resource>
              <Resource>{fremontFamily}</Resource>
            </div>
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
