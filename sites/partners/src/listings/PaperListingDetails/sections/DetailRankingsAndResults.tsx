import React, { useContext } from "react"
import { t, GridSection, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.rankingsResultsTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <ViewItem label={t("listings.waitlist.openQuestion")}>
          {listing.isWaitlistOpen ? t("t.yes") : t("t.no")}
        </ViewItem>
      </GridSection>
      {listing.isWaitlistOpen && (
        <GridSection columns={3}>
          <ViewItem label={t("listings.waitlist.sizeQuestion")}>
            {listing.waitlistMaxSize ? t("t.yes") : t("t.no")}
          </ViewItem>
        </GridSection>
      )}
      {listing.waitlistMaxSize && (
        <GridSection columns={3}>
          <ViewItem label={t("listings.waitlist.maxSize")}>
            {listing.waitlistMaxSize.toString()}
          </ViewItem>
          <ViewItem label={t("listings.waitlist.currentSize")}>
            {listing.waitlistCurrentSize.toString()}
          </ViewItem>
          <ViewItem label={t("listings.waitlist.openSize")}>
            {listing.waitlistOpenSpots.toString()}
          </ViewItem>
        </GridSection>
      )}
    </GridSection>
  )
}

export default DetailRankingsAndResults
