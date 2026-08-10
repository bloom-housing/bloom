import { TranslationOrigin } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  buildEdits,
  buildTranslationRows,
  conflictKeysFrom,
  editsForKeys,
  effectiveValue,
  isChanged,
  keysThatHideSections,
  validateEdits,
  validateValue,
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
  const editedAt = new Date("2026-01-01")

  it("sends the version captured when the key was edited", () => {
    expect(buildEdits({ "a.key": "New" }, { "a.key": editedAt })).toEqual([
      { key: "a.key", value: "New", lastUpdatedAt: editedAt },
    ])
  })

  it("omits the lock for a key that had no override when it was edited", () => {
    expect(buildEdits({ "a.key": "New" }, { "a.key": null })).toEqual([
      { key: "a.key", value: "New" },
    ])
  })

  it("omits the lock for a key with no captured version at all", () => {
    expect(buildEdits({ "unknown.key": "New" }, {})).toEqual([{ key: "unknown.key", value: "New" }])
  })

  it("builds one edit per changed key and leaves the rest out", () => {
    expect(
      buildEdits({ "a.one": "Uno", "c.three": "Tres" }, { "a.one": editedAt }).map(
        (edit) => edit.key
      )
    ).toEqual(["a.one", "c.three"])
  })

  it("keeps an empty value, which is how a section is hidden", () => {
    expect(buildEdits({ "a.key": "" }, { "a.key": null })).toEqual([{ key: "a.key", value: "" }])
  })

  it("locks against the captured version rather than a later one", () => {
    // Rows revalidate on window focus, so by save time the stored row may carry a newer
    // updatedAt. Sending that would overwrite the other admin instead of conflicting.
    const [edit] = buildEdits({ "a.key": "New" }, { "a.key": editedAt })
    expect(edit.lastUpdatedAt).toEqual(editedAt)
  })
})

describe("conflictKeysFrom", () => {
  const conflictError = (conflicts: unknown, status = 409) => ({
    response: { status, data: { message: "translationConflict", conflicts } },
  })

  it("reads the keys a 409 names", () => {
    expect(conflictKeysFrom(conflictError(["a.one", "b.two"]))).toEqual(["a.one", "b.two"])
  })

  it("returns nothing for a non-409 response", () => {
    expect(conflictKeysFrom(conflictError(["a.one"], 400))).toEqual([])
    expect(conflictKeysFrom(conflictError(["a.one"], 500))).toEqual([])
  })

  it("returns nothing when the error has no response at all", () => {
    expect(conflictKeysFrom(new Error("network down"))).toEqual([])
    expect(conflictKeysFrom(undefined)).toEqual([])
    expect(conflictKeysFrom(null)).toEqual([])
  })

  it("returns nothing when a 409 carries no usable conflicts list", () => {
    expect(conflictKeysFrom(conflictError(undefined))).toEqual([])
    expect(conflictKeysFrom(conflictError("a.one"))).toEqual([])
  })

  it("drops non-string entries rather than passing them through", () => {
    expect(conflictKeysFrom(conflictError(["a.one", 42, null, "b.two"]))).toEqual([
      "a.one",
      "b.two",
    ])
  })
})

describe("editsForKeys", () => {
  it("keeps only the named keys, which are the ones still unresolved", () => {
    expect(editsForKeys({ "a.one": "1", "b.two": "2", "c.three": "3" }, ["b.two"])).toEqual({
      "b.two": "2",
    })
  })

  it("ignores a named key that has no pending edit", () => {
    expect(editsForKeys({ "a.one": "1" }, ["a.one", "gone.key"])).toEqual({ "a.one": "1" })
  })

  it("returns nothing when no keys are named, which is the fully saved case", () => {
    expect(editsForKeys({ "a.one": "1" }, [])).toEqual({})
  })

  it("keeps an empty edited value", () => {
    expect(editsForKeys({ "a.one": "" }, ["a.one"])).toEqual({ "a.one": "" })
  })
})

describe("validateValue", () => {
  const rowFor = (english: string) =>
    buildTranslationRows({ englishBase: { "a.key": english }, overrides: [] })[0]

  it("accepts a value that keeps every token", () => {
    expect(
      validateValue(rowFor("Hello %{name}, you have %{count}"), "Hola %{name}: %{count}")
    ).toBe(null)
  })

  it("accepts a value with no tokens when English has none", () => {
    expect(validateValue(rowFor("Hello"), "Hola")).toBe(null)
  })

  it("reports a dropped token", () => {
    expect(validateValue(rowFor("Hello %{name}"), "Hola")).toEqual({
      key: "a.key",
      missingTokens: ["name"],
      missingPluralForms: false,
    })
  })

  it("reports every dropped token, not just the first", () => {
    expect(validateValue(rowFor("%{a} and %{b} and %{c}"), "%{b}").missingTokens).toEqual([
      "a",
      "c",
    ])
  })

  it("ignores token order and repetition", () => {
    expect(validateValue(rowFor("%{a} %{b}"), "%{b} %{a} %{a}")).toBe(null)
  })

  it("reports dropped smart_count pluralization", () => {
    const row = rowFor("%{smart_count} unit |||| %{smart_count} units")
    expect(validateValue(row, "%{smart_count} unidades")).toEqual({
      key: "a.key",
      missingTokens: [],
      missingPluralForms: true,
    })
  })

  it("allows a different number of plural forms, since plural rules vary by language", () => {
    const row = rowFor("%{smart_count} unit |||| %{smart_count} units")
    expect(
      validateValue(row, "%{smart_count} form |||| %{smart_count} form |||| %{smart_count} form")
    ).toBe(null)
  })

  it("reports a dropped smart_count token and its forms together", () => {
    const row = rowFor("%{smart_count} unit |||| %{smart_count} units")
    expect(validateValue(row, "unidades")).toEqual({
      key: "a.key",
      missingTokens: ["smart_count"],
      missingPluralForms: true,
    })
  })

  it("skips validation for a key with no English source", () => {
    const [row] = buildTranslationRows({
      englishBase: {},
      overrides: [override("fork.only", "Anything")],
    })
    expect(validateValue(row, "")).toBe(null)
  })

  it("treats an emptied value as dropping the tokens it should have kept", () => {
    expect(validateValue(rowFor("Hello %{name}"), "").missingTokens).toEqual(["name"])
  })
})

describe("validateEdits", () => {
  it("reports only the entries that break, keyed for the message", () => {
    const rows = buildTranslationRows({
      englishBase: { "a.ok": "Hello %{name}", "b.broken": "Bye %{name}", "c.plain": "Plain" },
      overrides: [],
    })

    expect(
      validateEdits({ "a.ok": "Hola %{name}", "b.broken": "Adios", "c.plain": "Simple" }, rows).map(
        (issue) => issue.key
      )
    ).toEqual(["b.broken"])
  })

  it("ignores an edited key with no matching row", () => {
    expect(validateEdits({ "gone.key": "" }, [])).toEqual([])
  })
})

describe("keysThatHideSections", () => {
  const rows = () =>
    buildTranslationRows({
      englishBase: { "has.base": "Shown" },
      overrides: [override("no.base", "Optional content")],
    })

  it("names a key with no base being emptied", () => {
    expect(keysThatHideSections({ "no.base": "" }, rows())).toEqual(["no.base"])
  })

  it("treats a whitespace-only value as empty", () => {
    expect(keysThatHideSections({ "no.base": "   " }, rows())).toEqual(["no.base"])
  })

  it("ignores a key with no base that is being given a value", () => {
    expect(keysThatHideSections({ "no.base": "Something" }, rows())).toEqual([])
  })

  it("ignores an emptied key that has a base to fall back to", () => {
    expect(keysThatHideSections({ "has.base": "" }, rows())).toEqual([])
  })
})
