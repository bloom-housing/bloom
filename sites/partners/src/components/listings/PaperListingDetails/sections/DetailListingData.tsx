import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldString, getDetailFieldTime } from "./helpers"

type DetailListingDataProps = {
  showJurisdictionName: boolean
}

const DetailListingData = (props: DetailListingDataProps) => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.details.listingData")} inset>
      {props.showJurisdictionName && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="jurisdictions.name" label={t("t.jurisdiction")}>
              {getDetailFieldString(listing.jurisdictions.name)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      <Grid.Row columns={5}>
        <Grid.Cell>
          <FieldValue label={t("listings.details.createdDate")}>
            {getDetailFieldDate(listing.createdAt)}
            {" at "}
            {getDetailFieldTime(listing.createdAt)}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell className={"seeds-grid-span-2"}>
          <FieldValue label={t("listings.details.id")}>{listing.id}</FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailListingData
