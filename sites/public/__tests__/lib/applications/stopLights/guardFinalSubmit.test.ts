import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { ApplicationFormConfig } from "../../../../src/lib/applications/configInterfaces"
import {
  StopLightColor,
  StopLightRule,
  stopLightRules,
} from "../../../../src/lib/applications/stopLights/stopLightRules"
import { guardFinalSubmit } from "../../../../src/lib/applications/stopLights/guardFinalSubmit"

const registrySnapshot = [...stopLightRules]

type RuleFixture = Omit<StopLightRule, "evaluate"> & {
  evaluate: jest.MockedFunction<StopLightRule["evaluate"]>
}

const buildRule = (
  key: string,
  step: string,
  light: StopLightColor,
  triggers: boolean
): RuleFixture => ({
  key,
  step,
  light,
  evaluate: jest.fn(() => triggers),
  modalTitle: `stopLights.${key}.modalTitle`,
  alertTitle: `stopLights.${key}.alertTitle`,
  body: `stopLights.${key}.body`,
})

const buildConductor = (rules: RuleFixture[], enabledRuleKeys = rules.map((rule) => rule.key)) => {
  stopLightRules.splice(0, stopLightRules.length, ...rules)

  const conductor = new ApplicationConductor({ householdSize: 2 }, {} as Listing)
  const config: ApplicationFormConfig = {
    sections: [],
    languages: [],
    steps: [{ name: "primaryApplicantName" }, { name: "income" }, { name: "terms" }],
    featureFlags: [],
    isAdvocate: false,
    enabledStopLightRuleKeys: enabledRuleKeys,
  }
  conductor.config = config

  const routeTo = jest.spyOn(conductor, "routeTo").mockImplementation(() => undefined)
  return { conductor, routeTo }
}

afterEach(() => {
  stopLightRules.splice(0, stopLightRules.length, ...registrySnapshot)
})

describe("guardFinalSubmit", () => {
  it("redirects to the blocked step with ?blockedRule and does not proceed", () => {
    const rule = buildRule("nameBlocked", "primaryApplicantName", "red", true)
    const { conductor, routeTo } = buildConductor([rule])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(routeTo).toHaveBeenCalledTimes(1)
    expect(routeTo).toHaveBeenCalledWith("/applications/contact/name?blockedRule=nameBlocked")
    expect(proceed).not.toHaveBeenCalled()
  })

  it("proceeds when no rules are registered", () => {
    const { conductor, routeTo } = buildConductor([])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(routeTo).not.toHaveBeenCalled()
  })

  it("proceeds when a red rule does not trigger", () => {
    const rule = buildRule("nameClean", "primaryApplicantName", "red", false)
    const { conductor, routeTo } = buildConductor([rule])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(rule.evaluate).toHaveBeenCalled()
    expect(proceed).toHaveBeenCalledTimes(1)
    expect(routeTo).not.toHaveBeenCalled()
  })

  it("proceeds when only a yellow rule triggers", () => {
    const rule = buildRule("incomeWarning", "income", "yellow", true)
    const { conductor, routeTo } = buildConductor([rule])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(routeTo).not.toHaveBeenCalled()
  })

  it("ignores a triggered red rule that is not enabled for the jurisdiction", () => {
    const rule = buildRule("nameBlocked", "primaryApplicantName", "red", true)
    const { conductor, routeTo } = buildConductor([rule], [])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(rule.evaluate).not.toHaveBeenCalled()
    expect(proceed).toHaveBeenCalledTimes(1)
    expect(routeTo).not.toHaveBeenCalled()
  })

  it("redirects to the earliest blocked step in step order", () => {
    const incomeRule = buildRule("incomeBlocked", "income", "red", true)
    const nameRule = buildRule("nameBlocked", "primaryApplicantName", "red", true)
    const { conductor, routeTo } = buildConductor([incomeRule, nameRule])
    const proceed = jest.fn()

    guardFinalSubmit(conductor, proceed)

    expect(routeTo).toHaveBeenCalledTimes(1)
    expect(routeTo).toHaveBeenCalledWith("/applications/contact/name?blockedRule=nameBlocked")
    expect(proceed).not.toHaveBeenCalled()
  })
})
