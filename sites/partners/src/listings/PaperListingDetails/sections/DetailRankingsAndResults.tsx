import React, { useContext } from "react"
import moment from "moment"
import { t, GridSection, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getLotteryEvent } from "../../../../lib/helpers"
import { EnumListingReviewOrderType } from "@bloom-housing/backend-core/types"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)

  const lotteryEvent = getLotteryEvent(listing)

  const getReviewOrderType = (): EnumListingReviewOrderType => {
    return lotteryEvent
      ? EnumListingReviewOrderType.lottery
      : EnumListingReviewOrderType.firstComeFirstServe
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.rankingsResultsTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <ViewItem label={t("listings.reviewOrderQuestion")}>
          {getReviewOrderType() === EnumListingReviewOrderType.firstComeFirstServe
            ? t("listings.firstComeFirstServe")
            : t("listings.lottery")}
        </ViewItem>
      </GridSection>
      {lotteryEvent && (
        <>
          <GridSection columns={3}>
            <ViewItem label={t("listings.lotteryDateQuestion")}>
              {moment(new Date(lotteryEvent?.startTime)).utc().format("MM/DD/YYYY")}
            </ViewItem>
            <ViewItem label={t("listings.lotteryStartTime")}>
              {moment(new Date(lotteryEvent?.startTime)).format("hh:mm A")}
            </ViewItem>
            <ViewItem label={t("listings.lotteryEndTime")}>
              {moment(new Date(lotteryEvent?.endTime)).format("hh:mm A")}
            </ViewItem>
          </GridSection>
          <GridSection columns={2}>
            <ViewItem label={t("listings.lotteryDateNotes")}>{lotteryEvent?.note}</ViewItem>
          </GridSection>
        </>
      )}
      {getReviewOrderType() === EnumListingReviewOrderType.firstComeFirstServe && (
        <GridSection columns={2}>
          <ViewItem label={t("listings.dueDateQuestion")}>
            {listing.applicationDueDate ? t("t.yes") : t("t.no")}
          </ViewItem>
        </GridSection>
      )}
      <GridSection columns={2}>
        <ViewItem label={t("listings.waitlist.openQuestion")}>
          {listing.isWaitlistOpen ? t("t.yes") : t("t.no")}
        </ViewItem>
      </GridSection>
      {listing.isWaitlistOpen && (
        <GridSection columns={2}>
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
