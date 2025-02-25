import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import pageContent from "../md_content/disclaimer.md"
import { ContentPage } from "../patterns/ContentPage"

const Disclaimer = () => {
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
      <ContentPage
        heading={t("pageTitle.disclaimer")}
        subheading="A design approach is a general philosophy that may or may not include a guide for specific methods."
      >
        <Markdown>{pageContent.toString()}</Markdown>
      </ContentPage>
    </Layout>
  )
}

export default Disclaimer
