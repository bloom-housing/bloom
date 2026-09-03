import React, { useEffect, useContext } from "react"
import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import pageContent from "../../static_content/generic_content.md"
import { storedPageBody } from "../../static_content/stored_content"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"

const DisclaimerDeprecated = () => {
  const { profile } = useContext(AuthContext)
  const jurisdictionContent = useJurisdictionContent()
  const body = storedPageBody(
    jurisdictionContent,
    "disclaimerHtml",
    <Markdown>{pageContent.toString()}</Markdown>
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.disclaimer")}</>

  return (
    <Layout pageTitle={t("pageTitle.disclaimer")}>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>{body}</MarkdownSection>
    </Layout>
  )
}

export default DisclaimerDeprecated
