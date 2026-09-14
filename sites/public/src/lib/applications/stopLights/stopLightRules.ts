import dayjs from "dayjs"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type StopLightColor = "red" | "yellow"

export interface StopLightRule {
  key: string // stable id, e.g. "seniorBuildingMinimumAge"
  step: string // matches ApplicationConductor step/route name, e.g. "primaryApplicantName"
  light: StopLightColor
  evaluate: (application: Application, listing: Listing) => boolean
  heading: string // translation key
  body: string // translation key
  editFieldAnchor?: string // element id to scroll/focus on "Edit", red light only
}

// Example for test purposes
// ok to remove when not needed anymore
const seniorBuildingAgeExample: StopLightRule = {
  key: "seniorBuildingMinimumAge",
  step: "primaryApplicantName",
  light: "red",
  evaluate: (application, listing) => {
    const minimumAge = listing.reservedCommunityMinAge
    if (!minimumAge) return false

    const { birthYear, birthMonth, birthDay } = application.applicant
    if (!birthYear || !birthMonth || !birthDay) return false

    const dateOfBirth = dayjs(`${birthYear}-${birthMonth}-${birthDay}`)
    if (!dateOfBirth.isValid()) return false

    const applicantAge = dayjs().diff(dateOfBirth, "year")
    return applicantAge < minimumAge
  },
  heading: "stopLights.seniorBuildingMinimumAge.heading",
  body: "stopLights.seniorBuildingMinimumAge.body",
  editFieldAnchor: "applicant.dateOfBirth",
}

// ---------------------------------------------------------------------------
// DEMO ONLY — throwaway rules for exercising useStopLightGate by hand on the
// name step. Both read the same DOB field, so one answer drives both colors.
//
//   birth year 1990 (age 36)  -> RED     blocked, nothing saves or routes
//   birth year 1966 (age 60)  -> YELLOW  warns, continues once acknowledged
//   birth year 1950 (age 76)  -> passes straight through
//
// Real rules put translation keys in heading/body and the modal runs them
// through t(). These carry literal copy so the demo is readable without
// adding translations.
//
// Revert with: git checkout -- sites/public/src/lib/applications/stopLights/stopLightRules.ts
// ---------------------------------------------------------------------------
const getApplicantAge = (application: Application): number | null => {
  const { birthYear, birthMonth, birthDay } = application.applicant ?? {}
  if (!birthYear || !birthMonth || !birthDay) return null

  const dateOfBirth = dayjs(`${birthYear}-${birthMonth}-${birthDay}`)
  if (!dateOfBirth.isValid()) return null

  return dayjs().diff(dateOfBirth, "year")
}

const demoSeniorMinimumAge: StopLightRule = {
  key: "demoSeniorMinimumAge",
  step: "primaryApplicantName",
  light: "red",
  evaluate: (application) => {
    const age = getApplicantAge(application)
    return age !== null && age < 55
  },
  heading: "This building is for residents 55 and older",
  body: "The date of birth you entered puts you under 55, so you can't continue with this application. Edit your date of birth, or return to the listings to find something else.",
  editFieldAnchor: "applicant.dateOfBirth",
}

const demoSeniorPreferredAge: StopLightRule = {
  key: "demoSeniorPreferredAge",
  step: "primaryApplicantName",
  light: "yellow",
  evaluate: (application) => {
    const age = getApplicantAge(application)
    return age !== null && age >= 55 && age < 62
  },
  heading: "Most units here are set aside for residents 62 and older",
  body: "You meet the 55 minimum, so you can keep going. Be aware that applicants 62 and older are given preference for most of the units in this building.",
  editFieldAnchor: "applicant.dateOfBirth",
}

export const stopLightRules: StopLightRule[] = [
  seniorBuildingAgeExample,
  demoSeniorMinimumAge,
  demoSeniorPreferredAge,
]
