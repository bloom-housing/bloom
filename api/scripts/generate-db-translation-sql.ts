// Example: yarn translations:sql --input scripts/db-translation-input.example.json --output 53_test

import { Translate } from '@google-cloud/translate/build/src/v2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ quiet: true });

type LanguageCode =
  | 'en'
  | 'es'
  | 'vi'
  | 'zh'
  | 'tl'
  | 'ar'
  | 'bn'
  | 'ko'
  | 'hy'
  | 'fa';

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

type FlattenedTranslation = {
  path: string[];
  en: string;
};

type InputPayload = TranslationTree;

type CliOptions = {
  input: string;
  output?: string;
  languages?: LanguageCode[];
  jurisdiction?: string;
  machineTranslate: boolean;
};

const DEFAULT_LANGUAGES: LanguageCode[] = [
  'en',
  'es',
  'tl',
  'vi',
  'zh',
  'ar',
  'bn',
  'ko',
  'hy',
  'fa',
];
const ALLOWED_LANGUAGES = new Set<LanguageCode>(DEFAULT_LANGUAGES);

export const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    input: '',
    machineTranslate: true,
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (arg === '--input') {
      options.input = args[index + 1] || '';
      index++;
      continue;
    }

    if (arg === '--output') {
      const outputPath = args[index + 1];
      if (!outputPath || outputPath.startsWith('--')) {
        throw new Error(
          'Missing value for --output. Example: --output 52_test or --output prisma/migrations/52_test/migration.sql',
        );
      }
      options.output = outputPath;
      index++;
      continue;
    }

    if (arg === '--languages') {
      const raw = args[index + 1] || '';
      options.languages = raw
        .split(',')
        .map((language) => language.trim())
        .filter(Boolean) as LanguageCode[];
      index++;
      continue;
    }

    if (arg === '--jurisdiction') {
      const jurisdiction = args[index + 1];
      if (!jurisdiction || jurisdiction.startsWith('--')) {
        throw new Error(
          'Missing value for --jurisdiction. Example: --jurisdiction "Bloomington"',
        );
      }
      options.jurisdiction = jurisdiction;
      index++;
      continue;
    }

    if (arg === '--no-machine-translate') {
      options.machineTranslate = false;
      continue;
    }
  }

  if (!options.input) {
    throw new Error('Missing required --input argument.');
  }

  return options;
};

export const resolveOutputPath = (outputArg: string): string => {
  const normalized = outputArg.trim();
  if (!normalized) {
    throw new Error('Output path/name cannot be empty.');
  }

  const hasPathSeparator =
    normalized.includes('/') || normalized.includes('\\');
  const hasSqlExtension = normalized.toLowerCase().endsWith('.sql');

  if (!hasPathSeparator && !hasSqlExtension) {
    return path.join('prisma', 'migrations', normalized, 'migration.sql');
  }

  if (hasPathSeparator && !hasSqlExtension) {
    return path.join(normalized, 'migration.sql');
  }

  return normalized;
};

export const ensureLanguages = (languages: string[]): LanguageCode[] => {
  const normalized = languages.map((language) => language.toLowerCase());

  normalized.forEach((language) => {
    if (!ALLOWED_LANGUAGES.has(language as LanguageCode)) {
      throw new Error(`Unsupported language code: ${language}`);
    }
  });

  return normalized as LanguageCode[];
};

export const readInput = (filePath: string): InputPayload => {
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(
      'Input must be a translation object (same nested shape as translation-factory output).',
    );
  }

  return payload as InputPayload;
};

export const flattenTranslationTree = (
  tree: TranslationTree,
  parentPath: string[] = [],
): FlattenedTranslation[] => {
  const flattenedValues: FlattenedTranslation[] = [];

  Object.entries(tree).forEach(([key, value]) => {
    if (!key.trim()) {
      throw new Error('Translation tree contains an empty key.');
    }

    const path = [...parentPath, key];

    if (typeof value === 'string') {
      flattenedValues.push({ path, en: value });
      return;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedValues = flattenTranslationTree(
        value as TranslationTree,
        path,
      );
      flattenedValues.push(...nestedValues);
      return;
    }

    throw new Error(
      `Invalid translation value at ${path.join(
        '.',
      )}. Values must be strings or nested objects.`,
    );
  });

  return flattenedValues;
};

const makeTranslateService = (): Translate => {
  const googleApiEmail = process.env.GOOGLE_API_EMAIL || '';
  const googleApiId = process.env.GOOGLE_API_ID || '';
  const googleApiKey = process.env.GOOGLE_API_KEY || '';

  if (!googleApiEmail || !googleApiId || !googleApiKey) {
    throw new Error(
      'Missing Google Translate credentials. Set GOOGLE_API_EMAIL, GOOGLE_API_ID, and GOOGLE_API_KEY in your .env, or run with --no-machine-translate.',
    );
  }

  return new Translate({
    credentials: {
      private_key: googleApiKey.replace(/\\n/gm, '\n'),
      client_email: googleApiEmail,
    },
    projectId: googleApiId,
  });
};

const fetchMachineTranslations = async (
  values: string[],
  language: LanguageCode,
  translateService: Translate,
): Promise<string[]> => {
  if (values.length === 0) {
    return [];
  }

  const [translatedResponse] = await translateService.translate(values, {
    from: 'en',
    to: language,
    format: 'html',
  });

  const translatedValues = Array.isArray(translatedResponse)
    ? translatedResponse
    : [translatedResponse];

  if (translatedValues.length !== values.length) {
    throw new Error(
      `Unexpected number of translated values for ${language}. Expected ${values.length}, got ${translatedValues.length}.`,
    );
  }

  return translatedValues;
};

const escapeSqlLiteral = (value: string): string => value.replace(/'/g, "''");

const toJsonbLiteral = (payload: unknown): string =>
  `'${escapeSqlLiteral(JSON.stringify(payload))}'::jsonb`;

const setNestedValue = (
  target: Record<string, unknown>,
  pathSegments: string[],
  value: unknown,
) => {
  let currentNode: Record<string, unknown> = target;

  pathSegments.forEach((segment, index) => {
    const isLeaf = index === pathSegments.length - 1;

    if (isLeaf) {
      currentNode[segment] = value;
      return;
    }

    const existingNode = currentNode[segment];
    if (
      !existingNode ||
      typeof existingNode !== 'object' ||
      Array.isArray(existingNode)
    ) {
      currentNode[segment] = {};
    }

    currentNode = currentNode[segment] as Record<string, unknown>;
  });
};

export const buildLanguagePatchMap = async (
  entries: FlattenedTranslation[],
  languages: LanguageCode[],
  machineTranslate: boolean,
): Promise<Record<LanguageCode, Array<{ path: string[]; value: string }>>> => {
  const result = {} as Record<
    LanguageCode,
    Array<{ path: string[]; value: string }>
  >;
  const translateService = machineTranslate ? makeTranslateService() : null;

  for (const language of languages) {
    const patch: Array<{ path: string[]; value: string }> = [];
    const pendingTranslationIndexes: number[] = [];
    const pendingEnglishValues: string[] = [];

    entries.forEach((entry, entryIndex) => {
      if (language === 'en') {
        patch.push({ path: entry.path, value: entry.en });
        return;
      }

      pendingTranslationIndexes.push(entryIndex);
      pendingEnglishValues.push(entry.en);
    });

    if (pendingTranslationIndexes.length > 0) {
      if (!machineTranslate) {
        const missingKeys = pendingTranslationIndexes.map((entryIndex) =>
          entries[entryIndex].path.join('.'),
        );
        throw new Error(
          `Machine translation is disabled. Missing ${language} translations for paths: ${missingKeys.join(
            ', ',
          )}.`,
        );
      }

      const translatedValues = await fetchMachineTranslations(
        pendingEnglishValues,
        language,
        translateService as Translate,
      );

      pendingTranslationIndexes.forEach((entryIndex, translatedIndex) => {
        patch.push({
          path: entries[entryIndex].path,
          value: translatedValues[translatedIndex],
        });
      });
    }

    result[language] = patch;
  }

  return result;
};

export const buildSql = (
  languagePatchMap: Record<
    LanguageCode,
    Array<{ path: string[]; value: string }>
  >,
  languages: LanguageCode[],
  jurisdiction?: string,
): string => {
  const escapedJurisdiction = jurisdiction
    ? escapeSqlLiteral(jurisdiction)
    : undefined;
  const jurisdictionIdExpression = escapedJurisdiction
    ? `(SELECT id FROM jurisdictions WHERE name = '${escapedJurisdiction}' LIMIT 1)`
    : 'NULL';

  const preludeStatements: string[] = [];
  if (escapedJurisdiction) {
    preludeStatements.push(
      `DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM jurisdictions WHERE name = '${escapedJurisdiction}') THEN\n    RAISE EXCEPTION 'Jurisdiction % not found', '${escapedJurisdiction}';\n  END IF;\nEND $$;`,
    );
  }

  const statements = languages.map((language) => {
    const patch = languagePatchMap[language];

    if (patch.length === 0) {
      throw new Error(`No entries available for language: ${language}`);
    }

    let updateExpression = "COALESCE(translations, '{}'::jsonb)";
    const insertPayload: Record<string, unknown> = {};

    patch.forEach((entry) => {
      const pathLiteral = `{${entry.path.join(',')}}`;
      const valueLiteral = toJsonbLiteral(entry.value);

      updateExpression = `jsonb_set(${updateExpression}, '${pathLiteral}', ${valueLiteral}, true)`;
      setNestedValue(insertPayload, entry.path, entry.value);
    });

    const insertPayloadLiteral = toJsonbLiteral(insertPayload);
    const updateWhereClause = escapedJurisdiction
      ? `language = '${language}' AND jurisdiction_id = ${jurisdictionIdExpression}`
      : `language = '${language}' AND jurisdiction_id IS NULL`;

    return `-- ${language}\nWITH updated AS (\n  UPDATE translations\n  SET translations = ${updateExpression}\n  WHERE ${updateWhereClause}\n  RETURNING 1\n)\nINSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")\nSELECT\n  '${language}',\n  ${insertPayloadLiteral},\n  ${jurisdictionIdExpression},\n  CURRENT_TIMESTAMP,\n  CURRENT_TIMESTAMP\nWHERE NOT EXISTS (SELECT 1 FROM updated);`;
  });

  return [...preludeStatements, ...statements, ''].join('\n');
};

export async function main() {
  const options = parseArgs();
  const inputPath = path.resolve(process.cwd(), options.input);
  const payload = readInput(inputPath);

  const languages = ensureLanguages(options.languages || DEFAULT_LANGUAGES);

  const entries = flattenTranslationTree(payload);

  if (entries.length === 0) {
    throw new Error(
      'Input translation object does not contain any string values.',
    );
  }

  const languagePatchMap = await buildLanguagePatchMap(
    entries,
    languages,
    options.machineTranslate,
  );

  const sql = buildSql(languagePatchMap, languages, options.jurisdiction);

  if (options.output) {
    const outputPath = path.resolve(
      process.cwd(),
      resolveOutputPath(options.output),
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    fs.writeFileSync(outputPath, sql, 'utf8');
    return;
  }

  process.stdout.write(sql);
}

if (require.main === module) {
  void main();
}
