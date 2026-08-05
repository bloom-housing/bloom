import { TranslationOrigin } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { buildTranslationRows, effectiveValue } from "../../src/lib/translationEditor"

const override = (key: string, value: string, extra = {}) => ({
  key,
  value,
  updatedAt: new Date("2026-01-01"),
  origin: TranslationOrigin.human,
  stale: false,
  ...extra,
})

describe("buildTranslationRows", () => {
  it("returns one row per base key, sorted, with no override", () => {
    const rows = buildTranslationRows({
      englishBase: { "t.hello": "Hello", "a.first": "First" },
      overrides: [],
    })

    expect(rows.map((row) => row.key)).toEqual(["a.first", "t.hello"])
    expect(rows[1]).toMatchObject({
      baseValue: "Hello",
      englishValue: "Hello",
      overrideValue: null,
      updatedAt: null,
      origin: null,
      stale: false,
      hasBase: true,
    })
  })

  it("attaches an override to its base key", () => {
    const [row] = buildTranslationRows({
      englishBase: { "region.name": "Bloomington" },
      overrides: [override("region.name", "Springfield", { stale: true })],
    })

    expect(row).toMatchObject({
      baseValue: "Bloomington",
      overrideValue: "Springfield",
      origin: TranslationOrigin.human,
      stale: true,
      hasBase: true,
    })
  })

  it("falls the base back to English when the language file lacks the key", () => {
    const rows = buildTranslationRows({
      englishBase: { "t.hello": "Hello", "t.bye": "Goodbye" },
      languageBase: { "t.hello": "Hola" },
      overrides: [],
    })

    expect(rows.map((row) => [row.key, row.baseValue])).toEqual([
      ["t.bye", "Goodbye"],
      ["t.hello", "Hola"],
    ])
    // englishValue stays English regardless, since token validation compares against it.
    expect(rows.find((row) => row.key === "t.hello").englishValue).toEqual("Hello")
  })

  it("includes an override for a key absent from the base and marks it hasBase false", () => {
    const [row] = buildTranslationRows({
      englishBase: {},
      overrides: [override("listings.petPolicyDescription", "Pets welcome")],
    })

    expect(row).toMatchObject({
      key: "listings.petPolicyDescription",
      baseValue: null,
      englishValue: null,
      overrideValue: "Pets welcome",
      hasBase: false,
    })
  })

  it("treats an empty base value as present, since empty hides a section rather than meaning absent", () => {
    const [row] = buildTranslationRows({
      englishBase: { "account.disclaimer": "" },
      overrides: [],
    })

    expect(row.hasBase).toBe(true)
    expect(row.baseValue).toEqual("")
  })

  it("keeps an empty override distinct from having no override", () => {
    const [hidden, absent] = buildTranslationRows({
      englishBase: { "a.hidden": "Shown", "b.absent": "Shown" },
      overrides: [override("a.hidden", "")],
    })

    expect(hidden.overrideValue).toEqual("")
    expect(absent.overrideValue).toBeNull()
  })

  it("does not duplicate a key present in the base, the language file, and the overrides", () => {
    const rows = buildTranslationRows({
      englishBase: { "t.hello": "Hello" },
      languageBase: { "t.hello": "Hola" },
      overrides: [override("t.hello", "Buenos dias")],
    })

    expect(rows).toHaveLength(1)
  })
})

describe("effectiveValue", () => {
  it("prefers the override, including an empty one", () => {
    const [row] = buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [override("a.key", "")],
    })

    expect(effectiveValue(row)).toEqual("")
  })

  it("falls back to the base when there is no override", () => {
    const [row] = buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [],
    })

    expect(effectiveValue(row)).toEqual("Base")
  })
})
