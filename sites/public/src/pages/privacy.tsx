import React, { useEffect, useContext } from "react"
import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../md_content/privacy_policy.md"
import { ContentPage } from "../patterns/ContentPage"

const Privacy = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <ContentPage heading={t("pageTitle.privacy")}>
        <Markdown>{pageContent.toString()}</Markdown>
      </ContentPage>
    </Layout>
  )
}

export default Privacy
