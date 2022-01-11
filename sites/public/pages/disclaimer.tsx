import React, { useEffect, useContext } from "react"
import { AuthContext, PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { USER_STATUS } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../page_content/disclaimer.md"

const Disclaimer = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: t("pageTitle.disclaimer"),
      status: profile ? USER_STATUS.LoggedIn : USER_STATUS.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.disclaimer")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Disclaimer
