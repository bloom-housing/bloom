import React, { useEffect, useContext } from "react"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import { t, MarkdownSection } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../detroit-ui-components/src/headers/PageHeader"
import { InfoCardGrid } from "../../../detroit-ui-components/src/sections/InfoCardGrid"
import { UserStatus } from "../lib/constants"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import Resource from "../src/Resource"
import RenderIf from "../src/RenderIf"

// Import Markdown resource cards:
import housingAndRevitalization from "../page_content/resources/housing_and_revitalization.md"
import enforcePropertyConditions from "../page_content/resources/enforce_property_conditions.md"
import housingNetwork from "../page_content/resources/housing_network.md"
import evictionPrevention from "../page_content/resources/eviction_prevention.md"
import housingCounseling from "../page_content/resources/housing_counseling.md"
import homeRepair from "../page_content/resources/home_repair.md"
import fairHousing from "../page_content/resources/fair_housing.md"
import homelessnessServices from "../page_content/resources/homelessness_services.md"
import utilitiesAssistance from "../page_content/resources/utilities_assistance.md"
import taxForeclosurePrevention from "../page_content/resources/tax_foreclosure_prevention.md"
import homeownerPropertyTaxRelief from "../page_content/resources/homeowner_property_tax_relief.md"
import michigan211 from "../page_content/resources/michigan_211.md"
import financialCounseling from "../page_content/resources/financial_counseling.md"
import housingCommission from "../page_content/resources/housing_commission.md"
import landBankAuthority from "../page_content/resources/land_bank_authority.md"
import projectCleanSlate from "../page_content/resources/project_clean_slate.md"
import civilRightsInclusionOpportunity from "../page_content/resources/civil_rights_inclusion_opportunity.md"
import housingRelocationAssistance from "../page_content/resources/housing_relocation_assistance.md"
import sidebarContent from "../page_content/resources/sidebar.md"

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

      <section>
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <MarkdownSection>
              <InfoCardGrid
                title={t("pageTitle.resources")}
                subtitle={t("pageDescription.resources")}
              >
                <Resource>{housingAndRevitalization}</Resource>
                <Resource>{enforcePropertyConditions}</Resource>
                <Resource>{housingNetwork}</Resource>
                <Resource>{evictionPrevention}</Resource>
                <Resource>{housingCounseling}</Resource>
                <Resource>{homeRepair}</Resource>
                <Resource>{fairHousing}</Resource>
                <Resource>{homelessnessServices}</Resource>
                <Resource>{utilitiesAssistance}</Resource>
                <Resource>{taxForeclosurePrevention}</Resource>
                <Resource>{homeownerPropertyTaxRelief}</Resource>
                <Resource>{michigan211}</Resource>
                <Resource>{financialCounseling}</Resource>
                <Resource>{housingCommission}</Resource>
                <Resource>{landBankAuthority}</Resource>
                <Resource>{projectCleanSlate}</Resource>
                <Resource>{civilRightsInclusionOpportunity}</Resource>
                <Resource>{housingRelocationAssistance}</Resource>
              </InfoCardGrid>
            </MarkdownSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h3: {
                      component: ({ children, ...props }) => (
                        <h3 {...props} className="text-tiny text-caps-underline">
                          {children}
                        </h3>
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
    </Layout>
  )
}

export default AdditionalResources
