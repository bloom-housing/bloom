import { passwordRegex } from '../../../src/utilities/password-regex';
describe('Testing password regex', () => {
  it('should not match for weak password', () => {
    expect(passwordRegex.test('abcdef')).toBe(false);
  });
  it('should match for strong password', () => {
    expect(passwordRegex.test('abcdef123')).toBe(true);
  });
});
