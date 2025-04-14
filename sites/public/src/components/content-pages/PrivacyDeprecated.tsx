import React, { useEffect, useContext, useState } from "react"
import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import RenderIf from "../../RenderIf"

const getPrivacySection = async (jurisdiction: string) => {
  return import(
    `../../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/privacy_policy.md`
  )
}

const PrivacyDeprecated = () => {
  const { profile } = useContext(AuthContext)
  const [privacySection, setPrivacySection] = useState("")

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Privacy",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    const loadPageContent = async () => {
      const privacy = await getPrivacySection(process.env.jurisdictionName || "")
      setPrivacySection(privacy.default)
    }
    loadPageContent().catch(() => {
      console.log("privacy section doesn't exist")
    })
  }, [])

  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <MarkdownSection>
        <Markdown
          options={{
            overrides: {
              RenderIf,
            },
          }}
        >
          {privacySection.toString()}
        </Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default PrivacyDeprecated
