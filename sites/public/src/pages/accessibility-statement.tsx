import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../static_content/jurisdiction_accessibility_statement_content.md"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "../patterns/PageHeaderLayout.module.scss"
import { RenderIf } from "../lib/helpers"

const AccessibilityStatement = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Accessibility Statement",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout pageTitle={t("pageTitle.accessibilityStatement")}>
      <PageHeaderLayout heading={t("pageTitle.accessibilityStatement")} inverse>
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

export default AccessibilityStatement
