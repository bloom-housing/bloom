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
  editFieldAnchor?: string // id of a focusable element to focus on "Update my answer", red only
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
  // The month input, not DOBField's <fieldset id="applicant.dateOfBirth"> wrapper: an anchor
  // has to name a directly focusable element.
  editFieldAnchor: "applicant.birthMonth",
}

// ---------------------------------------------------------------------------
// DEMO ONLY — a throwaway rule for seeing the red modal on the address step
// without any jurisdiction or feature flag setup.
//
//   ZIP 00000     -> RED, blocked before address verification even runs
//   any other ZIP -> passes straight through, saves and routes as usual
//
// Real rules put translation keys in the three copy fields. This one carries
// literal copy instead: the modal runs every field through t(), and
// node-polyglot returns the key unchanged when no phrase matches it, so these
// sentences reach the screen as written without touching general.json.
//
// Revert with:
//   git checkout -- sites/public/src/lib/applications/stopLights/stopLightRules.ts
//   git checkout -- sites/public/src/pages/applications/contact/address.tsx
// ---------------------------------------------------------------------------
const demoAddressOutsideServiceArea: StopLightRule = {
  key: "demoAddressOutsideServiceArea",
  step: "primaryApplicantAddress",
  light: "red",
  evaluate: (application) => application.applicant?.applicantAddress?.zipCode?.trim() === "00000",
  modalTitle: "Your address is outside the service area for this listing",
  alertTitle:
    "The ZIP code you entered is outside the area this listing serves, so you aren't eligible to apply.",
  body: "If this is a mistake, you can update your answer. If your information is correct, please browse other listings to find one that matches your address.",
  // A DOM element id, not the react-hook-form field name. Field renders
  // `id={props.id || props.name}`, and the address page passes an explicit id to every
  // address field, so the name "applicant.applicantAddress.zipCode" matches nothing.
  editFieldAnchor: "addressZipCode",
}

export const stopLightRules: StopLightRule[] = [
  seniorBuildingAgeExample,
  demoAddressOutsideServiceArea,
]
