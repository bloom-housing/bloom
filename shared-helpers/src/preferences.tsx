import * as React from "react"
import {
  InputType,
  MultiselectQuestion,
  MultiselectOption,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  ApplicationSection,
  ListingMultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import { UseFormMethods } from "react-hook-form"
import {
  t,
  Field,
  Select,
  SelectOption,
  resolveObject,
  FormAddress,
} from "@bloom-housing/ui-components"
import { getInputType } from "./multiselectQuestions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToPreferencesForm = (
  applicationPreferences: ApplicationMultiselectQuestion[],
  listingPreferences: ListingMultiselectQuestion[],
  applicationSection: ApplicationSection
) => {
  const preferencesFormData = { application: { [applicationSection]: {} } }

  const applicationPreferencesWithTypes: {
    preference: ApplicationMultiselectQuestion
    inputType: string
  }[] = applicationPreferences.map((pref) => {
    return {
      preference: pref,
      inputType: getInputType(
        listingPreferences.filter(
          (listingPref) => listingPref.multiselectQuestion.text === pref.key
        )[0].multiselectQuestion.options ?? []
      ),
    }
  })

  applicationPreferencesWithTypes.forEach((pref) => {
    let options = {}

    /**
     * Checkbox fields expect the following format
     * PreferenceName: {
     *    OptionName1: true
     *    OptionName2: false
     *    OptionName1-address: {
     *      street: "",
     *      city: "",
     *      ...
     *    }
     * }
     */
    if (pref.inputType === "checkbox") {
      options = pref.preference.options.reduce((acc, curr) => {
        const claimed = curr.checked

        if (pref.inputType === "checkbox") {
          acc[curr.key] = claimed
          if (curr.extraData?.length) {
            acc[`${curr.key}-address`] = curr.extraData[0].value
          }
        }

        return acc
      }, {})

      preferencesFormData["application"][applicationSection][pref.preference.key] = options
    }

    /**
     * Radio fields expect the following format
     * PreferenceName: OptionName
     */
    if (pref.inputType === "radio") {
      const selectedRadio = pref.preference.options.filter((option) => !!option.checked)[0]
      preferencesFormData[pref?.preference?.key] = selectedRadio?.key
    }
  })

  console.log({ preferencesFormData })

  return { ...preferencesFormData }
}

export type ExclusiveKey = {
  optionKey: string
  preferenceKey: string | undefined
}
