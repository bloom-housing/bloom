import { useContext, useEffect } from "react"
import Markdown from "markdown-to-jsx"
import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { RenderIf } from "../lib/helpers"
import { UserStatus } from "../lib/constants"
import pageContent from "../md_content/terms.md"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "./../patterns/PageHeaderLayout.module.scss"
const Terms = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Terms",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pagetTitle = <>{t("pageTitle.termsAndConditions")}</>

  return (
    <Layout>
      <PageHeaderLayout heading={pagetTitle} inverse>
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
