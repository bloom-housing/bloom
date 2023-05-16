import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailBuildingDetails = () => {
  const listing = useContext(ListingContext)
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.buildingDetailsTitle")}
      grid={false}
      inset
    >
      {listing.buildingAddress ? (
        <>
          <GridSection columns={3} subtitle={"Building Address"}>
            <GridCell span={2}>
              <ViewItem id="buildingAddress.street" label={t("application.contact.streetAddress")}>
                {listing.buildingAddress?.street}
              </ViewItem>
            </GridCell>
            <ViewItem id="neighborhood" label={t("t.neighborhood")}>
              {listing?.neighborhood}
            </ViewItem>
          </GridSection>
          <GridSection columns={6}>
            <GridCell span={2}>
              <ViewItem id="buildingAddress.city" label={t("application.contact.city")}>
                {listing.buildingAddress?.city}
              </ViewItem>
            </GridCell>
            <ViewItem id="buildingAddress.state" label={t("application.contact.state")}>
              {listing.buildingAddress?.state}
            </ViewItem>
            <ViewItem id="buildingAddress.zipCode" label={t("application.contact.zip")}>
              {listing.buildingAddress?.zipCode}
            </ViewItem>

            <GridCell span={2}>
              <ViewItem id="yearBuilt" label={t("listings.yearBuilt")}>
                {listing.yearBuilt}
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={3}>
            <ViewItem id="buildingAddress.county" label={t("application.contact.county")}>
              {t(`counties.${listing.buildingAddress.county}`)}
            </ViewItem>
            <ViewItem id="longitude" label={t("listings.longitude")}>
              {listing.buildingAddress?.longitude && listing.buildingAddress.longitude.toString()}
            </ViewItem>
            <ViewItem id="latitude" label={t("listings.latitude")}>
              {listing.buildingAddress?.latitude && listing.buildingAddress.latitude.toString()}
            </ViewItem>
          </GridSection>
        </>
      ) : (
        <ViewItem>
          <GridSection subtitle={"Building Address"}>{getDetailFieldString(null)}</GridSection>
        </ViewItem>
      )}
    </GridSection>
  )
}

export default DetailBuildingDetails
