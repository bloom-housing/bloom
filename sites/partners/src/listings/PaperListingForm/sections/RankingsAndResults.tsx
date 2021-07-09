import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field, FieldGroup, GridCell } from "@bloom-housing/ui-components"

import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { FormListing } from "../index"

type RankingsAndResultsProps = {
  listing?: FormListing
}

const RankingsAndResults = ({ listing }: RankingsAndResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const waitlistOpen: YesNoAnswer = watch(
    "waitlistOpenQuestion",
    listing?.isWaitlistOpen ? YesNoAnswer.Yes : YesNoAnswer.No
  )
  const showWaitlistSize: YesNoAnswer = watch(
    "waitlistSizeQuestion",
    listing?.waitlistMaxSize ? YesNoAnswer.Yes : YesNoAnswer.No
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
        <GridSection columns={2}>
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
          {waitlistOpen === YesNoAnswer.Yes && (
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
          )}
        </GridSection>

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
