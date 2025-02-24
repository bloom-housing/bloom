import React, { useEffect, useContext } from "react"
import Layout from "../layouts/application"
import Head from "next/head"
import { Hero, t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { Button } from "@bloom-housing/ui-seeds"
import { UserStatus } from "../lib/constants"
import MaxWidthLayout from "../layouts/max-width"

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
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("errors.notFound.message")}
      </Hero>
      <div className="homepage-extra">
        <MaxWidthLayout>
          <>
            <p>{t("welcome.seeMoreOpportunities")}</p>
            <Button variant="primary-outlined" href="/help/housing-help">
              {t("welcome.viewAdditionalHousing")}
            </Button>
          </>
        </MaxWidthLayout>
      </div>
    </Layout>
  )
}

export { ErrorPage as default, ErrorPage }
