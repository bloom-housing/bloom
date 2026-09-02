import React, { useEffect, useContext } from "react"
import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../static_content/generic_content.md"
import { getStoredDisclaimersContent } from "../../static_content/stored_content"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"

const PrivacyDeprecated = () => {
  const { profile } = useContext(AuthContext)
  const jurisdictionContent = useJurisdictionContent()
  const { body } = {
    body: <Markdown>{pageContent.toString()}</Markdown>,
    ...getStoredDisclaimersContent(jurisdictionContent, "privacyHtml"),
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout pageTitle={t("pageTitle.privacy")}>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>{body}</MarkdownSection>
    </Layout>
  )
}

export default PrivacyDeprecated
