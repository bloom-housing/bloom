import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailCommunityType = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.sections.communityType")} inset>
      <Grid.Row>
        <FieldValue id="reservedCommunityType" label={t("listings.reservedCommunityType")}>
          {getDetailFieldString(
            listing.reservedCommunityType
              ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
              : null
          )}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue
          id="reservedCommunityDescription"
          label={t("listings.reservedCommunityDescription")}
        >
          {getDetailFieldString(listing.reservedCommunityDescription)}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailCommunityType
