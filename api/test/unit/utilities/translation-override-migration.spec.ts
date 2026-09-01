import { LanguagesEnum, SiteEnum } from '@prisma/client';
import {
  buildOverrideRows,
  diffRows,
  DesiredRow,
  flattenToKeyValues,
  formatReport,
  overrideFiles,
  withSourceHashes,
} from '../../../src/utilities/translation-override-migration';
import { sourceHash } from '../../../src/utilities/translation-source-hash';

const row = (overrides: Partial<DesiredRow> = {}): DesiredRow => ({
  jurisdictionId: null,
  language: LanguagesEnum.en,
  site: SiteEnum.public,
  key: 'a.b',
  value: 'Value',
  sourceHash: null,
  ...overrides,
});

describe('overrideFiles', () => {
  it('maps english to general.json and every other language to its own file', () => {
    const files = overrideFiles({ languages: [LanguagesEnum.es] });
    const publicFiles = files.filter((file) => file.site === SiteEnum.public);

    expect(publicFiles.map((file) => file.url)).toEqual([
      'https://raw.githubusercontent.com/bloom-housing/bloom/main/sites/public/page_content/locale_overrides/general.json',
      'https://raw.githubusercontent.com/bloom-housing/bloom/main/sites/public/page_content/locale_overrides/es.json',
    ]);
  });

  it('reads both sites', () => {
    const files = overrideFiles({ languages: [LanguagesEnum.en] });

    expect(files.map((file) => file.url)).toEqual([
      'https://raw.githubusercontent.com/bloom-housing/bloom/main/sites/public/page_content/locale_overrides/general.json',
      'https://raw.githubusercontent.com/bloom-housing/bloom/main/sites/partners/page_content/overrides/general.json',
    ]);
  });

  it('keeps english when a language filter leaves it out', () => {
    const languages = overrideFiles({ languages: [LanguagesEnum.vi] })
      .filter((file) => file.site === SiteEnum.public)
      .map((file) => file.language);

    expect(languages).toEqual([LanguagesEnum.en, LanguagesEnum.vi]);
  });

  it('reads every language when none is given', () => {
    const languages = overrideFiles({})
      .filter((file) => file.site === SiteEnum.public)
      .map((file) => file.language);

    expect(languages).toEqual(Object.values(LanguagesEnum));
  });

  it('takes the repository and ref from its caller', () => {
    const [first] = overrideFiles({
      languages: [LanguagesEnum.en],
      repositoryUrl: 'https://raw.githubusercontent.com/acme/fork',
      gitRef: 'abc123',
    });

    expect(first.url).toEqual(
      'https://raw.githubusercontent.com/acme/fork/abc123/sites/public/page_content/locale_overrides/general.json',
    );
  });
});

describe('flattenToKeyValues', () => {
  it('turns nesting into dotted keys', () => {
    expect(flattenToKeyValues({ a: { b: { c: 'Value' } } })).toEqual([
      { key: 'a.b.c', value: 'Value' },
    ]);
  });

  it('passes an already flat key through', () => {
    expect(flattenToKeyValues({ 'a.b': 'Value' })).toEqual([
      { key: 'a.b', value: 'Value' },
    ]);
  });

  it('names the key when a value is not a string', () => {
    expect(() => flattenToKeyValues({ a: { b: 3 } })).toThrow(
      'Invalid translation value at a.b',
    );
  });

  it('rejects an empty key', () => {
    expect(() => flattenToKeyValues({ ' ': 'Value' })).toThrow('empty key');
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
  it('hashes the english value in the same scope', () => {
    const rows = withSourceHashes([
      row({ jurisdictionId: 'juris-1', key: 'a.b', value: 'Pets' }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        key: 'a.b',
        value: 'Mascotas',
      }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash('Pets'));
  });

  it('falls back to the english value stored for every jurisdiction', () => {
    const rows = withSourceHashes([
      row({ site: SiteEnum.partners, key: 'a.b', value: 'Pets' }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        site: SiteEnum.partners,
        key: 'a.b',
        value: 'Mascotas',
      }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash('Pets'));
  });

  it("prefers the row's own scope over a wider one", () => {
    const rows = withSourceHashes([
      row({ site: SiteEnum.public, key: 'a.b', value: 'Wider' }),
      row({ jurisdictionId: 'juris-1', key: 'a.b', value: 'Own' }),
      row({
        jurisdictionId: 'juris-1',
        language: LanguagesEnum.es,
        key: 'a.b',
        value: 'Mascotas',
      }),
    ]);

    expect(rows[2].sourceHash).toEqual(sourceHash('Own'));
  });

  it('stores no hash when there is no english to hash', () => {
    const rows = withSourceHashes([
      row({ language: LanguagesEnum.es, key: 'a.b', value: 'Mascotas' }),
    ]);

    expect(rows[0].sourceHash).toBeNull();
  });

  it('hashes an empty english value rather than skipping it', () => {
    const rows = withSourceHashes([
      row({ key: 'a.b', value: '' }),
      row({ language: LanguagesEnum.es, key: 'a.b', value: 'Algo' }),
    ]);

    expect(rows[1].sourceHash).toEqual(sourceHash(''));
  });

  it('leaves an english row without a hash', () => {
    const rows = withSourceHashes([row({ key: 'a.b', value: 'Pets' })]);

    expect(rows[0].sourceHash).toBeNull();
  });
});

describe('diffRows', () => {
  it('splits rows into create, update and unchanged', () => {
    const diff = diffRows(
      [
        row({ key: 'same', value: 'Value' }),
        row({ key: 'changed', value: 'Old' }),
      ],
      [
        row({ key: 'same', value: 'Value' }),
        row({ key: 'changed', value: 'New' }),
        row({ key: 'new', value: 'Value' }),
      ],
    );

    expect(diff.create.map((r) => r.key)).toEqual(['new']);
    expect(diff.update.map((r) => r.key)).toEqual(['changed']);
    expect(diff.unchanged).toEqual(1);
  });

  it('counts a changed source hash as an update', () => {
    const diff = diffRows(
      [row({ key: 'a.b', sourceHash: 'old' })],
      [row({ key: 'a.b', sourceHash: 'new' })],
    );

    expect(diff.update).toHaveLength(1);
  });

  it('keeps scopes apart', () => {
    const diff = diffRows(
      [row({ jurisdictionId: 'juris-1', key: 'a.b' })],
      [row({ jurisdictionId: 'juris-2', key: 'a.b' })],
    );

    expect(diff.create).toHaveLength(1);
  });

  it('keeps languages apart', () => {
    const diff = diffRows(
      [row({ key: 'a.b' })],
      [row({ key: 'a.b', language: LanguagesEnum.es })],
    );

    expect(diff.create).toHaveLength(1);
  });

  it('leaves an existing row alone when asked to', () => {
    const diff = diffRows(
      [row({ key: 'a.b', value: 'Edited by an admin' })],
      [row({ key: 'a.b', value: 'From the file' })],
      true,
    );

    expect(diff.update).toHaveLength(0);
    expect(diff.skipped).toEqual(1);
  });
});

describe('formatReport', () => {
  const report = (overrides = {}) =>
    formatReport({
      sections: [
        {
          label: 'public overrides for Bloomington',
          diff: {
            create: [row({ key: 'a.b' })],
            update: [],
            unchanged: 2,
            skipped: 0,
          },
        },
      ],
      commit: false,
      repositoryUrl: 'https://x/repo',
      gitRef: 'main',
      missing: [],
      ...overrides,
    });

  it('says a dry run wrote nothing, and names the source', () => {
    const text = report();

    expect(text).toContain('Dry run. Re-run with commit: true to write.');
    expect(text).toContain('Source: https://x/repo at main');
    expect(text).toContain(
      'public overrides for Bloomington: 1 to create, 0 to update, 2 unchanged',
    );
  });

  it('names the files that were not there', () => {
    expect(report({ missing: ['https://x/repo/main/es.json'] })).toContain(
      'no file at https://x/repo/main/es.json',
    );
  });

  it('reports rows left alone', () => {
    const text = report({
      sections: [
        {
          label: 'public overrides for Bloomington',
          diff: { create: [], update: [], unchanged: 0, skipped: 3 },
        },
      ],
    });

    expect(text).toContain('3 left as they are');
  });

  it('truncates a long list', () => {
    const text = report({
      sections: [
        {
          label: 'public overrides for Bloomington',
          diff: {
            create: Array.from({ length: 7 }, (_, i) =>
              row({ key: `key.${i}` }),
            ),
            update: [],
            unchanged: 0,
            skipped: 0,
          },
        },
      ],
    });

    expect(text).toContain('  create en key.4');
    expect(text).not.toContain('  create en key.5');
    expect(text).toContain('  ...and 2 more');
  });
});
