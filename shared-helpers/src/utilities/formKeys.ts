import { HouseholdMemberRelationship, AlternateContactRelationship } from "../types/backend-swagger"

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

export const contactPreferencesKeys = [
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

export const adaFeatureKeys = ["mobility", "vision", "hearing"]

export const relationshipKeys = ["", ...Object.values(HouseholdMemberRelationship)]

export const altContactRelationshipKeys = Object.values(AlternateContactRelationship)

export const ethnicityKeys = ["hispanicLatino", "notHispanicLatino"]

export const rootRaceKeys = [
  "americanIndianAlaskanNative",
  "asian",
  "blackAfricanAmerican",
  "nativeHawaiianOtherPacificIslander",
  "white",
  "otherMultiracial",
  "declineToRespond",
]

export const asianKeys = [
  "asianIndian",
  "chinese",
  "filipino",
  "japanese",
  "korean",
  "vietnamese",
  "otherAsian",
]

export const nativeHawaiianOtherPacificIslanderKeys = [
  "nativeHawaiian",
  "guamanianOrChamorro",
  "samoan",
  "otherPacificIslander",
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

export const prependRoot = (root: string, subKeys: string[]) => {
  return subKeys.map((key) => `${root}-${key}`)
}

interface subCheckboxes {
  [key: string]: string[]
}

// Transform an object with keys that may be prepended with a string to an array of only the values with the string
export const fieldGroupObjectToArray = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formObject: { [key: string]: any },
  rootKey: string
): string[] => {
  const modifiedArray: string[] = []
  const getValue = (elem: string) => {
    const formSubKey = elem.substring(elem.indexOf("-") + 1)
    return formSubKey === formObject[elem] ? formSubKey : `${formSubKey}: ${formObject[elem]}`
  }
  Object.keys(formObject)
    .filter((formValue) => formValue.split("-")[0] === rootKey && formObject[formValue])
    .forEach((elem) => {
      if (formObject[elem].isArray) {
        formObject[elem].forEach(() => {
          modifiedArray.push(getValue(elem))
        })
      } else {
        modifiedArray.push(getValue(elem))
      }
    })
  return modifiedArray
}

export const raceKeys: subCheckboxes = {
  americanIndianAlaskanNative: [],
  asian: prependRoot("asian", asianKeys),
  blackAfricanAmerican: [],
  nativeHawaiianOtherPacificIslander: prependRoot(
    "nativeHawaiianOtherPacificIslander",
    nativeHawaiianOtherPacificIslanderKeys
  ),
  white: [],
  otherMultiracial: [],
  declineToRespond: [],
}

export const isKeyIncluded = (
  searchKey: string,
  originalValues: Array<string> | undefined
): boolean => {
  let keyExists = false
  originalValues?.forEach((key) => {
    if (key.includes(searchKey)) {
      keyExists = true
    }
  })
  return keyExists
}

// Get the value of a field that is storing a custom value, i.e. "otherAsian: Custom Race Input"
export const getCustomValue = (subKey: string, formValues: Array<string> | undefined): string => {
  const customValues = formValues?.find((value: string) => value.split(":")[0] === subKey)
  return customValues?.length ? customValues.split(":")[1]?.substring(1) : ""
}

export const howDidYouHear = [
  {
    id: "jurisdictionWebsite",
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

export const preferredUnit = [
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

export const bedroomKeys = [
  "SRO",
  "studio",
  "oneBdrm",
  "twoBdrm",
  "threeBdrm",
  "fourBdrm",
  "fiveBdrm",
]

export const listingFeatures = [
  "wheelchairRamp",
  "elevator",
  "serviceAnimalsAllowed",
  "accessibleParking",
  "parkingOnSite",
  "inUnitWasherDryer",
  "laundryInBuilding",
  "barrierFreeEntrance",
  "rollInShower",
  "grabBars",
  "heatingInUnit",
  "acInUnit",
  "hearing",
  "mobility",
  "visual",
]

export enum RoleOption {
  Administrator = "administrator",
  Partner = "partner",
  JurisdictionalAdmin = "jurisdictionalAdmin",
}
export const roleKeys = Object.values(RoleOption)

export const listingUtilities = [
  "water",
  "gas",
  "trash",
  "sewer",
  "electricity",
  "cable",
  "phone",
  "internet",
]
