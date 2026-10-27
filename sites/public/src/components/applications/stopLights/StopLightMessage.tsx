import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Message } from "@bloom-housing/ui-seeds"
import { StopLightColor, StopLightRule } from "../../../lib/applications/stopLights/stopLightRules"

export interface StopLightMessageProps {
  rule: StopLightRule | null
  className?: string
}

const messageVariant: Record<StopLightColor, "alert" | "warn"> = {
  red: "alert",
  yellow: "warn",
}

const StopLightMessage = ({ rule, className }: StopLightMessageProps) =>
  rule ? (
    <Message fullwidth variant={messageVariant[rule.light]} className={className}>
      <strong>{t(rule.alertTitle)}</strong> <p className="seeds-body-text">{t(rule.body)}</p>
    </Message>
  ) : null

export { StopLightMessage }
