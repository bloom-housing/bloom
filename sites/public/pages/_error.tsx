import React, { useEffect, useContext } from "react"
import Layout from "../layouts/application"
import Head from "next/head"
import { MarkdownSection, t } from "@bloom-housing/ui-components"
import { LinkButton } from "../../../detroit-ui-components/src/actions/LinkButton"
import { Hero } from "../../../detroit-ui-components/src/headers/Hero"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"

const ErrorPage = () => {
  const pageTitle = t("errors.notFound.title")

  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Page Not Found",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero
        title={pageTitle}
        titleClassName="text-white"
        buttonTitle={t("welcome.seeRentalListings")}
        buttonLink="/listings"
      >
        <span className={"text-white"}>{t("errors.notFound.message")}</span>
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <>
            <p>{t("welcome.seeMoreOpportunities")}</p>
            <LinkButton href="/additional-resources">
              {t("welcome.viewAdditionalHousing")}
            </LinkButton>
          </>
        </MarkdownSection>
      </div>
    </Layout>
  )
}

export { ErrorPage as default, ErrorPage }
