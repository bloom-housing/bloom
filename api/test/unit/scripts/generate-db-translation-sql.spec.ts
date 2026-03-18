import fs from 'fs';
import {
  buildSql,
  flattenTranslationTree,
  resolveOutputPath,
  parseArgs,
  ensureLanguages,
  readInput,
  buildLanguagePatchMap,
} from '../../../scripts/generate-db-translation-sql';

jest.mock('fs');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('generate-db-translation-sql helpers', () => {
  it('resolves output migration name to prisma migration file path', () => {
    expect(resolveOutputPath('52_test')).toBe(
      'prisma/migrations/52_test/migration.sql',
    );
  });

  it('resolves output directory path to migration.sql', () => {
    expect(resolveOutputPath('prisma/migrations/52_test')).toBe(
      'prisma/migrations/52_test/migration.sql',
    );
  });

  it('keeps explicit sql output path unchanged', () => {
    expect(resolveOutputPath('prisma/migrations/52_test/custom.sql')).toBe(
      'prisma/migrations/52_test/custom.sql',
    );
  });

  it('flattens nested translation tree into path/value entries', () => {
    const flattened = flattenTranslationTree({
      footer: {
        line1: 'Bloom',
        line2: '',
      },
      confirmation: {
        eligible: {
          lottery: 'Lottery text',
        },
      },
    });

    expect(flattened).toEqual(
      expect.arrayContaining([
        { path: ['footer', 'line1'], en: 'Bloom' },
        { path: ['footer', 'line2'], en: '' },
        { path: ['confirmation', 'eligible', 'lottery'], en: 'Lottery text' },
      ]),
    );
  });

  it('builds non-destructive SQL with coalesced root and nested jsonb_set paths', () => {
    const sql = buildSql(
      {
        en: [
          { path: ['footer', 'line1'], value: 'Bloom' },
          { path: ['footer', 'thankYou'], value: 'Thank you' },
          {
            path: ['applicationUpdate', 'applicationStatus', 'submitted'],
            value: 'Submitted',
          },
        ],
      } as any,
      ['en'],
    );

    expect(sql).toContain("COALESCE(translations, '{}'::jsonb)");
    expect(sql).toContain("'{footer,line1}'");
    expect(sql).toContain("'{footer,thankYou}'");
    expect(sql).toContain("'{applicationUpdate,applicationStatus,submitted}'");
  });

  it('targets default generic translations with null jurisdiction', () => {
    const sql = buildSql(
      {
        en: [{ path: ['footer', 'line1'], value: 'Bloom' }],
      } as any,
      ['en'],
    );

    expect(sql).toContain("WHERE language = 'en' AND jurisdiction_id IS NULL");
    expect(sql).toContain(
      'INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")',
    );
    expect(sql).toContain('\n  NULL,\n');
  });

  it('targets jurisdiction-specific translations when jurisdiction is provided', () => {
    const sql = buildSql(
      {
        en: [{ path: ['footer', 'line1'], value: 'Bloom' }],
      } as any,
      ['en'],
      'Bloomington',
    );

    expect(sql).toContain('DO $$');
    expect(sql).toContain(
      "IF NOT EXISTS (SELECT 1 FROM jurisdictions WHERE name = 'Bloomington') THEN",
    );
    expect(sql).toContain(
      "WHERE language = 'en' AND jurisdiction_id = (SELECT id FROM jurisdictions WHERE name = 'Bloomington' LIMIT 1)",
    );
    expect(sql).toContain(
      "(SELECT id FROM jurisdictions WHERE name = 'Bloomington' LIMIT 1)",
    );
  });

  describe('parseArgs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('parses required --input argument', () => {
      process.argv = ['node', 'script.ts', '--input', 'input.json'];
      const result = parseArgs();
      expect(result.input).toBe('input.json');
    });

    it('parses --output argument', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--output',
        '52_test',
      ];
      const result = parseArgs();
      expect(result.output).toBe('52_test');
    });

    it('parses --languages comma-separated list', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--languages',
        'en,es,vi',
      ];
      const result = parseArgs();
      expect(result.languages).toEqual(['en', 'es', 'vi']);
    });

    it('parses --jurisdiction argument', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--jurisdiction',
        'Bloomington',
      ];
      const result = parseArgs();
      expect(result.jurisdiction).toBe('Bloomington');
    });

    it('parses --no-machine-translate flag', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--no-machine-translate',
      ];
      const result = parseArgs();
      expect(result.machineTranslate).toBe(false);
    });

    it('defaults machineTranslate to true', () => {
      process.argv = ['node', 'script.ts', '--input', 'input.json'];
      const result = parseArgs();
      expect(result.machineTranslate).toBe(true);
    });

    it('throws error when --input is missing', () => {
      process.argv = ['node', 'script.ts'];
      expect(() => parseArgs()).toThrow('Missing required --input argument.');
    });

    it('throws error when --output has no value', () => {
      process.argv = ['node', 'script.ts', '--input', 'input.json', '--output'];
      expect(() => parseArgs()).toThrow(
        'Missing value for --output. Example: --output 52_test or --output prisma/migrations/52_test/migration.sql',
      );
    });

    it('throws error when --output is followed by another flag', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--output',
        '--languages',
        'en',
      ];
      expect(() => parseArgs()).toThrow(
        'Missing value for --output. Example: --output 52_test or --output prisma/migrations/52_test/migration.sql',
      );
    });

    it('throws error when --jurisdiction has no value', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--jurisdiction',
      ];
      expect(() => parseArgs()).toThrow(
        'Missing value for --jurisdiction. Example: --jurisdiction "Bloomington"',
      );
    });

    it('throws error when --jurisdiction is followed by another flag', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--jurisdiction',
        '--languages',
        'en',
      ];
      expect(() => parseArgs()).toThrow(
        'Missing value for --jurisdiction. Example: --jurisdiction "Bloomington"',
      );
    });

    it('handles languages with whitespace', () => {
      process.argv = [
        'node',
        'script.ts',
        '--input',
        'input.json',
        '--languages',
        'en, es , vi',
      ];
      const result = parseArgs();
      expect(result.languages).toEqual(['en', 'es', 'vi']);
    });
  });

  describe('ensureLanguages', () => {
    it('normalizes language codes to lowercase', () => {
      const result = ensureLanguages(['EN', 'ES', 'VI']);
      expect(result).toEqual(['en', 'es', 'vi']);
    });

    it('accepts all default supported languages', () => {
      const result = ensureLanguages([
        'en',
        'es',
        'vi',
        'zh',
        'tl',
        'ar',
        'bn',
        'ko',
        'hy',
        'fa',
      ]);
      expect(result).toHaveLength(10);
    });

    it('throws error for unsupported language code', () => {
      expect(() => ensureLanguages(['en', 'fr'])).toThrow(
        'Unsupported language code: fr',
      );
    });
  });

  describe('readInput', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('reads and parses valid JSON input file', () => {
      const mockPayload = {
        footer: { line1: 'Bloom' },
        confirmation: { eligible: { lottery: 'Lottery text' } },
      };
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockPayload),
      );

      const result = readInput('input.json');
      expect(result).toEqual(mockPayload);
      expect(fs.readFileSync).toHaveBeenCalledWith('input.json', 'utf8');
    });

    it('throws error when input is not an object', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify('string'));
      expect(() => readInput('input.json')).toThrow(
        'Input must be a translation object (same nested shape as translation-factory output).',
      );
    });

    it('throws error when input is an array', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([1, 2]));
      expect(() => readInput('input.json')).toThrow(
        'Input must be a translation object (same nested shape as translation-factory output).',
      );
    });

    it('throws error when input is null', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(null));
      expect(() => readInput('input.json')).toThrow(
        'Input must be a translation object (same nested shape as translation-factory output).',
      );
    });

    it('throws error for invalid JSON', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json {');
      expect(() => readInput('input.json')).toThrow();
    });
  });

  describe('buildLanguagePatchMap', () => {
    it('returns English values as-is without machine translation', async () => {
      const entries = [
        { path: ['footer', 'line1'], en: 'Bloom' },
        { path: ['confirmation', 'eligible'], en: 'Eligible' },
      ];

      const result = await buildLanguagePatchMap(entries, ['en'], false);

      expect(result.en).toEqual([
        { path: ['footer', 'line1'], value: 'Bloom' },
        { path: ['confirmation', 'eligible'], value: 'Eligible' },
      ]);
    });

    it('throws error for non-English language without machine translation', async () => {
      const entries = [{ path: ['footer', 'line1'], en: 'Bloom' }];

      await expect(
        buildLanguagePatchMap(entries, ['es'], false),
      ).rejects.toThrow(
        'Machine translation is disabled. Missing es translations for paths: footer.line1.',
      );
    });
  });
});
