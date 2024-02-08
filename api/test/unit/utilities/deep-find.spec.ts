import { deepFind } from '../../../src/utilities/deep-find';

describe('Testing deep find', () => {
  it('should return undefined for field that is missing', () => {
    expect(deepFind({ a: true }, 'abcdef')).toEqual(undefined);
  });

  it('should return simple value at key', () => {
    expect(deepFind({ a: true }, 'a')).toEqual(true);
  });

  it('should return complex value at key', () => {
    expect(deepFind({ a: { b: { c: true } } }, 'a.b')).toEqual({ c: true });
  });
});
