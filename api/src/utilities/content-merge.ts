// Merges JurisdictionContent documents for the public read.
//
// A language row is folded over the English default field by field: a value set in the language row
// wins, and anything the language row leaves unset falls back to the English value. Object fields
// recurse. Lists of objects with a stable `id` merge by identity (mergeListById) so partial
// item-level translation, reorders, and explicit deletions (tombstones) work; lists of primitives
// (e.g. footer.textSectionsHtml) stay positional and are replaced wholesale by the language value.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

interface IdItem {
  id?: unknown;
  _deleted?: unknown;
  [key: string]: unknown;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// A list participates in id-based merging when any element is an object carrying an `id`. Lists of
// primitives (or objects without ids) are treated positionally and replaced by the override.
const isIdList = (value: unknown): value is IdItem[] =>
  Array.isArray(value) &&
  value.some((item) => isPlainObject(item) && 'id' in item);

// Drops the tombstone flag so it never reaches the merged output the render path consumes.
const withoutTombstone = (item: Record<string, unknown>) => {
  const { _deleted, ...rest } = item;
  void _deleted;
  return rest;
};

// Correlates two lists by item id: English items keep their order, a matching language item merges
// over the English item, a tombstone (`_deleted`) drops the id, and language-only items append after
// the English-derived items.
export function mergeListById(
  englishItems: IdItem[],
  languageItems: IdItem[],
): Record<string, unknown>[] {
  const overridesById = new Map<unknown, IdItem>();
  for (const item of languageItems) {
    if (isPlainObject(item) && 'id' in item) {
      overridesById.set(item.id, item);
    }
  }

  const consumed = new Set<unknown>();
  const merged: Record<string, unknown>[] = [];

  for (const englishItem of englishItems) {
    if (!isPlainObject(englishItem) || !('id' in englishItem)) {
      continue;
    }
    const override = overridesById.get(englishItem.id);
    if (override) {
      consumed.add(englishItem.id);
      if (override._deleted) {
        continue;
      }
      merged.push(
        withoutTombstone(
          mergeValue(englishItem, override) as Record<string, unknown>,
        ),
      );
    } else {
      merged.push(withoutTombstone(englishItem));
    }
  }

  // Items added only in the language row (ids absent from English) append after the English items;
  // a tombstone for an id English never had is a no-op.
  for (const item of languageItems) {
    if (!isPlainObject(item) || !('id' in item) || consumed.has(item.id)) {
      continue;
    }
    if (item._deleted) {
      continue;
    }
    merged.push(withoutTombstone(item));
  }

  return merged;
}

// Folds one override value over one base value with the field/list rules above.
function mergeValue(base: unknown, override: unknown): unknown {
  // An unset override (including the null the sanitizer writes for an absent optional field) falls
  // back to the base value.
  if (override === undefined || override === null) {
    return base;
  }

  if (isIdList(override) || isIdList(base)) {
    return mergeListById(
      isIdList(base) ? base : [],
      isIdList(override) ? override : [],
    );
  }

  // Positional lists (primitives, or objects without ids) are replaced wholesale by the override.
  if (Array.isArray(override) || Array.isArray(base)) {
    return override;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = {};
    for (const key of new Set([
      ...Object.keys(base),
      ...Object.keys(override),
    ])) {
      // Guard against prototype pollution from a hand-edited or malformed stored document.
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      result[key] = mergeValue(base[key], override[key]);
    }
    return result;
  }

  return override;
}

export interface MergeableContent {
  footer?: Json;
  faq?: Json;
  resources?: Json;
  disclaimers?: Json;
  contact?: Json;
}

// Merges a language content document over the English default, field by field. Passing an
// undefined/empty language document returns the English content unchanged (the English-only case).
export function mergeContent(
  englishContent: MergeableContent,
  languageContent?: MergeableContent,
): MergeableContent {
  return mergeValue(
    englishContent ?? {},
    languageContent ?? {},
  ) as MergeableContent;
}
