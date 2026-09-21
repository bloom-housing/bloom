import { useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StopLightRule, stopLightRules } from "./stopLightRules"

export interface StopLightsProps {
  redRules: StopLightRule[]
  yellowRules: StopLightRule[]
  onEditRed: () => void
  onCancelYellow: () => void
  onAcknowledgeYellow: () => void
}

export interface StopLightGate {
  guardSubmit: (pendingSave: Partial<Application>, proceed: () => void) => void
  stopLights: StopLightsProps
}

export const useStopLightGate = (
  stepName: string,
  application: Application,
  listing: Listing,
  enabledRuleKeys: string[],
  deepLinkRuleKey?: string
): StopLightGate => {
  const rulesForStep = stopLightRules.filter(
    (rule) => rule.step === stepName && enabledRuleKeys.includes(rule.key)
  )

  const [redRules, setRedRules] = useState<StopLightRule[]>([])
  const [yellowRules, setYellowRules] = useState<StopLightRule[]>([])
  const [resume, setResume] = useState<{ proceed: () => void } | null>(null)

  useEffect(() => {
    if (!deepLinkRuleKey) return
    const rule = rulesForStep.find((r) => r.key === deepLinkRuleKey && r.light === "red")
    if (rule && rule.evaluate(application, listing)) {
      setRedRules([rule])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkRuleKey])

  const guardSubmit = (pendingSave: Partial<Application>, proceed: () => void) => {
    if (rulesForStep.length === 0) {
      proceed()
      return
    }

    const draftApplication = { ...application, ...pendingSave }

    const triggeredRed = rulesForStep.filter(
      (rule) => rule.light === "red" && rule.evaluate(draftApplication, listing)
    )
    if (triggeredRed.length > 0) {
      setRedRules(triggeredRed)
      return
    }

    const triggeredYellow = rulesForStep.filter(
      (rule) => rule.light === "yellow" && rule.evaluate(draftApplication, listing)
    )
    if (triggeredYellow.length > 0) {
      setYellowRules(triggeredYellow)
      setResume({ proceed })
      return
    }

    proceed()
  }

  const acknowledgeYellow = () => {
    if (!yellowRules.length || !resume) return
    setYellowRules([])
    const { proceed } = resume
    setResume(null)
    proceed()
  }

  const cancelYellow = () => {
    setYellowRules([])
    setResume(null)
  }

  const dismissRed = () => setRedRules([])

  return {
    guardSubmit,
    stopLights: {
      redRules,
      yellowRules,
      onEditRed: dismissRed,
      onCancelYellow: cancelYellow,
      onAcknowledgeYellow: acknowledgeYellow,
    },
  }
}
