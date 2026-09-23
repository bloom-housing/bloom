import React, { useState } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Message } from "@bloom-housing/ui-seeds"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import { contrastWithWhite, isTooDark, meetsAA, suggestAccessible } from "../../lib/contrast"
import styles from "./BrandColorWarning.module.scss"

interface BrandColorWarningProps {
  base?: string
  onApply: (hex: string) => void
  testId: string
}

const BrandColorWarning = ({ base, onApply, testId }: BrandColorWarningProps) => {
  const [dismissed, setDismissed] = useState<string | null>(null)

  const value = base?.trim()
  if (!value || !HEX_COLOR.test(value) || dismissed === value) return null

  const dismiss = (
    <Button
      type="button"
      variant="text"
      size="sm"
      onClick={() => setDismissed(value)}
      id={`${testId}-dismiss`}
    >
      {t("t.dismiss")}
    </Button>
  )

  if (isTooDark(value)) {
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

  if (meetsAA(value)) return null

  const suggestion = suggestAccessible(value)

  return (
    <Message
      variant="warn"
      role="alert"
      className={styles["warning"]}
      testId={`${testId}-contrast`}
    >
      <div className={styles["warning__body"]}>
        <span>{t("branding.contrastWarning", { ratio: contrastWithWhite(value).toFixed(1) })}</span>
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
