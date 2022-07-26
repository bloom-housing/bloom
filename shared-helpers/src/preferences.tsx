import * as React from "react"
import {
  InputType,
  MultiselectQuestion,
  MultiselectOption,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  ApplicationSection,
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

export const mapRadiosToApi = (
  data: { [name: string]: string },
  question: MultiselectQuestion
): ApplicationMultiselectQuestion => {
  if (Object.keys(data).length === 0) {
    return {
      key: "",
      claimed: false,
      options: [],
    }
  }

  const [key, value] = Object.entries(data)[0]
  const options = []

  options.push({
    key: value,
    checked: true,
    extraData: [],
  })
  question?.options?.forEach((option) => {
    if (option.text !== value) {
      options.push({
        key: option.text,
        checked: false,
        extraData: [],
      })
    }
  })

  return {
    key,
    claimed: true,
    options,
  }
}

export const mapCheckboxesToApi = (
  formData: PreferenceForm,
  preference: MultiselectQuestion,
  applicationSection: ApplicationSection
): ApplicationMultiselectQuestion => {
  console.log("mapPreferenceToApi")
  const data = formData["application"][applicationSection][preference.text.replace(/'/g, "")]
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
