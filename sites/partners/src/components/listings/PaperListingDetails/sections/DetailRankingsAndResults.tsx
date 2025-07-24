import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext, getLotteryEvent } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldNumber, getDetailBoolean, getDetailFieldRichText } from "./helpers"

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
          <Grid.Cell>
            <FieldValue id="reviewOrderQuestion" label={t("listings.reviewOrderQuestion")}>
              {getReviewOrderType() === ReviewOrderTypeEnum.firstComeFirstServe
                ? t("listings.firstComeFirstServe")
                : t("listings.lotteryTitle")}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      {listing.reviewOrderType === ReviewOrderTypeEnum.lottery && process.env.showLottery && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="lotteryOptInQuestion" label={t("listings.lotteryOptInQuestion")}>
              {listing?.lotteryOptIn ? t("t.yes") : t("t.no")}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      {lotteryEvent && (
        <>
          <Grid.Row>
            <Grid.Cell>
              <FieldValue
                id="lotteryEvent.startTime.date"
                label={t("listings.lotteryDateQuestion")}
              >
                {dayjs(new Date(lotteryEvent?.startDate)).utc().format("MM/DD/YYYY")}
              </FieldValue>
            </Grid.Cell>
            <Grid.Cell>
              <FieldValue id="lotteryEvent.startTime.time" label={t("listings.lotteryStartTime")}>
                {lotteryEvent?.startTime
                  ? dayjs(new Date(lotteryEvent?.startTime)).format("hh:mm A")
                  : null}
              </FieldValue>
            </Grid.Cell>
            <Grid.Cell>
              <FieldValue
                id="lotteryEvent.lotteryEndTime.time"
                label={t("listings.lotteryEndTime")}
              >
                {lotteryEvent?.endTime
                  ? dayjs(new Date(lotteryEvent?.endTime)).format("hh:mm A")
                  : null}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
          <Grid.Row>
            <Grid.Cell>
              <FieldValue id="lotteryDateNotes" label={t("listings.lotteryDateNotes")}>
                {lotteryEvent?.note}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        </>
      )}
      {(listing.reviewOrderType === ReviewOrderTypeEnum.waitlist || enableUnitGroups) && (
        <>
          <Grid.Row>
            <Grid.Cell>
              <FieldValue id="waitlist.openQuestion" label={t("listings.waitlist.openQuestion")}>
                {getDetailBoolean(listing.isWaitlistOpen)}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
          <Grid.Row>
            {enableWaitlistAdditionalFields && (
              <>
                <Grid.Cell>
                  <FieldValue id="waitlistMaxSize" label={t("listings.waitlist.maxSize")}>
                    {getDetailFieldNumber(listing.waitlistMaxSize)}
                  </FieldValue>
                </Grid.Cell>
                <Grid.Cell>
                  <FieldValue id="waitlistCurrentSize" label={t("listings.waitlist.currentSize")}>
                    {getDetailFieldNumber(listing.waitlistCurrentSize)}
                  </FieldValue>
                </Grid.Cell>
              </>
            )}
            <Grid.Cell>
              <FieldValue id="waitlistOpenSpots" label={t("listings.waitlist.openSize")}>
                {getDetailFieldNumber(listing.waitlistOpenSpots)}
              </FieldValue>
            </Grid.Cell>
          </Grid.Row>
        </>
      )}
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="whatToExpect" label={t("listings.whatToExpectLabel")}>
            {getDetailFieldRichText(listing.whatToExpect, "whatToExpect")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailRankingsAndResults
