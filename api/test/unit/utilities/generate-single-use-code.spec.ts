import { generateSingleUseCode } from '../../../src/utilities/generate-single-use-code';

describe('generateSingleUseCode', () => {
  it('should generate mfa code of the specified length', () => {
    expect(generateSingleUseCode().length).toEqual(
      Number(process.env.MFA_CODE_LENGTH),
    );
  });
});
