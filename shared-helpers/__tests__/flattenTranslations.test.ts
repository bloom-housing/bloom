import { flattenTranslations } from "../src/utilities/flattenTranslations"

describe("flattenTranslations", () => {
  it("joins nested keys with dots", () => {
    expect(
      flattenTranslations({
        t: { hello: "Hello", goodbye: "Goodbye" },
        footer: { links: { home: "Home" } },
      })
    ).toEqual({
      "t.hello": "Hello",
      "t.goodbye": "Goodbye",
      "footer.links.home": "Home",
    })
  })

  it("keeps top-level keys unprefixed", () => {
    expect(flattenTranslations({ hello: "Hello" })).toEqual({ hello: "Hello" })
  })

  it("preserves empty values, which hide a section rather than meaning absent", () => {
    expect(flattenTranslations({ account: { disclaimer: "" } })).toEqual({
      "account.disclaimer": "",
    })
  })

  it("returns an empty object for a nullish or non-object input", () => {
    expect(flattenTranslations(null)).toEqual({})
    expect(flattenTranslations(undefined)).toEqual({})
    expect(flattenTranslations("a string")).toEqual({})
    expect(flattenTranslations(["a", "b"])).toEqual({})
  })

  it("stringifies non-string leaves rather than dropping them", () => {
    expect(flattenTranslations({ a: 1, b: true, c: null, d: ["x"] })).toEqual({
      a: "1",
      b: "true",
      c: "null",
      d: "x",
    })
  })
})
