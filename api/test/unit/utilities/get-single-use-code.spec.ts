import { getSingleUseCode } from '../../../src/utilities/get-single-use-code';

describe('getSingleUseCode', () => {
  it('should return same mfa code if still valid', () => {
    expect(getSingleUseCode(5, '00000', new Date(), 60000)).toEqual('00000');
  });
  it('should return new mfa code of the specified length if no longer valid', () => {
    const singleUseCode = getSingleUseCode(
      5,
      '00000',
      new Date(new Date().getTime() - 80000),
      60000,
    );
    expect(singleUseCode).not.toEqual('00000');
    expect(singleUseCode.length).toEqual(5);
  });
});
