import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../helpers"

type StopLightJurisdiction = Pick<Jurisdiction, "featureFlags"> & {
  enabledStopLightRuleKeys?: string[]
}

/**
 * The Stop Light rule keys a jurisdiction actually enforces. Returns no keys unless the
 * enableStopLights feature flag is on for that jurisdiction, so a fork with the flag off
 * behaves exactly as it does today regardless of what is stored in the column.
 */
export const getEnabledStopLightRuleKeys = (jurisdiction: StopLightJurisdiction): string[] =>
  isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableStopLights)
    ? jurisdiction.enabledStopLightRuleKeys ?? []
    : []
