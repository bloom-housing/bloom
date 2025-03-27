import React, { useEffect, useContext } from "react"
import { MarkdownSection, t, PageHeader } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../md_content/accessibility.md"
import { RenderIf } from "../lib/helpers"

const Accessibility = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Accessibility",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.accessibilityStatement")}</>

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
          {pageContent.toString()}
        </Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Accessibility
