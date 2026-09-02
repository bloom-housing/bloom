import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../static_content/generic_content.md"
import { getStoredDisclaimersContent } from "../../static_content/stored_content"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "../../patterns/PageHeaderLayout.module.scss"

const DisclaimerSeeds = () => {
  const { profile } = useContext(AuthContext)
  const jurisdictionContent = useJurisdictionContent()
  const { body } = {
    body: <Markdown className={styles["markdown"]}>{pageContent.toString()}</Markdown>,
    ...getStoredDisclaimersContent(jurisdictionContent, "disclaimerHtml"),
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.disclaimer")} metaDescription={t("pageDescription.disclaimer")}>
      <PageHeaderLayout
        heading={t("pageTitle.disclaimer")}
        subheading="A design approach is a general philosophy that may or may not include a guide for specific methods."
        inverse
      >
        {body}
      </PageHeaderLayout>
    </Layout>
  )
}

export default DisclaimerSeeds
