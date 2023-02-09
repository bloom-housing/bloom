import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { getDetailFieldString } from "./helpers"
import { ListingContext } from "../../ListingContext"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.neighborhoodAmenitiesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <ViewItem
            id="neighborhoodAmenities.groceryStores"
            label={t("listings.amenities.groceryStores")}
          >
            {getDetailFieldString(listing.neighborhoodAmenities?.groceryStores)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem
            id="neighborhoodAmenities.publicTransportation"
            label={t("listings.amenities.publicTransportation")}
          >
            {getDetailFieldString(listing.neighborhoodAmenities?.publicTransportation)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="neighborhoodAmenities.schools" label={t("listings.amenities.schools")}>
            {getDetailFieldString(listing.neighborhoodAmenities?.schools)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem
            id="neighborhoodAmenities.parksAndCommunityCenters"
            label={t("listings.amenities.parksAndCommunityCenters")}
          >
            {getDetailFieldString(listing.neighborhoodAmenities?.parksAndCommunityCenters)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem
            id="neighborhoodAmenities.pharmacies"
            label={t("listings.amenities.pharmacies")}
          >
            {getDetailFieldString(listing.neighborhoodAmenities?.pharmacies)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem
            id="neighborhoodAmenities.healthCareResources"
            label={t("listings.amenities.healthCareResources")}
          >
            {getDetailFieldString(listing.neighborhoodAmenities?.healthCareResources)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
