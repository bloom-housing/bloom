import { useEffect, useState } from "react"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StopLightRule, stopLightRules } from "./stopLightRules"

export interface StopLightsProps {
  rule: StopLightRule | null
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
  // a step has at most one rule
  const rule = stopLightRules.find(
    (candidate) => candidate.step === stepName && enabledRuleKeys.includes(candidate.key)
  )

  // the rule currently being shown and, for yellow only, what to run once it is acknowledged
  const [triggered, setTriggered] = useState<{
    rule: StopLightRule
    proceed?: () => void
  } | null>(null)

  useEffect(() => {
    if (!deepLinkRuleKey || !rule) return
    if (
      rule.key === deepLinkRuleKey &&
      rule.light === "red" &&
      rule.evaluate(application, listing)
    ) {
      setTriggered({ rule })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkRuleKey])

  const guardSubmit = (pendingSave: Partial<Application>, proceed: () => void) => {
    if (!rule) {
      proceed()
      return
    }

    const draftApplication = { ...application, ...pendingSave }

    if (!rule.evaluate(draftApplication, listing)) {
      proceed()
      return
    }

    if (rule.light === "red") {
      setTriggered({ rule })
      return
    }

    setTriggered({ rule, proceed }) // yellow: remember what to run once acknowledged
  }

  const acknowledgeYellow = () => {
    if (!triggered?.proceed) return
    const { proceed } = triggered
    setTriggered(null)
    proceed()
  }

  // red "Edit" and yellow "Cancel" both just close the modal: nothing proceeds and the
  // applicant stays on the page
  const dismiss = () => setTriggered(null)

  return {
    guardSubmit,
    stopLights: {
      rule: triggered?.rule ?? null,
      onEditRed: dismiss,
      onCancelYellow: dismiss,
      onAcknowledgeYellow: acknowledgeYellow,
    },
  }
}
