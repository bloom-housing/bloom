import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"

const DetailListingData = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection className="bg-primary-lighter" title={t("listings.details.listingData")} inset>
      <GridCell span={2}>
        <FieldValue label={t("listings.details.id")}>{listing.id}</FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("listings.details.createdDate")}>
          {getDetailFieldDate(listing.createdAt)}
          <br />
          {getDetailFieldTime(listing.createdAt)}
        </FieldValue>
      </GridCell>
    </GridSection>
  )
}

export default DetailListingData
