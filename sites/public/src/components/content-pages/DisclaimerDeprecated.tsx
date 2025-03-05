import React, { useEffect, useContext } from "react"
import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../md_content/disclaimer_deprecated.md"

const DisclaimerDeprecated = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.disclaimer")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown>{pageContent.toString()}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default DisclaimerDeprecated
