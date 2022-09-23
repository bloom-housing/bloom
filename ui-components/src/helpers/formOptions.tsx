import * as React from "react"
import { t } from "./translator"
import { SelectOption } from "../forms/Select"

export interface FormOptionsProps {
  options: (string | SelectOption)[]
  keyPrefix?: string
  strings?: {
    selectOne?: string
  }
}

export const numberOptions = (end: number, start = 1): SelectOption[] => {
  const nums = []
  for (let i = start; i <= end; i++) {
    nums.push({ label: i.toString(), value: i.toString() })
  }

  return nums
}

export const FormOptions = (props: FormOptionsProps) => {
  const options = props.options.map((option: string | SelectOption) => {
    if (option == "" || option["value"] == "") {
      return (
        <option value="" key="select-one">
          {props.strings?.selectOne ?? t("t.selectOne")}
        </option>
      )
    } else {
      return (
        <option value={option["value"] || option} key={option["value"] || option}>
          {option["label"] || t(`${props.keyPrefix}.${option as string}`)}
        </option>
      )
    }
  })
  return <>{options}</>
}
