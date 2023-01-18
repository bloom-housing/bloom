import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
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
          <ViewItem id="reservedCommunityType" label={t("listings.reservedCommunityType")}>
            {getDetailFieldString(
              listing.reservedCommunityType
                ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
                : null
            )}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem
            id="reservedCommunityDescription"
            label={t("listings.reservedCommunityDescription")}
          >
            {getDetailFieldString(listing.reservedCommunityDescription)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailCommunityType
