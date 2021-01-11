import React from "react"
import { t, GridSection, ViewItem, GridCell, Field } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"

export enum FormPreferencesFields {
  LiveIn = "application.preferences.liveIn",
  WorkIn = "application.preferences.workIn",
  None = "application.preferences.none",
}

const FormPreferences = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue } = formMethods

  return (
    <GridSection title={t("application.details.preferences")} columns={1} separator>
      <GridCell>
        <ViewItem
          label={`${t("application.details.liveOrWorkIn")} ${t("application.details.countyName")}`}
        >
          <fieldset className="mt-4">
            <Field
              id={FormPreferencesFields.LiveIn}
              name={FormPreferencesFields.LiveIn}
              type="checkbox"
              label={`${t("application.add.preferences.liveIn")} ${t(
                "application.details.countyName"
              )}`}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue(FormPreferencesFields.None, false)
                },
              }}
            />

            <Field
              id={FormPreferencesFields.WorkIn}
              name={FormPreferencesFields.WorkIn}
              type="checkbox"
              label={`${t("application.add.preferences.workIn")} ${t(
                "application.details.countyName"
              )}`}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue(FormPreferencesFields.None, false)
                },
              }}
            />

            <Field
              id={FormPreferencesFields.None}
              name={FormPreferencesFields.None}
              type="checkbox"
              label={t("application.add.preferences.optedOut")}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue(FormPreferencesFields.LiveIn, false)
                  setValue(FormPreferencesFields.WorkIn, false)
                },
              }}
            />
          </fieldset>
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { FormPreferences as default, FormPreferences }
