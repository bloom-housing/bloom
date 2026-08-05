import {
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
