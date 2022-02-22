import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useFormContext, useWatch } from "react-hook-form"
import { t, GridSection, Field, FieldGroup, GridCell, Textarea } from "@bloom-housing/ui-components"

import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { FormListing } from "../formTypes"
import { fieldHasError, fieldMessage } from "../../../../lib/helpers"

type RankingsAndResultsProps = {
  listing?: FormListing
}

const RankingsAndResults = ({ listing }: RankingsAndResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control, errors } = formMethods

  const waitlistOpen = useWatch({
    control,
    name: "waitlistOpenQuestion",
    defaultValue: listing?.isWaitlistOpen
      ? YesNoAnswer.Yes
      : listing?.isWaitlistOpen === false
      ? YesNoAnswer.No
      : null,
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
        <GridSection columns={2} className={"flex items-center"}>
          <GridCell>
            <p
              className={`field-label m-4 ml-0 ${
                fieldHasError(errors?.isWaitlistOpen) && waitlistOpen === null && "text-alert"
              }`}
            >
              {t("listings.waitlist.openQuestion")}
            </p>
            <FieldGroup
              name="waitlistOpenQuestion"
              type="radio"
              register={register}
              error={fieldHasError(errors?.isWaitlistOpen) && waitlistOpen === null}
              errorMessage={fieldMessage(errors?.isWaitlistOpen)}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "waitlistOpenYes",
                  defaultChecked: listing && listing.isWaitlistOpen === true,
                },

                {
                  ...yesNoRadioOptions[1],
                  id: "waitlistOpenNo",
                  defaultChecked: listing && listing.isWaitlistOpen === false,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {waitlistOpen === YesNoAnswer.Yes && (
          <GridSection columns={3}>
            <Field
              name="waitlistMaxSize"
              id="waitlistMaxSize"
              register={register}
              label={t("listings.waitlist.maxSizeQuestion")}
              placeholder={t("listings.waitlist.maxSize")}
              type={"number"}
              subNote={t("listings.recommended")}
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
