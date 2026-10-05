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

// ---------------------------------------------------------------------------
// DEMO ONLY — do not commit. Exercises guardFinalSubmit: a red rule on the programs step
// that the blank application already violates (no program answer saved). Answering the
// programs page (any option, opt-out included) satisfies it, so walking the form never
// trips it; it only fires if the applicant skips the programs page by deep-linking past
// it. Self-gates on the listing having program questions, since the programs step is
// skipped for listings without them. Every rule is enabled by the demo override in
// enabledStopLightRuleKeys.ts; start the application from choose-language so the keys
// land in the conductor config. Copy is literal text; t() falls back to the key itself.
//
// Needs a listing with at least one program question (and swapCommunityTypeWithPrograms
// off, otherwise the programs step itself is skipped).
//
// Try it: start an application on that listing, then type /applications/review/terms into
// the address bar (skipping every step, including programs), tick the box and Submit.
// Instead of submitting you land on
// /applications/programs/programs?blockedRule=demo_programsSkipped with the red modal open.
// Answer the programs question, continue back to Terms, and Submit goes through.
//
// Revert with:
//   git checkout -- sites/public/src/lib/applications/stopLights/stopLightRules.ts \
//     sites/public/src/lib/applications/stopLights/enabledStopLightRuleKeys.ts
// ---------------------------------------------------------------------------
const demoProgramsSkipped: StopLightRule = {
  key: "demo_programsSkipped",
  step: "programs",
  light: "red",
  evaluate: (application, listing) => {
    const programQuestionIds = (listing?.listingMultiselectQuestions ?? [])
      .filter((question) => question?.multiselectQuestions?.applicationSection === "programs")
      .map((question) => question.multiselectQuestions.id)
    if (!programQuestionIds.length) return false

    // V1 MSQ: any checked option (opt-out included) marks the question claimed
    const answeredV1 = (application.programs ?? []).some((question) => question?.claimed)
    // V2 MSQ: a saved selection for one of this listing's program questions
    const answeredV2 = (application.applicationSelections ?? []).some((selection) =>
      programQuestionIds.includes(selection?.multiselectQuestion?.id)
    )
    return !answeredV1 && !answeredV2
  },
  modalTitle: "[DEMO red] programs question was skipped",
  alertTitle: "[DEMO red] programs rule triggered: no program answer on the application",
  body: "Red light from the final-submit backstop: you skipped this question. Answer it to continue.",
}

export const stopLightRules: StopLightRule[] = [demoProgramsSkipped]
