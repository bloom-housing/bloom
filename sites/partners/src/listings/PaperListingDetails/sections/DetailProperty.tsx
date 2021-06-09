import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailProperty = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
      title={t("listings.property.title")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.property.id")}>{listing.property.id}</ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("listings.property.developer")}>{listing.property.developer}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection subtitle={t("listings.property.buildingAddress")} columns={3}>
        <GridCell>
          <ViewItem label={t("application.contact.streetAddress")}>
            {listing.property.buildingAddress.street}
          </ViewItem>
        </GridCell>

        <GridCell span={2}>
          <ViewItem label={t("application.contact.apt")}>
            {listing.property.buildingAddress.street2}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>
            {listing.property.buildingAddress.city}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.state")}>
            {listing.property.buildingAddress.state}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.zip")}>
            {listing.property.buildingAddress.zipCode}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailProperty
