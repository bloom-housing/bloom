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
 * One unsaved edit: what the admin typed, and the version it is locked against.
 *
 * The two are one object so they cannot be updated apart. Resolving a conflict rewrites both, and
 * an edit reverted back to its original value drops both.
 */
export type PendingEdit = {
  value: string
  /** Null when the key had no override at edit time, so there is nothing to lock against. */
  version: Date | null
}

export type PendingEdits = Record<string, PendingEdit>

/**
 * Turns the pending edits into the batch the PUT takes.
 *
 * `lastUpdatedAt` is the per-key optimistic lock, and it is the version captured when the admin
 * first edited each key rather than the version the row holds now. A save or revert refetches the
 * rows, so reading the lock at save time would send whatever another admin had written in the
 * meantime and overwrite them without ever reporting a conflict.
 *
 * A key with no override when it was edited has no prior version to lock against, so no
 * `lastUpdatedAt` is sent. The API then attempts a create, which conflicts if someone has since
 * added that key.
 */
export const buildEdits = (edits: PendingEdits): TranslationKeyEdit[] =>
  Object.entries(edits).map(([key, { value, version }]) =>
    version ? { key, value, lastUpdatedAt: version } : { key, value }
  )

export type TranslationGridRow = TranslationEditorRow & {
  /** The unsaved value for this key, or null when nothing is pending. An edit may be empty. */
  editedValue: string | null
}

/**
 * Attaches each row's pending edit to the row itself.
 *
 * The grid callbacks read the edit from the row rather than closing over the edits map, so a
 * committed edit does not force ag-grid to rebuild every column definition.
 */
export const withPendingEdits = (
  rows: TranslationEditorRow[],
  edits: PendingEdits
): TranslationGridRow[] =>
  rows.map((row) => {
    const edit = edits[row.key]
    return { ...row, editedValue: edit ? edit.value : null }
  })

/**
 * Records an entered value against its row, or drops the entry when the value matches what the
 * site renders today.
 *
 * The version comes from the row only on the first edit of a key. Later edits keep the version
 * already captured, so a refetch between two edits cannot widen the lock.
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

  const existing = edits[row.key]
  next[row.key] = { value, version: existing ? existing.version : row.updatedAt }
  return next
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

export type TranslationConflict = {
  key: string
  /** What the admin typed, which the save could not write. */
  mine: string
  /** What the key holds now, after whoever changed it first. */
  theirs: string
}

export type ConflictChoice = "mine" | "theirs"

/** Pairs each rejected key's pending value with the value its row holds now, for the dialog. */
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
      mine: edits[key]?.value ?? "",
      theirs: row ? effectiveValue(row) ?? "" : "",
    }
  })
}

/**
 * Keeps the edits resolved in the admin's favor and drops the rest.
 *
 * A kept edit is re-locked against the version its row holds now. The admin has seen the other
 * write and chosen to replace it, so the retry must not conflict on the same key again. This is
 * the one place the version moves after the first edit.
 */
export const applyConflictChoices = (
  edits: PendingEdits,
  choices: Record<string, ConflictChoice>,
  rows: TranslationEditorRow[]
): PendingEdits => {
  const rowsByKey = new Map(rows.map((row) => [row.key, row]))

  return Object.entries(edits).reduce((kept, [key, edit]) => {
    if (choices[key] !== "theirs") {
      kept[key] = { value: edit.value, version: rowsByKey.get(key)?.updatedAt ?? null }
    }
    return kept
  }, {} as PendingEdits)
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

/** Narrows the pending edits to the keys still unresolved, dropping the ones the save wrote. */
export const editsForKeys = (edits: PendingEdits, keys: string[]): PendingEdits =>
  keys.reduce((remaining, key) => {
    if (key in edits) {
      remaining[key] = edits[key]
    }
    return remaining
  }, {} as PendingEdits)

/**
 * Drops the named keys and keeps the rest.
 *
 * A save clears the keys it sent rather than clearing everything, so a cell that committed while
 * the request was in flight is still pending when it returns.
 */
export const editsWithoutKeys = (edits: PendingEdits, keys: string[]): PendingEdits => {
  const remaining = { ...edits }
  keys.forEach((key) => delete remaining[key])
  return remaining
}
