export type FlatTranslations = Record<string, string>

/**
 * Flattens a nested locale file into the dot-separated key paths polyglot addresses values by.
 * The translation editor lists every key in the base, so it needs the flattened form rather than
 * the per-path lookup `resolveObject` gives.
 *
 * Non-string leaves are stringified rather than dropped, so a malformed locale file surfaces in
 * the editor instead of losing keys silently.
 */
export const flattenTranslations = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nested: any,
  prefix = ""
): FlatTranslations => {
  const flattened: FlatTranslations = {}
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
    return flattened
  }

  for (const [key, value] of Object.entries(nested)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value, path))
    } else {
      flattened[path] = typeof value === "string" ? value : String(value)
    }
  }

  return flattened
}
