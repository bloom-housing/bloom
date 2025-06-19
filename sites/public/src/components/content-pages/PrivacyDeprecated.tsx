import React, { useEffect, useContext } from "react"
import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../md_content/privacy_policy.md"

const PrivacyDeprecated = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown>{pageContent.toString()}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default PrivacyDeprecated
