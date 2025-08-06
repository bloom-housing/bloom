import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailNeighborhoodAmenities = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableNeighborhoodAmenities = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNeighborhoodAmenities,
    listing.jurisdictions.id
  )

  return enableNeighborhoodAmenities ? (
    <SectionWithGrid heading={t("listings.sections.neighborhoodAmenitiesTitle")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="neighborhoodAmenities.groceryStores"
            label={t("listings.amenities.groceryStores")}
          >
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.groceryStores)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="neighborhoodAmenities.publicTransportation"
            label={t("listings.amenities.publicTransportation")}
          >
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.publicTransportation)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="neighborhoodAmenities.schools" label={t("listings.amenities.schools")}>
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.schools)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="neighborhoodAmenities.parksAndCommunityCenters"
            label={t("listings.amenities.parksAndCommunityCenters")}
          >
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.parksAndCommunityCenters)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="neighborhoodAmenities.pharmacies"
            label={t("listings.amenities.pharmacies")}
          >
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.pharmacies)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="neighborhoodAmenities.healthCareResources"
            label={t("listings.amenities.healthCareResources")}
          >
            {getDetailFieldString(listing.listingNeighborhoodAmenities?.healthCareResources)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  ) : (
    <></>
  )
}

export default DetailNeighborhoodAmenities
