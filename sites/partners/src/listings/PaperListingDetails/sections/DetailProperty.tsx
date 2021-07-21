import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailProperty = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection className="bg-primary-ligher" title={t("listings.title")} grid={false} inset>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.developer")}>{listing.developer}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection subtitle={t("listings.buildingAddress")} columns={3}>
        <GridCell>
          <ViewItem label={t("application.contact.streetAddress")}>
            {listing.buildingAddress.street}
          </ViewItem>
        </GridCell>

        <GridCell span={2}>
          <ViewItem label={t("application.contact.apt")}>
            {listing.buildingAddress.street2}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>{listing.buildingAddress.city}</ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.state")}>
            {listing.buildingAddress.state}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.zip")}>
            {listing.buildingAddress.zipCode}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailProperty
