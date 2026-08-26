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

  it("produces no key for an empty nested object, since it holds no value to edit", () => {
    expect(flattenTranslations({ a: {}, b: { c: {} } })).toEqual({})
  })

  it("gives a dotted key and its nested equivalent the same flattened path", () => {
    // Both spellings address the same value in polyglot, so the editor shows one row either way.
    expect(flattenTranslations({ "a.b": "Dotted" })).toEqual({ "a.b": "Dotted" })
    expect(flattenTranslations({ a: { b: "Nested" } })).toEqual({ "a.b": "Nested" })
  })

  it("keeps a key named after an Object prototype member as an ordinary key", () => {
    expect(flattenTranslations({ t: { constructor: "Builder", toString: "Label" } })).toEqual({
      "t.constructor": "Builder",
      "t.toString": "Label",
    })
  })
})
