import {
  TranslationKeyEdit,
  TranslationOrigin,
  TranslationRawKey,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FlatTranslations } from "@bloom-housing/shared-helpers/src/utilities/flattenTranslations"

export type TranslationEditorRow = {
  key: string
  /** The value shown when no override exists: the language base, falling back to English. */
  baseValue: string | null
  /** Always the English base, for interpolation-token validation. */
  englishValue: string | null
  overrideValue: string | null
  updatedAt: Date | null
  origin: TranslationOrigin | null
  stale: boolean
  /**
   * False when no locale file supplies this key, so only an override makes it render. `tIfExists`
   * is used for keys that may not exist in every fork, so those are the keys whose presence
   * decides whether a section renders, and clearing or reverting one needs a warning.
   */
  hasBase: boolean
}

const hasKey = (source: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(source, key)

/**
 * Builds one row per key from the bundled locale files and the jurisdiction's override rows.
 *
 * The key set is the union of the two: the base supplies the keys an admin can override, and an
 * override with no base is a fork-specific key that only exists in the database.
 */
export const buildTranslationRows = ({
  englishBase,
  languageBase,
  overrides,
  englishOverrideKeys,
}: {
  englishBase: FlatTranslations
  languageBase?: FlatTranslations
  overrides: TranslationRawKey[]
  englishOverrideKeys?: Set<string>
}): TranslationEditorRow[] => {
  const overridesByKey = new Map(overrides.map((override) => [override.key, override]))
  const keys = new Set([
    ...Object.keys(englishBase),
    ...Object.keys(languageBase ?? {}),
    ...overridesByKey.keys(),
  ])

  return [...keys].sort().map((key) => {
    const override = overridesByKey.get(key)
    const englishValue = hasKey(englishBase, key) ? englishBase[key] : null
    const languageValue = languageBase && hasKey(languageBase, key) ? languageBase[key] : null
    const baseValue = languageValue ?? englishValue

    return {
      key,
      baseValue,
      englishValue,
      overrideValue: override ? override.value : null,
      updatedAt: override ? override.updatedAt : null,
      origin: override ? override.origin : null,
      stale: override ? override.stale : !!englishOverrideKeys?.has(key),
      hasBase: baseValue !== null,
    }
  })
}

// The value the public site renders: the override when one exists, otherwise the base.
export const effectiveValue = (row: TranslationEditorRow): string | null =>
  row.overrideValue ?? row.baseValue

// True when the entered value differs from what the site renders today.
export const isChanged = (row: TranslationEditorRow, value: string): boolean =>
  value !== (effectiveValue(row) ?? "")

export type PendingEdit = {
  value: string
  version: Date | null
}

export type PendingEdits = Record<string, PendingEdit>

export const buildEdits = (edits: PendingEdits): TranslationKeyEdit[] =>
  Object.entries(edits).map(([key, { value, version }]) =>
    version ? { key, value, lastUpdatedAt: version } : { key, value }
  )

export type TranslationGridRow = TranslationEditorRow & {
  editedValue: string | null
}

// Attaches each row's pending edit to the row itself.
export const withPendingEdits = (
  rows: TranslationEditorRow[],
  edits: PendingEdits
): TranslationGridRow[] =>
  rows.map((row) => ({
    ...row,
    editedValue: hasKey(edits, row.key) ? edits[row.key].value : null,
  }))

/**
 * Records an entered value against its row, or drops the entry when the value matches what the
 * site renders today.
 *
 * The version comes from the row only on the first edit of a key. Later edits keep the version
 * already captured.
 */
export const applyEdit = (
  edits: PendingEdits,
  row: TranslationEditorRow,
  value: string
): PendingEdits => {
  const next = { ...edits }

  if (!isChanged(row, value)) {
    delete next[row.key]
    return next
  }

  const version = hasKey(edits, row.key) ? edits[row.key].version : row.updatedAt
  next[row.key] = { value, version }
  return next
}

/**
 * The keys a batch save rejected because someone else changed them first.
 *
 * The API answers a partial save with a 409 naming only those keys; every other edit in the batch
 * was written. Any other failure returns an empty list.
 */
export const conflictKeysFrom = (error: unknown): string[] => {
  const response = (error as { response?: { status?: number; data?: { conflicts?: unknown } } })
    ?.response

  if (response?.status !== 409 || !Array.isArray(response.data?.conflicts)) {
    return []
  }

  return response.data.conflicts.filter((key): key is string => typeof key === "string")
}

export const rejectedValueKeys = (error: unknown, sentKeys: string[]): string[] => {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response

  if (response?.status !== 400 || !Array.isArray(response.data?.message)) {
    return []
  }

  const rejected = response.data.message
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => /^edits\.(\d+)\.value\b/.exec(entry)?.[1])
    .filter((position): position is string => position !== undefined)
    .map((position) => sentKeys[Number(position)])
    .filter((key): key is string => key !== undefined)

  return [...new Set(rejected)]
}

export type TranslationConflict = {
  key: string
  mine: string
  theirs: string
}

export type ConflictChoice = "mine" | "theirs"

// Pairs each rejected key's pending value with its row's current value, for the dialog.
export const buildConflicts = (
  conflictKeys: string[],
  edits: PendingEdits,
  rows: TranslationEditorRow[]
): TranslationConflict[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return conflictKeys.map((key) => {
    const row = rowsByKey.get(key)
    return {
      key,
      mine: hasKey(edits, key) ? edits[key].value : "",
      theirs: row ? effectiveValue(row) ?? "" : "",
    }
  })
}

// Keeps the edits resolved in the admin's favor and drops the rest.
export const applyConflictChoices = (
  edits: PendingEdits,
  choices: Record<string, ConflictChoice>,
  rows: TranslationEditorRow[]
): PendingEdits => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(edits).reduce((kept, [key, edit]) => {
    if (!hasKey(choices, key) || choices[key] !== "theirs") {
      kept[key] = { value: edit.value, version: rowsByKey.get(key)?.updatedAt ?? null }
    }
    return kept
  }, {} as PendingEdits)
}

export type TranslationIssue = {
  key: string
  missingTokens: string[]
  missingPluralForms: boolean
}

const INTERPOLATION_TOKEN = /%\{([^}]+)\}/g

const tokensIn = (value: string): Set<string> =>
  new Set(Array.from(value.matchAll(INTERPOLATION_TOKEN), (match) => match[1].trim()))

/**
 * Compares an entered value against its English source for the structure polyglot needs.
 *
 * A dropped `%{token}` renders the placeholder literally or loses the interpolated data, and a
 * dropped `||||` breaks `smart_count` pluralization. The number of plural forms is not compared,
 * because plural rules are per language: English has two forms where other languages have more.
 *
 * Returns null when the value is sound, or when the key has no English source to compare against.
 */
export const validateValue = (
  row: TranslationEditorRow,
  value: string
): TranslationIssue | null => {
  if (row.englishValue === null) return null

  const englishTokens = tokensIn(row.englishValue)
  const valueTokens = tokensIn(value)
  const missingTokens = [...englishTokens].filter((token) => !valueTokens.has(token))
  const missingPluralForms = row.englishValue.includes("||||") && !value.includes("||||")

  if (!missingTokens.length && !missingPluralForms) return null
  return { key: row.key, missingTokens, missingPluralForms }
}

// Every entered value that would break interpolation or pluralization.
export const validateEdits = (
  edits: PendingEdits,
  rows: TranslationEditorRow[]
): TranslationIssue[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(edits)
    .map(([key, { value }]) => {
      const row = rowsByKey.get(key)
      return row ? validateValue(row, value) : null
    })
    .filter((issue): issue is TranslationIssue => issue !== null)
}

/**
 * Keys whose save or revert would remove a section from the site.
 *
 * A key with no base value renders only when an override supplies it, so emptying or reverting one
 * takes its section away. A key with a base falls back instead, and nothing disappears.
 */
export const keysThatHideSections = (
  edits: PendingEdits,
  rows: TranslationEditorRow[]
): string[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(edits)
    .filter(([key, { value }]) => {
      const row = rowsByKey.get(key)
      return !!row && !row.hasBase && value.trim() === ""
    })
    .map(([key]) => key)
}

// Narrows the pending edits to the keys still unresolved, dropping the ones the save wrote.
export const editsForKeys = (edits: PendingEdits, keys: string[]): PendingEdits =>
  keys.reduce((remaining, key) => {
    if (hasKey(edits, key)) {
      remaining[key] = edits[key]
    }
    return remaining
  }, {} as PendingEdits)

// Drops the named keys and keeps the rest.
export const editsWithoutKeys = (edits: PendingEdits, keys: string[]): PendingEdits => {
  const remaining = { ...edits }
  keys.forEach((key) => delete remaining[key])
  return remaining
}
