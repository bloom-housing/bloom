import React, { useContext } from "react"
import { t, GridSection, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
      title={t("listings.sections.rankingsResultsTitle")}
      grid={false}
      inset
    >
      {listing.waitlistMaxSize && (
        <GridSection columns={3} className={"flex items-center"}>
          <ViewItem label={t("listings.waitlist.maxSize")}>{listing.waitlistMaxSize}</ViewItem>
          <ViewItem label={t("listings.waitlist.currentSize")}>
            {listing.waitlistCurrentSize}
          </ViewItem>
          {/* <ViewItem label={t("listings.waitlist.openSize")}>{listing.???}</ViewItem> */}
        </GridSection>
      )}
    </GridSection>
  )
}

export default DetailRankingsAndResults
