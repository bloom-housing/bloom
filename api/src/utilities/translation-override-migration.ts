import { LanguagesEnum, SiteEnum } from '@prisma/client';
import { sourceHash } from './translation-source-hash';
import { NoExecutableMarkupConstraint } from '../decorators/no-executable-markup.decorator';
import {
  MAX_KEY_LENGTH,
  MAX_VALUE_LENGTH,
} from '../dtos/translations/translation-key-edit.dto';

export type Scope = {
  jurisdictionId: string | null;
  language: LanguagesEnum;
  site: SiteEnum | null;
};

export type DesiredRow = Scope & {
  key: string;
  value: string;
  sourceHash: string | null;
};

export type ExistingRow = DesiredRow;

export type RowDiff = {
  create: DesiredRow[];
  update: DesiredRow[];
  unchanged: number;
  skipped: number;
};

export type OverrideFile = {
  language: LanguagesEnum;
  site: SiteEnum;
  url: string;
};

export const DEFAULT_REPOSITORY_URL =
  'https://raw.githubusercontent.com/bloom-housing/bloom';
export const DEFAULT_GIT_REF = 'main';
export const DEFAULT_PUBLIC_PATH = 'sites/public/page_content/locale_overrides';
export const DEFAULT_PARTNERS_PATH = 'sites/partners/page_content/overrides';

const fileFor = (language: LanguagesEnum) =>
  language === LanguagesEnum.en ? 'general.json' : `${language}.json`;

export const overrideFiles = ({
  languages,
  repositoryUrl = DEFAULT_REPOSITORY_URL,
  gitRef = DEFAULT_GIT_REF,
  publicPath = DEFAULT_PUBLIC_PATH,
  partnersPath = DEFAULT_PARTNERS_PATH,
}: {
  languages?: LanguagesEnum[];
  repositoryUrl?: string;
  gitRef?: string;
  publicPath?: string;
  partnersPath?: string;
}): OverrideFile[] => {
  const wanted = languages
    ? Array.from(new Set([LanguagesEnum.en, ...languages]))
    : Object.values(LanguagesEnum);

  return [
    { site: SiteEnum.public, path: publicPath },
    { site: SiteEnum.partners, path: partnersPath },
  ].flatMap(({ site, path }) =>
    wanted.map((language) => ({
      language,
      site,
      url: `${repositoryUrl}/${gitRef}/${path}/${fileFor(language)}`,
    })),
  );
};

export const flattenToKeyValues = (
  tree: Record<string, unknown>,
  parentPath: string[] = [],
): Array<{ key: string; value: string }> =>
  Object.entries(tree).flatMap(([key, value]) => {
    if (!key.trim()) {
      throw new Error('Translation file contains an empty key.');
    }

    const path = [...parentPath, key];

    if (typeof value === 'string') {
      return [{ key: path.join('.'), value }];
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenToKeyValues(value as Record<string, unknown>, path);
    }

    throw new Error(
      `Invalid translation value at ${path.join(
        '.',
      )}. Values must be strings or nested objects.`,
    );
  });

export const assertStorableValues = ({
  url,
  translations,
}: {
  url: string;
  translations: Record<string, unknown>;
}): void => {
  const markup = new NoExecutableMarkupConstraint();

  for (const { key, value } of flattenToKeyValues(translations)) {
    const reason =
      key.length > MAX_KEY_LENGTH
        ? `key is longer than ${MAX_KEY_LENGTH} characters`
        : value.length > MAX_VALUE_LENGTH
        ? `value is longer than ${MAX_VALUE_LENGTH} characters`
        : markup.validate(value)
        ? null
        : 'value contains executable markup';

    if (reason) {
      throw new Error(`${url} cannot be stored: ${key} ${reason}`);
    }
  }
};

export const buildOverrideRows = ({
  files,
  jurisdictionId,
  site,
}: {
  files: Array<{
    language: LanguagesEnum;
    translations: Record<string, unknown>;
  }>;
  jurisdictionId: string | null;
  site: SiteEnum;
}): DesiredRow[] =>
  files.flatMap((file) =>
    flattenToKeyValues(file.translations).map(({ key, value }) => ({
      jurisdictionId,
      language: file.language,
      site,
      key,
      value,
      sourceHash: null,
    })),
  );

const scopeKey = (row: Scope, key: string) =>
  `${row.jurisdictionId ?? ''}|${row.site ?? ''}|${key}`;

export const withSourceHashes = (rows: DesiredRow[]): DesiredRow[] => {
  const english = new Map<string, string>();
  rows
    .filter((row) => row.language === LanguagesEnum.en)
    .forEach((row) => english.set(scopeKey(row, row.key), row.value));

  return rows.map((row) => {
    if (row.language === LanguagesEnum.en) {
      return { ...row, sourceHash: null };
    }

    const source =
      english.get(scopeKey(row, row.key)) ??
      english.get(`|${row.site ?? ''}|${row.key}`);

    return {
      ...row,
      sourceHash: source === undefined ? null : sourceHash(source),
    };
  });
};

export const diffRows = (
  existing: ExistingRow[],
  desired: DesiredRow[],
  skipExisting = false,
): RowDiff => {
  const existingByKey = new Map(
    existing.map((row) => [`${scopeKey(row, row.key)}|${row.language}`, row]),
  );

  const diff: RowDiff = { create: [], update: [], unchanged: 0, skipped: 0 };

  desired.forEach((row) => {
    const match = existingByKey.get(
      `${scopeKey(row, row.key)}|${row.language}`,
    );
    if (!match) {
      diff.create.push(row);
    } else if (
      match.value !== row.value ||
      match.sourceHash !== row.sourceHash
    ) {
      if (skipExisting) {
        diff.skipped++;
      } else {
        diff.update.push(row);
      }
    } else {
      diff.unchanged++;
    }
  });

  return diff;
};

export const formatReport = ({
  sections,
  commit,
  repositoryUrl,
  gitRef,
  missing,
}: {
  sections: Array<{ label: string; diff: RowDiff }>;
  commit: boolean;
  repositoryUrl: string;
  gitRef: string;
  missing: string[];
}): string => {
  const lines = [
    commit ? 'Writing changes.' : 'Dry run. Re-run with commit: true to write.',
    `Source: ${repositoryUrl} at ${gitRef}`,
    '',
  ];

  missing.forEach((url) => lines.push(`no file at ${url}`));
  if (missing.length) {
    lines.push('');
  }

  sections.forEach(({ label, diff }) => {
    const skipped = diff.skipped ? `, ${diff.skipped} left as they are` : '';
    lines.push(
      `${label}: ${diff.create.length} to create, ${diff.update.length} to update, ${diff.unchanged} unchanged${skipped}`,
    );
    diff.create
      .slice(0, 5)
      .forEach((row) => lines.push(`  create ${row.language} ${row.key}`));
    if (diff.create.length > 5) {
      lines.push(`  ...and ${diff.create.length - 5} more`);
    }
    diff.update
      .slice(0, 5)
      .forEach((row) => lines.push(`  update ${row.language} ${row.key}`));
    if (diff.update.length > 5) {
      lines.push(`  ...and ${diff.update.length - 5} more`);
    }
  });

  if (commit && missing.length) {
    lines.push(
      '',
      `Recorded as complete with ${missing.length} file(s) missing. Delete the script_runs row to run it again once they are in place.`,
    );
  }

  return lines.join('\n');
};
