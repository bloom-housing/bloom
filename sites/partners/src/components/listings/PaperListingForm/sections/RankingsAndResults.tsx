import React, { useContext } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useFormContext, useWatch } from "react-hook-form"
import { t, Field, FieldGroup, Textarea, DateField, TimeField } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { FormListing } from "../../../../lib/listings/formTypes"
import { AuthContext, getLotteryEvent } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
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
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, control, errors } = formMethods

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

  const selectedJurisdictionId: string = useWatch({
    control,
    name: "jurisdictions.id",
  })

  const enableWaitlistAdditionalFields = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableWaitlistAdditionalFields,
    selectedJurisdictionId
  )

  const enableUnitGroups = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUnitGroups,
    selectedJurisdictionId
  )

  // Ensure the lottery fields only show when it's "available units" listing
  const showLotteryFields =
    (availabilityQuestion !== "openWaitlist" || enableUnitGroups) &&
    reviewOrder === "reviewOrderLottery"

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
        {(availabilityQuestion !== "openWaitlist" || enableUnitGroups) && (
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
        {showLotteryFields && (
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
                  required
                  setValue={setValue}
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
                  required
                  setValue={setValue}
                  watch={watch}
                  error={errors?.lotteryStartTime ? true : false}
                  strings={{
                    timeError: errors?.lotteryStartTime ? t("errors.timeError") : null,
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
                  required
                  setValue={setValue}
                  watch={watch}
                  error={errors?.lotteryEndTime ? true : false}
                  strings={{
                    timeError: errors?.lotteryEndTime ? t("errors.timeError") : null,
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
                  disabled: !enableUnitGroups && availabilityQuestion === "availableUnits",
                  defaultChecked: listing && listing.isWaitlistOpen === true,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "waitlistOpenNo",
                  disabled: !enableUnitGroups && availabilityQuestion === "availableUnits",
                  defaultChecked: !listing || (listing && listing.isWaitlistOpen === false),
                },
              ]}
            />
          </Grid.Cell>
        </Grid.Row>
        {waitlistOpen === YesNoEnum.yes &&
          (availabilityQuestion === "openWaitlist" || enableUnitGroups) && (
            <Grid.Row columns={3}>
              {enableWaitlistAdditionalFields && (
                <>
                  <Field
                    name="waitlistMaxSize"
                    id="waitlistMaxSize"
                    register={register}
                    label={t("listings.waitlist.maxSizeQuestion")}
                    placeholder={t("listings.waitlist.maxSize")}
                    type={"number"}
                    subNote={t("t.recommended")}
                  />
                  <Field
                    name="waitlistCurrentSize"
                    id="waitlistCurrentSize"
                    register={register}
                    label={t("listings.waitlist.currentSizeQuestion")}
                    placeholder={t("listings.waitlist.currentSize")}
                    type={"number"}
                  />
                </>
              )}
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
