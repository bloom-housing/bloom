import * as React from "react"
import {
  InputType,
  MultiselectQuestion,
  MultiselectOption,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
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

type PreferenceForm = {
  [name: string]: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPreferencesToApi = (
  data: PreferenceForm,
  preference: MultiselectQuestion
): ApplicationMultiselectQuestion => {
  const claimed = !!Object.keys(data).filter((key) => data[key] === true).length

  const addressFields = Object.keys(data).filter((option) => Object.keys(data[option]))

  const preferenceOptions: ApplicationMultiselectQuestionOption[] = Object.keys(data)
    .filter((option) => !Object.keys(data[option]).length)
    .map((key) => {
      const addressData = addressFields.filter((addressField) => addressField === `${key}-address`)

      return {
        key,
        checked: data[key] === true,
        extraData: addressData.length
          ? [{ type: InputType.address, key, value: data[addressData[0]] }]
          : [],
      }
    })

  return {
    key: preference.text ?? "",
    claimed,
    options: preferenceOptions,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToPreferencesForm = (preferences: ApplicationMultiselectQuestion[]) => {
  const preferencesFormData = {}

  console.log("api to form")
  // console.log({ preferences })
  preferences.forEach((item) => {
    // console.log({ item })
    const options = item.options.reduce((acc, curr) => {
      // extraData which comes from the API is an array, in the form we expect an object
      // const extraData =
      //   curr?.extraData?.reduce((extraAcc, extraCurr) => {
      //     Object.assign(extraAcc, {
      //       [extraCurr.key]: extraCurr.value,
      //     })
      //     return extraAcc
      //   }, {}) || {}

      // each form option has "claimed" property - it's "checked" property in the API
      const claimed = curr.checked

      Object.assign(acc, {
        [curr.key]: claimed,
      })

      if (curr.extraData?.length) {
        Object.assign(acc, {
          [`${curr.key}-address`]: curr.extraData[0].value,
        })
      }
      return acc
    }, {})

    Object.assign(preferencesFormData, {
      [item.key]: options,
    })
  })

  return preferencesFormData
}

export type ExclusiveKey = {
  optionKey: string
  preferenceKey: string | undefined
}

export const preferenceFieldName = (preferenceName: string, optionName: string) => {
  return `application.preferences.${preferenceName.replace(/'/g, "")}.${optionName.replace(
    /'/g,
    ""
  )}`
}

export const getExclusiveKeys = (preference: MultiselectQuestion) => {
  const exclusive: string[] = []
  preference?.options?.forEach((option: MultiselectOption) => {
    if (option.exclusive) exclusive.push(preferenceFieldName(preference.text, option.text))
  })
  if (preference?.optOutText)
    exclusive.push(preferenceFieldName(preference.text, preference.optOutText))
  return exclusive
}

const uncheckOptions = (options: string[], setValue: (key: string, value: boolean) => void) => {
  options?.forEach((option) => {
    setValue(option, false)
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
  allOptions: string[]
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

export const getInputType = (options: MultiselectOption[]) => {
  return options?.filter((option) => option.exclusive).length === options?.length
    ? "radio"
    : "checkbox"
}
