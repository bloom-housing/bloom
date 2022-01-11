import React, { useEffect, useContext } from "react"
import { AuthContext, MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { USER_STATUS } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../page_content/privacy_policy.md"

const Privacy = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: t("pageTitle.privacy"),
      status: profile ? USER_STATUS.LoggedIn : USER_STATUS.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Privacy
