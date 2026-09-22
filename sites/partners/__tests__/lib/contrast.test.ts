import {
  AA_RATIO,
  contrastWithWhite,
  isTooDark,
  meetsAA,
  relativeLuminance,
  suggestAccessible,
} from "../../src/lib/contrast"

// The expected values come from the WCAG 2.2 definitions, not from this implementation.
describe("relativeLuminance", () => {
  it.each([
    ["#FFFFFF", 1],
    ["#000000", 0],
    // 0.2126 * 1 for pure red, since the other two channels are zero.
    ["#FF0000", 0.2126],
    ["#00FF00", 0.7152],
    ["#0000FF", 0.0722],
  ])("computes %s", (hex, expected) => {
    expect(relativeLuminance(hex)).toBeCloseTo(expected, 4)
  })

  it("expands a three digit hex", () => {
    expect(relativeLuminance("#FFF")).toEqual(relativeLuminance("#FFFFFF"))
  })
})

describe("contrastWithWhite", () => {
  it("is 21 for black, the maximum the formula allows", () => {
    expect(contrastWithWhite("#000000")).toBeCloseTo(21, 2)
  })

  it("is 1 for white against itself", () => {
    expect(contrastWithWhite("#FFFFFF")).toBeCloseTo(1, 2)
  })

  // #767676 is the WCAG documented boundary: the lightest gray that still clears 4.5:1 on white.
  it("puts the documented boundary gray just over AA", () => {
    expect(contrastWithWhite("#767676")).toBeGreaterThanOrEqual(AA_RATIO)
    expect(contrastWithWhite("#777777")).toBeLessThan(AA_RATIO)
  })
})

describe("meetsAA", () => {
  it.each(["#000000", "#767676", "#773E98", "#0000FF"])("accepts %s", (hex) => {
    expect(meetsAA(hex)).toBe(true)
  })

  it.each(["#FFFFFF", "#EEDD00", "#77AA33"])("refuses %s", (hex) => {
    expect(meetsAA(hex)).toBe(false)
  })
})

describe("isTooDark", () => {
  it("flags a base whose derived dark shades would be indistinguishable", () => {
    expect(isTooDark("#111111")).toBe(true)
  })

  it("leaves a usable dark color alone", () => {
    expect(isTooDark("#773E98")).toBe(false)
  })
})

describe("suggestAccessible", () => {
  it("returns nothing for a color that already passes", () => {
    expect(suggestAccessible("#773E98")).toBeNull()
  })

  it("returns nothing for a value that is not a hex color", () => {
    expect(suggestAccessible("rebeccapurple")).toBeNull()
    expect(suggestAccessible("")).toBeNull()
  })

  it.each(["#EEDD00", "#77AA33", "#FF0000", "#00FF00"])(
    "suggests a passing color for %s",
    (hex) => {
      const suggestion = suggestAccessible(hex)

      expect(suggestion).not.toBeNull()
      expect(meetsAA(suggestion)).toBe(true)
    }
  )

  it("keeps the hue the admin chose", () => {
    // #EEDD00 is yellow; the suggestion should be a darker yellow rather than a different color.
    const suggestion = suggestAccessible("#EEDD00")

    expect(contrastWithWhite(suggestion)).toBeGreaterThanOrEqual(AA_RATIO)
    expect(suggestion.slice(1, 3) > suggestion.slice(5, 7)).toBe(true)
  })

  it("suggests the darkest possible value when nothing lighter passes", () => {
    expect(suggestAccessible("#FFFFFF")).not.toBeNull()
  })
})
