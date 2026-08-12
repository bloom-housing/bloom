import { sourceHash } from '../../../src/utilities/translation-source-hash';

describe('sourceHash', () => {
  it('is deterministic for the same input', () => {
    expect(sourceHash('Welcome')).toEqual(sourceHash('Welcome'));
  });

  it('differs when the input changes', () => {
    expect(sourceHash('Welcome')).not.toEqual(sourceHash('Welcome!'));
  });

  it('returns a 64-character hex sha256 digest', () => {
    expect(sourceHash('anything')).toMatch(/^[0-9a-f]{64}$/);
  });
});
