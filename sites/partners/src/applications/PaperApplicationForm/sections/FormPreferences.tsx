import React, { useMemo } from "react"
import {
  Field,
  t,
  ExtraField,
  getPreferenceOptionName,
  PREFERENCES_NONE_FORM_PATH,
  GridSection,
  ViewItem,
  GridCell,
  SelectOption,
} from "@bloom-housing/ui-components"

import { useFormContext } from "react-hook-form"
import { Preference, FormMetadataOptions } from "@bloom-housing/backend-core/types"

type FormPreferencesProps = {
  county: string
  preferences: Preference[]
  hhMembersOptions?: SelectOption[]
}

const FormPreferences = ({ county, preferences, hhMembersOptions }: FormPreferencesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const hasMetaData = useMemo(() => {
    return !!preferences?.filter((preference) => preference?.formMetadata)?.length
  }, [preferences])

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((preference) =>
      preference?.formMetadata?.options.forEach((option) =>
        keys.push(getPreferenceOptionName(preference?.formMetadata.key, option.key))
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  function uncheckPreference(metaKey: string, options: FormMetadataOptions[]) {
    const preferenceKeys = options?.map((option) => option.key)
    preferenceKeys.forEach((k) => setValue(getPreferenceOptionName(metaKey, k), false))
  }

  if (!hasMetaData) {
    return null
  }

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((preference) => {
          const metaKey = preference?.formMetadata?.key
          const noneOptionKey = `${PREFERENCES_NONE_FORM_PATH}.${preference.formMetadata.key}-none`

          return (
            <GridCell key={preference.id}>
              <ViewItem
                label={t(`application.preferences.${metaKey}.title`, {
                  county,
                })}
              >
                <fieldset className="mt-4">
                  {preference?.formMetadata?.options?.map((option) => {
                    return (
                      <React.Fragment key={option.key}>
                        <Field
                          id={getPreferenceOptionName(preference.formMetadata.key, option.key)}
                          name={getPreferenceOptionName(preference.formMetadata.key, option.key)}
                          type="checkbox"
                          label={t(
                            `application.preferences.${preference?.formMetadata?.key}.${option.key}.label`,
                            {
                              county,
                            }
                          )}
                          register={register}
                          inputProps={{
                            onChange: () => {
                              setValue(noneOptionKey, false)
                            },
                          }}
                        />
                        {watchPreferences[
                          getPreferenceOptionName(preference.formMetadata.key, option.key)
                        ] &&
                          option.extraData?.map((extra) => (
                            <ExtraField
                              key={extra.key}
                              metaKey={preference.formMetadata.key}
                              optionKey={option.key}
                              extraKey={extra.key}
                              type={extra.type}
                              register={register}
                              hhMembersOptions={hhMembersOptions}
                            />
                          ))}
                      </React.Fragment>
                    )
                  })}

                  {preference?.formMetadata && (
                    <Field
                      id={noneOptionKey}
                      name={noneOptionKey}
                      type="checkbox"
                      label={t("t.none")}
                      register={register}
                      inputProps={{
                        onChange: () =>
                          uncheckPreference(
                            preference.formMetadata.key,
                            preference.formMetadata?.options
                          ),
                      }}
                    />
                  )}
                </fieldset>
              </ViewItem>
            </GridCell>
          )
        })}
      </GridSection>
    </GridSection>
  )
}

export { FormPreferences as default, FormPreferences }
