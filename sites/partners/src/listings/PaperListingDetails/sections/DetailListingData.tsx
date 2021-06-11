import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailListingData = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection className="bg-primary-lighter" title={t("listings.details.listingData")} inset>
      <GridCell>
        <ViewItem label={t("listings.details.id")}>{listing.id}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("listings.details.createdDate")}>{listing.createdAt}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("listings.details.updatedDate")}>{listing.updatedAt}</ViewItem>
      </GridCell>
    </GridSection>
  )
}

export default DetailListingData
