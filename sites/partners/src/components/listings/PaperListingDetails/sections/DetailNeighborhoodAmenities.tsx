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
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useJurisdiction } from "../../../../lib/hooks"

type AmenityConfig = {
  key: NeighborhoodAmenitiesEnum
  labelKey: string
  fieldId: string
  getValue: (listing: Listing) => string | null | undefined
}

const amenitiesConfig: AmenityConfig[] = [
  {
    key: NeighborhoodAmenitiesEnum.groceryStores,
    labelKey: "listings.amenities.groceryStores",
    fieldId: "neighborhoodAmenities.groceryStores",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.groceryStores,
  },
  {
    key: NeighborhoodAmenitiesEnum.publicTransportation,
    labelKey: "listings.amenities.publicTransportation",
    fieldId: "neighborhoodAmenities.publicTransportation",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.publicTransportation,
  },
  {
    key: NeighborhoodAmenitiesEnum.schools,
    labelKey: "listings.amenities.schools",
    fieldId: "neighborhoodAmenities.schools",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.schools,
  },
  {
    key: NeighborhoodAmenitiesEnum.parksAndCommunityCenters,
    labelKey: "listings.amenities.parksAndCommunityCenters",
    fieldId: "neighborhoodAmenities.parksAndCommunityCenters",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.parksAndCommunityCenters,
  },
  {
    key: NeighborhoodAmenitiesEnum.pharmacies,
    labelKey: "listings.amenities.pharmacies",
    fieldId: "neighborhoodAmenities.pharmacies",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.pharmacies,
  },
  {
    key: NeighborhoodAmenitiesEnum.healthCareResources,
    labelKey: "listings.amenities.healthCareResources",
    fieldId: "neighborhoodAmenities.healthCareResources",
    getValue: (listing) => listing.listingNeighborhoodAmenities?.healthCareResources,
  },
]

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
    return amenitiesConfig.filter((amenity) => visibleAmenitiesList.includes(amenity.key))
  }, [jurisdictionData?.visibleNeighborhoodAmenities])

  if (!enableNeighborhoodAmenities) {
    return <></>
  }

  return (
    <SectionWithGrid heading={t("listings.sections.neighborhoodAmenitiesTitle")} inset>
      {visibleAmenities.map((amenity) => (
        <Grid.Row key={amenity.key}>
          <Grid.Cell>
            <FieldValue id={amenity.fieldId} label={t(amenity.labelKey)}>
              {getDetailFieldString(amenity.getValue(listing))}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      ))}
    </SectionWithGrid>
  )
}

export default DetailNeighborhoodAmenities
