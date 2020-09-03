import * as React from "react"
import { t } from "./translator"

interface FormOptionsProps {
  options: string[]
  keyPrefix: string
}

interface CheckboxGroupItem {
  id: string
  checked?: boolean
}

export const contactPreferencesKeys = ["email", "phone", "letter", "text"]

export const relationshipKeys = [
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

export const ethnicityKeys = ["hispanicLatino", "notHispanicLatino"]

export const raceKeys = [
  "americanIndianAlaskanNative",
  "asian",
  "blackAfricanAmerican",
  "nativeHawaiianOtherPacificIslander",
  "white",
  "americanIndianAlaskanNativeAndBlackAfricanAmerican",
  "americanIndianAlaskanNativeAndWhite",
  "asianAndWhite",
  "blackAfricanAmericanAndWhite",
  "otherMutliracial",
]

export const genderKeys = [
  "female",
  "male",
  "genderqueerGenderNon-Binary",
  "transFemale",
  "transMale",
  "notListed",
]

export const sexualOrientation = [
  "bisexual",
  "gayLesbianSameGenderLoving",
  "questioningUnsure",
  "straightHeterosexual",
  "notListed",
]

export const phoneNumberKeys = ["work", "home", "cell"]

export const howDidYouHear: CheckboxGroupItem[] = [
  {
    id: "alamedaCountyHCDWebsite",
  },
  {
    id: "developerWebsite",
  },
  {
    id: "flyer",
  },
  {
    id: "emailAlert",
  },
  {
    id: "friend",
  },
  {
    id: "housingCounselor",
  },
  {
    id: "radioAd",
  },
  {
    id: "busAd",
  },
  {
    id: "other",
  },
]

export const preferredUnit: CheckboxGroupItem[] = [
  {
    id: "studio",
  },
  {
    id: "oneBedroom",
  },
  {
    id: "twoBedroom",
  },
  {
    id: "threeBedroom",
  },
  {
    id: "moreThanThreeBedroom",
  },
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
