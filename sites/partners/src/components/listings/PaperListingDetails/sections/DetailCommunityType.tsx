import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailCommunityType = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.communityType")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <FieldValue id="reservedCommunityType" label={t("listings.reservedCommunityType")}>
            {getDetailFieldString(
              listing.reservedCommunityType
                ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
                : null
            )}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <FieldValue
            id="reservedCommunityDescription"
            label={t("listings.reservedCommunityDescription")}
          >
            {getDetailFieldString(listing.reservedCommunityDescription)}
          </FieldValue>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailCommunityType
