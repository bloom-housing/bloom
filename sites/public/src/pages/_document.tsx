import React from "react"
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document"
import {
  BrandRampDTO,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchJurisdictionByName } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

const HEX_COLOR = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

type BrandRamp = Partial<BrandRampDTO>

interface BrandDocumentProps {
  primary: BrandRamp | null
  secondary: BrandRamp | null
  faviconUrl: string | null
}

const rampShades: (keyof BrandRamp)[] = ["base", "dark", "darker", "light", "lighter"]

const hexOnly = (ramp?: BrandRamp): BrandRamp | null => {
  if (!ramp || !HEX_COLOR.test(ramp.base ?? "")) return null

  return rampShades.reduce((checked: BrandRamp, shade) => {
    if (HEX_COLOR.test(ramp[shade] ?? "")) {
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

// Exported for tests: <Html> cannot render outside Next's document context.
export const brandStyleBlock = ({ primary, secondary }: BrandDocumentProps): string => {
  if (!primary) return ""

  const variables = [
    rampVariables("seeds", "primary", primary),
    secondary ? rampVariables("seeds", "secondary", secondary) : "",
    rampVariables("bloom", "primary", primary),
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
    }
  }

  render() {
    const brandVariables = brandStyleBlock(this.props)
    const { faviconUrl } = this.props

    return (
      <Html>
        <Head>
          {brandVariables && (
            <style id="brand-vars" dangerouslySetInnerHTML={{ __html: brandVariables }} />
          )}
          {/* Nothing emitted without one, so the browser falls back to /favicon.ico */}
          {faviconUrl && <link rel="icon" href={faviconUrl} />}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
