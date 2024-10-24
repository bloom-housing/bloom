// import React from "react"
// import Markdown from "markdown-to-jsx"
// import { t, InfoCardGrid, MarkdownSection, Heading } from "@bloom-housing/ui-components"

// // Import Markdown resource cards:
// import sidebarContent from "./resources/sidebar.md"
// import alaResourceFinder211 from "./resources/alaResourceFinder211.md"
// import echoHousing from "./resources/echoHousing.md"
// import hrc from "./resources/hrc.md"
// import depositRentalAssistance from "./resources/depositRentalAssistance.md"
// import hcdDepartment from "./resources/hcdDepartment.md"
// import acBoost from "./resources/acBoost.md"
// import acAntiDisplacement from "./resources/acAntiDisplacement.md"
// import acEmergencyRental from "./resources/acEmergencyRental.md"
// import acHomeownerServices from "./resources/acHomeownerServices.md"
// import acHousingPreservation from "./resources/acHousingPreservation.md"
// import haAlamedaCounty from "./resources/haAlamedaCounty.md"
// import haBerkley from "./resources/haBerkley.md"
// import haAlamedaCity from "./resources/haAlamedaCity.md"
// import haLivermore from "./resources/haLivermore.md"
// import haOakland from "./resources/haOakland.md"
// import oaklandHeader from "./resources/oaklandHeader.md"
// import baCommunityServiceOakland from "./resources/baCommunityServiceOakland.md"
// import bossCoordinatedEntry from "./resources/bossCoordinatedEntry.md"
// import eocpCoordinatedEntry from "./resources/eocpCoordinatedEntry.md"
// import familyFrontDoorOakland from "./resources/familyFrontDoorOakland.md"
// import keepOaklandHoused from "./resources/keepOaklandHoused.md"
// import transitionalAgedYouth from "./resources/transitionalAgedYouth.md"
// import northCountyHeader from "./resources/northCountyHeader.md"
// import baCommunityServiceNorth from "./resources/baCommunityServiceNorth.md"
// import familyFrontDoorNorth from "./resources/familyFrontDoorNorth.md"
// import womensDropInCenter from "./resources/womensDropInCenter.md"
// import midCountyHeader from "./resources/midCountyHeader.md"
// import buildingFuturesSanLeandro from "./resources/buildingFuturesSanLeandro.md"
// import buildingFuturesAlameda from "./resources/buildingFuturesAlameda.md"
// import baCommunityServiceHayward from "./resources/baCommunityServiceHayward.md"
// import eastCountyHeader from "./resources/eastCountyHeader.md"
// import adobeServicesEast from "./resources/adobeServicesEast.md"
// import adobeServicesSouth from "./resources/adobeServicesSouth.md"
// import fremontFamily from "./resources/fremontFamily.md"
// import southCountyHeader from "./resources/southCountyHeader.md"

import React, { useEffect, useContext } from "react"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import {
  t,
  InfoCardGrid,
  InfoCard,
  PageHeader,
  MarkdownSection,
  Heading,
} from "@bloom-housing/ui-components"
import { UserStatus } from "../lib/constants"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import Resource from "../Resource"
import RenderIf from "../RenderIf"

import sidebarContent from "../md_content/sidebar.md"
import exygy from "../md_content/exygy.md"

const AdditionalResources = () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")

  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Additional Resources",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader title={<>{pageTitle}</>} subtitle={subTitle} inverse={true}></PageHeader>

      <section className="md:px-5">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <MarkdownSection>
              {/* <Markdown
                options={{
                  overrides: {
                    InfoCard,
                    InfoCardGrid,
                  },
                }}
              > */}
              <InfoCardGrid
                title={"Housing Authorities"}
                subtitle={
                  "Public Housing Authorities (PHAs) typically oversee two programs that provide direct assistance to tenants: overseeing units of public housing, and administering the Section 8 Housing Choice Voucher program. However, some PHAs no longer manage public units, and the scale of these programs can also vary widely. Please contact your local PHA to find out how they may be of assistance to you."
                }
              />
              <section className="info-cards">
                <header className="info-cards__header">
                  <Heading priority={2} styleType="underlineWeighted" className={"text-sm"}>
                    {t("City and Region-Related Services")}
                  </Heading>
                </header>
              </section>
              <div className="info-cards__grid">
                <Resource>{exygy}</Resource>
              </div>
              {/* </Markdown> */}
            </MarkdownSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h4: {
                      component: ({ children, ...props }) => (
                        <h4 {...props} className={"text__caps_underline"}>
                          {children}
                        </h4>
                      ),
                    },
                  },
                }}
              >
                {sidebarContent}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}

export default AdditionalResources
