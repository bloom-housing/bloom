import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  Field,
  FieldGroup,
  GridCell,
  Textarea,
  DateField,
  TimeField,
} from "@bloom-housing/ui-components"

import { YesNoAnswer } from "../../../../lib/helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { getLotteryEvent } from "@bloom-housing/shared-helpers"

type RankingsAndResultsProps = {
  listing?: FormListing
}

const RankingsAndResults = ({ listing }: RankingsAndResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control } = formMethods

  const lotteryEvent = getLotteryEvent(listing)

  const waitlistOpen = useWatch({
    control,
    name: "waitlistOpenQuestion",
    defaultValue: listing?.isWaitlistOpen
      ? YesNoAnswer.Yes
      : listing?.isWaitlistOpen === false
      ? YesNoAnswer.No
      : null,
  })

  const reviewOrder = useWatch({
    control,
    name: "reviewOrderQuestion",
    defaultValue:
      listing?.reviewOrderType === ListingReviewOrder.lottery
        ? "reviewOrderLottery"
        : "reviewOrderFCFS",
  })

  const availabilityQuestion = useWatch({
    control,
    name: "listingAvailabilityQuestion",
  })

  const yesNoRadioOptions = [
    {
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]
  return (
    <div>
      <GridSection
        grid={false}
        title={t("listings.sections.rankingsResultsTitle")}
        description={t("listings.sections.rankingsResultsSubtitle")}
      >
        {availabilityQuestion !== "openWaitlist" && (
          <GridSection columns={2} className={"flex items-center"}>
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.reviewOrderQuestion")}</p>
              <FieldGroup
                name="reviewOrderQuestion"
                type="radio"
                register={register}
                fields={[
                  {
                    label: t("listings.firstComeFirstServe"),
                    value: "reviewOrderFCFS",
                    id: "reviewOrderFCFS",
                    defaultChecked:
                      listing?.reviewOrderType === ListingReviewOrder.firstComeFirstServe,
                  },
                  {
                    label: t("listings.lotteryTitle"),
                    value: "reviewOrderLottery",
                    id: "reviewOrderLottery",
                    defaultChecked: listing?.reviewOrderType === ListingReviewOrder.lottery,
                  },
                ]}
              />
            </GridCell>
          </GridSection>
        )}
        {reviewOrder === "reviewOrderFCFS" && (
          <GridSection columns={2} className={"flex items-center"}>
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.dueDateQuestion")}</p>
              <FieldGroup
                name="dueDateQuestion"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "dueDateQuestionYes",
                    defaultChecked: listing && listing.applicationDueDate !== null,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "dueDateQuestionNo",
                    defaultChecked: listing && !listing.applicationDueDate,
                  },
                ]}
              />
            </GridCell>
          </GridSection>
        )}
        {reviewOrder === "reviewOrderLottery" && (
          <>
            <GridSection columns={3}>
              <GridCell>
                <DateField
                  label={t("listings.lotteryDateQuestion")}
                  name={"lotteryDate"}
                  id={"lotteryDate"}
                  register={register}
                  watch={watch}
                  defaultDate={{
                    month: lotteryEvent?.startDate
                      ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("MM")
                      : null,
                    day: lotteryEvent?.startDate
                      ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("DD")
                      : null,
                    year: lotteryEvent?.startDate
                      ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("YYYY")
                      : null,
                  }}
                />
              </GridCell>
              <GridCell>
                <TimeField
                  label={t("listings.lotteryStartTime")}
                  name={"lotteryStartTime"}
                  id={"lotteryStartTime"}
                  register={register}
                  watch={watch}
                  defaultValues={{
                    hours: lotteryEvent?.startTime
                      ? dayjs(new Date(lotteryEvent?.startTime)).format("hh")
                      : null,
                    minutes: lotteryEvent?.startTime
                      ? dayjs(new Date(lotteryEvent?.startTime)).format("mm")
                      : null,
                    seconds: lotteryEvent?.startTime
                      ? dayjs(new Date(lotteryEvent?.startTime)).format("ss")
                      : null,
                    period: new Date(lotteryEvent?.startTime).getHours() >= 12 ? "pm" : "am",
                  }}
                />
              </GridCell>
              <GridCell>
                <TimeField
                  label={t("listings.lotteryEndTime")}
                  name={"lotteryEndTime"}
                  id={"lotteryEndTime"}
                  register={register}
                  watch={watch}
                  defaultValues={{
                    hours: lotteryEvent?.endTime
                      ? dayjs(new Date(lotteryEvent?.endTime)).format("hh")
                      : null,
                    minutes: lotteryEvent?.endTime
                      ? dayjs(new Date(lotteryEvent?.endTime)).format("mm")
                      : null,
                    seconds: lotteryEvent?.endTime
                      ? dayjs(new Date(lotteryEvent?.endTime)).format("ss")
                      : null,
                    period: new Date(lotteryEvent?.endTime).getHours() >= 12 ? "pm" : "am",
                  }}
                />
              </GridCell>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <Textarea
                  label={t("listings.lotteryDateNotes")}
                  name={"lotteryDateNotes"}
                  id={"lotteryDateNotes"}
                  placeholder={t("t.notes")}
                  note={t("t.optional")}
                  fullWidth={true}
                  register={register}
                  defaultValue={lotteryEvent ? lotteryEvent.note : null}
                />
              </GridCell>
            </GridSection>
          </>
        )}
        <GridSection columns={2} className={"flex items-center"}>
          <GridCell>
            <p className={`field-label m-4 ml-0`}>{t("listings.waitlist.openQuestion")}</p>
            <FieldGroup
              name="waitlistOpenQuestion"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "waitlistOpenYes",
                  disabled: availabilityQuestion === "availableUnits",
                  defaultChecked: listing && listing.isWaitlistOpen === true,
                },

                {
                  ...yesNoRadioOptions[1],
                  id: "waitlistOpenNo",
                  disabled: availabilityQuestion === "availableUnits",
                  defaultChecked: !listing || (listing && listing.isWaitlistOpen === false),
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {waitlistOpen === YesNoAnswer.Yes && availabilityQuestion === "openWaitlist" && (
          <GridSection columns={3}>
            <Field
              name="waitlistOpenSpots"
              id="waitlistOpenSpots"
              register={register}
              label={t("listings.waitlist.openSizeQuestion")}
              placeholder={t("listings.waitlist.openSize")}
              type={"number"}
            />
          </GridSection>
        )}
        <GridSection columns={3}>
          <GridCell span={2}>
            <Textarea
              label={t("listings.whatToExpectLabel")}
              name={"whatToExpect"}
              id={"whatToExpect"}
              fullWidth={true}
              register={register}
            />
          </GridCell>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default RankingsAndResults
