import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "../patterns/PageHeaderLayout.module.scss"
import pageContent from "../md_content/accessibility.md"
import { RenderIf } from "../lib/helpers"

const Accessibility = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Accessibility",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = t("pageTitle.accessibilityStatement")

  return (
    <Layout pageTitle={t("pageTitle.accessibilityStatement")}>
      <PageHeaderLayout heading={pageTitle} inverse>
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

export default Accessibility
