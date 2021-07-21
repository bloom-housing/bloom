import * as React from "react"
import { t } from "./translator"
import { Language } from "@bloom-housing/backend-core/types"

export interface SelectOption {
  value: string
  label: string
}

interface FormOptionsProps {
  options: (string | SelectOption)[]
  keyPrefix?: string
}

interface FieldGroupItem {
  id: string
  checked?: boolean
}

export const contactPreferencesKeys: FieldGroupItem[] = [
  {
    id: "email",
  },
  {
    id: "phone",
  },
  {
    id: "letter",
  },
  {
    id: "text",
  },
]

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

export const altContactRelationshipKeys = [
  "familyMember",
  "friend",
  "caseManager",
  "other",
  "noContact",
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

export const howDidYouHear: FieldGroupItem[] = [
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

export const phoneNumberKeys = ["work", "home", "cell"]

export const preferredUnit: FieldGroupItem[] = [
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

export const bedroomKeys = ["studio", "oneBdrm", "twoBdrm", "threeBdrm"]

export const applicationLanguageKeys = [Language.en, Language.es, Language.zh, Language.vi]

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
