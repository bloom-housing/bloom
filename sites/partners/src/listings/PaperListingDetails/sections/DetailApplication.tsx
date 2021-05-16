import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailApplication = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
      title={t("listings.applicationTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.applicationDeadline")}>
            {listing.applicationDueDate}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("listings.applicationFee")}>{listing.applicationFee}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection subtitle={t("listings.applicationAddress")} columns={3}>
        <GridCell>
          <ViewItem label={t("application.contact.streetAddress")}>
            {listing.applicationAddress?.street}
          </ViewItem>
        </GridCell>

        <GridCell span={2}>
          <ViewItem label={t("application.contact.apt")}>
            {listing.applicationAddress?.street2}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>
            {listing.applicationAddress?.city}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.state")}>
            {listing.applicationAddress?.state}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.zip")}>
            {listing.applicationAddress?.zipCode}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplication
