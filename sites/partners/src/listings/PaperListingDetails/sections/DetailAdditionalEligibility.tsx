import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailAdditionalEligibility = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalEligibilityTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.creditHistory")}>{listing.creditHistory}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.rentalHistory")}>{listing.rentalHistory}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.criminalBackground")}>{listing.criminalBackground}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.sections.rentalAssistanceTitle")}>
            {listing.rentalAssistance}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalEligibility
