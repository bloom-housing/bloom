import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../helpers"

type StopLightJurisdiction = Pick<Jurisdiction, "featureFlags"> & {
  enabledStopLightRuleKeys?: string[]
}

export const getEnabledStopLightRuleKeys = (jurisdiction: StopLightJurisdiction): string[] =>
  isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableStopLights)
    ? jurisdiction.enabledStopLightRuleKeys ?? []
    : []
