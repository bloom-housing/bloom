import { TranslationOrigin } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  buildEdits,
  buildTranslationRows,
  effectiveValue,
  isChanged,
} from "../../src/lib/translationEditor"

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

describe("isChanged", () => {
  const rowFor = (base: string | null, overrides = []) =>
    buildTranslationRows({
      englishBase: base === null ? {} : { "a.key": base },
      overrides,
    })[0]

  it("compares against the override when one exists", () => {
    const row = rowFor("Base", [override("a.key", "Override")])
    expect(isChanged(row, "Override")).toBe(false)
    expect(isChanged(row, "Base")).toBe(true)
  })

  it("compares against the base when there is no override", () => {
    const row = rowFor("Base")
    expect(isChanged(row, "Base")).toBe(false)
    expect(isChanged(row, "Changed")).toBe(true)
  })

  it("treats an empty entry as a change when the key currently renders something", () => {
    expect(isChanged(rowFor("Base"), "")).toBe(true)
  })

  it("treats an empty entry as unchanged when the key renders nothing", () => {
    const row = rowFor(null, [override("a.key", "")])
    expect(isChanged(row, "")).toBe(false)
  })
})

describe("buildEdits", () => {
  it("sends the lock for a key that already has an override", () => {
    const rows = buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [override("a.key", "Override")],
    })

    expect(buildEdits({ "a.key": "New" }, rows)).toEqual([
      { key: "a.key", value: "New", lastUpdatedAt: new Date("2026-01-01") },
    ])
  })

  it("omits the lock for a key being overridden for the first time", () => {
    const rows = buildTranslationRows({ englishBase: { "a.key": "Base" }, overrides: [] })

    expect(buildEdits({ "a.key": "New" }, rows)).toEqual([{ key: "a.key", value: "New" }])
  })

  it("omits the lock for a key that is not in the row set at all", () => {
    expect(buildEdits({ "unknown.key": "New" }, [])).toEqual([{ key: "unknown.key", value: "New" }])
  })

  it("builds one edit per changed key and leaves the rest out", () => {
    const rows = buildTranslationRows({
      englishBase: { "a.one": "One", "b.two": "Two", "c.three": "Three" },
      overrides: [],
    })

    expect(buildEdits({ "a.one": "Uno", "c.three": "Tres" }, rows).map((edit) => edit.key)).toEqual(
      ["a.one", "c.three"]
    )
  })

  it("keeps an empty value, which is how a section is hidden", () => {
    const rows = buildTranslationRows({ englishBase: { "a.key": "Base" }, overrides: [] })

    expect(buildEdits({ "a.key": "" }, rows)).toEqual([{ key: "a.key", value: "" }])
  })
})
