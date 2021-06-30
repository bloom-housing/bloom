import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, DateField, TimeField } from "@bloom-housing/ui-components"

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
            name={"applicationDueDateField"}
            id={"applicationDueDateField"}
            register={register}
            watch={watch}
            note={t("listings.whenApplicationsClose")}
          />
          <TimeField
            label={t("listings.applicationDueTime")}
            name={"applicationDueTimeField"}
            id={"applicationDueTimeField"}
            register={register}
            watch={watch}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default ApplicationDates
