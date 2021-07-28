import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailBuildingDetails = () => {
  const listing = useContext(ListingContext)
  console.log("buildingAddress from details", listing?.buildingAddress)
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingDetailsTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell span={2}>
          <ViewItem label={t("application.contact.streetAddress")}>
            {listing.buildingAddress.street}
          </ViewItem>
        </GridCell>
        <ViewItem label={t("t.neighborhood")}>{listing.neighborhood}</ViewItem>
      </GridSection>
      <GridSection columns={6}>
        <GridCell span={2}>
          <ViewItem label={t("application.contact.city")}>{listing.buildingAddress.city}</ViewItem>
        </GridCell>
        <ViewItem label={t("application.contact.state")}>{listing.buildingAddress.state}</ViewItem>
        <ViewItem label={t("application.contact.zip")}>{listing.buildingAddress.zipCode}</ViewItem>

        <GridCell span={2}>
          <ViewItem label={t("listings.yearBuilt")}>{listing.yearBuilt}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={3}>
        <ViewItem label={t("listings.longitude")}>
          {listing.buildingAddress.longitude && listing.buildingAddress.longitude.toString()}
        </ViewItem>
        <ViewItem label={t("listings.latitude")}>
          {listing.buildingAddress.latitude && listing.buildingAddress.latitude.toString()}
        </ViewItem>
      </GridSection>
    </GridSection>
  )
}

export default DetailBuildingDetails
