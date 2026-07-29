// Merges JurisdictionContent documents for the public read.
//
// A language row is folded over the English default field by field: a value set in the language row
// wins, and anything the language row leaves unset falls back to the English value. Object fields
// recurse. Lists of objects with a stable `id` merge by identity (mergeListById) so partial
// item-level translation, reorders, and explicit deletions (tombstones) work; lists of primitives
// (e.g. footer.textSectionsHtml) stay positional and are fully replaced by the language value.

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

const hasId = (item: IdItem): boolean => isPlainObject(item) && item.id != null;

// Correlates two lists by item id: English items keep their order, a matching language item merges
// over the English item, a tombstone (`_deleted`) drops the id, and language-only items append after
// the English-derived items. A valid stored item always carries an id (the DTOs require it), so the
// id-less cases below only arise from a hand-edited or malformed row; they are preserved (not
// dropped) so a bad row degrades gracefully rather than losing content silently.
export function mergeListById(
  englishItems: IdItem[],
  languageItems: IdItem[],
): Record<string, unknown>[] {
  const overridesById = new Map<unknown, IdItem>();
  for (const item of languageItems) {
    if (hasId(item)) {
      overridesById.set(item.id, item);
    }
  }

  const consumed = new Set<unknown>();
  const emitted = new Set<unknown>();
  const merged: Record<string, unknown>[] = [];

  // Emits an item once (a repeated id is not duplicated) and never emits a tombstone.
  const emit = (item: IdItem) => {
    if (!isPlainObject(item) || item._deleted) {
      return;
    }
    if (item.id != null) {
      if (emitted.has(item.id)) {
        return;
      }
      emitted.add(item.id);
    }
    merged.push(withoutTombstone(item));
  };

  for (const englishItem of englishItems) {
    if (!isPlainObject(englishItem)) {
      continue;
    }
    const override = hasId(englishItem)
      ? overridesById.get(englishItem.id)
      : undefined;
    if (override) {
      consumed.add(englishItem.id);
      if (override._deleted) {
        continue;
      }
      emit(mergeValue(englishItem, override) as IdItem);
    } else {
      // No override, an id-less English item, or an id with no language match: keep as-is.
      emit(englishItem);
    }
  }

  // Language items not consumed above append after the English-derived items: ids absent from
  // English, plus any id-less additions. A tombstone for an id English never had is a no-op.
  for (const item of languageItems) {
    if (isPlainObject(item) && item.id != null && consumed.has(item.id)) {
      continue;
    }
    emit(item);
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

  // Positional lists (primitives, or objects without ids) are fully replaced by the override.
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
