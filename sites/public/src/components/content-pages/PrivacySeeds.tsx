import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../static_content/generic_content.md"
import { storedPageBody } from "../../static_content/stored_content"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "../../patterns/PageHeaderLayout.module.scss"

const Privacy = () => {
  const { profile } = useContext(AuthContext)
  const jurisdictionContent = useJurisdictionContent()
  const body = storedPageBody(
    jurisdictionContent,
    "privacyHtml",
    <Markdown className={styles["markdown"]}>{pageContent.toString()}</Markdown>
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.privacy")} metaDescription={t("pageDescription.privacy")}>
      <PageHeaderLayout heading={t("pageTitle.privacy")} inverse>
        {body}
      </PageHeaderLayout>
    </Layout>
  )
}

export default Privacy
