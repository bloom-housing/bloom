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
   * False when the key has no English base value. `tIfExists` is used only for keys that may not
   * exist in every fork, so those keys are the ones whose presence decides whether a section
   * renders, and clearing or reverting one needs a warning.
   */
  hasBase: boolean
}

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
}: {
  englishBase: FlatTranslations
  languageBase?: FlatTranslations
  overrides: TranslationRawKey[]
}): TranslationEditorRow[] => {
  const overridesByKey = new Map(overrides.map((override) => [override.key, override]))
  const keys = new Set([
    ...Object.keys(englishBase),
    ...Object.keys(languageBase ?? {}),
    ...overridesByKey.keys(),
  ])

  return [...keys].sort().map((key) => {
    const override = overridesByKey.get(key)
    const englishValue = key in englishBase ? englishBase[key] : null
    const languageValue = languageBase && key in languageBase ? languageBase[key] : null

    return {
      key,
      baseValue: languageValue ?? englishValue,
      englishValue,
      overrideValue: override ? override.value : null,
      updatedAt: override ? override.updatedAt : null,
      origin: override ? override.origin : null,
      stale: override ? override.stale : false,
      hasBase: englishValue !== null,
    }
  })
}

/** The value the public site renders: the override when one exists, otherwise the base. */
export const effectiveValue = (row: TranslationEditorRow): string | null =>
  row.overrideValue ?? row.baseValue

/** True when the entered value differs from what the site renders today. */
export const isChanged = (row: TranslationEditorRow, value: string): boolean =>
  value !== (effectiveValue(row) ?? "")

/**
 * Turns the edited values into the batch the PUT takes.
 *
 * `lastUpdatedAt` is the per-key optimistic lock and is sent only for keys that already have an
 * override row. A key being overridden for the first time has no prior version to lock against,
 * and sending one would make the API treat it as a conflict.
 */
export const buildEdits = (
  editedValues: Record<string, string>,
  rows: TranslationEditorRow[]
): TranslationKeyEdit[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(editedValues).map(([key, value]) => {
    const updatedAt = rowsByKey.get(key)?.updatedAt
    return updatedAt ? { key, value, lastUpdatedAt: updatedAt } : { key, value }
  })
}

/**
 * The keys a batch save rejected because someone else changed them first.
 *
 * The API answers a partial save with a 409 naming only those keys; every other edit in the batch
 * was written. Any other failure returns an empty list, so the caller falls back to a plain error.
 */
export const conflictKeysFrom = (error: unknown): string[] => {
  const response = (error as { response?: { status?: number; data?: { conflicts?: unknown } } })
    ?.response

  if (response?.status !== 409 || !Array.isArray(response.data?.conflicts)) {
    return []
  }

  return response.data.conflicts.filter((key): key is string => typeof key === "string")
}

export type TranslationIssue = {
  key: string
  /** Interpolation tokens the English source has that the entered value does not. */
  missingTokens: string[]
  /** True when English pluralizes with `||||` and the entered value does not. */
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

/** Every entered value that would break interpolation or pluralization. */
export const validateEdits = (
  editedValues: Record<string, string>,
  rows: TranslationEditorRow[]
): TranslationIssue[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(editedValues)
    .map(([key, value]) => {
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
  editedValues: Record<string, string>,
  rows: TranslationEditorRow[]
): string[] => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(editedValues)
    .filter(([key, value]) => {
      const row = rowsByKey.get(key)
      return !!row && !row.hasBase && value.trim() === ""
    })
    .map(([key]) => key)
}

/** Narrows pending edits to the keys still unresolved, dropping the ones the save wrote. */
export const editsForKeys = (
  editedValues: Record<string, string>,
  keys: string[]
): Record<string, string> =>
  keys.reduce((remaining, key) => {
    if (key in editedValues) {
      remaining[key] = editedValues[key]
    }
    return remaining
  }, {} as Record<string, string>)
