import { useEffect, useRef, useState } from "react"
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

/**
 * Client-side Stop Light enforcement for one application step.
 */
export const useStopLightGate = (
  stepName: string,
  application: Application,
  listing: Listing,
  enabledRuleKeys: string[] = [],
  deepLinkRuleKey?: string
): StopLightGate => {
  const rulesForStep = stopLightRules.filter(
    (rule) => rule.step === stepName && enabledRuleKeys.includes(rule.key)
  )

  const [redRules, setRedRules] = useState<StopLightRule[]>([])
  const [yellowRules, setYellowRules] = useState<StopLightRule[]>([])
  // Held submit; a ref so acknowledge can clear it synchronously in one React batch.
  const resumeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!deepLinkRuleKey) return
    const rule = rulesForStep.find(
      (candidate) => candidate.key === deepLinkRuleKey && candidate.light === "red"
    )
    if (rule && rule.evaluate(application, listing)) {
      setRedRules([rule])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkRuleKey]) // Next populates router.query after the first render

  // Preview of StepDefinition.save() (top-level assign). Does not cover programs,
  // communityTypes, or preferencesAll, whose save() takes an array rather than Partial<Application>.
  const guardSubmit = (pendingSave: Partial<Application>, proceed: () => void) => {
    resumeRef.current = null

    if (rulesForStep.length === 0) {
      proceed()
      return
    }

    const draftApplication: Application = { ...application, ...pendingSave }

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
      resumeRef.current = proceed
      return
    }

    proceed()
  }

  const acknowledgeYellow = () => {
    const proceed = resumeRef.current
    resumeRef.current = null
    setYellowRules([])
    if (proceed) proceed()
  }

  const cancelYellow = () => {
    resumeRef.current = null
    setYellowRules([])
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
