import React from "react"
import { t, GridSection, ViewItem, GridCell, Field } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"

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
              id="application.preferences.liveIn"
              name="application.preferences.liveIn"
              type="checkbox"
              label={`${t("application.add.preferences.liveIn")} ${t(
                "application.details.countyName"
              )}`}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue("application.preferences.none", false)
                },
              }}
            />

            <Field
              id="application.preferences.workIn"
              name="application.preferences.workIn"
              type="checkbox"
              label={`${t("application.add.preferences.workIn")} ${t(
                "application.details.countyName"
              )}`}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue("application.preferences.none", false)
                },
              }}
            />

            <Field
              id="application.preferences.none"
              name="application.preferences.none"
              type="checkbox"
              label={t("application.add.preferences.optedOut")}
              register={register}
              inputProps={{
                onChange: () => {
                  setValue("application.preferences.liveIn", false)
                  setValue("application.preferences.workIn", false)
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
