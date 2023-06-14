import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
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
              <FieldValue
                id="buildingAddress.street"
                label={t("application.contact.streetAddress")}
              >
                {listing.buildingAddress?.street}
              </FieldValue>
            </GridCell>
            <FieldValue id="neighborhood" label={t("t.neighborhood")}>
              {listing?.neighborhood}
            </FieldValue>
          </GridSection>
          <GridSection columns={6}>
            <GridCell span={2}>
              <FieldValue id="buildingAddress.city" label={t("application.contact.city")}>
                {listing.buildingAddress?.city}
              </FieldValue>
            </GridCell>
            <FieldValue id="buildingAddress.state" label={t("application.contact.state")}>
              {listing.buildingAddress?.state}
            </FieldValue>
            <FieldValue id="buildingAddress.zipCode" label={t("application.contact.zip")}>
              {listing.buildingAddress?.zipCode}
            </FieldValue>

            <GridCell span={2}>
              <FieldValue id="yearBuilt" label={t("listings.yearBuilt")}>
                {listing.yearBuilt}
              </FieldValue>
            </GridCell>
          </GridSection>
          <GridSection columns={3}>
            <FieldValue id="longitude" label={t("listings.longitude")}>
              {listing.buildingAddress?.longitude && listing.buildingAddress.longitude.toString()}
            </FieldValue>
            <FieldValue id="latitude" label={t("listings.latitude")}>
              {listing.buildingAddress?.latitude && listing.buildingAddress.latitude.toString()}
            </FieldValue>
          </GridSection>
        </>
      ) : (
        <FieldValue>
          <GridSection subtitle={"Building Address"}>{getDetailFieldString(null)}</GridSection>
        </FieldValue>
      )}
    </GridSection>
  )
}

export default DetailBuildingDetails
