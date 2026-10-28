export const FONT_HOSTS = ["fonts.googleapis.com"]

export type FontSlot = "sans" | "alt-sans" | "serif"

// A family name is interpolated into a style block, so it is held to letters, digits, spaces and
// hyphens. Mirrors FONT_FAMILY in api/src/dtos/jurisdictions/brand.dto.ts.
export const FONT_FAMILY = /^[A-Za-z0-9](?:[A-Za-z0-9 -]{0,62}[A-Za-z0-9])?$/

export const fontFamilyOnly = (value?: string): string | null =>
  typeof value === "string" && FONT_FAMILY.test(value) ? value : null

// A stored url is only ever requested when it is a plain google fonts url. A brand cannot point
// a page at another host.
export const googleFontUrlOnly = (value?: string): string | null => {
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

// --brand-font-fallback-* is defined in overrides.scss. A missing custom property makes the whole
// font-family declaration invalid, so sans-serif or serif is included as a last resort.
export const fontStack = (family: string, slot: FontSlot): string =>
  `"${family}", var(--brand-font-fallback-${slot}, ${slot === "serif" ? "serif" : "sans-serif"})`
