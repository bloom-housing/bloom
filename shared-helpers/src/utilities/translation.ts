import { t } from "@bloom-housing/ui-components"

/**
 * Returns the translation for a key if it exists in the current translation file,
 * or null if it does not. Intended for content that exists in a fork but not in core,
 * where you want to conditionally render based on whether the key is defined.
 *
 * Usage:
 *   {tIfExists("fork.onlyBlock") && <Wrapper>{tIfExists("fork.onlyBlock")}</Wrapper>}
 */
export const tIfExists = (
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>
): string | null => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polyglot = (global as any).Translator?.polyglot
  if (!polyglot?.has(key)) return null
  return t(key, options) || null
}
