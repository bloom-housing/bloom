import MaxWidthLayout from "../../layouts/max-width"
import styles from "./Resources.module.scss"
import { Card, Grid } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import Head from "next/head"
import { t, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import ResourceSection from "./ResourceSection"
import ResourceCard from "./ResourceCard"
import Link from "next/link"

const Resources = () => {
  const pageTitle = t("pageTitle.additionalResources")

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader
        title={<>{pageTitle}</>}
        subtitle={t("pageDescription.additionalResources")}
        inverse={true}
      ></PageHeader>

      <MaxWidthLayout className={styles["site-layout"]}>
        <article className={styles["site-content"]}>
          <div className={styles["resources-section-wrapper"]}>
            <ResourceSection
              sectionTitle={t("resources.immedieteHousingTitle")}
              sectionSubtitle={t("resources.immedieteHousingSubtitle")}
            >
              <Grid>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                </GridRow>
              </Grid>
            </ResourceSection>
            <ResourceSection sectionTitle={t("resources.housingProgramsTitle")}>
              <Grid>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                  <ResourceCard
                    title={t("resources.alamedaResourceFinderTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.housingProgramsTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                  <ResourceCard
                    title={t("resources.housingProgramsTitle")}
                    href="/"
                    content={t("resources.alamedaResourceFinder")}
                  />
                </GridRow>
              </Grid>
            </ResourceSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0">
            <Card className={styles["contact-card"]}>
              <div className={styles["contact-card-subsection"]}>
                <p className={styles["contact-card-title"]}>{t("resources.contactTitle")}</p>
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
      </MaxWidthLayout>
    </Layout>
  )
}

export default Resources
