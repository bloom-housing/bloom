import React, { useEffect, useState } from "react"
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
import {
  fontFamilyOnly,
  fontStack,
  googleFontUrlOnly,
} from "@bloom-housing/shared-helpers/src/utilities/brandFont"
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

const FONT_VARIABLES = {
  fontFamily: { variable: "--seeds-font-sans", slot: "sans" },
  headingFontFamily: { variable: "--seeds-font-alt-sans", slot: "alt-sans" },
  serifFontFamily: { variable: "--seeds-font-serif", slot: "serif" },
} as const

/*
  A family is only previewed alongside a usable font url, matching what the document emits. Without
  the stylesheet the sample would render in the fallback stack and look like the font had applied.
*/
const fontVariables = (values: PreviewValues): Record<string, string> => {
  if (!googleFontUrlOnly(values.fontUrl?.trim())) return {}

  const sans = fontFamilyOnly(values.fontFamily?.trim())
  const heading = fontFamilyOnly(values.headingFontFamily?.trim()) ?? sans

  return Object.entries(FONT_VARIABLES).reduce(
    (variables: Record<string, string>, [field, { variable, slot }]) => {
      const family = field === "headingFontFamily" ? heading : fontFamilyOnly(values[field]?.trim())
      if (family) variables[variable] = fontStack(family, slot)
      return variables
    },
    {}
  )
}

export const previewVariables = (values: PreviewValues): Record<string, string> => {
  const variables = {
    ...rampVariables(values, "primary"),
    ...rampVariables(values, "secondary"),
    ...fontVariables(values),
  }
  if (values.buttonRadius) variables["--brand-button-radius"] = radiusVariable(values.buttonRadius)
  return variables
}

const SETTLE_MS = 400

/*
  Loads the brand's stylesheet so the sample renders in the real font. The url is held to the same
  google fonts allowlist the api enforces, and settled first, so a half-typed value is not
  requested. The link is removed when the url changes or the page is left.
*/
const useBrandFont = (fontUrl?: string) => {
  const [settled, setSettled] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(googleFontUrlOnly(fontUrl?.trim())), SETTLE_MS)
    return () => window.clearTimeout(timer)
  }, [fontUrl])

  useEffect(() => {
    if (!settled) return undefined

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = settled
    link.dataset.brandPreviewFont = "true"
    document.head.appendChild(link)

    return () => link.remove()
  }, [settled])
}

const BrandPreview = ({ values }: { values: PreviewValues }) => {
  useBrandFont(values.fontUrl)

  return (
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

        <div
          className={styles["preview__type"]}
          style={previewVariables(values) as React.CSSProperties}
          data-testid="brand-preview-type"
        >
          <Heading size="xl" priority={4} className={styles["preview__heading"]}>
            {t("branding.previewHeading")}
          </Heading>
          <p className={styles["preview__body"]}>{t("branding.previewBody")}</p>
          <p className={styles["preview__serif"]}>{t("branding.previewSerif")}</p>
        </div>
      </Card.Section>
    </Card>
  )
}

export default BrandPreview
