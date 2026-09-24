import dayjs from "dayjs"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type StopLightColor = "red" | "yellow"

export interface StopLightRule {
  key: string // stable id, e.g. "seniorBuildingMinimumAge"
  step: string // matches ApplicationConductor step/route name, e.g. "primaryApplicantName"
  light: StopLightColor
  evaluate: (application: Application, listing: Listing) => boolean
  modalTitle: string // translation key
  alertTitle: string // translation key
  body: string // translation key
  editFieldAnchor?: string // element id to scroll/focus on "Update my answer", red light only
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
  modalTitle: "stopLights.seniorBuildingMinimumAge.modalTitle",
  alertTitle: "stopLights.seniorBuildingMinimumAge.alertTitle",
  body: "stopLights.seniorBuildingMinimumAge.body",
  editFieldAnchor: "applicant.dateOfBirth",
}

// ---------------------------------------------------------------------------
// DEMO ONLY — throwaway rule for exercising useStopLightBanners by hand on the
// address step. Type "Stop" as the city (any case) and leave the field.
// Flip DEMO_ADDRESS_LIGHT to "yellow" to see the yellow banner instead.
//
// Copy is literal text rather than translation keys so no locale changes are
// needed; t() falls back to the key itself (and logs a missing-phrase warning).
//
// Revert with: git checkout -- sites/public/src/lib/applications/stopLights/stopLightRules.ts
// ---------------------------------------------------------------------------
const DEMO_ADDRESS_LIGHT: StopLightColor = "red"

const demoAddressCity: StopLightRule = {
  key: "demoAddressCity",
  step: "primaryApplicantAddress",
  light: DEMO_ADDRESS_LIGHT,
  evaluate: (application) =>
    application.applicant?.applicantAddress?.city?.trim().toLowerCase() === "stop",
  modalTitle: "Your address is outside this listing's area",
  alertTitle:
    DEMO_ADDRESS_LIGHT === "red"
      ? "The city you entered is outside the area for this listing, so you aren't eligible to apply."
      : "The city you entered may be outside the area for this listing.",
  body:
    DEMO_ADDRESS_LIGHT === "red"
      ? "If this is a mistake, you can update your answer. If your information is correct, please browse other listings."
      : "You can still apply, but your address will be verified later and may not qualify.",
  editFieldAnchor: "addressCity",
}

export const stopLightRules: StopLightRule[] = [seniorBuildingAgeExample, demoAddressCity]
