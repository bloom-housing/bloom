import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../md_content/generic_content.md"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "../../patterns/PageHeaderLayout.module.scss"

const DisclaimerSeeds = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.disclaimer")}>
      <PageHeaderLayout
        heading={t("pageTitle.disclaimer")}
        subheading="A design approach is a general philosophy that may or may not include a guide for specific methods."
        inverse
      >
        <Markdown className={styles["markdown"]}>{pageContent.toString()}</Markdown>
      </PageHeaderLayout>
    </Layout>
  )
}

export default DisclaimerSeeds
