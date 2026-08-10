import { TranslationOrigin } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  applyConflictChoices,
  applyEdit,
  buildConflicts,
  buildEdits,
  buildTranslationRows,
  conflictKeysFrom,
  editsForKeys,
  effectiveValue,
  isChanged,
  keysThatHideSections,
  validateEdits,
  validateValue,
  withPendingEdits,
} from "../../src/lib/translationEditor"

const override = (key: string, value: string, extra = {}) => ({
  key,
  value,
  updatedAt: new Date("2026-01-01"),
  origin: TranslationOrigin.human,
  stale: false,
  ...extra,
})

const edit = (value: string, version: Date | null = null) => ({ value, version })

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
    expect(buildEdits({ "a.key": edit("New", editedAt) })).toEqual([
      { key: "a.key", value: "New", lastUpdatedAt: editedAt },
    ])
  })

  it("omits the lock for a key that had no override when it was edited", () => {
    expect(buildEdits({ "a.key": edit("New") })).toEqual([{ key: "a.key", value: "New" }])
  })

  it("builds one edit per changed key and leaves the rest out", () => {
    expect(
      buildEdits({ "a.one": edit("Uno", editedAt), "c.three": edit("Tres") }).map(
        (built) => built.key
      )
    ).toEqual(["a.one", "c.three"])
  })

  it("keeps an empty value, which is how a section is hidden", () => {
    expect(buildEdits({ "a.key": edit("") })).toEqual([{ key: "a.key", value: "" }])
  })

  it("locks against the captured version rather than a later one", () => {
    // A save or revert refetches the rows, so by save time the stored row may hold a newer
    // updatedAt. Sending that would overwrite the other admin instead of conflicting.
    const [built] = buildEdits({ "a.key": edit("New", editedAt) })
    expect(built.lastUpdatedAt).toEqual(editedAt)
  })
})

describe("withPendingEdits", () => {
  const rows = () =>
    buildTranslationRows({
      englishBase: { "a.one": "One", "b.two": "Two" },
      overrides: [override("a.one", "Override one")],
    })

  it("attaches the pending value to its row", () => {
    const [first, second] = withPendingEdits(rows(), { "a.one": edit("Typed") })
    expect(first.editedValue).toEqual("Typed")
    expect(second.editedValue).toBeNull()
  })

  it("attaches an empty pending value, which is how a section is hidden", () => {
    expect(withPendingEdits(rows(), { "a.one": edit("") })[0].editedValue).toEqual("")
  })

  it("gives every row a null value when nothing is pending", () => {
    expect(withPendingEdits(rows(), {}).map((row) => row.editedValue)).toEqual([null, null])
  })

  it("keeps the rest of the row intact", () => {
    expect(withPendingEdits(rows(), { "a.one": edit("Typed") })[0]).toMatchObject({
      key: "a.one",
      baseValue: "One",
      overrideValue: "Override one",
      hasBase: true,
    })
  })

  it("ignores a pending edit whose key is not on this page", () => {
    expect(withPendingEdits(rows(), { "z.elsewhere": edit("Typed") })).toHaveLength(2)
  })
})

describe("applyEdit", () => {
  const overriddenRow = () =>
    buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [override("a.key", "Override")],
    })[0]

  const plainRow = () =>
    buildTranslationRows({ englishBase: { "a.key": "Base" }, overrides: [] })[0]

  it("records the entered value against the version the row holds", () => {
    expect(applyEdit({}, overriddenRow(), "New")).toEqual({
      "a.key": { value: "New", version: new Date("2026-01-01") },
    })
  })

  it("captures no version for a key that has no override to lock against", () => {
    expect(applyEdit({}, plainRow(), "New")).toEqual({ "a.key": { value: "New", version: null } })
  })

  it("drops the entry when the value returns to what the site renders", () => {
    const edits = applyEdit({}, overriddenRow(), "New")
    expect(applyEdit(edits, overriddenRow(), "Override")).toEqual({})
  })

  it("keeps the version captured on the first edit through later ones", () => {
    const firstEdit = new Date("2025-06-01")
    expect(applyEdit({ "a.key": edit("First", firstEdit) }, overriddenRow(), "Second")).toEqual({
      "a.key": { value: "Second", version: firstEdit },
    })
  })

  it("keeps a captured absent version absent, rather than adopting the row's", () => {
    // The key had no override when it was first edited, so the save must still attempt a create.
    expect(applyEdit({ "a.key": edit("First") }, overriddenRow(), "Second")).toEqual({
      "a.key": { value: "Second", version: null },
    })
  })

  it("treats emptying a key that renders something as a change", () => {
    expect(applyEdit({}, overriddenRow(), "")).toEqual({
      "a.key": { value: "", version: new Date("2026-01-01") },
    })
  })

  it("leaves other keys alone", () => {
    expect(
      Object.keys(applyEdit({ "b.other": edit("Kept") }, overriddenRow(), "New")).sort()
    ).toEqual(["a.key", "b.other"])
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

describe("buildConflicts", () => {
  const rows = () =>
    buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [override("a.key", "Theirs")],
    })

  it("pairs the pending value with what the key holds now", () => {
    expect(buildConflicts(["a.key"], { "a.key": edit("Mine") }, rows())).toEqual([
      { key: "a.key", mine: "Mine", theirs: "Theirs" },
    ])
  })

  it("falls the stored value back to the base when there is no override", () => {
    const withoutOverride = buildTranslationRows({
      englishBase: { "a.key": "Base" },
      overrides: [],
    })
    expect(buildConflicts(["a.key"], { "a.key": edit("Mine") }, withoutOverride)[0].theirs).toEqual(
      "Base"
    )
  })

  it("uses empty strings for a named key with no row and no pending edit", () => {
    expect(buildConflicts(["gone.key"], {}, rows())).toEqual([
      { key: "gone.key", mine: "", theirs: "" },
    ])
  })

  it("returns one entry per named key, in the order given", () => {
    const many = buildTranslationRows({
      englishBase: { "a.one": "1", "b.two": "2" },
      overrides: [],
    })
    expect(
      buildConflicts(["b.two", "a.one"], { "a.one": edit("x"), "b.two": edit("y") }, many).map(
        (conflict) => conflict.key
      )
    ).toEqual(["b.two", "a.one"])
  })

  it("returns nothing when no keys conflicted", () => {
    expect(buildConflicts([], { "a.key": edit("Mine") }, rows())).toEqual([])
  })
})

describe("applyConflictChoices", () => {
  const rows = () =>
    buildTranslationRows({
      englishBase: { "a.one": "1", "b.two": "2" },
      overrides: [
        override("a.one", "Theirs one", { updatedAt: new Date("2026-05-05") }),
        override("b.two", "Theirs two", { updatedAt: new Date("2026-06-06") }),
      ],
    })

  const edits = () => ({
    "a.one": edit("Mine one", new Date("2026-01-01")),
    "b.two": edit("Mine two", new Date("2026-01-01")),
  })

  it("keeps the edits resolved as mine and drops the ones resolved as theirs", () => {
    expect(
      Object.keys(applyConflictChoices(edits(), { "a.one": "mine", "b.two": "theirs" }, rows()))
    ).toEqual(["a.one"])
  })

  it("re-locks a kept edit against the version its row holds now", () => {
    const kept = applyConflictChoices(edits(), { "a.one": "mine", "b.two": "theirs" }, rows())
    expect(kept["a.one"]).toEqual({ value: "Mine one", version: new Date("2026-05-05") })
  })

  it("returns nothing when every key is resolved as theirs", () => {
    expect(applyConflictChoices(edits(), { "a.one": "theirs", "b.two": "theirs" }, rows())).toEqual(
      {}
    )
  })

  it("keeps an edit with no recorded choice, so a dismissal never discards typed work", () => {
    expect(Object.keys(applyConflictChoices(edits(), {}, rows()))).toEqual(["a.one", "b.two"])
  })

  it("locks against nothing when a kept key no longer has a row", () => {
    expect(applyConflictChoices({ "gone.key": edit("Mine", new Date("2026-01-01")) }, {}, rows())) //
      .toEqual({ "gone.key": { value: "Mine", version: null } })
  })
})

describe("editsForKeys", () => {
  it("keeps only the named keys, which are the ones still unresolved", () => {
    expect(
      editsForKeys({ "a.one": edit("1"), "b.two": edit("2"), "c.three": edit("3") }, ["b.two"])
    ).toEqual({ "b.two": edit("2") })
  })

  it("ignores a named key that has no pending edit", () => {
    expect(editsForKeys({ "a.one": edit("1") }, ["a.one", "gone.key"])).toEqual({
      "a.one": edit("1"),
    })
  })

  it("returns nothing when no keys are named, which is the fully saved case", () => {
    expect(editsForKeys({ "a.one": edit("1") }, [])).toEqual({})
  })

  it("keeps an empty edited value", () => {
    expect(editsForKeys({ "a.one": edit("") }, ["a.one"])).toEqual({ "a.one": edit("") })
  })

  it("keeps the value and its version together", () => {
    const editedAt = new Date("2026-01-01")
    expect(editsForKeys({ "a.one": edit("1", editedAt) }, ["a.one"])["a.one"].version).toEqual(
      editedAt
    )
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
      validateEdits(
        { "a.ok": edit("Hola %{name}"), "b.broken": edit("Adios"), "c.plain": edit("Simple") },
        rows
      ).map((issue) => issue.key)
    ).toEqual(["b.broken"])
  })

  it("ignores an edited key with no matching row", () => {
    expect(validateEdits({ "gone.key": edit("") }, [])).toEqual([])
  })
})

describe("keysThatHideSections", () => {
  const rows = () =>
    buildTranslationRows({
      englishBase: { "has.base": "Shown" },
      overrides: [override("no.base", "Optional content")],
    })

  it("names a key with no base being emptied", () => {
    expect(keysThatHideSections({ "no.base": edit("") }, rows())).toEqual(["no.base"])
  })

  it("treats a whitespace-only value as empty", () => {
    expect(keysThatHideSections({ "no.base": edit("   ") }, rows())).toEqual(["no.base"])
  })

  it("ignores a key with no base that is being given a value", () => {
    expect(keysThatHideSections({ "no.base": edit("Something") }, rows())).toEqual([])
  })

  it("ignores an emptied key that has a base to fall back to", () => {
    expect(keysThatHideSections({ "has.base": edit("") }, rows())).toEqual([])
  })
})
