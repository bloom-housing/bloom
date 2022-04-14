import * as React from "react"
import { t } from "./translator"
import { Language } from "@bloom-housing/backend-core/types"
import { SelectOption } from "../forms/Select"

export interface FormOptionsProps {
  options: (string | SelectOption)[]
  keyPrefix?: string
}

export const applicationLanguageKeys = [Language.en, Language.es, Language.zh, Language.vi]

export enum RoleOption {
  Administrator = "administrator",
  Partner = "partner",
}
export const roleKeys = Object.values(RoleOption)

export const numberOptions = (end: number, start = 1, addEmpty = false): SelectOption[] => {
  const nums = []
  if (addEmpty) {
    nums.push({ label: "", value: "" })
  }
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
          {t("t.selectOne")}
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
