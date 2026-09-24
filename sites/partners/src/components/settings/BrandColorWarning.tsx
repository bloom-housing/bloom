import React, { useEffect, useState } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Message } from "@bloom-housing/ui-seeds"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import { RampShade } from "../../lib/branding"
import {
  contrast,
  displayRatio,
  isTooDark,
  meetsAA,
  suggestAccessible,
  textOn,
  WHITE,
} from "../../lib/contrast"
import styles from "./BrandColorWarning.module.scss"

interface BrandColorWarningProps {
  value?: string
  shade: RampShade | "base"
  fieldLabel: string
  derived?: string
  onApply: (hex: string) => void
  testId: string
}

const SETTLE_MS = 400

const useSettled = (value?: string): string | undefined => {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), SETTLE_MS)
    return () => window.clearTimeout(timer)
  }, [value])

  return settled
}

const applicable = (
  shade: RampShade | "base",
  value: string,
  derived: string | undefined,
  against: string
): string | null => {
  if (shade === "base") return suggestAccessible(value)
  return derived && meetsAA(derived, against) ? derived : null
}

const BrandColorWarning = ({
  value,
  shade,
  fieldLabel,
  derived,
  onApply,
  testId,
}: BrandColorWarningProps) => {
  const [dismissed, setDismissed] = useState<string | null>(null)
  const settled = useSettled(value)

  const color = settled?.trim()
  if (!color || !HEX_COLOR.test(color) || dismissed === color) return null

  const dismiss = (
    <Button
      type="button"
      variant="text"
      size="sm"
      onClick={() => setDismissed(color)}
      id={`${testId}-dismiss`}
    >
      {t("t.dismiss")}
    </Button>
  )

  const tooDark = shade === "base" && isTooDark(color)
  const against = textOn[shade]
  if (!tooDark && meetsAA(color, against)) return null

  const suggestion = tooDark ? null : applicable(shade, color, derived, against)

  return (
    <Message
      variant="warn"
      role="status"
      className={styles["warning"]}
      testId={`${testId}-${tooDark ? "lightness" : "contrast"}`}
    >
      <div className={styles["warning__body"]}>
        <span>
          {tooDark
            ? t("branding.lightnessWarning")
            : t(
                against === WHITE ? "branding.contrastWarning" : "branding.contrastWarningBodyText",
                {
                  field: fieldLabel,
                  ratio: displayRatio(contrast(color, against)),
                }
              )}
        </span>
        <div className={styles["warning__actions"]}>
          {suggestion && (
            <Button
              type="button"
              variant="primary-outlined"
              size="sm"
              onClick={() => onApply(suggestion)}
              id={`${testId}-apply`}
            >
              <span
                className={styles["warning__swatch"]}
                style={{ backgroundColor: suggestion }}
                aria-hidden="true"
              />
              {t("branding.contrastAction", { suggestion })}
            </Button>
          )}
          {dismiss}
        </div>
      </div>
    </Message>
  )
}

export default BrandColorWarning
