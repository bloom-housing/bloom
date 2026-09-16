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

// Mirrors the api allowlist: a stored token is re-checked here the way the colors are
const LENGTH_OR_SEEDS_VAR = /^(0|[0-9]+(\.[0-9]+)?(px|rem|em|%)|var\(--seeds-[a-z0-9-]+\))$/
const TOKEN_GRAMMARS: Record<string, RegExp> = {
  "--button-border-radius-sm": LENGTH_OR_SEEDS_VAR,
  "--button-border-radius-md": LENGTH_OR_SEEDS_VAR,
  "--button-border-radius-lg": LENGTH_OR_SEEDS_VAR,
  "--seeds-font-serif": FONT_FAMILY,
}

type BrandRamp = Partial<BrandRampDTO>

interface BrandDocumentProps {
  primary: BrandRamp | null
  secondary: BrandRamp | null
  faviconUrl: string | null
  fontFamily: string | null
  headingFontFamily: string | null
  fontUrl: string | null
  tokens: Record<string, string>
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

const allowlistedTokens = (tokens?: object): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tokens ?? {}).filter(
      ([name, value]) => typeof value === "string" && TOKEN_GRAMMARS[name]?.test(value)
    )
  )

const tokenValue = (name: string, value: string) =>
  name === "--seeds-font-serif" ? fontStack(value, "serif") : value

export const brandStyleBlock = ({
  primary,
  secondary,
  fontFamily,
  headingFontFamily,
  tokens,
}: BrandDocumentProps): string => {
  if (!primary && !fontFamily && !headingFontFamily && !Object.keys(tokens).length) return ""

  // Headings, buttons and tabs read the alt token.
  const headingFont = headingFontFamily ?? fontFamily

  const variables = [
    primary ? rampVariables("seeds", "primary", primary) : "",
    primary && secondary ? rampVariables("seeds", "secondary", secondary) : "",
    primary ? rampVariables("bloom", "primary", primary) : "",
    fontFamily ? `--seeds-font-sans: ${fontStack(fontFamily, "sans")};` : "",
    headingFont ? `--seeds-font-alt-sans: ${fontStack(headingFont, "alt-sans")};` : "",
    ...Object.entries(tokens).map(([name, value]) => `${name}: ${tokenValue(name, value)};`),
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
    const fontUrl = googleFontUrlOnly(brand?.fontUrl)

    return {
      ...initialProps,
      primary: hexOnly(brand?.primary),
      secondary: hexOnly(brand?.secondary),
      faviconUrl: brand?.faviconUrl ?? null,
      fontFamily: fontUrl ? fontFamilyOnly(brand?.fontFamily) : null,
      headingFontFamily: fontUrl ? fontFamilyOnly(brand?.headingFontFamily) : null,
      fontUrl,
      tokens: allowlistedTokens(brand?.tokens),
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
