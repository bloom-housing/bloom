import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Alert, Button } from "@bloom-housing/ui-seeds"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import { contrastWithWhite, isTooDark, meetsAA, suggestAccessible } from "../../lib/contrast"
import styles from "./BrandColorWarning.module.scss"

interface BrandColorWarningProps {
  base?: string
  onApply: (hex: string) => void
  testId: string
}

const BrandColorWarning = ({ base, onApply, testId }: BrandColorWarningProps) => {
  const value = base?.trim()
  if (!value || !HEX_COLOR.test(value)) return null

  if (isTooDark(value)) {
    return (
      <Alert variant="warn" className={styles["warning"]} testId={`${testId}-lightness`}>
        {t("branding.lightnessWarning")}
      </Alert>
    )
  }

  if (meetsAA(value)) return null

  const suggestion = suggestAccessible(value)

  return (
    <Alert variant="warn" className={styles["warning"]} testId={`${testId}-contrast`}>
      {t("branding.contrastWarning", { ratio: contrastWithWhite(value).toFixed(1) })}
      {suggestion && (
        <Button
          variant="primary-outlined"
          size="sm"
          className={styles["warning__action"]}
          onClick={() => onApply(suggestion)}
          id={`${testId}-apply`}
        >
          {t("branding.contrastAction", { suggestion })}
        </Button>
      )}
    </Alert>
  )
}

export default BrandColorWarning
