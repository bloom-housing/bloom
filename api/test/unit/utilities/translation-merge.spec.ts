import { flattenTranslationRows } from '../../../src/utilities/translation-merge';

describe('flattenTranslationRows', () => {
  it('flattens rows into a key/value map, preserving dot-path keys', () => {
    expect(
      flattenTranslationRows([
        [
          { key: 'footer.line1', value: 'Bloom' },
          { key: 'region.name', value: 'Bloomington' },
        ],
      ]),
    ).toEqual({ 'footer.line1': 'Bloom', 'region.name': 'Bloomington' });
  });

  it('applies groups in order so a later group overrides an earlier one', () => {
    expect(
      flattenTranslationRows([
        [
          { key: 'region.name', value: 'default' },
          { key: 'footer.line1', value: 'base' },
        ],
        [{ key: 'region.name', value: 'override' }],
      ]),
    ).toEqual({ 'region.name': 'override', 'footer.line1': 'base' });
  });

  it('returns an empty object for empty groups', () => {
    expect(flattenTranslationRows([[], []])).toEqual({});
  });

  it('does not pollute Object.prototype via a __proto__ key', () => {
    const result = flattenTranslationRows([[{ key: '__proto__', value: 'x' }]]);

    expect(result).toEqual({});
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.prototype).not.toHaveProperty('x');
  });
});
