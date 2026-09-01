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

export const stopLightRules: StopLightRule[] = [seniorBuildingAgeExample]
