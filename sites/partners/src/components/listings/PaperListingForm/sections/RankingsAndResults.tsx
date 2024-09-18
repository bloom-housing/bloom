import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useFormContext, useWatch } from "react-hook-form"
import { t, Field, FieldGroup, Textarea, DateField, TimeField } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { FormListing } from "../../../../lib/listings/formTypes"
import { getLotteryEvent } from "@bloom-housing/shared-helpers"
import {
  Listing,
  ReviewOrderTypeEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type RankingsAndResultsProps = {
  listing?: FormListing
  disableDueDates?: boolean
  isAdmin?: boolean
}

const RankingsAndResults = ({ listing, disableDueDates, isAdmin }: RankingsAndResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, errors } = formMethods

  const lotteryEvent = getLotteryEvent(listing as unknown as Listing)

  const waitlistOpen = useWatch({
    control,
    name: "waitlistOpenQuestion",
    defaultValue: listing?.isWaitlistOpen
      ? YesNoEnum.yes
      : listing?.isWaitlistOpen === false
      ? YesNoEnum.no
      : null,
  })

  const reviewOrder = useWatch({
    control,
    name: "reviewOrderQuestion",
    defaultValue:
      listing?.reviewOrderType === ReviewOrderTypeEnum.lottery
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
      value: YesNoEnum.yes,
    },
    {
      label: t("t.no"),
      value: YesNoEnum.no,
    },
  ]
  return (
    <>
      <SectionWithGrid
        heading={t("listings.sections.rankingsResultsTitle")}
        subheading={t("listings.sections.rankingsResultsSubtitle")}
      >
        {availabilityQuestion !== "openWaitlist" && (
          <Grid.Row columns={2} className={"flex items-center"}>
            <Grid.Cell>
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
                    disabled:
                      disableDueDates && listing?.reviewOrderType === ReviewOrderTypeEnum.lottery,
                    defaultChecked:
                      listing?.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe,
                  },
                  {
                    label: t("listings.lotteryTitle"),
                    value: "reviewOrderLottery",
                    id: "reviewOrderLottery",
                    disabled:
                      disableDueDates &&
                      listing?.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe,
                    defaultChecked: listing?.reviewOrderType === ReviewOrderTypeEnum.lottery,
                  },
                ]}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
        {reviewOrder === "reviewOrderFCFS" && (
          <Grid.Row columns={2} className={"flex items-center"}>
            <Grid.Cell>
              <p className="field-label m-4 ml-0">{t("listings.dueDateQuestion")}</p>
              <FieldGroup
                name="dueDateQuestion"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "dueDateQuestionYes",
                    disabled: disableDueDates && !listing?.applicationDueDate,
                    defaultChecked: listing && listing.applicationDueDate !== null,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "dueDateQuestionNo",
                    disabled: disableDueDates && listing?.applicationDueDate !== null,
                    defaultChecked: listing && !listing.applicationDueDate,
                  },
                ]}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
        {reviewOrder === "reviewOrderLottery" && (
          <>
            {process.env.showLottery && (
              <>
                {isAdmin ? (
                  <Grid.Row columns={2} className={"flex items-center"}>
                    <Grid.Cell>
                      <p className={`field-label m-4 ml-0`}>{t("listings.lotteryOptInQuestion")}</p>
                      <FieldGroup
                        name="lotteryOptInQuestion"
                        type="radio"
                        register={register}
                        fields={[
                          {
                            ...yesNoRadioOptions[0],
                            id: "lotteryOptInYes",
                            defaultChecked:
                              !listing ||
                              listing.lotteryOptIn === true ||
                              listing.lotteryOptIn === null,
                          },

                          {
                            ...yesNoRadioOptions[1],
                            id: "lotteryOptInNo",
                            defaultChecked: listing && listing.lotteryOptIn === false,
                          },
                        ]}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                ) : (
                  <Grid.Row columns={2}>
                    <Grid.Cell>
                      <p className={"field-note -mt-6"}>
                        {!listing || listing.lotteryOptIn === true || listing.lotteryOptIn === null
                          ? t("listings.lotteryOptInPartnerYes")
                          : t("listings.lotteryOptInPartnerNo")}
                      </p>
                    </Grid.Cell>
                  </Grid.Row>
                )}
              </>
            )}

            <Grid.Row columns={3}>
              <Grid.Cell>
                <DateField
                  label={t("listings.lotteryDateQuestion")}
                  name={"lotteryDate"}
                  id={"lotteryDate"}
                  register={register}
                  watch={watch}
                  disabled={disableDueDates}
                  error={
                    errors?.lotteryDate
                      ? {
                          month: errors?.lotteryDate,
                          day: errors?.lotteryDate,
                          year: errors?.lotteryDate,
                        }
                      : null
                  }
                  errorMessage={t("errors.dateError")}
                  defaultDate={
                    errors?.lotteryDate
                      ? null
                      : {
                          month: lotteryEvent?.startDate
                            ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("MM")
                            : null,
                          day: lotteryEvent?.startDate
                            ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("DD")
                            : null,
                          year: lotteryEvent?.startDate
                            ? dayjs(new Date(lotteryEvent?.startDate)).utc().format("YYYY")
                            : null,
                        }
                  }
                  dataTestId={"lottery-start-date"}
                />
              </Grid.Cell>
              <Grid.Cell>
                <TimeField
                  label={t("listings.lotteryStartTime")}
                  name={"lotteryStartTime"}
                  id={"lotteryStartTime"}
                  register={register}
                  watch={watch}
                  disabled={disableDueDates}
                  error={errors?.lotteryDate ? true : false}
                  strings={{
                    timeError: errors?.lotteryDate ? t("errors.dateError") : null,
                  }}
                  defaultValues={
                    errors?.lotteryDate
                      ? null
                      : {
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
                        }
                  }
                  dataTestId={"lottery-start-time"}
                />
              </Grid.Cell>
              <Grid.Cell>
                <TimeField
                  label={t("listings.lotteryEndTime")}
                  name={"lotteryEndTime"}
                  id={"lotteryEndTime"}
                  register={register}
                  watch={watch}
                  disabled={disableDueDates}
                  error={errors?.lotteryDate ? true : false}
                  strings={{
                    timeError: errors?.lotteryDate ? t("errors.dateError") : null,
                  }}
                  defaultValues={
                    errors?.lotteryDate
                      ? null
                      : {
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
                        }
                  }
                  dataTestId={"lottery-end-time"}
                />
              </Grid.Cell>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Cell className="seeds-grid-span-2">
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
              </Grid.Cell>
            </Grid.Row>
          </>
        )}
        <Grid.Row columns={2} className={"flex items-center"}>
          <Grid.Cell>
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
          </Grid.Cell>
        </Grid.Row>
        {waitlistOpen === YesNoEnum.yes && availabilityQuestion === "openWaitlist" && (
          <Grid.Row columns={3}>
            <Field
              name="waitlistOpenSpots"
              id="waitlistOpenSpots"
              register={register}
              label={t("listings.waitlist.openSizeQuestion")}
              placeholder={t("listings.waitlist.openSize")}
              type={"number"}
            />
          </Grid.Row>
        )}
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              label={t("listings.whatToExpectLabel")}
              name={"whatToExpect"}
              id={"whatToExpect"}
              fullWidth={true}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default RankingsAndResults
