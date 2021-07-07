import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailBuildingFeatures = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingFeaturesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.propertyAmenities")}>
            {getDetailFieldString(listing.amenities)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.unitAmenities")}>
            {getDetailFieldString(listing.unitAmenities)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.accessibility")}>
            {getDetailFieldString(listing.accessibility)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.smokingPolicy")}>
            {getDetailFieldString(listing.smokingPolicy)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.petsPolicy")}>{getDetailFieldString(listing.petPolicy)}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("t.servicesOffered")}>
            {getDetailFieldString(listing.servicesOffered)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingFeatures
