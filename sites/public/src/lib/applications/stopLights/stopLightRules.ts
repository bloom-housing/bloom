import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type StopLightColor = "red" | "yellow"

export interface StopLightRule {
  /** stable id, must match the key stored in Jurisdictions.enabledStopLightRuleKeys */
  key: string
  /** matches an ApplicationConductor step name, e.g. "primaryApplicantName" */
  step: string
  light: StopLightColor
  evaluate: (application: Application, listing: Listing) => boolean
  /** translation key */
  heading: string
  /** translation key */
  body: string
  /** element id to scroll to/focus when the applicant chooses "Edit"; red light only */
  editFieldAnchor?: string
}

/**
 * Every configured Stop Light rule. Rules are global: they run for every application on
 * every listing, so an `evaluate` must self-gate on listing properties (never listing ids)
 * and must stay pure and cheap. A rule only takes effect for a jurisdiction that lists its
 * `key` in Jurisdictions.enabledStopLightRuleKeys.
 */
export const stopLightRules: StopLightRule[] = []
