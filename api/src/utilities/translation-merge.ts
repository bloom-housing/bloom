export interface TranslationRow {
  key: string;
  value: string;
}

// Flattens grouped translation rows into a key/value map. Groups are applied in order,
// so a later group's key overrides an earlier one (low-to-high precedence).
export function flattenTranslationRows(
  groups: TranslationRow[][],
): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const group of groups) {
    for (const row of group) {
      flat[row.key] = row.value;
    }
  }
  return flat;
}
