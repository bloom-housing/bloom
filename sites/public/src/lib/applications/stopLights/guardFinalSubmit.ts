import { Application } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationConductor from "../ApplicationConductor"
import { stopLightRules } from "./stopLightRules"

export const guardFinalSubmit = (conductor: ApplicationConductor, proceed: () => void) => {
  for (const step of conductor.steps) {
    const blockedRule = stopLightRules.find(
      (rule) =>
        rule.step === step.name &&
        rule.light === "red" &&
        conductor.config.enabledStopLightRuleKeys?.includes(rule.key) &&
        rule.evaluate(conductor.application as Application, conductor.listing)
    )
    if (blockedRule) {
      conductor.routeTo(`${step.url}?blockedRule=${blockedRule.key}`)
      return
    }
  }

  proceed()
}
