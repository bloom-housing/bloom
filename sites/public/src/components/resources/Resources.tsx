import { t } from "@bloom-housing/ui-components"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import Layout from "../../layouts/application"
import styles from "./Resources.module.scss"
import { getJurisdictionResourcesContent } from "../../static_content/jurisdiction_resources_content"
import { getGenericResourcesContent } from "../../static_content/generic_resources_content"

const Resources = () => {
  const pageTitle = t("pageTitle.additionalResources")

  const content = getJurisdictionResourcesContent() || getGenericResourcesContent()

  return (
    <Layout pageTitle={pageTitle}>
      <PageHeaderLayout
        inverse
        heading={pageTitle}
        subheading={t("pageDescription.additionalResources")}
        className={styles["site-layout"]}
      >
        {content}
      </PageHeaderLayout>
    </Layout>
  )
}

export default Resources
