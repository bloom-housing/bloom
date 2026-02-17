import { t } from "@bloom-housing/ui-components"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import Layout from "../../layouts/application"
import styles from "./Resources.module.scss"
import sectionStyles from "./ResourceSection.module.scss"
import { getJurisdictionResourcesContent } from "../../static_content/jurisdiction_resources_content"
import { getGenericResourcesContent } from "../../static_content/generic_resources_content"
import { Card, Grid, Heading, Link } from "@bloom-housing/ui-seeds"
import ResourceSection from "./ResourceSection"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"

export type ResourceCards = {
  contactCard?: {
    description?: React.ReactNode
    departmentTitle?: React.ReactNode
    email?: string
  }
  resourceSections: {
    sectionTitle: string
    sectionSubtitle?: string
    cards: React.ReactNode[]
  }[]
}

const Resources = () => {
  const pageTitle = t("pageTitle.additionalResources")

  const content: ResourceCards | null =
    getJurisdictionResourcesContent() || getGenericResourcesContent()

  if (!content) return <></>

  const showContactCard =
    content.contactCard?.description ||
    content.contactCard?.departmentTitle ||
    content.contactCard?.email

  return (
    <Layout pageTitle={pageTitle}>
      <PageHeaderLayout
        inverse
        heading={pageTitle}
        subheading={t("pageDescription.additionalResources")}
        className={styles["site-layout"]}
      >
        <article className={styles["site-content"]}>
          {showContactCard && (
            <div>
              <Heading
                className={`${sectionStyles["resource-section-title"]} seeds-m-be-header`}
                priority={2}
              >
                {t("resources.contactTitle")}
              </Heading>
              <Card className={styles["contact-card"]}>
                <div className={styles["contact-card-subsection"]}>
                  <div className={styles["contact-card-subsection"]}>
                    {content.contactCard.departmentTitle && (
                      <p className={styles["contact-card-info"]}>
                        {content.contactCard.departmentTitle}
                      </p>
                    )}
                  </div>
                  {content.contactCard.description && (
                    <p className={styles["contact-card-description"]}>
                      {content.contactCard.description}
                    </p>
                  )}
                </div>
                {content.contactCard.email && (
                  <div className={styles["contact-card-subsection"]}>
                    <Link href={`mailto:${content.contactCard.email}`}>
                      {content.contactCard.email}
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          )}

          {content.resourceSections?.map((section, index) => (
            <div className={styles["resources-section-wrapper"]} key={index}>
              <ResourceSection
                sectionTitle={section.sectionTitle}
                sectionSubtitle={section.sectionSubtitle}
              >
                <Grid spacing="sm">
                  <GridRow columns={3}>{section.cards}</GridRow>
                </Grid>
              </ResourceSection>
            </div>
          ))}
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Resources
