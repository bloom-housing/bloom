import React, { useEffect, useContext } from "react"
import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"

const About = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "About",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <PageHeader title={t("pageTitle.about")} inverse />
      <MarkdownSection>
        <p>{t("about.body1")}</p>
        <p>{t("about.body2")}</p>
        <p>{t("about.moreInfoContact")}</p>
        <p>{t("about.thankYouPartners")}</p>
        <p>{t("about.partnersList")}</p>
      </MarkdownSection>
    </Layout>
  )
}

export default About
