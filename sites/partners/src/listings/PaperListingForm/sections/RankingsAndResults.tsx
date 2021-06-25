import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field, FieldGroup, GridCell } from "@bloom-housing/ui-components"

import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"

const RankingsAndResults = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const waitlistOpen: YesNoAnswer = watch("waitlistOpenQuestion")
  const showWaitlistSize: YesNoAnswer = watch("waitlistSizeQuestion")

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
      <GridSection grid={false} separator>
        <span className="form-section__title">{t("listings.sections.rankingsResultsTitle")}</span>
        <span className="form-section__description">
          {t("listings.sections.rankingsResultsSubtitle")}
        </span>
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.waitlist.openQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="waitlistOpenQuestion"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "waitlistOpenYes" },
              { ...yesNoRadioOptions[1], id: "waitlistOpenNo" },
            ]}
          />
        </GridSection>
        {waitlistOpen === YesNoAnswer.Yes && (
          <GridSection columns={8} className={"flex items-center"}>
            <GridCell span={2}>
              <p className="field-label m-4 ml-0">{t("listings.waitlist.sizeQuestion")}</p>
            </GridCell>
            <FieldGroup
              name="waitlistSizeQuestion"
              type="radio"
              register={register}
              fields={[
                { ...yesNoRadioOptions[0], id: "showWaitlistSizeYes" },
                { ...yesNoRadioOptions[1], id: "showWaitlistSizeNo" },
              ]}
            />
          </GridSection>
        )}
        {showWaitlistSize === YesNoAnswer.Yes && (
          <GridSection columns={3} className={"flex items-center"}>
            <Field
              name="maxWaitlistSize"
              id="maxWaitlistSize"
              register={register}
              label={t("listings.waitlist.maxSizeQuestion")}
              placeholder={t("listings.waitlist.maxSize")}
              type={"number"}
            />
            <Field
              name="currentWaitlistSize"
              id="currentWaitlistSize"
              register={register}
              label={t("listings.waitlist.currentSizeQuestion")}
              placeholder={t("listings.waitlist.currentSize")}
              type={"number"}
            />
            <Field
              name="openWaitlistSize"
              id="openWaitlistSize"
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
