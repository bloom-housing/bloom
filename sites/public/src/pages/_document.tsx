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
const FONT_FAMILY = /^[A-Za-z0-9](?:[A-Za-z0-9 -]{0,62}[A-Za-z0-9])?$/
const FONT_HOSTS = ["fonts.googleapis.com"]

type BrandRamp = Partial<BrandRampDTO>

interface BrandDocumentProps {
  primary: BrandRamp | null
  secondary: BrandRamp | null
  faviconUrl: string | null
  fontFamily: string | null
  headingFontFamily: string | null
  fontUrl: string | null
  serifFontFamily: string | null
  buttonRadius: string | null
}

const rampShades: (keyof BrandRamp)[] = ["base", "dark", "darker", "light", "lighter"]

// A stored row can hold any JSON, and test() throws on an object with a non-callable toString.
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
    const usable =
      url.protocol === "https:" &&
      FONT_HOSTS.includes(url.hostname) &&
      !url.port &&
      !url.username &&
      !url.password
    return usable ? value : null
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
// The fallbacks live in overrides.scss so the stacks stay in css next to the rest of the styling.
const fontStack = (family: string, slot: "sans" | "alt-sans" | "serif") =>
  `"${family}", var(--brand-font-fallback-${slot})`

const RADIUS_STEPS = ["sm", "base", "md", "lg", "xl", "2xl", "3xl", "full"]

const radiusStepOnly = (value?: string): string | null =>
  typeof value === "string" && RADIUS_STEPS.includes(value) ? value : null

const radiusVariable = (step: string) =>
  step === "base" ? "var(--seeds-rounded)" : `var(--seeds-rounded-${step})`

export const brandStyleBlock = ({
  primary,
  secondary,
  fontFamily,
  headingFontFamily,
  serifFontFamily,
  buttonRadius,
}: BrandDocumentProps): string => {
  // Headings, buttons and tabs read the alt token.
  const headingFont = headingFontFamily ?? fontFamily

  const rootVariables = [
    primary ? rampVariables("seeds", "primary", primary) : "",
    primary && secondary ? rampVariables("seeds", "secondary", secondary) : "",
    primary ? rampVariables("bloom", "primary", primary) : "",
    fontFamily ? `--seeds-font-sans: ${fontStack(fontFamily, "sans")};` : "",
    headingFont ? `--seeds-font-alt-sans: ${fontStack(headingFont, "alt-sans")};` : "",
    serifFontFamily ? `--seeds-font-serif: ${fontStack(serifFontFamily, "serif")};` : "",
  ]
    .filter(Boolean)
    .join("\n")

  // ui-seeds sets the radius on .seeds-button itself, and an element's own declaration beats an
  // inherited one, so a button radius has to be written against the same element.
  const buttonVariables = buttonRadius
    ? ["sm", "md", "lg"]
        .map((size) => `--button-border-radius-${size}: ${radiusVariable(buttonRadius)};`)
        .join("\n")
    : ""

  // Doubled selector: ui-seeds sets these same tokens in a stylesheet that loads after this
  // block, and a single :root would lose the tie on document order.
  return [
    rootVariables ? `:root:root {\n${rootVariables}\n}` : "",
    buttonVariables ? `:root:root .seeds-button {\n${buttonVariables}\n}` : "",
  ]
    .filter(Boolean)
    .join("\n")
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
    const fontUrl = googleFontUrlOnly(brand?.fontUrl)

    return {
      ...initialProps,
      primary: hexOnly(brand?.primary),
      secondary: hexOnly(brand?.secondary),
      faviconUrl: brand?.faviconUrl ?? null,
      fontFamily: fontUrl ? fontFamilyOnly(brand?.fontFamily) : null,
      headingFontFamily: fontUrl ? fontFamilyOnly(brand?.headingFontFamily) : null,
      fontUrl,
      serifFontFamily: fontUrl ? fontFamilyOnly(brand?.serifFontFamily) : null,
      buttonRadius: radiusStepOnly(brand?.buttonRadius),
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
          {/* Nothing emitted without one, so the browser falls back to /favicon.ico */}
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
