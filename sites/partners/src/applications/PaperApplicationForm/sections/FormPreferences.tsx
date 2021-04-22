import React, { useMemo, useCallback } from "react"
import {
  Field,
  t,
  ExtraField,
  PREFERENCES_FORM_PATH,
  GridSection,
  ViewItem,
  GridCell,
  SelectOption,
} from "@bloom-housing/ui-components"

import { useFormContext } from "react-hook-form"
import { Preference, FormMetadataOptions } from "@bloom-housing/backend-core/types"

type FormPreferencesProps = {
  preferences: Preference[]
  hhMembersOptions?: SelectOption[]
}

const FormPreferences = ({ preferences, hhMembersOptions }: FormPreferencesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const buildOptionName = useCallback((metaKey: string, option: string) => {
    return `${PREFERENCES_FORM_PATH}.${metaKey}.${option}.claimed`
  }, [])

  const hasMetaData = useMemo(() => {
    return !!preferences?.filter((preference) => preference?.formMetadata)?.length
  }, [preferences])

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((preference) =>
      preference?.formMetadata?.options.forEach((option) =>
        keys.push(buildOptionName(preference?.formMetadata.key, option.key))
      )
    )

    return keys
  }, [preferences, buildOptionName])

  const watchPreferences = watch(allOptionFieldNames)

  function uncheckPreference(metaKey: string, options: FormMetadataOptions[]) {
    const preferenceKeys = options?.map((option) => option.key)
    preferenceKeys.forEach((k) => setValue(buildOptionName(metaKey, k), false))
  }

  if (!hasMetaData) {
    return null
  }

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((preference) => (
          <GridCell key={preference.id}>
            <ViewItem label={preference.title}>
              <fieldset className="mt-4">
                {preference?.formMetadata?.options?.map((option) => {
                  return (
                    <React.Fragment key={option.key}>
                      <Field
                        id={buildOptionName(preference.formMetadata.key, option.key)}
                        name={buildOptionName(preference.formMetadata.key, option.key)}
                        type="checkbox"
                        label={t(`application.preferences.options.${option.key}`)}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue(`${preference.formMetadata.key}-none`, false)
                          },
                        }}
                      />
                      {watchPreferences[buildOptionName(preference.formMetadata.key, option.key)] &&
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
                    id={`${preference.formMetadata.key}-none`}
                    name={`${preference.formMetadata.key}-none`}
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
        ))}
      </GridSection>
    </GridSection>
  )
}

export { FormPreferences as default, FormPreferences }
