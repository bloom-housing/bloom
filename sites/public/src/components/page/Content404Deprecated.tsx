import React from "react"
import { Hero, t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import MaxWidthLayout from "../../layouts/max-width"

export const Content404Deprecated = () => {
  const pageTitle = t("errors.notFound.title")

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
