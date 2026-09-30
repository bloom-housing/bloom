import React from "react"
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document"
import {
  BrandRadiusEnum,
  BrandRampDTO,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  radiusStepOnly,
  radiusVariable,
} from "@bloom-housing/shared-helpers/src/utilities/brandRadius"
import {
  fontFamilyOnly,
  fontStack,
  googleFontUrlOnly,
} from "@bloom-housing/shared-helpers/src/utilities/brandFont"
import { fetchJurisdictionByName } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

// The family is interpolated into the style block, so it is held to letters, digits, spaces and
// hyphens.

type BrandRamp = Partial<BrandRampDTO>

interface BrandDocumentProps {
  primary: BrandRamp | null
  secondary: BrandRamp | null
  faviconUrl: string | null
  fontFamily: string | null
  headingFontFamily: string | null
  fontUrl: string | null
  serifFontFamily: string | null
  buttonRadius: BrandRadiusEnum | null
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

const rampVariables = (namespace: string, name: string, ramp: BrandRamp) =>
  rampShades
    .filter((shade) => ramp[shade])
    .map(
      (shade) =>
        `--${namespace}-color-${name}${shade === "base" ? "" : `-${shade}`}: ${ramp[shade]};`
    )
    .join("\n")

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
    secondary ? rampVariables("seeds", "secondary", secondary) : "",
    primary ? rampVariables("bloom", "primary", primary) : "",
    fontFamily ? `--seeds-font-sans: ${fontStack(fontFamily, "sans")};` : "",
    headingFont ? `--seeds-font-alt-sans: ${fontStack(headingFont, "alt-sans")};` : "",
    serifFontFamily ? `--seeds-font-serif: ${fontStack(serifFontFamily, "serif")};` : "",
    buttonRadius ? `--brand-button-radius: ${radiusVariable(buttonRadius)};` : "",
  ]
    .filter(Boolean)
    .join("\n")

  // Doubled selector: ui-seeds sets these same tokens in a stylesheet that loads after this
  // block, and a single :root would lose the tie on document order.
  return rootVariables ? `:root:root {\n${rootVariables}\n}` : ""
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
    const storedFontUrl = googleFontUrlOnly(brand?.fontUrl)
    const fontFamily = storedFontUrl ? fontFamilyOnly(brand?.fontFamily) : null
    const headingFontFamily = storedFontUrl ? fontFamilyOnly(brand?.headingFontFamily) : null
    const serifFontFamily = storedFontUrl ? fontFamilyOnly(brand?.serifFontFamily) : null

    return {
      ...initialProps,
      primary: hexOnly(brand?.primary),
      secondary: hexOnly(brand?.secondary),
      faviconUrl: brand?.faviconUrl ?? null,
      fontFamily,
      headingFontFamily,
      serifFontFamily,
      fontUrl: fontFamily || headingFontFamily || serifFontFamily ? storedFontUrl : null,
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
