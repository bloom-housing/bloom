import fs from 'fs';
import { LanguagesEnum, SiteEnum } from '@prisma/client';
import {
  buildBlobRows,
  buildOverrideRows,
  diffRows,
  flattenToKeyValues,
  formatReport,
  parseArgs,
  readOverrideFiles,
  withSourceHashes,
  DesiredRow,
} from '../../../scripts/migrate-translations-to-key-rows';
import { sourceHash } from '../../../src/utilities/translation-source-hash';

jest.mock('fs');
jest.mock('dotenv', () => ({ config: jest.fn() }));

const row = (overrides: Partial<DesiredRow> = {}): DesiredRow => ({
  jurisdictionId: null,
  language: LanguagesEnum.en,
  site: null,
  key: 'a.b',
  value: 'Value',
  sourceHash: null,
  ...overrides,
});

describe('parseArgs', () => {
  it('defaults to a dry run', () => {
    expect(parseArgs([])).toEqual({ commit: false });
  });

  it('reads the jurisdiction, commit flag, and languages', () => {
    expect(
      parseArgs([
        '--jurisdiction',
        'Bloomington',
        '--commit',
        '--languages',
        'es, zh',
      ]),
    ).toEqual({
      jurisdiction: 'Bloomington',
      commit: true,
      languages: [LanguagesEnum.es, LanguagesEnum.zh],
    });
  });

  it('rejects a missing jurisdiction value', () => {
    expect(() => parseArgs(['--jurisdiction', '--commit'])).toThrow(
      'Missing value for --jurisdiction',
    );
  });

  it('rejects an unknown language', () => {
    expect(() => parseArgs(['--languages', 'es,klingon'])).toThrow(
      'Unsupported language code: klingon',
    );
  });
});

describe('flattenToKeyValues', () => {
  it('flattens a nested tree to dotted keys', () => {
    expect(
      flattenToKeyValues({
        confirmation: { eligible: { waitlist: 'On the waitlist' } },
        t: { hello: 'Hello' },
      }),
    ).toEqual([
      { key: 'confirmation.eligible.waitlist', value: 'On the waitlist' },
      { key: 't.hello', value: 'Hello' },
    ]);
  });

  it('keeps a key that is already flat', () => {
    expect(flattenToKeyValues({ 'listings.petPolicy': 'Pets' })).toEqual([
      { key: 'listings.petPolicy', value: 'Pets' },
    ]);
  });
});

describe('buildBlobRows', () => {
  it('writes one row per key at the blob scope with no site', () => {
    expect(
      buildBlobRows([
        {
          jurisdictionId: null,
          language: LanguagesEnum.en,
          translations: { t: { hello: 'Hello' } },
        },
        {
          jurisdictionId: 'juris-1',
          language: LanguagesEnum.es,
          translations: { t: { hello: 'Hola' } },
        },
      ]),
    ).toEqual([
      row({ key: 't.hello', value: 'Hello' }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        key: 't.hello',
        value: 'Hola',
      }),
    ]);
  });

  it('tolerates a row with no translations', () => {
    expect(
      buildBlobRows([
        {
          jurisdictionId: null,
          language: LanguagesEnum.en,
          translations: null,
        },
      ]),
    ).toEqual([]);
  });
});

describe('buildOverrideRows', () => {
  it('writes rows for the given jurisdiction and site', () => {
    expect(
      buildOverrideRows({
        files: [
          {
            language: LanguagesEnum.es,
            translations: { listings: { petPolicy: 'Mascotas' } },
          },
        ],
        jurisdictionId: 'juris-1',
        site: SiteEnum.public,
      }),
    ).toEqual([
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        site: SiteEnum.public,
        key: 'listings.petPolicy',
        value: 'Mascotas',
      }),
    ]);
  });

  it('keeps an empty value, which is how a section is hidden', () => {
    const rows = buildOverrideRows({
      files: [
        {
          language: LanguagesEnum.en,
          translations: { account: { settings: { disclaimer: '' } } },
        },
      ],
      jurisdictionId: 'juris-1',
      site: SiteEnum.public,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual('');
  });
});

describe('withSourceHashes', () => {
  it('hashes the English value in the same scope', () => {
    const rows = withSourceHashes([
      row({
        jurisdictionId: 'juris-1',
        site: SiteEnum.public,
        key: 'listings.petPolicy',
        value: 'Pets',
      }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        site: SiteEnum.public,
        key: 'listings.petPolicy',
        value: 'Mascotas',
      }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash('Pets'));
  });

  it('falls back to the global value for the same site', () => {
    const rows = withSourceHashes([
      row({ site: SiteEnum.partners, key: 'a.b', value: 'English' }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        site: SiteEnum.partners,
        key: 'a.b',
        value: 'Espanol',
      }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash('English'));
  });

  it('leaves the hash null when no English row supplies the source', () => {
    // The English value then comes from a bundled locale file the API cannot read, so a hash here
    // would be one the editor could never reproduce.
    const rows = withSourceHashes([
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        site: SiteEnum.public,
        key: 'listings.petPolicy',
        value: 'Mascotas',
      }),
    ]);

    expect(rows[0].sourceHash).toBeNull();
  });

  it('hashes an English value that is empty, which is a value rather than a gap', () => {
    const rows = withSourceHashes([
      row({ site: SiteEnum.public, key: 'a.b', value: '' }),
      row({
        language: LanguagesEnum.es,
        site: SiteEnum.public,
        key: 'a.b',
        value: 'Espanol',
      }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash(''));
  });

  it('leaves an English row without a hash', () => {
    const rows = withSourceHashes([row({ value: 'Hello' })]);
    expect(rows[0].sourceHash).toBeNull();
  });
});

describe('diffRows', () => {
  it('separates rows to create, rows to update, and unchanged rows', () => {
    const unchanged = row({ key: 'same', value: 'Same' });
    const changed = row({ key: 'changed', value: 'New' });
    const fresh = row({ key: 'fresh', value: 'Fresh' });

    const diff = diffRows(
      [unchanged, { ...changed, value: 'Old' }],
      [unchanged, changed, fresh],
    );

    expect(diff.unchanged).toEqual(1);
    expect(diff.update).toEqual([changed]);
    expect(diff.create).toEqual([fresh]);
  });

  it('treats a changed source hash as an update', () => {
    const existing = row({ key: 'a.b', value: 'Hola', sourceHash: 'old' });
    const desired = row({ key: 'a.b', value: 'Hola', sourceHash: 'new' });

    expect(diffRows([existing], [desired]).update).toEqual([desired]);
  });

  it('keeps scopes apart', () => {
    const existing = row({ key: 'a.b', value: 'Value', site: SiteEnum.public });
    const desired = row({
      key: 'a.b',
      value: 'Value',
      site: SiteEnum.partners,
    });

    const diff = diffRows([existing], [desired]);

    expect(diff.create).toEqual([desired]);
    expect(diff.unchanged).toEqual(0);
  });

  it('keeps languages apart', () => {
    const existing = row({ key: 'a.b', value: 'Hello' });
    const desired = row({
      key: 'a.b',
      value: 'Hola',
      language: LanguagesEnum.es,
    });

    expect(diffRows([existing], [desired]).create).toEqual([desired]);
  });
});

describe('formatReport', () => {
  it('says how to write when the run is a dry run', () => {
    const report = formatReport(
      [
        {
          label: 'public overrides',
          diff: { create: [], update: [], unchanged: 3 },
        },
      ],
      false,
    );

    expect(report).toContain('Dry run');
    expect(report).toContain(
      'public overrides: 0 to create, 0 to update, 3 unchanged',
    );
  });

  it('truncates a long list of changes', () => {
    const create = Array.from({ length: 7 }, (_, index) =>
      row({ key: `key.${index}` }),
    );

    const report = formatReport(
      [{ label: 'blob', diff: { create, update: [], unchanged: 0 } }],
      true,
    );

    expect(report).toContain('Writing changes.');
    expect(report).toContain('create en key.0');
    expect(report).toContain('...and 2 more');
    expect(report).not.toContain('create en key.6');
  });
});

describe('readOverrideFiles', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      'general.json',
      'es.json',
      'zh.json',
      'README.md',
    ] as never);
    mockedFs.readFileSync.mockReturnValue(
      JSON.stringify({ a: { b: 'value' } }),
    );
  });

  it('maps general.json to English and each other file to its language', () => {
    const files = readOverrideFiles('overrides');

    expect(files.map((file) => file.language)).toEqual([
      LanguagesEnum.en,
      LanguagesEnum.es,
      LanguagesEnum.zh,
    ]);
  });

  it('keeps English when a language filter is given', () => {
    const files = readOverrideFiles('overrides', [LanguagesEnum.zh]);

    expect(files.map((file) => file.language)).toEqual([
      LanguagesEnum.en,
      LanguagesEnum.zh,
    ]);
  });

  it('throws when the directory is missing', () => {
    mockedFs.existsSync.mockReturnValue(false);

    expect(() => readOverrideFiles('nope')).toThrow(
      'Override directory not found',
    );
  });
});
