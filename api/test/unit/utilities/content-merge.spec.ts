import {
  mergeContent,
  mergeListById,
} from '../../../src/utilities/content-merge';

describe('mergeContent', () => {
  it('returns the English content unchanged when there is no language row', () => {
    const english = {
      contact: { phone: '555-0100', email: 'help@bloom.gov' },
    };

    expect(mergeContent(english)).toEqual(english);
  });

  it('overrides scalar fields set in the language row and falls back for the rest', () => {
    const merged = mergeContent(
      { contact: { phone: '555-0100', email: 'help@bloom.gov' } },
      { contact: { email: 'ayuda@bloom.gov' } },
    );

    expect(merged.contact).toEqual({
      phone: '555-0100',
      email: 'ayuda@bloom.gov',
    });
  });

  it('treats an unset (undefined/null) override field as a fallback, not a clear', () => {
    const merged = mergeContent(
      { contact: { phone: '555-0100', addressHtml: '<p>City Hall</p>' } },
      { contact: { phone: '555-0199', addressHtml: null } },
    );

    expect(merged.contact).toEqual({
      phone: '555-0199',
      addressHtml: '<p>City Hall</p>',
    });
  });

  it('keeps an empty-string override so a section can be hidden', () => {
    const merged = mergeContent(
      { disclaimers: { privacyHtml: '<p>Privacy</p>' } },
      { disclaimers: { privacyHtml: '' } },
    );

    expect(merged.disclaimers).toEqual({ privacyHtml: '' });
  });

  it('merges FAQ items by id, keeping English order and English fallback per field', () => {
    const merged = mergeContent(
      {
        faq: {
          categories: [
            {
              id: 'general',
              title: 'General',
              items: [
                { id: 'a', question: 'What?', answerHtml: '<p>EN A</p>' },
                { id: 'b', question: 'When?', answerHtml: '<p>EN B</p>' },
              ],
            },
          ],
        },
      },
      {
        faq: {
          categories: [
            {
              id: 'general',
              // title left unset -> falls back to English "General"
              items: [{ id: 'b', answerHtml: '<p>ES B</p>' }],
            },
          ],
        },
      },
    );

    expect(merged.faq).toEqual({
      categories: [
        {
          id: 'general',
          title: 'General',
          items: [
            { id: 'a', question: 'What?', answerHtml: '<p>EN A</p>' },
            { id: 'b', question: 'When?', answerHtml: '<p>ES B</p>' },
          ],
        },
      ],
    });
  });

  it('preserves English list order regardless of override order (merge by id, not index)', () => {
    const merged = mergeListById(
      [
        { id: 'a', text: 'EN A' },
        { id: 'b', text: 'EN B' },
      ],
      [
        { id: 'b', text: 'ES B' },
        { id: 'a', text: 'ES A' },
      ],
    );

    expect(merged).toEqual([
      { id: 'a', text: 'ES A' },
      { id: 'b', text: 'ES B' },
    ]);
  });

  it('skips a tombstoned item so it reads as not present', () => {
    const merged = mergeListById(
      [
        { id: 'a', text: 'EN A' },
        { id: 'b', text: 'EN B' },
      ],
      [{ id: 'b', _deleted: true }],
    );

    expect(merged).toEqual([{ id: 'a', text: 'EN A' }]);
  });

  it('appends items added only in the language row after the English-derived items', () => {
    const merged = mergeListById(
      [{ id: 'a', text: 'EN A' }],
      [{ id: 'z', text: 'ES Z only' }],
    );

    expect(merged).toEqual([
      { id: 'a', text: 'EN A' },
      { id: 'z', text: 'ES Z only' },
    ]);
  });

  it('ignores a tombstone for an id English never had', () => {
    const merged = mergeListById(
      [{ id: 'a', text: 'EN A' }],
      [{ id: 'ghost', _deleted: true }],
    );

    expect(merged).toEqual([{ id: 'a', text: 'EN A' }]);
  });

  it('does not leak the _deleted flag onto a surviving overridden item', () => {
    const merged = mergeListById(
      [{ id: 'a', text: 'EN A' }],
      [{ id: 'a', text: 'ES A', _deleted: false }],
    );

    expect(merged).toEqual([{ id: 'a', text: 'ES A' }]);
    expect(merged[0]).not.toHaveProperty('_deleted');
  });

  it('replaces a primitive list wholesale and falls back when the override omits it', () => {
    const overridden = mergeContent(
      { footer: { textSectionsHtml: ['<p>EN 1</p>', '<p>EN 2</p>'] } },
      { footer: { textSectionsHtml: ['<p>ES 1</p>'] } },
    );
    expect(overridden.footer).toEqual({ textSectionsHtml: ['<p>ES 1</p>'] });

    const fallback = mergeContent(
      { footer: { textSectionsHtml: ['<p>EN 1</p>'] } },
      { footer: {} },
    );
    expect(fallback.footer).toEqual({ textSectionsHtml: ['<p>EN 1</p>'] });
  });

  it('preserves an id-less item in a mixed list rather than dropping it', () => {
    // Only reachable via a malformed/hand-edited row; degrade gracefully by keeping the item.
    const merged = mergeListById(
      [{ id: 'a', text: 'EN A' }, { text: 'legacy, no id' }],
      [{ id: 'a', text: 'ES A' }],
    );

    expect(merged).toEqual([
      { id: 'a', text: 'ES A' },
      { text: 'legacy, no id' },
    ]);
  });

  it('emits a duplicated English id only once', () => {
    const merged = mergeListById(
      [
        { id: 'a', text: 'EN A' },
        { id: 'a', text: 'EN A dup' },
      ],
      [{ id: 'a', text: 'ES A' }],
    );

    expect(merged).toEqual([{ id: 'a', text: 'ES A' }]);
  });

  it('appends an id-less language item after the English items', () => {
    const merged = mergeListById(
      [{ id: 'a', text: 'EN A' }],
      [{ text: 'ES extra, no id' }],
    );

    expect(merged).toEqual([
      { id: 'a', text: 'EN A' },
      { text: 'ES extra, no id' },
    ]);
  });

  it('does not pollute Object.prototype via a __proto__ key in stored content', () => {
    const merged = mergeContent(
      { contact: { phone: '555-0100' } },
      { contact: JSON.parse('{"__proto__": {"polluted": true}}') },
    );

    expect(merged.contact).toEqual({ phone: '555-0100' });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
