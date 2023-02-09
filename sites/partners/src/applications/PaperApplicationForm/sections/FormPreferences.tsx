import React, { useMemo } from "react"
import { Field, t, GridSection, GridCell, SelectOption } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { useFormContext } from "react-hook-form"

import {
  stateKeys,
  ExtraField,
  getPreferenceOptionName,
  getExclusivePreferenceOptionName,
  getExclusiveKeys,
  setExclusive,
} from "@bloom-housing/shared-helpers"
import {
  Preference,
  FormMetadataExtraData,
  ListingPreference,
} from "@bloom-housing/backend-core/types"

type FormPreferencesProps = {
  county: string
  preferences: ListingPreference[]
  hhMembersOptions?: SelectOption[]
}

const FormPreferences = ({ county, preferences, hhMembersOptions }: FormPreferencesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const hasMetaData = useMemo(() => {
    return !!preferences?.filter((listingPreference) => listingPreference.preference?.formMetadata)
      ?.length
  }, [preferences])

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((listingPreference) =>
      listingPreference.preference?.formMetadata?.options.forEach((option) =>
        keys.push(
          getPreferenceOptionName(option.key, listingPreference.preference?.formMetadata.key)
        )
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  const exclusiveKeys = getExclusiveKeys(preferences)

  if (!hasMetaData) {
    return null
  }

  const getOption = (
    optionKey: string | null,
    optionName: string,
    exclusive: boolean,
    extraData: FormMetadataExtraData[],
    preference: Preference,
    label?: string
  ) => {
    return (
      <React.Fragment key={optionKey}>
        <Field
          id={optionName}
          name={optionName}
          type="checkbox"
          label={
            label ??
            t(`application.preferences.${preference?.formMetadata?.key}.${optionKey}.label`, {
              county,
            })
          }
          register={register}
          inputProps={{
            onChange: (e) => {
              if (exclusive && e.target.checked) {
                setExclusive(true, setValue, exclusiveKeys, optionName, preference)
              }
              if (!exclusive) {
                setExclusive(false, setValue, exclusiveKeys, optionName, preference)
              }
            },
          }}
        />
        {watchPreferences[optionName] &&
          extraData?.map((extra) => (
            <ExtraField
              key={extra.key}
              metaKey={preference.formMetadata.key}
              optionKey={optionKey}
              extraKey={extra.key}
              type={extra.type}
              register={register}
              hhMembersOptions={hhMembersOptions}
              stateKeys={stateKeys}
            />
          ))}
      </React.Fragment>
    )
  }

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((listingPreference) => {
          const metaKey = listingPreference.preference?.formMetadata?.key

          return (
            <GridCell key={listingPreference.preference.id}>
              <ViewItem
                label={t(`application.preferences.${metaKey}.title`, {
                  county,
                })}
              >
                <fieldset className="mt-4">
                  {listingPreference.preference?.formMetadata?.options?.map((option) => {
                    return getOption(
                      option.key,
                      getPreferenceOptionName(
                        option.key,
                        listingPreference.preference?.formMetadata?.key
                      ),
                      option.exclusive,
                      option.extraData,
                      listingPreference.preference
                    )
                  })}

                  {listingPreference.preference?.formMetadata &&
                    !listingPreference.preference.formMetadata.hideGenericDecline &&
                    getOption(
                      null,
                      getExclusivePreferenceOptionName(
                        listingPreference.preference?.formMetadata?.key
                      ),
                      true,
                      [],
                      listingPreference.preference,
                      t("application.preferences.dontWant")
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
