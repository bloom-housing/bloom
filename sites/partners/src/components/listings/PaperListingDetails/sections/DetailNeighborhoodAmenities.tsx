import React, { useContext, useMemo } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  NeighborhoodAmenitiesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useJurisdiction } from "../../../../lib/hooks"

const DetailNeighborhoodAmenities = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const { data: jurisdictionData } = useJurisdiction(listing.jurisdictions.id)

  const enableNeighborhoodAmenities = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNeighborhoodAmenities,
    listing.jurisdictions.id
  )

  const visibleAmenities = useMemo(() => {
    const visibleAmenitiesList = jurisdictionData?.visibleNeighborhoodAmenities || []
    return Object.values(NeighborhoodAmenitiesEnum).filter((amenity) =>
      visibleAmenitiesList.includes(amenity)
    )
  }, [jurisdictionData?.visibleNeighborhoodAmenities])

  if (!enableNeighborhoodAmenities) {
    return <></>
  }

  return (
    <SectionWithGrid heading={t("listings.sections.neighborhoodAmenitiesTitle")} inset>
      {visibleAmenities.map((amenity) => {
        return (
          <Grid.Row key={amenity}>
            <Grid.Cell>
              <FieldValue
                id={`neighborhoodAmenities.${amenity}`}
                label={t(`listings.amenities.${amenity}`)}
              >
                {getDetailFieldString(listing.listingNeighborhoodAmenities?.[amenity])}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )
      })}
    </SectionWithGrid>
  )
}

export default DetailNeighborhoodAmenities
