import Link from "next/link"
import Head from "next/head"
import { Card, Grid, Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import Layout from "../../layouts/application"
import ResourceSection from "./ResourceSection"
import ResourceCard from "./ResourceCard"
import styles from "./Resources.module.scss"

import housingAndRevitalization from "./../../md_content/resources/housing_and_revitalization.md"
import enforcePropertyConditions from "./../../md_content/resources/enforce_property_conditions.md"
import housingNetwork from "./../../md_content/resources/housing_network.md"
import evictionPrevention from "./../../md_content/resources/eviction_prevention.md"
import housingCounseling from "./../../md_content/resources/housing_counseling.md"
import homeRepair from "./../../md_content/resources/home_repair.md"
import fairHousing from "./../../md_content/resources/fair_housing.md"
import homelessnessServices from "./../../md_content/resources/homelessness_services.md"
import utilitiesAssistance from "./../../md_content/resources/utilities_assistance.md"
import taxForeclosurePrevention from "./../../md_content/resources/tax_foreclosure_prevention.md"
import homeownerPropertyTaxRelief from "./../../md_content/resources/homeowner_property_tax_relief.md"
import michigan211 from "./../../md_content/resources/michigan_211.md"
import financialCounseling from "./../../md_content/resources/financial_counseling.md"
import housingCommission from "./../../md_content/resources/housing_commission.md"
import landBankAuthority from "./../../md_content/resources/land_bank_authority.md"
import projectCleanSlate from "./../../md_content/resources/project_clean_slate.md"
import civilRightsInclusionOpportunity from "./../../md_content/resources/civil_rights_inclusion_opportunity.md"
import housingRelocationAssistance from "./../../md_content/resources/housing_relocation_assistance.md"

const Resources = () => {
  const pageTitle = t("pageTitle.additionalResources")

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>
      <PageHeaderLayout
        inverse
        heading={pageTitle}
        subheading={t("pageDescription.additionalResources")}
        className={styles["site-layout"]}
      >
        <article className={styles["site-content"]}>
          <div className={styles["resources-section-wrapper"]}>
            <ResourceSection
              sectionTitle={t("resources.immediateHousingTitle")}
              sectionSubtitle={t("resources.immediateHousingSubtitle")}
            >
              <Grid spacing="sm">
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.revitalizationTitle")}
                    href="/"
                    content={housingAndRevitalization.toString()}
                  />
                  <ResourceCard
                    title={t("resources.propertyConditionsTitle")}
                    href="/"
                    content={enforcePropertyConditions.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.housingNetworkTitle")}
                    href="/"
                    content={housingNetwork.toString()}
                  />
                  <ResourceCard
                    title={t("resources.evictionPrevention")}
                    content={evictionPrevention.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.housingCounseling")}
                    href="/"
                    content={housingCounseling.toString()}
                  />
                  <ResourceCard
                    title={t("resources.homeRepair")}
                    href="/"
                    content={homeRepair.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.fairHousing")}
                    href="/"
                    content={fairHousing.toString()}
                  />
                  <ResourceCard
                    title={t("resources.homelessnessServices")}
                    href="/"
                    content={homelessnessServices.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.utilitiesAssistance")}
                    href="/"
                    content={utilitiesAssistance.toString()}
                  />
                  <ResourceCard
                    title={t("resources.taxForeclosurePrevention")}
                    href="/"
                    content={taxForeclosurePrevention.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.homeownerPropertyTaxRelief")}
                    href="/"
                    content={homeownerPropertyTaxRelief.toString()}
                  />
                  <ResourceCard
                    title={t("resources.michigan211")}
                    href="/"
                    content={michigan211.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.financialCounseling")}
                    href="/"
                    content={financialCounseling.toString()}
                  />
                  <ResourceCard
                    title={t("resources.housingCommission")}
                    href="/"
                    content={housingCommission.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.landBankAuthority")}
                    href="/"
                    content={landBankAuthority.toString()}
                  />
                  <ResourceCard
                    title={t("resources.projectCleanSlate")}
                    href="/"
                    content={projectCleanSlate.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.civilRightsInclusionOpportunity")}
                    href="/"
                    content={civilRightsInclusionOpportunity.toString()}
                  />
                  <ResourceCard
                    title={t("resources.housingRelocationAssistance")}
                    href="/"
                    content={housingRelocationAssistance.toString()}
                  />
                </GridRow>
              </Grid>
            </ResourceSection>
          </div>
          <aside className={styles["aside-section"]}>
            <Card className={styles["contact-card"]}>
              <div className={styles["contact-card-subsection"]}>
                <Heading size="xl" priority={2}>
                  {t("resources.contactTitle")}
                </Heading>
                <p className={styles["contact-card-description"]}>
                  {t("resources.contactDescription")}
                </p>
              </div>
              <div className={styles["contact-card-subsection"]}>
                <p className={styles["contact-card-info"]}>{t("resources.contactInfo")}</p>
                <Link href={`mailto:${t("resources.contactEmail")}`}>
                  {t("resources.contactEmail")}
                </Link>
              </div>
            </Card>
          </aside>
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Resources
