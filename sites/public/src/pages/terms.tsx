import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../static_content/jurisdiction_terms_content.md"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "../patterns/PageHeaderLayout.module.scss"
import { RenderIf } from "../lib/helpers"

const Terms = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Terms and Conditions",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.termsAndConditions")}>
      <PageHeaderLayout heading={t("pageTitle.termsAndConditions")} inverse>
        <Markdown
          options={{
            overrides: {
              RenderIf,
            },
          }}
          className={styles["markdown"]}
        >
          {pageContent.toString()}
        </Markdown>
      </PageHeaderLayout>
    </Layout>
  )
}

export default Terms
