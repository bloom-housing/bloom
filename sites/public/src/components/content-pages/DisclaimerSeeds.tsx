import Markdown from "markdown-to-jsx"
import React, { useEffect, useContext } from "react"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import pageContent from "../../md_content/disclaimer_seeds.md"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import styles from "../../patterns/PageHeaderLayout.module.scss"
import { RenderIf } from "../../lib/helpers"
import { UserStatus } from "../../lib/constants"

const DisclaimerSeeds = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = t("pageTitle.terms")

  return (
    <Layout pageTitle={pageTitle}>
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

export default DisclaimerSeeds
