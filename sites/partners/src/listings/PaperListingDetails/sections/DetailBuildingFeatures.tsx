import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingFeaturesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("t.propertyAmenities")}>{listing.amenities}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.accessibility")}>{listing.accessibility}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("t.unitAmenities")}>{listing.unitAmenities}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.smokingPolicy")}>{listing.smokingPolicy}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("t.petsPolicy")}>{listing.petPolicy}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.servicesOffered")}>{listing.servicesOffered}</ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
