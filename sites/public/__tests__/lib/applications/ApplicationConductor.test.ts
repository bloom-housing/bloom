import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ApplicationConductor from "../../../src/lib/applications/ApplicationConductor"

describe("ApplicationConductor stop light configuration", () => {
  it("defaults to no enabled stop light rule keys", () => {
    const conductor = new ApplicationConductor({}, { ...listing })
    expect(conductor.config.enabledStopLightRuleKeys).toEqual([])
  })
})
