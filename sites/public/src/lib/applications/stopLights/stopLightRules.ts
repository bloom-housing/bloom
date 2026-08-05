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

export const stopLightRules: StopLightRule[] = []
