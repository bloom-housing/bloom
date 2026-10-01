import dayjs from "dayjs"
import {
  Application,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
// DEMO ONLY — do not commit. One throwaway rule per wired application step, so the
// gate (and the banner on the name step) can be exercised by hand. Every rule is
// enabled for every jurisdiction by the demo override in enabledStopLightRuleKeys.ts;
// start the application from the choose-language page so the keys land in the
// conductor config.
//
// Copy is literal text rather than translation keys; t() falls back to the key itself.
//
// Revert with:
//   git checkout -- sites/public/src/lib/applications/stopLights/stopLightRules.ts \
//     sites/public/src/lib/applications/stopLights/enabledStopLightRuleKeys.ts
// ---------------------------------------------------------------------------
const isStop = (value?: string) => value?.trim().toLowerCase() === "stop"

const demoRule = (
  step: string,
  light: StopLightColor,
  trigger: string,
  evaluate: StopLightRule["evaluate"],
  editFieldAnchor?: string
): StopLightRule => ({
  key: `demo_${step}`,
  step,
  light,
  evaluate,
  modalTitle: `[DEMO ${light}] ${step}`,
  alertTitle: `[DEMO ${light}] ${step} rule triggered: ${trigger}`,
  body:
    light === "red"
      ? "Red light: you can't continue. Update your answer to get past this step."
      : "Yellow light: you can continue after acknowledging, or cancel to change your answer.",
  editFieldAnchor: light === "red" ? editFieldAnchor : undefined,
})

// true when the draft claims any non-opt-out option in the given multiselect section,
// for both the V1 (application.preferences/programs) and V2 (applicationSelections) shapes
const claimsAnyInSection = (
  application: Application,
  listing: Listing,
  section: MultiselectQuestionsApplicationSectionEnum
) => {
  const v1Questions = (application[section] ?? []) as { claimed?: boolean }[]
  if (v1Questions.some((question) => question.claimed)) return true

  const sectionQuestionIds = (listing?.listingMultiselectQuestions ?? [])
    .filter((question) => question.multiselectQuestions?.applicationSection === section)
    .map((question) => question.multiselectQuestions.id)
  return (application.applicationSelections ?? []).some(
    (selection) =>
      sectionQuestionIds.includes(selection.multiselectQuestion?.id) &&
      !selection.hasOptedOut &&
      selection.selections?.length > 0
  )
}

const demoStopLightRules: StopLightRule[] = [
  demoRule(
    "primaryApplicantName",
    "red",
    'first name is "stop"',
    (application) => isStop(application.applicant?.firstName),
    "applicant.firstName"
  ),
  demoRule(
    "primaryApplicantAddress",
    "red",
    'city is "stop"',
    (application) => isStop(application.applicant?.applicantAddress?.city),
    "addressCity"
  ),
  demoRule(
    "alternateContactType",
    "yellow",
    'type is "Friend"',
    (application) => application.alternateContact?.type === "friend"
  ),
  demoRule(
    "alternateContactName",
    "red",
    'first name is "stop"',
    (application) => isStop(application.alternateContact?.firstName),
    "firstName"
  ),
  demoRule("alternateContactInfo", "yellow", 'city is "stop"', (application) =>
    isStop(application.alternateContact?.address?.city)
  ),
  demoRule(
    "liveAlone",
    "yellow",
    "applicant lives alone",
    (application) => application.householdSize === 1
  ),
  demoRule(
    "addMembers",
    "red",
    "household of 3 or more",
    (application) => application.householdSize >= 3,
    "app-add-household-member-button"
  ),
  demoRule(
    "preferredUnitSize",
    "yellow",
    "more than one unit size selected",
    (application) => application.preferredUnitTypes?.length > 1
  ),
  demoRule(
    "adaHouseholdMembers",
    "red",
    '"Hearing" is checked',
    (application) => !!application.accessibility?.hearing
  ),
  demoRule("reasonableAccommodations", "yellow", 'text contains "stop"', (application) =>
    (application as Application & { reasonableAccommodations?: string }).reasonableAccommodations
      ?.toLowerCase()
      .includes("stop")
  ),
  demoRule(
    "householdChanges",
    "yellow",
    'answered "Yes"',
    (application) => application.householdExpectingChanges === true
  ),
  demoRule(
    "householdStudent",
    "red",
    'answered "Yes"',
    (application) => application.householdStudent === true
  ),
  demoRule("vouchersSubsidies", "yellow", "any voucher or subsidy selected", (application) =>
    (application.incomeVouchers ?? []).some((voucher) => voucher && voucher !== "none")
  ),
  demoRule(
    "income",
    "red",
    "income of 100,000 or more",
    (application) => Number(application.income) >= 100000,
    "income"
  ),
  demoRule("programs", "red", "any program claimed", (application, listing) =>
    claimsAnyInSection(application, listing, MultiselectQuestionsApplicationSectionEnum.programs)
  ),
  demoRule("communityTypes", "red", "any community type claimed", (application, listing) =>
    claimsAnyInSection(application, listing, MultiselectQuestionsApplicationSectionEnum.programs)
  ),
  demoRule("preferencesAll", "yellow", "any preference claimed", (application, listing) =>
    claimsAnyInSection(application, listing, MultiselectQuestionsApplicationSectionEnum.preferences)
  ),
  demoRule("demographics", "yellow", 'heard about it from "Friend"', (application) =>
    application.demographics?.howDidYouHear?.includes("friend")
  ),
]

// DEMO ONLY: seniorBuildingAgeExample is left out because a step has at most one rule
// and it would shadow the demo name-step rule.
export const stopLightRules: StopLightRule[] = demoStopLightRules
