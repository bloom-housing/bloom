import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../md_content/privacy_policy.md"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import { RenderIf } from "../../lib/helpers"
import styles from "../../patterns/PageHeaderLayout.module.scss"

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
        <div className={styles["markdown"]}>
          <Markdown
            options={{
              overrides: {
                RenderIf,
              },
            }}
          >
            {pageContent.toString()}
          </Markdown>
        </div>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Privacy
