import { getSingleUseCode } from '../../../src/utilities/get-single-use-code';

describe('getSingleUseCode', () => {
  jest.useFakeTimers().setSystemTime(new Date('2024-10-02T12:00:00.000Z'));
  it('should return same mfa code if still valid', () => {
    expect(
      getSingleUseCode(5, '00000', new Date('2024-10-02T12:00:00.000Z'), 60000),
    ).toEqual('00000');
  });
  it('should return new mfa code of the specified length if no longer valid', () => {
    const singleUseCode = getSingleUseCode(
      5,
      '00000',
      new Date('2024-10-02T11:49:00.000Z'),
      60000,
    );
    expect(singleUseCode).not.toEqual('00000');
    expect(singleUseCode.length).toEqual(5);
  });
});
