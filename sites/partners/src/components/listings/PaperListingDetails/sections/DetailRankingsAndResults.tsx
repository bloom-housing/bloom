import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { AuthContext, getLotteryEvent } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getDetailFieldNumber, getDetailFieldString, getDetailBoolean } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailRankingsAndResults = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableWaitlistAdditionalFields = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableWaitlistAdditionalFields,
    listing.jurisdictions.id
  )

  const enableUnitGroups = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUnitGroups,
    listing.jurisdictions.id
  )

  const lotteryEvent = getLotteryEvent(listing)
  const getReviewOrderType = () => {
    if (!listing.reviewOrderType) {
      return lotteryEvent ? ReviewOrderTypeEnum.lottery : ReviewOrderTypeEnum.firstComeFirstServe
    } else {
      return listing.reviewOrderType
    }
  }
  return (
    <SectionWithGrid heading={t("listings.sections.rankingsResultsTitle")} inset>
      {(listing.reviewOrderType !== ReviewOrderTypeEnum.waitlist || enableUnitGroups) && (
        <Grid.Row>
          <FieldValue id="reviewOrderQuestion" label={t("listings.reviewOrderQuestion")}>
            {getReviewOrderType() === ReviewOrderTypeEnum.firstComeFirstServe
              ? t("listings.firstComeFirstServe")
              : t("listings.lotteryTitle")}
          </FieldValue>
        </Grid.Row>
      )}
      {listing.reviewOrderType === ReviewOrderTypeEnum.lottery && process.env.showLottery && (
        <Grid.Row>
          <FieldValue id="lotteryOptInQuestion" label={t("listings.lotteryOptInQuestion")}>
            {listing?.lotteryOptIn ? t("t.yes") : t("t.no")}
          </FieldValue>
        </Grid.Row>
      )}
      {lotteryEvent && (
        <>
          <Grid.Row>
            <FieldValue id="lotteryEvent.startTime.date" label={t("listings.lotteryDateQuestion")}>
              {dayjs(new Date(lotteryEvent?.startDate)).utc().format("MM/DD/YYYY")}
            </FieldValue>
            <FieldValue id="lotteryEvent.startTime.time" label={t("listings.lotteryStartTime")}>
              {lotteryEvent?.startTime
                ? dayjs(new Date(lotteryEvent?.startTime)).format("hh:mm A")
                : null}
            </FieldValue>
            <FieldValue id="lotteryEvent.lotteryEndTime.time" label={t("listings.lotteryEndTime")}>
              {lotteryEvent?.endTime
                ? dayjs(new Date(lotteryEvent?.endTime)).format("hh:mm A")
                : null}
            </FieldValue>
          </Grid.Row>
          <Grid.Row>
            <FieldValue id="lotteryDateNotes" label={t("listings.lotteryDateNotes")}>
              {lotteryEvent?.note}
            </FieldValue>
          </Grid.Row>
        </>
      )}
      {(listing.reviewOrderType === ReviewOrderTypeEnum.waitlist || enableUnitGroups) && (
        <>
          <Grid.Row>
            <FieldValue id="waitlist.openQuestion" label={t("listings.waitlist.openQuestion")}>
              {getDetailBoolean(listing.isWaitlistOpen)}
            </FieldValue>
          </Grid.Row>
          <Grid.Row>
            {enableWaitlistAdditionalFields && (
              <>
                <FieldValue id="waitlistMaxSize" label={t("listings.waitlist.maxSize")}>
                  {getDetailFieldNumber(listing.waitlistMaxSize)}
                </FieldValue>
                <FieldValue id="waitlistCurrentSize" label={t("listings.waitlist.currentSize")}>
                  {getDetailFieldNumber(listing.waitlistCurrentSize)}
                </FieldValue>
              </>
            )}
            <FieldValue id="waitlistOpenSpots" label={t("listings.waitlist.openSize")}>
              {getDetailFieldNumber(listing.waitlistOpenSpots)}
            </FieldValue>
          </Grid.Row>
        </>
      )}

      <Grid.Row>
        <FieldValue id="whatToExpect" label={t("listings.whatToExpectLabel")}>
          {getDetailFieldString(listing.whatToExpect)}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailRankingsAndResults
