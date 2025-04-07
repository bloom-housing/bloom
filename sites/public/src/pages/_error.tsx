import React, { useEffect, useContext } from "react"
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
    <>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("errors.notFound.message")}
      </Hero>
      <div className="homepage-extra">
        <MaxWidthLayout className={"seeds-p-b-container"}>
          <>
            <p className={"seeds-m-be-header"}>{t("welcome.seeMoreOpportunities")}</p>
            <Button variant="primary-outlined" href="/help/housing-help">
              {t("welcome.viewAdditionalHousing")}
            </Button>
          </>
        </MaxWidthLayout>
      </div>
    </>
  )
}

export { ErrorPage as default, ErrorPage }
