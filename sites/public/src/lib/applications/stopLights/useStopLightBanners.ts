import { useState } from "react"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StopLightRule, stopLightRules } from "./stopLightRules"

export interface StopLightBanners {
  onFieldBlur: () => void
  banner: StopLightRule | null
}

export const useStopLightBanners = (
  stepName: string,
  application: Application,
  listing: Listing,
  enabledRuleKeys: string[],
  getValues: () => Partial<Application>
): StopLightBanners => {
  const rule = stopLightRules.find(
    (rule) => rule.step === stepName && enabledRuleKeys.includes(rule.key)
  )

  const [banner, setBanner] = useState<StopLightRule | null>(null)

  const onFieldBlur = () => {
    if (!rule) return
    const draftApplication = { ...application, ...getValues() }
    setBanner(rule.evaluate(draftApplication, listing) ? rule : null)
  }

  return { onFieldBlur, banner }
}
