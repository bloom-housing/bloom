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
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                </GridRow>
              </Grid>
            </ResourceSection>
            <ResourceSection sectionTitle={t("resources.housingProgramsTitle")}>
              <Grid>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                </GridRow>
                <GridRow columns={2}>
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
                  />
                  <ResourceCard
                    title={t("resources.mockCardTitle")}
                    href="/"
                    content={t("resources.mockCardDescription")}
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
