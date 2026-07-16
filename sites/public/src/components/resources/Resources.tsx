import { t } from "@bloom-housing/ui-components"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts/application"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import { getGenericResourcesContent } from "../../static_content/generic_resources_content"
import { getJurisdictionResourcesContent } from "../../static_content/jurisdiction_resources_content"
import styles from "./Resources.module.scss"
import ResourceSection from "./ResourceSection"
import sectionStyles from "./ResourceSection.module.scss"

export type ResourceCards = {
  contactCard?: {
    description?: React.ReactNode
    departmentTitle?: React.ReactNode
    email?: string
  }
  resourceSections: {
    sectionTitle: string
    sectionSubtitle?: string
    cards?: React.ReactNode[]
    cardsWithTitles?: { cards: React.ReactNode[]; title: string }[]
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
    <Layout pageTitle={pageTitle} metaDescription={t("pageDescription.additionalResources")}>
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
                cards={section.cards}
                cardsWithTitles={section.cardsWithTitles}
              />
            </div>
          ))}
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Resources
