import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getLotteryEvent } from "@bloom-housing/shared-helpers"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { getDetailFieldNumber, getDetailFieldString, getDetailBoolean } from "./helpers"

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
          <FieldValue id="reviewOrderQuestion" label={t("listings.reviewOrderQuestion")}>
            {getReviewOrderType() === ListingReviewOrder.firstComeFirstServe
              ? t("listings.firstComeFirstServe")
              : t("listings.lotteryTitle")}
          </FieldValue>
        </GridSection>
      )}
      {lotteryEvent && (
        <>
          <GridSection columns={3}>
            <FieldValue id="lotteryEvent.startTime.date" label={t("listings.lotteryDateQuestion")}>
              {dayjs(new Date(lotteryEvent?.startTime)).utc().format("MM/DD/YYYY")}
            </FieldValue>
            <FieldValue id="lotteryEvent.startTime.time" label={t("listings.lotteryStartTime")}>
              {dayjs(new Date(lotteryEvent?.startTime)).format("hh:mm A")}
            </FieldValue>
            <FieldValue id="lotteryEvent.lotteryEndTime.time" label={t("listings.lotteryEndTime")}>
              {dayjs(new Date(lotteryEvent?.endTime)).format("hh:mm A")}
            </FieldValue>
          </GridSection>
          <GridSection columns={2}>
            <FieldValue id="lotteryDateNotes" label={t("listings.lotteryDateNotes")}>
              {lotteryEvent?.note}
            </FieldValue>
          </GridSection>
        </>
      )}
      {getReviewOrderType() === ListingReviewOrder.firstComeFirstServe && (
        <GridSection columns={2}>
          <FieldValue id="dueDateQuestion" label={t("listings.dueDateQuestion")}>
            {listing.applicationDueDate ? t("t.yes") : t("t.no")}
          </FieldValue>
        </GridSection>
      )}
      {listing.reviewOrderType === ListingReviewOrder.waitlist && (
        <>
          <GridSection columns={2}>
            <FieldValue id="waitlist.openQuestion" label={t("listings.waitlist.openQuestion")}>
              {getDetailBoolean(listing.isWaitlistOpen)}
            </FieldValue>
          </GridSection>
          <GridSection columns={3}>
            <FieldValue id="waitlistOpenSpots" label={t("listings.waitlist.openSize")}>
              {getDetailFieldNumber(listing.waitlistOpenSpots)}
            </FieldValue>
          </GridSection>
        </>
      )}
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="whatToExpect" label={t("listings.whatToExpectLabel")}>
            {getDetailFieldString(listing.whatToExpect)}
          </FieldValue>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailRankingsAndResults
