import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../helpers"
import { stopLightRules } from "./stopLightRules"

type StopLightJurisdiction = Pick<Jurisdiction, "featureFlags"> & {
  enabledStopLightRuleKeys?: string[]
}

// DEMO ONLY — do not commit. Enables every rule regardless of the feature flag or
// jurisdiction config.
export const getEnabledStopLightRuleKeys = (_jurisdiction: StopLightJurisdiction): string[] =>
  stopLightRules.map((rule) => rule.key)

export const getEnabledStopLightRuleKeysReal = (jurisdiction: StopLightJurisdiction): string[] =>
  isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableStopLights)
    ? jurisdiction.enabledStopLightRuleKeys ?? []
    : []
