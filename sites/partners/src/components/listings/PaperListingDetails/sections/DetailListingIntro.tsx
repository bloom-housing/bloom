import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailListingIntro = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.introTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell span={2}>
          <FieldValue id="jurisdiction.name" label={t("t.jurisdiction")}>
            {getDetailFieldString(listing.jurisdiction.name)}
          </FieldValue>
        </GridCell>
        <GridCell span={2}>
          <FieldValue id="name" label={t("listings.listingName")}>
            {getDetailFieldString(listing.name)}
          </FieldValue>
        </GridCell>
        <FieldValue id="developer" label={t("listings.developer")}>
          {getDetailFieldString(listing.developer)}
        </FieldValue>
      </GridSection>
    </GridSection>
  )
}

export default DetailListingIntro
