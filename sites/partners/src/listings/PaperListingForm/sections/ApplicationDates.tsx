import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, DateField } from "@bloom-housing/ui-components"

const ApplicationDates = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  return (
    <div>
      <GridSection grid={false} separator>
        <span className="form-section__title">{t("listings.sections.applicationDatesTitle")}</span>
        <span className="form-section__description">
          {t("listings.sections.applicationDatesSubtitle")}
        </span>
        <GridSection columns={3}>
          <DateField
            label={t("listings.applicationDeadline")}
            name={"applicationDueDate"}
            id={"applicationDueDate"}
            register={register}
            watch={watch}
            note={t("listings.whenApplicationsClose")}
          />
          {/* <DateField
            label={t("listings.applicationDueTime")}
            name={"applicationDueTime"}
            id={"applicationDueTime"}
            register={register}
            watch={watch}
          /> */}
        </GridSection>
      </GridSection>
    </div>
  )
}

export default ApplicationDates
