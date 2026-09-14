// Records what a translated content field was translated from, so a later change to the English
// value can be flagged in the editor.
//
// Translations store this per row in a `sourceHash` column. Content documents are nested JSON, so
// the hash lives beside the value it describes: each object gains a `_sourceHashes` map of field
// name to hash.

import { sourceHash } from './translation-source-hash';

const HASHES = '_sourceHashes';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIdList = (value: unknown): value is Record<string, unknown>[] =>
  Array.isArray(value) &&
  value.some((item) => isPlainObject(item) && 'id' in item);

const isTranslatable = (field: string) =>
  !field.startsWith('_') && field !== 'id';

// A positional list is replaced whole by a language row, so it is hashed as one value.
const hashOf = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return sourceHash(value);
  }
  if (Array.isArray(value) && !isIdList(value)) {
    return sourceHash(JSON.stringify(value));
  }
  return null;
};

const byId = (items: Record<string, unknown>[]) => {
  const map = new Map<unknown, Record<string, unknown>>();
  for (const item of items) {
    if (isPlainObject(item) && item.id != null) {
      map.set(item.id, item);
    }
  }
  return map;
};

/**
 * Walks an English document and a language document together, visiting every field the language
 * document sets that has an English counterpart. Lists of objects are paired by id, the way
 * mergeListById pairs them for the public read.
 */
const walkPairs = (
  english: unknown,
  language: unknown,
  visit: (
    languageObject: Record<string, unknown>,
    field: string,
    englishValue: unknown,
    path: string,
  ) => void,
  path = '',
): void => {
  if (!isPlainObject(language)) {
    return;
  }
  const englishObject = isPlainObject(english) ? english : undefined;

  for (const [field, languageValue] of Object.entries(language)) {
    if (!isTranslatable(field)) {
      continue;
    }
    const englishValue = englishObject?.[field];
    const fieldPath = path ? `${path}.${field}` : field;

    const keyedById =
      Array.isArray(languageValue) &&
      (isIdList(languageValue) || isIdList(englishValue));

    if (keyedById) {
      const englishItems = isIdList(englishValue)
        ? byId(englishValue)
        : new Map<unknown, Record<string, unknown>>();
      for (const item of languageValue) {
        if (!isPlainObject(item) || item.id == null) {
          continue;
        }
        walkPairs(
          englishItems.get(item.id),
          item,
          visit,
          `${fieldPath}[${String(item.id)}]`,
        );
      }
      continue;
    }

    if (isPlainObject(languageValue)) {
      walkPairs(englishValue, languageValue, visit, fieldPath);
      continue;
    }

    visit(language, field, englishValue, fieldPath);
  }
};

/**
 * Returns the language document with each translated field's `_sourceHashes` entry set to a hash of
 * the English value it was translated from. A field with no English counterpart has no baseline and
 * is left without one.
 */
export const stampSourceHashes = <T>(
  english: unknown,
  language: T,
  stored?: unknown,
): T => {
  if (!isPlainObject(language)) {
    return language;
  }

  const priorHashes = new Map<string, unknown>();
  const priorValues = new Map<string, unknown>();
  walkPairs(english, stored, (storedObject, field, _englishValue, path) => {
    const hashes = storedObject[HASHES];
    if (isPlainObject(hashes)) {
      priorHashes.set(path, hashes[field]);
    }
    priorValues.set(path, storedObject[field]);
  });

  const stamped = JSON.parse(JSON.stringify(language)) as T;
  walkPairs(english, stamped, (languageObject, field, englishValue, path) => {
    const prior = priorHashes.get(path);
    const unchanged =
      priorValues.has(path) &&
      JSON.stringify(priorValues.get(path)) ===
        JSON.stringify(languageObject[field]);
    const hash =
      unchanged && typeof prior === 'string' ? prior : hashOf(englishValue);
    const hashes = isPlainObject(languageObject[HASHES])
      ? (languageObject[HASHES] as Record<string, unknown>)
      : {};

    if (hash === null) {
      delete hashes[field];
    } else {
      hashes[field] = hash;
    }

    if (Object.keys(hashes).length) {
      languageObject[HASHES] = hashes;
    } else {
      delete languageObject[HASHES];
    }
  });

  return stamped;
};

/**
 * Returns the paths of translated fields whose English source has changed since they were saved.
 * A field with no stored hash has no baseline.
 */
export const staleFieldPaths = (
  english: unknown,
  language: unknown,
): string[] => {
  const stale: string[] = [];

  walkPairs(english, language, (languageObject, field, englishValue, path) => {
    const hashes = languageObject[HASHES];
    if (!isPlainObject(hashes)) {
      return;
    }
    const stored = hashes[field];
    if (typeof stored !== 'string') {
      return;
    }
    if (stored !== hashOf(englishValue)) {
      stale.push(path);
    }
  });

  return stale;
};
