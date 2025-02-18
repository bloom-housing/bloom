import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { useContext, useEffect } from "react"
import { UserStatus } from "../lib/constants"
import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import pageContent from "../md_content/terms.md"
import Layout from "../layouts/application"
import Markdown from "markdown-to-jsx"
import { RenderIf } from "../lib/helpers"

const Terms = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Terms",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pagetTitle = <>{t("pageTitle.termsAndConditions")}</>

  return (
    <Layout>
      <PageHeader title={pagetTitle} />
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

export default Terms
