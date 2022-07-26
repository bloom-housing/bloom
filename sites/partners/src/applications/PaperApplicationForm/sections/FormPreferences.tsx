import React, { useMemo } from "react"
import {
  Field,
  t,
  GridSection,
  ViewItem,
  GridCell,
  FormAddress,
} from "@bloom-housing/ui-components"

import { useFormContext } from "react-hook-form"
import { stateKeys, getInputType } from "@bloom-housing/shared-helpers"
import {
  ListingMultiselectQuestion,
  MultiselectOption,
  MultiselectQuestion,
} from "@bloom-housing/backend-core/types"

type FormPreferencesProps = {
  preferences: ListingMultiselectQuestion[]
}

const FormPreferences = ({ preferences }: FormPreferencesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, getValues } = formMethods

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    preferences?.forEach((listingPreference) =>
      listingPreference.multiselectQuestion.options.forEach((option) =>
        keys.push(
          `application.preferences.${listingPreference.multiselectQuestion.text}.${option.text}`
        )
      )
    )

    return keys
  }, [preferences])

  const watchPreferences = watch(allOptionFieldNames)

  const getOption = (
    option: MultiselectOption,
    preference: MultiselectQuestion,
    inputType: string
  ) => {
    return (
      <React.Fragment key={option.text}>
        <Field
          id={option.text}
          name={`application.preferences.${preference.text}.${option.text.replace(/'/g, "")}`}
          type={inputType}
          label={option.text}
          register={register}
        />
        {watchPreferences[`application.preferences.${preference.text}.${option.text}`] &&
          option.collectAddress && (
            <div className="pb-4">
              <FormAddress
                subtitle={t("application.preferences.options.address")}
                dataKey={`application.preferences.${preference.text}.${option.text}-address`}
                register={register}
                required={true}
                stateKeys={stateKeys}
                data-test-id={"app-preference-extra-field"}
              />
            </div>
          )}
      </React.Fragment>
    )
  }

  return (
    <GridSection title={t("application.details.preferences")} separator grid={false}>
      <GridSection columns={2}>
        {preferences?.map((listingPreference) => {
          return (
            <GridCell key={listingPreference.multiselectQuestion.text}>
              <ViewItem label={listingPreference.multiselectQuestion.text}>
                <fieldset className="mt-4">
                  {listingPreference.multiselectQuestion.options?.map((option) => {
                    return getOption(
                      option,
                      listingPreference.multiselectQuestion,
                      getInputType(listingPreference.multiselectQuestion.options)
                    )
                  })}

                  {listingPreference.multiselectQuestion?.optOutText &&
                    getOption(
                      {
                        text: listingPreference.multiselectQuestion.optOutText,
                        description: null,
                        links: [],
                        collectAddress: false,
                        exclusive: true,
                        ordinal: listingPreference.multiselectQuestion.options.length,
                      },
                      listingPreference.multiselectQuestion,
                      getInputType(listingPreference.multiselectQuestion.options)
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
