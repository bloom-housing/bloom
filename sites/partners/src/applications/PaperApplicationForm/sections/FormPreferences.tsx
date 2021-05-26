import React, { useMemo } from "react"
import {
  Field,
  t,
  ExtraField,
  getPreferenceOptionName,
  GridSection,
  ViewItem,
  GridCell,
  SelectOption,
  getExclusivePreferenceOptionName,
  getExclusiveKeys,
  setExclusive,
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
        keys.push(getPreferenceOptionName(option, option.key, preference?.formMetadata.key))
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  const exclusiveKeys = getExclusiveKeys(preferences)

  if (!hasMetaData) {
    return null
  }

  const getExclusiveOption = (label: string, noneKey: string, preference: Preference) => {
    return (
      <Field
        id={noneKey}
        name={noneKey}
        type="checkbox"
        label={label}
        register={register}
        inputProps={{
          onChange: (e) => {
            if (e.target.checked) {
              setExclusive(true, setValue, exclusiveKeys, noneKey, preference)
            }
          },
        }}
      />
    )
  }

  const getNormalOption = (option: FormMetadataOptions, preference: Preference) => {
    return (
      <React.Fragment key={option.key}>
        <Field
          id={getPreferenceOptionName(option, option.key, preference.formMetadata.key)}
          name={getPreferenceOptionName(option, option.key, preference.formMetadata.key)}
          type="checkbox"
          label={t(`application.preferences.${preference?.formMetadata?.key}.${option.key}.label`, {
            county,
          })}
          register={register}
          inputProps={{
            onChange: () => {
              setExclusive(false, setValue, exclusiveKeys)
            },
          }}
        />
        {watchPreferences[
          getPreferenceOptionName(option, option.key, preference.formMetadata.key)
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
  }

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((preference) => {
          const metaKey = preference?.formMetadata?.key

          return (
            <GridCell key={preference.id}>
              <ViewItem
                label={t(`application.preferences.${metaKey}.title`, {
                  county,
                })}
              >
                <fieldset className="mt-4">
                  {preference?.formMetadata?.options?.map((option) => {
                    const noneOptionKey = getExclusivePreferenceOptionName(option.key)

                    return option.exclusive
                      ? getExclusiveOption(
                          t(
                            `application.preferences.${preference.formMetadata.key}.${option.key}.label`,
                            { county }
                          ),
                          noneOptionKey,
                          preference
                        )
                      : getNormalOption(option, preference)
                  })}

                  {preference?.formMetadata &&
                    !preference.formMetadata.hideGenericDecline &&
                    getExclusiveOption(
                      t("t.none"),
                      getExclusivePreferenceOptionName(preference?.formMetadata?.key),
                      preference
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
