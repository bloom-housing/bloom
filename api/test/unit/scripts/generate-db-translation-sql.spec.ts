import {
  buildSql,
  flattenTranslationTree,
  resolveOutputPath,
} from '../../../scripts/generate-db-translation-sql';

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
});
