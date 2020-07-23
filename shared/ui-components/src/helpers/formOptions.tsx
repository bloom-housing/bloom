import * as React from "react"
import { t } from "./translator"

interface FormOptionsProps {
  options: string[]
  keyPrefix: string
}
export const contactPreferencesKeys = ["email", "phone", "letter", "text"]

export const relotionshipKeys = [
  "",
  "spouse",
  "registeredDomesticPartner",
  "parent",
  "child",
  "sibling",
  "cousin",
  "aunt",
  "uncle",
  "nephew",
  "niece",
  "grandparent",
  "greatGrandparent",
  "inLaw",
  "friend",
  "other",
]

export const stateKeys = [
  "",
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export const FormOptions = (props: FormOptionsProps) => {
  const keyPrefix = props.keyPrefix
  const options = props.options.map((option, key) => {
    if (option == "") {
      return (
        <option value="" key={keyPrefix + key}>
          {t("t.selectOne")}
        </option>
      )
    } else {
      return (
        <option value={option} key={keyPrefix + key}>
          {t(`${props.keyPrefix}.${option}`)}
        </option>
      )
    }
  })
  return <>{options}</>
}
