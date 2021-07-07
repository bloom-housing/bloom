import React from "react"
import moment from "moment"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  Field,
  FieldGroup,
  GridCell,
  Textarea,
  DateField,
} from "@bloom-housing/ui-components"

import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { FormListing } from "../index"
import { getLotteryEvent } from "../../helpers"

type RankingsAndResultsProps = {
  listing?: FormListing
}

const RankingsAndResults = ({ listing }: RankingsAndResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const lotteryEvent = getLotteryEvent(listing)

  const waitlistOpen: YesNoAnswer = watch(
    "waitlistOpenQuestion",
    listing?.isWaitlistOpen ? YesNoAnswer.Yes : YesNoAnswer.No
  )
  const showWaitlistSize: YesNoAnswer = watch(
    "waitlistSizeQuestion",
    listing?.waitlistMaxSize ? YesNoAnswer.Yes : YesNoAnswer.No
  )
  const reviewOrder = watch(
    "reviewOrderQuestion",
    lotteryEvent ? "reviewOrderLottery" : "reviewOrderFCFS"
  )

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
        separator
        title={t("listings.sections.rankingsResultsTitle")}
        description={t("listings.sections.rankingsResultsSubtitle")}
      >
        <GridSection columns={2} className={"flex items-center"}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.reviewOrderQuestion")}</p>
            <FieldGroup
              name="reviewOrderQuestion"
              type="radio"
              register={register}
              fields={[
                {
                  label: "First come first serve",
                  value: "reviewOrderFCFS",
                  id: "reviewOrderFCFS",
                  defaultChecked: lotteryEvent === null,
                },
                {
                  label: t("listings.lottery"),
                  value: "reviewOrderLottery",
                  id: "reviewOrderLottery",
                  defaultChecked: lotteryEvent !== null,
                },
              ]}
            />
          </GridCell>
        </GridSection>
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
          <GridSection columns={3}>
            <GridCell>
              <DateField
                label={t("listings.lotteryDateQuestion")}
                name={"lotteryDate"}
                id={"lotteryDate"}
                register={register}
                watch={watch}
                defaultDate={{
                  month: lotteryEvent?.startTime
                    ? moment(new Date(lotteryEvent?.startTime)).utc().format("MM")
                    : null,
                  day: lotteryEvent?.startTime
                    ? moment(new Date(lotteryEvent?.startTime)).utc().format("DD")
                    : null,
                  year: lotteryEvent?.startTime
                    ? moment(new Date(lotteryEvent?.startTime)).utc().format("YYYY")
                    : null,
                }}
              />
            </GridCell>
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
        )}
        <GridSection columns={2} className={"flex items-center"}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.waitlist.openQuestion")}</p>
            <FieldGroup
              name="waitlistOpenQuestion"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "waitlistOpenYes",
                  defaultChecked: listing && listing.isWaitlistOpen,
                },

                {
                  ...yesNoRadioOptions[1],
                  id: "waitlistOpenNo",
                  defaultChecked: listing && !listing.isWaitlistOpen,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {waitlistOpen === YesNoAnswer.Yes && (
          <GridSection columns={2} className={"flex items-center"}>
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.waitlist.sizeQuestion")}</p>
              <FieldGroup
                name="waitlistSizeQuestion"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "showWaitlistSizeYes",
                    defaultChecked: listing && listing.waitlistMaxSize !== null,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "showWaitlistSizeNo",
                    defaultChecked: listing && !listing.waitlistMaxSize,
                  },
                ]}
              />
            </GridCell>
          </GridSection>
        )}
        {showWaitlistSize === YesNoAnswer.Yes && waitlistOpen === YesNoAnswer.Yes && (
          <GridSection columns={3}>
            <Field
              name="waitlistMaxSize"
              id="waitlistMaxSize"
              register={register}
              label={t("listings.waitlist.maxSizeQuestion")}
              placeholder={t("listings.waitlist.maxSize")}
              type={"number"}
            />
            <Field
              name="waitlistCurrentSize"
              id="waitlistCurrentSize"
              register={register}
              label={t("listings.waitlist.currentSizeQuestion")}
              placeholder={t("listings.waitlist.currentSize")}
              type={"number"}
            />
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
      </GridSection>
    </div>
  )
}

export default RankingsAndResults
