import { passwordRegex } from '../../../src/utilities/password-regex';
describe('passwordRegex', () => {
  it('should identify weak passwords', () => {
    // too short, missing all
    expect(passwordRegex.test('abcdef')).toBe(false);
    // too short, includes all
    expect(passwordRegex.test('Abc2@')).toBe(false);
    // missing uppercase, number, special
    expect(passwordRegex.test('abcdefghijkl')).toBe(false);
    // missing uppercase, special
    expect(passwordRegex.test('abcdefghijkl123')).toBe(false);
    // missing special
    expect(passwordRegex.test('Abcdefghijkl123')).toBe(false);
    // missing uppercase
    expect(passwordRegex.test('abcdefghijkl123&')).toBe(false);
    // missing number
    expect(passwordRegex.test('Abcdefghijkl$')).toBe(false);
    // missing lowercase
    expect(passwordRegex.test('ABCDEFGHIJKL^')).toBe(false);
  });
  it('should identify strong passwords', () => {
    expect(passwordRegex.test('Abcdefghijkl1!')).toBe(true);
    expect(passwordRegex.test('2$Iz3S7]$oME')).toBe(true);
    expect(passwordRegex.test('dC135+AY5nEt')).toBe(true);
    expect(passwordRegex.test(' .;^xJ8d37Na7')).toBe(true);
  });
});
