import {
  Application,
  FeatureFlag,
  FeatureFlagEnum,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  StopLightRule,
  stopLightRules,
} from "../../../../src/lib/applications/stopLights/stopLightRules"
import { getEnabledStopLightRuleKeys } from "../../../../src/lib/applications/stopLights/enabledStopLightRuleKeys"

const exampleRedRule: StopLightRule = {
  key: "exampleHouseholdTooLarge",
  step: "householdSize",
  light: "red",
  evaluate: (application: Application, listing: Listing) =>
    application.householdSize > (listing.householdSizeMax ?? Number.MAX_SAFE_INTEGER),
  heading: "stopLights.exampleHouseholdTooLarge.heading",
  body: "stopLights.exampleHouseholdTooLarge.body",
  editFieldAnchor: "householdSize",
}

const exampleYellowRule: StopLightRule = {
  key: "exampleNoIncomeReported",
  step: "income",
  light: "yellow",
  evaluate: (application: Application) => Number(application.income ?? 0) === 0,
  heading: "stopLights.exampleNoIncomeReported.heading",
  body: "stopLights.exampleNoIncomeReported.body",
}

const exampleRules = [exampleRedRule, exampleYellowRule]

describe("stopLightRules", () => {
  it("ships with no registered rules", () => {
    expect(stopLightRules).toEqual([])
  })

  it("evaluates a red rule against both the application and the listing", () => {
    const application = { householdSize: 5 } as Application
    expect(exampleRedRule.evaluate(application, { householdSizeMax: 4 } as Listing)).toBe(true)
    expect(exampleRedRule.evaluate(application, { householdSizeMax: 6 } as Listing)).toBe(false)
    expect(exampleRedRule.evaluate(application, {} as Listing)).toBe(false)
  })

  it("evaluates a yellow rule", () => {
    expect(exampleYellowRule.evaluate({ income: "0" } as Application, {} as Listing)).toBe(true)
    expect(exampleYellowRule.evaluate({ income: "1000" } as Application, {} as Listing)).toBe(false)
  })

  it("filters rules by step, colour, and enabled keys the way the gate will", () => {
    const enabledRuleKeys = ["exampleNoIncomeReported"]

    expect(
      exampleRules.filter((rule) => rule.step === "income" && enabledRuleKeys.includes(rule.key))
    ).toEqual([exampleYellowRule])

    expect(
      exampleRules.filter(
        (rule) => rule.step === "householdSize" && enabledRuleKeys.includes(rule.key)
      )
    ).toEqual([])

    expect(exampleRules.filter((rule) => rule.light === "red")).toEqual([exampleRedRule])
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

  it("does not add or drop keys, including keys with no matching registry entry", () => {
    expect(
      getEnabledStopLightRuleKeys({
        featureFlags: stopLightsOn,
        enabledStopLightRuleKeys: ["notARegisteredRule"],
      })
    ).toEqual(["notARegisteredRule"])
  })
})
