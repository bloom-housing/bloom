import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailAdditionalEligibility = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalEligibilityTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.creditHistory")}>
            {getDetailFieldString(listing.creditHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.rentalHistory")}>
            {getDetailFieldString(listing.rentalHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.criminalBackground")}>
            {getDetailFieldString(listing.criminalBackground)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.sections.rentalAssistanceTitle")}>
            {getDetailFieldString(listing.rentalAssistance)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalEligibility
