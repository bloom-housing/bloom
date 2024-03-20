import { generateSingleUseCode } from '../../../src/utilities/generate-single-use-code';
import 'dotenv/config.js';

describe('generateSingleUseCode', () => {
  it('should generate mfa code of the specified length', () => {
    expect(generateSingleUseCode().length).toEqual(
      Number(process.env.MFA_CODE_LENGTH),
    );
  });
});
