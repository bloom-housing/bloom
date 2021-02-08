import React, { useMemo, useCallback } from "react"
import { t, GridSection, ViewItem, GridCell, Field } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import { Preference, FormMetadataOptions, InputType } from "@bloom-housing/backend-core/types"
import { FormAddress } from "../FormAddress"

type FormPreferencesProps = {
  preferences: Preference[]
}

const PREFERENCES_FORM_PATH = "application.preferences"

const FormPreferences = ({ preferences }: FormPreferencesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((preference) =>
      preference?.formMetadata.options.forEach((option) =>
        keys.push(`${PREFERENCES_FORM_PATH}.${option.key}`)
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  function uncheckPreference(options: FormMetadataOptions[]) {
    const preferenceKeys = options?.map((option) => option.key)
    preferenceKeys.forEach((k) => setValue(`${PREFERENCES_FORM_PATH}.${k}`, false))
  }

  const createExtraDataFields = useCallback(
    (optionKey, metaKey: string, type: InputType) => {
      console.log("create")
      if (!watchPreferences[`${PREFERENCES_FORM_PATH}.${optionKey}`]) return

      return (
        <div className="my-4">
          {(() => {
            if (type === InputType.text) {
              return (
                <Field
                  id={metaKey}
                  name={metaKey}
                  type="text"
                  label={metaKey}
                  register={register}
                />
              )
            }

            if (type === InputType.address) {
              return FormAddress(t("application.contact.address"), metaKey, "preference", register)
            }
          })()}
        </div>
      )
    },
    [register, watchPreferences]
  )

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((preference) => (
          <GridCell key={preference.id}>
            <ViewItem label={preference.title}>
              <fieldset className="mt-4">
                {preference.formMetadata?.options?.map((option) => {
                  return (
                    <React.Fragment key={option.key}>
                      <Field
                        id={option.key}
                        name={`${PREFERENCES_FORM_PATH}.${option.key}`}
                        type="checkbox"
                        label={option.key}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue(`${preference.formMetadata.key}-none`, false)
                          },
                        }}
                      />
                      {watchPreferences[`${PREFERENCES_FORM_PATH}.${option.key}`] &&
                        option.extraData?.map((extra) =>
                          createExtraDataFields(option.key, extra.key, extra.type)
                        )}
                    </React.Fragment>
                  )
                })}
                <Field
                  id={`${preference.formMetadata.key}-none`}
                  name={`${preference.formMetadata.key}-none`}
                  type="checkbox"
                  label={t("t.none")}
                  register={register}
                  inputProps={{
                    onChange: () => uncheckPreference(preference.formMetadata?.options),
                  }}
                />
              </fieldset>
            </ViewItem>
          </GridCell>
        ))}
      </GridSection>
    </GridSection>
  )
}

export { FormPreferences as default, FormPreferences }
