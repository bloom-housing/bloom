import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Heading, Tag } from "@bloom-housing/ui-seeds"
import {
  BrandFormValues,
  derivedShades,
  fieldName,
  RampName,
  RAMP_SHADES,
} from "../../lib/branding"
import { radiusVariable } from "@bloom-housing/shared-helpers/src/utilities/brandRadius"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import styles from "./BrandPreview.module.scss"

export type PreviewValues = Partial<BrandFormValues>

const rampVariables = (values: PreviewValues, ramp: RampName): Record<string, string> => {
  const base = values[fieldName(ramp, "base")]?.trim()
  if (!base || !HEX_COLOR.test(base)) return {}

  const derived = derivedShades(base)
  return RAMP_SHADES.reduce(
    (variables: Record<string, string>, shade) => {
      const value = values[fieldName(ramp, shade)]?.trim() || derived[shade]
      if (value && HEX_COLOR.test(value)) variables[`--seeds-color-${ramp}-${shade}`] = value
      return variables
    },
    { [`--seeds-color-${ramp}`]: base }
  )
}

export const previewVariables = (values: PreviewValues): Record<string, string> => {
  const variables = {
    ...rampVariables(values, "primary"),
    ...rampVariables(values, "secondary"),
  }
  if (values.buttonRadius) variables["--brand-button-radius"] = radiusVariable(values.buttonRadius)
  return variables
}

const BrandPreview = ({ values }: { values: PreviewValues }) => (
  <Card className={styles["preview"]}>
    <Card.Section>
      <Heading size="lg" priority={3}>
        {t("branding.preview")}
      </Heading>
      <p className={styles["preview__note"]}>{t("branding.previewNote")}</p>

      <div
        className={styles["preview__sample"]}
        style={previewVariables(values) as React.CSSProperties}
        data-testid="brand-preview"
      >
        <Button variant="primary" size="sm">
          {t("branding.previewPrimaryAction")}
        </Button>
        <Button variant="secondary" size="sm">
          {t("branding.previewSecondaryAction")}
        </Button>
        <Tag variant="primary">{t("branding.previewTag")}</Tag>
      </div>
    </Card.Section>
  </Card>
)

export default BrandPreview
