import {
  completeRamp,
  expandHex,
  hexToHsl,
  hslToHex,
  HEX_COLOR,
} from "../../src/utilities/brandRamp"

// The expected values come from the api's own fixtures rather than from this copy, so the two
// files agreeing is what the test proves.
describe("completeRamp", () => {
  it.each([
    [
      "#773E98",
      {
        base: "#773E98",
        darker: "#4C2861",
        dark: "#693786",
        light: "#EFE6F5",
        lighter: "#F8F4FB",
      },
    ],
    [
      "#0077DA",
      {
        base: "#0077DA",
        darker: "#004C8C",
        dark: "#0069C0",
        light: "#DCEFFF",
        lighter: "#F0F8FF",
      },
    ],
    [
      "#222222",
      {
        base: "#222222",
        darker: "#161616",
        dark: "#1E1E1E",
        light: "#E4E4E4",
        lighter: "#F4F4F4",
      },
    ],
    [
      "#EEDD00",
      {
        base: "#EEDD00",
        darker: "#988D00",
        dark: "#D1C200",
        light: "#FFFDDE",
        lighter: "#FFFEF1",
      },
    ],
  ])("derives the four values from %s", (base, expected) => {
    expect(completeRamp({ base })).toEqual(expected)
  })

  // This vector was computed with python colorsys rather than with completeRamp, so it pins the
  // mirror to the intended deltas rather than to either implementation.
  it("matches the ramp the endpoint returns", () => {
    expect(completeRamp({ base: "#77AA33" })).toEqual({
      base: "#77AA33",
      dark: "#69962D",
      darker: "#4C6D21",
      light: "#EFF7E4",
      lighter: "#F8FCF4",
    })
  })

  it("leaves explicit values alone and derives only the absent ones", () => {
    const ramp = completeRamp({ base: "#773E98", dark: "#6E2598", lighter: "#F9F4FA" })

    expect(ramp.dark).toEqual("#6E2598")
    expect(ramp.lighter).toEqual("#F9F4FA")
    expect(ramp.darker).toEqual("#4C2861")
    expect(ramp.light).toEqual("#EFE6F5")
  })

  it("uppercases every value it returns", () => {
    const ramp = completeRamp({ base: "#77aa33", dark: "#5588cc" })

    expect(ramp.base).toEqual("#77AA33")
    expect(ramp.dark).toEqual("#5588CC")
  })

  it("handles a three digit base", () => {
    expect(completeRamp({ base: "#FFF" }).base).toEqual("#FFF")
    expect(completeRamp({ base: "#FFF" }).darker).toEqual("#A3A3A3")
  })
})

describe("hex and HSL conversions", () => {
  it.each(["#773E98", "#0077DA", "#222222", "#EEDD00"])("round trips %s", (hex) => {
    expect(hslToHex(hexToHsl(hex))).toEqual(hex)
  })
})

describe("HEX_COLOR", () => {
  it.each(["#773E98", "#FFF", "#773e98"])("accepts %s", (value) => {
    expect(HEX_COLOR.test(value)).toBe(true)
  })

  it.each(["773E98", "#GG3E98", "#773E9", "rebeccapurple"])("refuses %s", (value) => {
    expect(HEX_COLOR.test(value)).toBe(false)
  })
})

describe("expandHex", () => {
  it("doubles each digit of a three digit hex", () => {
    expect(expandHex("#ABC")).toEqual("#AABBCC")
  })

  it.each(["#773E98", "rebeccapurple", "#ABCD"])("leaves %s alone", (value) => {
    expect(expandHex(value)).toEqual(value)
  })
})

describe("hexToHsl input forms", () => {
  it.each([
    ["#ABC", "ABC"],
    ["#773E98", "773E98"],
  ])("reads %s and %s the same way", (withHash, without) => {
    expect(hexToHsl(without)).toEqual(hexToHsl(withHash))
  })
})
