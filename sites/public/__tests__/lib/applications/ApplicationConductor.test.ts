import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ApplicationConductor from "../../../src/lib/applications/ApplicationConductor"
import { ApplicationFormConfig } from "../../../src/lib/applications/configInterfaces"

const baseConfig: ApplicationFormConfig = {
  sections: [],
  languages: [],
  steps: [],
  featureFlags: [],
  isAdvocate: false,
}

describe("ApplicationConductor stop light configuration", () => {
  it("defaults to no enabled stop light rule keys", () => {
    const conductor = new ApplicationConductor({}, { ...listing })
    expect(conductor.config.enabledStopLightRuleKeys).toEqual([])
  })

  it("exposes the enabled keys it was configured with", () => {
    const conductor = new ApplicationConductor({}, { ...listing })
    conductor.config = { ...baseConfig, enabledStopLightRuleKeys: ["exampleNoIncomeReported"] }

    expect(conductor.config.enabledStopLightRuleKeys).toEqual(["exampleNoIncomeReported"])
  })

  it("does not expose keys the jurisdiction did not enable", () => {
    const conductor = new ApplicationConductor({}, { ...listing })
    conductor.config = { ...baseConfig, enabledStopLightRuleKeys: ["exampleNoIncomeReported"] }

    expect(conductor.config.enabledStopLightRuleKeys).not.toContain("exampleHouseholdTooLarge")
  })
})
