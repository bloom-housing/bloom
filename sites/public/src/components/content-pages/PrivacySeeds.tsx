import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../static_content/generic_content.md"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "../../patterns/PageHeaderLayout.module.scss"
import LazyMarkdown from "../core/LazyMarkdown"

const Privacy = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.privacy")}>
      <PageHeaderLayout heading={t("pageTitle.privacy")} inverse>
        <LazyMarkdown className={styles["markdown"]}>{pageContent.toString()}</LazyMarkdown>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Privacy
