import { generateSingleUseCode } from '../../../src/utilities/generate-single-use-code';

describe('generateSingleUseCode', () => {
  it('should generate mfa code of the specified length', () => {
    expect(generateSingleUseCode(5).length).toEqual(5);
  });
});
