import React, { useEffect, useContext } from "react"
import { AuthContext, PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../page_content/terms.md"

const Terms = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Terms",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.terms")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Terms
