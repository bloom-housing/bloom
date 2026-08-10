import {
  FeatureFlag,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { stopLightRules } from "../../../../src/lib/applications/stopLights/stopLightRules"
import { getEnabledStopLightRuleKeys } from "../../../../src/lib/applications/stopLights/enabledStopLightRuleKeys"

describe("stopLightRules", () => {
  it("ships with no registered rules", () => {
    expect(stopLightRules).toEqual([])
  })
})

describe("getEnabledStopLightRuleKeys", () => {
  const stopLightsFlag = (active: boolean): FeatureFlag => ({
    id: "flag-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: FeatureFlagEnum.enableStopLights,
    description: "",
    active,
    jurisdictions: [],
  })

  const stopLightsOn = [stopLightsFlag(true)]
  const stopLightsOff = [stopLightsFlag(false)]

  it("returns the jurisdiction's configured keys when the flag is on", () => {
    expect(
      getEnabledStopLightRuleKeys({
        featureFlags: stopLightsOn,
        enabledStopLightRuleKeys: ["exampleNoIncomeReported", "exampleHouseholdTooLarge"],
      })
    ).toEqual(["exampleNoIncomeReported", "exampleHouseholdTooLarge"])
  })

  it("returns no keys when the flag is off, even if keys are configured", () => {
    expect(
      getEnabledStopLightRuleKeys({
        featureFlags: stopLightsOff,
        enabledStopLightRuleKeys: ["exampleNoIncomeReported"],
      })
    ).toEqual([])
  })

  it("returns no keys when the jurisdiction has no feature flags at all", () => {
    expect(
      getEnabledStopLightRuleKeys({
        featureFlags: [],
        enabledStopLightRuleKeys: ["exampleNoIncomeReported"],
      })
    ).toEqual([])
  })

  it("returns an empty array when the flag is on but no keys are configured", () => {
    expect(getEnabledStopLightRuleKeys({ featureFlags: stopLightsOn })).toEqual([])
    expect(
      getEnabledStopLightRuleKeys({ featureFlags: stopLightsOn, enabledStopLightRuleKeys: [] })
    ).toEqual([])
  })
})
