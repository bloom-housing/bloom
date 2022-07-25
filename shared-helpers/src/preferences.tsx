import * as React from "react"
import {
  InputType,
  MultiselectQuestion,
  MultiselectOption,
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

type ExtraFieldProps = {
  metaKey: string
  optionKey: string
  extraKey: string
  type: InputType
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hhMembersOptions?: SelectOption[]
  stateKeys: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPreferencesToApi = (data: Record<string, any>) => {
  if (!data.application?.preferences) return []

  const CLAIMED_KEY = "claimed"

  const preferencesFormData = data.application.preferences.options

  const keys = Object.keys(preferencesFormData)

  return keys.map((key) => {
    const currentPreference = preferencesFormData[key]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPreferenceValues = Object.values(currentPreference) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claimed = currentPreferenceValues.map((c: { claimed: any }) => c.claimed).includes(true)

    const options = Object.keys(currentPreference).map((option) => {
      const currentOption = currentPreference[option]

      // count keys except claimed
      const extraKeys = Object.keys(currentOption).filter((item) => item !== CLAIMED_KEY)

      const response = {
        key: option,
        checked: currentOption[CLAIMED_KEY],
      }

      // assign extra data and detect data type
      if (extraKeys.length) {
        const extraData = extraKeys.map((extraKey) => {
          const type = (() => {
            if (typeof currentOption[extraKey] === "boolean") return InputType.boolean
            // if object includes "city" property, it should be an address
            if (Object.keys(currentOption[extraKey]).includes("city")) return InputType.address

            return InputType.text
          })()

          return {
            key: extraKey,
            type,
            value: currentOption[extraKey],
          }
        })

        Object.assign(response, { extraData })
      } else {
        Object.assign(response, { extraData: [] })
      }

      return response
    })

    return {
      key,
      claimed,
      options,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToPreferencesForm = (preferences: ApplicationPreference[]) => {
  const preferencesFormData = {}

  preferences.forEach((item) => {
    const options = item.options.reduce((acc, curr) => {
      // extraData which comes from the API is an array, in the form we expect an object
      const extraData =
        curr?.extraData?.reduce((extraAcc, extraCurr) => {
          // value - it can be string or nested address object
          const value = extraCurr.value
          Object.assign(extraAcc, {
            [extraCurr.key]: value,
          })

          return extraAcc
        }, {}) || {}

      // each form option has "claimed" property - it's "checked" property in the API
      const claimed = curr.checked

      Object.assign(acc, {
        [curr.key]: {
          claimed,
          ...extraData,
        },
      })
      return acc
    }, {})

    Object.assign(preferencesFormData, {
      [item.key]: options,
    })
  })

  const noneValues = preferences.reduce((acc, item) => {
    const isClaimed = item.claimed

    Object.assign(acc, {
      [`${item.key}-none`]: !isClaimed,
    })

    return acc
  }, {})

  return { options: preferencesFormData, none: noneValues }
}

export type ExclusiveKey = {
  optionKey: string
  preferenceKey: string | undefined
}

export const getExclusiveKeys = (preference: MultiselectQuestion) => {
  const exclusive: string[] = []
  preference?.options?.forEach((option: MultiselectOption) => {
    if (option.exclusive) exclusive.push(option.text)
  })
  if (preference?.optOutText) exclusive.push(preference.optOutText)
  return exclusive
}

const uncheckOptions = (
  options: MultiselectOption[] | undefined,
  setValue: (key: string, value: boolean) => void
) => {
  options?.forEach((option) => {
    setValue(option.text, false)
  })
}

/*
  Set the value of an exclusive checkbox, unchecking all other boxes
*/
export const setExclusive = (
  exclusiveValue: boolean,
  setValue: (key: string, value: boolean) => void,
  exclusiveKeys: string[],
  exclusiveName: string,
  allOptions: MultiselectOption[]
) => {
  if (exclusiveValue) {
    // Uncheck all other keys if setting an exclusive key to true
    uncheckOptions(allOptions, setValue)
    setValue(exclusiveName, true)
  } else {
    // Uncheck all exclusive keys if setting a multiselect key to true
    exclusiveKeys.forEach((exclusiveOption) => {
      setValue(exclusiveOption, false)
    })
  }
}
