import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailAdditionalFees = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalFees")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("listings.applicationFee")}>{listing.applicationFee}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.depositMin")}>{listing.depositMin}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.depositMax")}>{listing.depositMax}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.sections.costsNotIncluded")}>
            {listing.costsNotIncluded}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalFees
