import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"

const DetailListingData = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection className="bg-primary-lighter" title={t("listings.details.listingData")} inset>
      <GridCell>
        <ViewItem label={t("listings.details.id")}>{listing.id}</ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("listings.details.createdDate")}>
          {getDetailFieldDate(listing.createdAt)}
          <br />
          {getDetailFieldTime(listing.createdAt)}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("listings.details.updatedDate")}>
          {getDetailFieldDate(listing.updatedAt)}
          <br />
          {getDetailFieldTime(listing.updatedAt)}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export default DetailListingData
