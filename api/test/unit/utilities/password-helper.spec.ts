import {
  isPasswordValid,
  passwordToHash,
  generateSalt,
} from '../../../src/utilities/password-helpers';
describe('Testing password helpers', () => {
  it('should generate salt of the correct length', () => {
    expect(generateSalt(15).length).toBe(15);
    expect(generateSalt().length).toBe(64);
  });

  it('should create a hash from password and verify that the password is valid', async () => {
    const hash = await passwordToHash('Abcdef12345!');
    const isValid = await isPasswordValid(hash, 'Abcdef12345!');
    expect(isValid).toBe(true);
  });

  it('should return false when incorrect password is provided', async () => {
    const hash = await passwordToHash('Abcdef12345!');
    const isValid = await isPasswordValid(hash, 'Abcdef67890!');
    expect(isValid).toBe(false);
  });
});
