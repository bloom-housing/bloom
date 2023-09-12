import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"

const DetailListingData = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.details.listingData")} inset>
      <Grid.Row>
        <FieldValue label={t("listings.details.id")}>{listing.id}</FieldValue>
        <FieldValue label={t("listings.details.createdDate")}>
          {getDetailFieldDate(listing.createdAt)}
          {" at "}
          {getDetailFieldTime(listing.createdAt)}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailListingData
