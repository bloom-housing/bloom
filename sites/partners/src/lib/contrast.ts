import {
  hexToHsl,
  hslToHex,
  HEX_COLOR,
} from "@bloom-housing/shared-helpers/src/utilities/brandRamp"

// ui-seeds puts white text on a primary background, so white is what a brand color is read against.
const WHITE_LUMINANCE = 1
export const AA_RATIO = 4.5

// Below this lightness the four derived shades stop being distinguishable from each other.
export const MIN_LIGHTNESS = 20

const channel = (value: number): number => {
  const fraction = value / 255
  return fraction <= 0.03928 ? fraction / 12.92 : Math.pow((fraction + 0.055) / 1.055, 2.4)
}

const expand = (hex: string): string =>
  hex.length === 4
    ? `#${hex
        .slice(1)
        .split("")
        .map((digit) => digit + digit)
        .join("")}`
    : hex

/* https://www.w3.org/TR/WCAG22/#dfn-relative-luminance */
export const relativeLuminance = (hex: string): number => {
  const value = expand(hex).slice(1)
  const [r, g, b] = [0, 2, 4].map((start) => channel(parseInt(value.slice(start, start + 2), 16)))

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/* https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio */
export const contrastWithWhite = (hex: string): number =>
  (WHITE_LUMINANCE + 0.05) / (relativeLuminance(hex) + 0.05)

export const meetsAA = (hex: string): boolean => contrastWithWhite(hex) >= AA_RATIO

export const isTooDark = (hex: string): boolean => hexToHsl(hex).l < MIN_LIGHTNESS

/*
  Admins edit the base and the other shades derive from it, so a suggestion must be a value
  that works as a base. Lowering lightness at the same hue raises contrast against white, and pure
  black always clears AA.
*/
export const suggestAccessible = (hex: string): string | null => {
  if (!HEX_COLOR.test(hex) || meetsAA(hex)) return null

  const { h, s, l } = hexToHsl(hex)
  for (let lightness = Math.floor(l) - 1; lightness >= 0; lightness -= 1) {
    const candidate = hslToHex({ h, s, l: lightness })
    if (meetsAA(candidate)) return candidate
  }

  return "#000000"
}
