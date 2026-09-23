import React, { useState } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Message } from "@bloom-housing/ui-seeds"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import { RampShade } from "../../lib/branding"
import { contrast, isTooDark, meetsAA, suggestAccessible, textOn, WHITE } from "../../lib/contrast"
import styles from "./BrandColorWarning.module.scss"

interface BrandColorWarningProps {
  value?: string
  shade: RampShade | "base"
  fieldLabel: string
  derived?: string
  onApply: (hex: string) => void
  testId: string
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

  const color = value?.trim()
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

  if (shade === "base" && isTooDark(color)) {
    return (
      <Message
        variant="warn"
        role="alert"
        className={styles["warning"]}
        testId={`${testId}-lightness`}
      >
        <div className={styles["warning__body"]}>
          <span>{t("branding.lightnessWarning")}</span>
          <div className={styles["warning__actions"]}>{dismiss}</div>
        </div>
      </Message>
    )
  }

  const against = textOn[shade]
  if (meetsAA(color, against)) return null

  const suggestion = applicable(shade, color, derived, against)
  const message =
    against === WHITE ? "branding.contrastWarning" : "branding.contrastWarningBodyText"

  return (
    <Message
      variant="warn"
      role="alert"
      className={styles["warning"]}
      testId={`${testId}-contrast`}
    >
      <div className={styles["warning__body"]}>
        <span>{t(message, { field: fieldLabel, ratio: contrast(color, against).toFixed(1) })}</span>
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
