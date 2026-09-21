import {
  BrandRadiusEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  brandErrorsFrom,
  brandFromValues,
  brandToFormValues,
  brandUpdateFrom,
  derivedShades,
  hasBrandValues,
} from "../../src/lib/branding"

const jurisdictionWith = (brand: unknown) => ({ brand } as unknown as Jurisdiction)

const valuesWith = (overrides = {}) => ({
  ...brandToFormValues(undefined),
  ...overrides,
})

describe("brandToFormValues", () => {
  it("blanks a shade the base already derives to, so it keeps deriving", () => {
    // What a read returns: completeRamp fills every shade whether stored or not.
    const values = brandToFormValues(
      jurisdictionWith({
        primary: {
          base: "#773E98",
          dark: "#693786",
          darker: "#4C2861",
          light: "#EFE6F5",
          lighter: "#F8F4FB",
        },
      })
    )

    expect(values.primaryBase).toEqual("#773E98")
    expect(values.primaryDark).toEqual("")
    expect(values.primaryDarker).toEqual("")
    expect(values.primaryLight).toEqual("")
    expect(values.primaryLighter).toEqual("")
  })

  it("keeps a shade the admin set explicitly", () => {
    const values = brandToFormValues(
      jurisdictionWith({ primary: { base: "#773E98", dark: "#6E2598" } })
    )

    expect(values.primaryDark).toEqual("#6E2598")
  })

  it("reads the fonts and the radius", () => {
    const values = brandToFormValues(
      jurisdictionWith({
        primary: { base: "#773E98" },
        fontFamily: "Inter",
        serifFontFamily: "Noto Serif",
        buttonRadius: BrandRadiusEnum["3xl"],
      })
    )

    expect(values.fontFamily).toEqual("Inter")
    expect(values.serifFontFamily).toEqual("Noto Serif")
    expect(values.buttonRadius).toEqual("3xl")
  })

  it("returns empty fields for a jurisdiction with no brand", () => {
    expect(brandToFormValues(jurisdictionWith(null)).primaryBase).toEqual("")
    expect(brandToFormValues(undefined).fontFamily).toEqual("")
  })
})

describe("brandFromValues", () => {
  it("round trips a derived ramp back to a base only", () => {
    const stored = {
      primary: {
        base: "#773E98",
        dark: "#693786",
        darker: "#4C2861",
        light: "#EFE6F5",
        lighter: "#F8F4FB",
      },
    }

    expect(brandFromValues(brandToFormValues(jurisdictionWith(stored)))).toEqual({
      primary: { base: "#773E98" },
    })
  })

  it("sends only the shades that were set", () => {
    const brand = brandFromValues(valuesWith({ primaryBase: "#773E98", primaryDark: "#6E2598" }))

    expect(brand.primary).toEqual({ base: "#773E98", dark: "#6E2598" })
  })

  it("omits a secondary with no base", () => {
    const brand = brandFromValues(valuesWith({ primaryBase: "#773E98", secondaryDark: "#123456" }))

    expect(brand.secondary).toBeUndefined()
  })

  it("trims what the admin typed", () => {
    const brand = brandFromValues(valuesWith({ primaryBase: " #773E98 ", fontFamily: " Inter " }))

    expect(brand.primary.base).toEqual("#773E98")
    expect(brand.fontFamily).toEqual("Inter")
  })

  it("omits the brand entirely when nothing is set", () => {
    expect(brandFromValues(valuesWith())).toBeUndefined()
  })
})

describe("brandUpdateFrom", () => {
  it("omits the brand for a logo-only save, since a logo needs no colors", () => {
    const update = brandUpdateFrom(valuesWith(), { logoFileId: "dev/logo.png" })

    expect(update.brand).toBeUndefined()
    expect(update.logoFileId).toEqual("dev/logo.png")
  })

  it("leaves an asset out when it did not change", () => {
    const update = brandUpdateFrom(valuesWith({ primaryBase: "#773E98" }), {})

    expect("logoFileId" in update).toBe(false)
    expect("faviconFileId" in update).toBe(false)
  })

  it("clears everything when the remove action asks it to", () => {
    // The admin chose Remove branding, so the stored values are irrelevant to what is sent.
    const update = brandUpdateFrom(valuesWith({ primaryBase: "#773E98" }), { clearBrand: true })

    expect(update).toEqual({ brand: null, logoFileId: null, faviconFileId: null })
  })

  it("changes nothing when every field is emptied, since clearing is its own action", () => {
    const update = brandUpdateFrom(valuesWith(), {})

    expect(update.brand).toBeUndefined()
    expect(JSON.stringify(update)).toEqual("{}")
  })

  it("sends null to disconnect an asset", () => {
    expect(brandUpdateFrom(valuesWith(), { logoFileId: null }).logoFileId).toBeNull()
  })
})

describe("hasBrandValues", () => {
  it("counts a radius on its own", () => {
    expect(hasBrandValues(valuesWith({ buttonRadius: "3xl" }))).toBe(true)
  })

  it("is false for untouched fields", () => {
    expect(hasBrandValues(valuesWith())).toBe(false)
  })
})

describe("derivedShades", () => {
  it("returns nothing for a base that is not hex, leaving validation to report it", () => {
    expect(derivedShades("rebeccapurple")).toEqual({})
    expect(derivedShades("")).toEqual({})
  })
})

describe("brandErrorsFrom", () => {
  it("places a message that names a top level field", () => {
    const errors = brandErrorsFrom(["fontUrl must be a URL address"])

    expect(errors.fields).toEqual([{ name: "fontUrl", message: "fontUrl must be a URL address" }])
    expect(errors.unplaced).toEqual([])
  })

  it("shows a nested message whole rather than guessing its ramp", () => {
    // class-validator names the nested property, so this cannot say which ramp it came from.
    const errors = brandErrorsFrom(["base must match /^#.../ regular expression"])

    expect(errors.fields).toEqual([])
    expect(errors.unplaced).toHaveLength(1)
  })

  it("shows a message the service raised itself, which arrives as one string", () => {
    // assertFontIsAvailable throws a BadRequestException, so message is a string not an array.
    const errors = brandErrorsFrom("a brand font needs both a fontUrl and a family name")

    expect(errors.fields).toEqual([])
    expect(errors.unplaced).toEqual(["a brand font needs both a fontUrl and a family name"])
  })

  it("survives a response with no usable message", () => {
    expect(brandErrorsFrom(undefined)).toEqual({ fields: [], unplaced: [] })
    expect(brandErrorsFrom({ statusCode: 400 })).toEqual({ fields: [], unplaced: [] })
  })
})
