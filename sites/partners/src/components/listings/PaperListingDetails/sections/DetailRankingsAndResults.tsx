import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t, GridSection, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getLotteryEvent } from "@bloom-housing/shared-helpers"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { getDetailFieldNumber, getDetailBoolean } from "./helpers"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)

  const lotteryEvent = getLotteryEvent(listing)
  const getReviewOrderType = () => {
    if (!listing.reviewOrderType) {
      return lotteryEvent ? ListingReviewOrder.lottery : ListingReviewOrder.firstComeFirstServe
    } else {
      return listing.reviewOrderType
    }
  }
  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.rankingsResultsTitle")}
      grid={false}
      inset
    >
      {listing.reviewOrderType !== ListingReviewOrder.waitlist && (
        <GridSection columns={2}>
          <ViewItem id="reviewOrderQuestion" label={t("listings.reviewOrderQuestion")}>
            {getReviewOrderType() === ListingReviewOrder.firstComeFirstServe
              ? t("listings.firstComeFirstServe")
              : t("listings.lotteryTitle")}
          </ViewItem>
        </GridSection>
      )}
      {lotteryEvent && (
        <>
          <GridSection columns={3}>
            <ViewItem id="lotteryEvent.startTime.date" label={t("listings.lotteryDateQuestion")}>
              {dayjs(new Date(lotteryEvent?.startTime)).utc().format("MM/DD/YYYY")}
            </ViewItem>
            <ViewItem id="lotteryEvent.startTime.time" label={t("listings.lotteryStartTime")}>
              {dayjs(new Date(lotteryEvent?.startTime)).format("hh:mm A")}
            </ViewItem>
            <ViewItem id="lotteryEvent.lotteryEndTime.time" label={t("listings.lotteryEndTime")}>
              {dayjs(new Date(lotteryEvent?.endTime)).format("hh:mm A")}
            </ViewItem>
          </GridSection>
          <GridSection columns={2}>
            <ViewItem id="lotteryDateNotes" label={t("listings.lotteryDateNotes")}>
              {lotteryEvent?.note}
            </ViewItem>
          </GridSection>
        </>
      )}
      {listing.reviewOrderType === ListingReviewOrder.waitlist && (
        <>
          <GridSection columns={2}>
            <ViewItem id="waitlist.openQuestion" label={t("listings.waitlist.openQuestion")}>
              {getDetailBoolean(listing.isWaitlistOpen)}
            </ViewItem>
          </GridSection>
          <GridSection columns={3}>
            <ViewItem id="waitlistOpenSpots" label={t("listings.waitlist.openSize")}>
              {getDetailFieldNumber(listing.waitlistOpenSpots)}
            </ViewItem>
          </GridSection>
        </>
      )}
    </GridSection>
  )
}

export default DetailRankingsAndResults
