import React from "react"
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document"
import {
  BrandRampDTO,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchJurisdictionByName } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

// The family is interpolated into the style block, so it is held to letters, digits, spaces and
// hyphens.
const FONT_FAMILY = /^[A-Za-z0-9][A-Za-z0-9 -]{0,63}$/
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"]

type BrandRamp = Partial<BrandRampDTO>

interface BrandDocumentProps {
  primary: BrandRamp | null
  secondary: BrandRamp | null
  faviconUrl: string | null
  fontFamily: string | null
  fontUrl: string | null
}

const rampShades: (keyof BrandRamp)[] = ["base", "dark", "darker", "light", "lighter"]

const isHex = (value: unknown): value is string =>
  typeof value === "string" && HEX_COLOR.test(value)

const hexOnly = (ramp?: BrandRamp): BrandRamp | null => {
  if (!ramp || !isHex(ramp.base)) return null

  return rampShades.reduce((checked: BrandRamp, shade) => {
    if (isHex(ramp[shade])) {
      checked[shade] = ramp[shade]
    }
    return checked
  }, {})
}

const fontFamilyOnly = (value?: string): string | null =>
  typeof value === "string" && FONT_FAMILY.test(value) ? value : null

const googleFontUrlOnly = (value?: string): string | null => {
  if (typeof value !== "string") return null

  try {
    const url = new URL(value)
    return url.protocol === "https:" && FONT_HOSTS.includes(url.hostname) ? value : null
  } catch {
    return null
  }
}

const rampVariables = (namespace: string, name: string, ramp: BrandRamp) =>
  rampShades
    .filter((shade) => ramp[shade])
    .map(
      (shade) =>
        `--${namespace}-color-${name}${shade === "base" ? "" : `-${shade}`}: ${ramp[shade]};`
    )
    .join("\n")

// Exported for tests: <Html> cannot render outside Next's document context.
export const brandStyleBlock = ({ primary, secondary, fontFamily }: BrandDocumentProps): string => {
  if (!primary && !fontFamily) return ""

  const variables = [
    primary ? rampVariables("seeds", "primary", primary) : "",
    primary && secondary ? rampVariables("seeds", "secondary", secondary) : "",
    primary ? rampVariables("bloom", "primary", primary) : "",
    // The fallback stack keeps text readable while the font loads.
    fontFamily ? `--seeds-font-sans: "${fontFamily}", system-ui, sans-serif;` : "",
  ]
    .filter(Boolean)
    .join("\n")

  // Doubled selector: ui-seeds sets these same tokens on :root in a stylesheet that loads after
  // this block, and a single :root would lose the tie on document order.
  return `:root:root {\n${variables}\n}`
}

export default class BloomDocument extends Document<BrandDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const [initialProps, jurisdiction] = await Promise.all([
      Document.getInitialProps(ctx),
      fetchJurisdictionByName(ctx.req),
    ])
    const brand =
      jurisdiction && isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableDbDrivenBranding)
        ? jurisdiction.brand
        : null

    return {
      ...initialProps,
      primary: hexOnly(brand?.primary),
      secondary: hexOnly(brand?.secondary),
      faviconUrl: brand?.faviconUrl ?? null,
      fontFamily: fontFamilyOnly(brand?.fontFamily),
      fontUrl: googleFontUrlOnly(brand?.fontUrl),
    }
  }

  render() {
    const brandVariables = brandStyleBlock(this.props)
    const { faviconUrl, fontUrl } = this.props

    return (
      <Html>
        <Head>
          {brandVariables && (
            <style id="brand-vars" dangerouslySetInnerHTML={{ __html: brandVariables }} />
          )}
          {faviconUrl && <link rel="icon" href={faviconUrl} />}
          {fontUrl && <link rel="preload" as="style" href={fontUrl} />}
          {fontUrl && <link rel="stylesheet" href={fontUrl} />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
