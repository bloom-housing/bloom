// Example: yarn translations:migrate --jurisdiction "Bloomington" --commit

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  LanguagesEnum,
  Prisma,
  SiteEnum,
  TranslationOrigin,
} from '@prisma/client';
import { PrismaService } from '../src/services/prisma.service';
import { sourceHash } from '../src/utilities/translation-source-hash';
import { flattenTranslationTree } from './generate-db-translation-sql';

dotenv.config({ quiet: true });

const ENGLISH_FILE = 'general.json';

const PUBLIC_OVERRIDES_DIR = path.join(
  '..',
  'sites',
  'public',
  'page_content',
  'locale_overrides',
);
const PARTNERS_OVERRIDES_DIR = path.join(
  '..',
  'sites',
  'partners',
  'page_content',
  'overrides',
);

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

export type ExistingRow = Scope & {
  key: string;
  value: string;
  sourceHash: string | null;
};

export type RowDiff = {
  create: DesiredRow[];
  update: DesiredRow[];
  unchanged: number;
  skipped: number;
};

export type CliOptions = {
  jurisdiction?: string;
  commit: boolean;
  languages?: LanguagesEnum[];
  skipExisting: boolean;
};

const LANGUAGES = Object.values(LanguagesEnum);

export const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = { commit: false, skipExisting: false };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '--jurisdiction') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(
          'Missing value for --jurisdiction. Example: --jurisdiction "Bloomington"',
        );
      }
      options.jurisdiction = value;
      index++;
      continue;
    }

    if (arg === '--languages') {
      const raw = argv[index + 1] || '';
      const languages = raw
        .split(',')
        .map((language) => language.trim())
        .filter(Boolean);
      languages.forEach((language) => {
        if (!LANGUAGES.includes(language as LanguagesEnum)) {
          throw new Error(`Unsupported language code: ${language}`);
        }
      });
      options.languages = languages as LanguagesEnum[];
      index++;
      continue;
    }

    if (arg === '--commit') {
      options.commit = true;
      continue;
    }

    if (arg === '--skip-existing') {
      options.skipExisting = true;
      continue;
    }
  }

  return options;
};

export const flattenToKeyValues = (
  tree: Record<string, unknown>,
): Array<{ key: string; value: string }> =>
  flattenTranslationTree(tree as never).map((entry) => ({
    key: entry.path.join('.'),
    value: entry.en,
  }));

export const buildBlobRows = (
  blobs: Array<{
    jurisdictionId: string | null;
    language: LanguagesEnum;
    translations: unknown;
  }>,
): DesiredRow[] =>
  blobs.flatMap((blob) =>
    flattenToKeyValues(
      (blob.translations ?? {}) as Record<string, unknown>,
    ).map(({ key, value }) => ({
      jurisdictionId: blob.jurisdictionId,
      language: blob.language,
      site: null,
      key,
      value,
      sourceHash: null,
    })),
  );

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
      english.get(`|${row.site ?? ''}|${row.key}`) ??
      english.get(`||${row.key}`);

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
    existing.map((row) => [scopeKey(row, row.key) + `|${row.language}`, row]),
  );

  const diff: RowDiff = { create: [], update: [], unchanged: 0, skipped: 0 };

  desired.forEach((row) => {
    const match = existingByKey.get(
      scopeKey(row, row.key) + `|${row.language}`,
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

export const formatReport = (
  sections: Array<{ label: string; diff: RowDiff }>,
  commit: boolean,
): string => {
  const lines = [
    commit ? 'Writing changes.' : 'Dry run. Re-run with --commit to write.',
    '',
  ];

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

  return lines.join('\n');
};

export const readOverrideFiles = (
  directory: string,
  languages?: LanguagesEnum[],
): Array<{
  language: LanguagesEnum;
  translations: Record<string, unknown>;
}> => {
  const resolved = path.resolve(__dirname, '..', directory);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Override directory not found: ${resolved}`);
  }

  return fs
    .readdirSync(resolved)
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({
      file,
      language:
        file === ENGLISH_FILE
          ? LanguagesEnum.en
          : (file.replace('.json', '') as LanguagesEnum),
    }))
    .filter(({ language }) => LANGUAGES.includes(language))
    .filter(
      ({ language }) =>
        !languages ||
        language === LanguagesEnum.en ||
        languages.includes(language),
    )
    .map(({ file, language }) => ({
      language,
      translations: JSON.parse(
        fs.readFileSync(path.join(resolved, file), 'utf8'),
      ) as Record<string, unknown>,
    }));
};

const scopeLabel = (site: SiteEnum | null, jurisdiction?: string) =>
  site === null
    ? 'legacy blob (email scope)'
    : `${site} overrides${
        jurisdiction ? ` for ${jurisdiction}` : ' (all jurisdictions)'
      }`;

const writeRows = async (
  client: PrismaService | Prisma.TransactionClient,
  diff: RowDiff,
) => {
  if (diff.create.length) {
    await client.translationStrings.createMany({
      data: diff.create.map((row) => ({
        jurisdictionId: row.jurisdictionId,
        language: row.language,
        site: row.site,
        key: row.key,
        value: row.value,
        sourceHash: row.sourceHash,
        origin: TranslationOrigin.human,
      })),
    });
  }

  for (const row of diff.update) {
    // updateMany: the unique index is NULLS NOT DISTINCT, which Prisma's compound
    // unique input cannot express for a null jurisdictionId or site.
    await client.translationStrings.updateMany({
      where: {
        jurisdictionId: row.jurisdictionId,
        language: row.language,
        site: row.site,
        key: row.key,
      },
      data: { value: row.value, sourceHash: row.sourceHash },
    });
  }
};

const existingFor = async (
  prisma: PrismaService,
  where: { jurisdictionId: string | null; site: SiteEnum | null },
): Promise<ExistingRow[]> =>
  prisma.translationStrings.findMany({
    where,
    select: {
      jurisdictionId: true,
      language: true,
      site: true,
      key: true,
      value: true,
      sourceHash: true,
    },
  });

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const prisma = new PrismaService();
  const sections: Array<{ label: string; diff: RowDiff }> = [];

  try {
    const blobs = await prisma.translations.findMany({
      select: { jurisdictionId: true, language: true, translations: true },
    });
    const blobRows = withSourceHashes(buildBlobRows(blobs));
    const blobScopes = [...new Set(blobRows.map((row) => row.jurisdictionId))];
    const existingBlobRows = (
      await Promise.all(
        blobScopes.map((jurisdictionId) =>
          existingFor(prisma, { jurisdictionId, site: null }),
        ),
      )
    ).flat();
    const blobDiff = diffRows(existingBlobRows, blobRows, options.skipExisting);
    sections.push({ label: scopeLabel(null), diff: blobDiff });

    const partnersRows = withSourceHashes(
      buildOverrideRows({
        files: readOverrideFiles(PARTNERS_OVERRIDES_DIR, options.languages),
        jurisdictionId: null,
        site: SiteEnum.partners,
      }),
    );
    const partnersDiff = diffRows(
      await existingFor(prisma, {
        jurisdictionId: null,
        site: SiteEnum.partners,
      }),
      partnersRows,
      options.skipExisting,
    );
    sections.push({
      label: scopeLabel(SiteEnum.partners),
      diff: partnersDiff,
    });

    let publicDiff: RowDiff | null = null;
    if (options.jurisdiction) {
      const jurisdiction = await prisma.jurisdictions.findFirst({
        where: { name: options.jurisdiction },
        select: { id: true },
      });
      if (!jurisdiction) {
        throw new Error(`Jurisdiction not found: ${options.jurisdiction}`);
      }

      const publicRows = withSourceHashes(
        buildOverrideRows({
          files: readOverrideFiles(PUBLIC_OVERRIDES_DIR, options.languages),
          jurisdictionId: jurisdiction.id,
          site: SiteEnum.public,
        }),
      );
      publicDiff = diffRows(
        await existingFor(prisma, {
          jurisdictionId: jurisdiction.id,
          site: SiteEnum.public,
        }),
        publicRows,
        options.skipExisting,
      );
      sections.push({
        label: scopeLabel(SiteEnum.public, options.jurisdiction),
        diff: publicDiff,
      });
    } else {
      console.warn(
        'No --jurisdiction given, so the public overrides are not migrated.',
      );
    }

    console.log(formatReport(sections, options.commit));

    if (options.commit) {
      await prisma.$transaction((tx) => writeRows(tx, blobDiff));
      await writeRows(prisma, partnersDiff);
      if (publicDiff) {
        await writeRows(prisma, publicDiff);
      }
      console.log('\nDone.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void main();
}
