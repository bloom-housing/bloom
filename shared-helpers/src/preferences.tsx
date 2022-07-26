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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToPreferencesForm = (
  preferences: ApplicationMultiselectQuestion[],
  fieldType: string
) => {
  const preferencesFormData = {}

  console.log("api to form!!!")
  console.log({ preferences })
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

  return { ...preferencesFormData }
}

export type ExclusiveKey = {
  optionKey: string
  preferenceKey: string | undefined
}
