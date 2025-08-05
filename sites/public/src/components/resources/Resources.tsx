import Markdown from "markdown-to-jsx"
import { Card, Grid, Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import Layout from "../../layouts/application"
import ResourceSection from "./ResourceSection"
import ResourceCard from "./ResourceCard"
import styles from "./Resources.module.scss"
import { RenderIf } from "../../lib/helpers"

import civilRightsInclusionOpportunity from "./../../md_content/resources/civil_rights_inclusion_opportunity.md"
import contactInfo from "./../../md_content/resources/contact_info.md"
import enforcePropertyConditions from "./../../md_content/resources/enforce_property_conditions.md"
import evictionPrevention from "./../../md_content/resources/eviction_prevention.md"
import fairHousing from "./../../md_content/resources/fair_housing.md"
import financialCounseling from "./../../md_content/resources/financial_counseling.md"
import homeRepair from "./../../md_content/resources/home_repair.md"
import homeownerPropertyTaxRelief from "./../../md_content/resources/homeowner_property_tax_relief.md"
import homelessnessServices from "./../../md_content/resources/homelessness_services.md"
import housingAndRevitalization from "./../../md_content/resources/housing_and_revitalization.md"
import housingCommission from "./../../md_content/resources/housing_commission.md"
import housingCounseling from "./../../md_content/resources/housing_counseling.md"
import housingNetwork from "./../../md_content/resources/housing_network.md"
import housingRelocationAssistance from "./../../md_content/resources/housing_relocation_assistance.md"
import landBankAuthority from "./../../md_content/resources/land_bank_authority.md"
import michigan211 from "./../../md_content/resources/michigan_211.md"
import projectCleanSlate from "./../../md_content/resources/project_clean_slate.md"
import taxForeclosurePrevention from "./../../md_content/resources/tax_foreclosure_prevention.md"
import utilitiesAssistance from "./../../md_content/resources/utilities_assistance.md"

const Resources = () => {
  const pageTitle = t("pageTitle.additionalResources")

  return (
    <Layout pageTitle={pageTitle}>
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
                    href="https://detroitmi.gov/departments/housing-and-revitalization-department"
                    content={housingAndRevitalization.toString()}
                  />
                  <ResourceCard
                    title={t("resources.propertyConditionsTitle")}
                    href="https://detroitmi.gov/departments/buildings-safety-engineering-and-environmental-department"
                    content={enforcePropertyConditions.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.housingNetworkTitle")}
                    href="https://detroithousingnetwork.org/"
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
                    href="https://housing.state.mi.us/webportal/default.aspx?page=counseling_start"
                    content={housingCounseling.toString()}
                  />
                  <ResourceCard
                    title={t("resources.homeRepair")}
                    href="https://detroitmi.gov/departments/housing-and-revitalization-department/residents"
                    content={homeRepair.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.fairHousing")}
                    href="https://www.fairhousingdetroit.org/"
                    content={fairHousing.toString()}
                  />
                  <ResourceCard
                    title={t("resources.homelessnessServices")}
                    href="http://www.camdetroit.org/"
                    content={homelessnessServices.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.utilitiesAssistance")}
                    href="https://www.waynemetro.org/energy-and-water-assistance/"
                    content={utilitiesAssistance.toString()}
                  />
                  <ResourceCard
                    title={t("resources.taxForeclosurePrevention")}
                    href="http://www.uchcdetroit.org/"
                    content={taxForeclosurePrevention.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.homeownerPropertyTaxRelief")}
                    href="https://detroitmi.gov/government/boards/property-assessment-board-review/homeowners-property-exemption-hope"
                    content={homeownerPropertyTaxRelief.toString()}
                  />
                  <ResourceCard
                    title={t("resources.michigan211")}
                    href="https://www.mi211.org/"
                    content={michigan211.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.financialCounseling")}
                    href="https://detroitmi.gov/departments/department-neighborhoods/financial-empowerment-center-fec"
                    content={financialCounseling.toString()}
                  />
                  <ResourceCard
                    title={t("resources.housingCommission")}
                    href="https://www.dhcmi.org/Default.aspx"
                    content={housingCommission.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.landBankAuthority")}
                    href="https://buildingdetroit.org/"
                    content={landBankAuthority.toString()}
                  />
                  <ResourceCard
                    title={t("resources.projectCleanSlate")}
                    href="https://detroitmi.gov/departments/law-department/project-clean-slate"
                    content={projectCleanSlate.toString()}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.civilRightsInclusionOpportunity")}
                    href="https://detroitmi.gov/departments/civil-rights-inclusion-opportunity-department"
                    content={civilRightsInclusionOpportunity.toString()}
                  />
                  <ResourceCard
                    title={t("resources.housingRelocationAssistance")}
                    href="https://www.uchcdetroit.org/"
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
                <p className={styles["contact-card-info"]}>{t("resources.contactInfo")}</p>
              </div>
              <Markdown
                options={{
                  overrides: {
                    RenderIf,
                  },
                }}
                className={styles["contact-card-content"]}
              >
                {contactInfo.toString()}
              </Markdown>
            </Card>
          </aside>
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Resources
