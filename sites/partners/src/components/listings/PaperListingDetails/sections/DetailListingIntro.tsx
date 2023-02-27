import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../../detroit-ui-components/src/blocks/ViewItem"
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
          <ViewItem id="jurisdiction.name" label={t("t.jurisdiction")}>
            {getDetailFieldString(listing.jurisdiction.name)}
          </ViewItem>
        </GridCell>
        <GridCell span={2}>
          <ViewItem id="name" label={t("listings.listingName")}>
            {getDetailFieldString(listing.name)}
          </ViewItem>
        </GridCell>
        <ViewItem id="developer" label={t("listings.developer")}>
          {getDetailFieldString(listing.developer)}
        </ViewItem>
      </GridSection>
    </GridSection>
  )
}

export default DetailListingIntro
