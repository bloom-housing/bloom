import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldNumber, getDetailFieldString, getDetailBoolean } from "./helpers"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.rankingsResultsTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <ViewItem id="waitlist.openQuestion" label={t("listings.waitlist.openQuestion")}>
          {getDetailBoolean(listing.isWaitlistOpen)}
        </ViewItem>
      </GridSection>
      {listing.isWaitlistOpen && (
        <GridSection columns={3}>
          <ViewItem id="waitlistMaxSize" label={t("listings.waitlist.maxSize")}>
            {getDetailFieldNumber(listing.waitlistMaxSize)}
          </ViewItem>
          <ViewItem id="waitlistCurrentSize" label={t("listings.waitlist.currentSize")}>
            {getDetailFieldNumber(listing.waitlistCurrentSize)}
          </ViewItem>
          <ViewItem id="waitlistOpenSpots" label={t("listings.waitlist.openSize")}>
            {getDetailFieldNumber(listing.waitlistOpenSpots)}
          </ViewItem>
        </GridSection>
      )}
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="whatToExpect" label={t("listings.whatToExpectLabel")}>
            {getDetailFieldString(listing.whatToExpect)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailRankingsAndResults
