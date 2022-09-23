import React, { useEffect } from "react"
import {
  t,
  GridSection,
  ViewItem,
  Select,
  TimeField,
  DateField,
  DateFieldValues,
} from "@bloom-housing/ui-components"
import { applicationLanguageKeys } from "@bloom-housing/shared-helpers"
import { useFormContext } from "react-hook-form"

const FormApplicationData = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, setValue } = formMethods

  const dateSubmittedValue: DateFieldValues = watch("dateSubmitted")
  const dateSubmittedError = !!errors?.dateSubmitted
  const isDateFilled =
    dateSubmittedValue?.day && dateSubmittedValue?.month && dateSubmittedValue?.year

  const isDateRequired =
    dateSubmittedValue?.day || dateSubmittedValue?.month || dateSubmittedValue?.year

  useEffect(() => {
    if (dateSubmittedError || !isDateRequired) {
      setValue("timeSubmitted.hours", null)
      setValue("timeSubmitted.minutes", null)
      setValue("timeSubmitted.seconds", null)
    }
  }, [dateSubmittedError, isDateRequired, setValue])

  return (
    <GridSection title={t("application.details.applicationData")} grid={false}>
      <GridSection columns={3}>
        <ViewItem label={t("application.add.dateSubmitted")}>
          <DateField
            id="dateSubmitted"
            name="dateSubmitted"
            register={register}
            error={errors?.dateSubmitted}
            watch={watch}
            label={t("application.add.dateSubmitted")}
            readerOnly
            errorMessage={t("errors.dateError")}
            required={!!isDateRequired}
            labelClass={"text_caps-spaced"}
          />
        </ViewItem>

        <ViewItem label={t("application.add.timeSubmitted")}>
          <TimeField
            id="timeSubmitted"
            name="timeSubmitted"
            label={t("application.add.timeSubmitted")}
            register={register}
            watch={watch}
            error={!!errors?.timeSubmitted}
            readerOnly
            disabled={!isDateFilled}
            required={!!isDateFilled}
            labelClass={"text_caps-spaced"}
          />
        </ViewItem>

        <ViewItem label={t("application.add.languageSubmittedIn")}>
          <Select
            id="application.language"
            name="application.language"
            label={t("application.add.languageSubmittedIn")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={["", ...applicationLanguageKeys]}
            keyPrefix="languages"
          />
        </ViewItem>
      </GridSection>
    </GridSection>
  )
}

export { FormApplicationData as default, FormApplicationData }
