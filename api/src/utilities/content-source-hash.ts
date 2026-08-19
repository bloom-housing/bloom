// Records what a translated content field was translated from, so a later change to the English
// value can be flagged in the editor.
//
// Translations store this per row in a `sourceHash` column. Content documents are nested JSON, so
// the hash lives beside the value it describes: each object gains a `_sourceHashes` map of field
// name to hash.

import { sourceHash } from './translation-source-hash';

const HASHES = '_sourceHashes';

const STRUCTURAL_FIELDS = new Set(['id', 'href', 'logoSrc', 'logoUrl']);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIdList = (value: unknown): value is Record<string, unknown>[] =>
  Array.isArray(value) &&
  value.some((item) => isPlainObject(item) && 'id' in item);

const isTranslatable = (field: string) =>
  !field.startsWith('_') && !STRUCTURAL_FIELDS.has(field);

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
  if (!isPlainObject(english) || !isPlainObject(language)) {
    return;
  }

  for (const [field, languageValue] of Object.entries(language)) {
    if (!isTranslatable(field)) {
      continue;
    }
    const englishValue = english[field];
    const fieldPath = path ? `${path}.${field}` : field;

    if (isIdList(languageValue) && isIdList(englishValue)) {
      const englishItems = byId(englishValue);
      for (const item of languageValue) {
        const match = item.id == null ? undefined : englishItems.get(item.id);
        if (match) {
          walkPairs(match, item, visit, `${fieldPath}[${String(item.id)}]`);
        }
      }
      continue;
    }

    if (isPlainObject(languageValue) && isPlainObject(englishValue)) {
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
export const stampSourceHashes = <T>(english: unknown, language: T): T => {
  if (!isPlainObject(language)) {
    return language;
  }

  const stamped = JSON.parse(JSON.stringify(language)) as T;
  walkPairs(english, stamped, (languageObject, field, englishValue) => {
    const hash = hashOf(englishValue);
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
