import { checkUserLockout } from '../../../src/utilities/passport-validator-utilities';

describe('Testing checkUserLockout', () => {
  it('should return without erroring and set failedLoginAttemptsCount to be 0 if lockout expired', () => {
    const val = {
      lastLoginAt: new Date('01/01/2024'),
      failedLoginAttemptsCount: 5,
    };
    const updatedFailedLoginCount = checkUserLockout(
      val.lastLoginAt,
      val.failedLoginAttemptsCount,
      5,
      10,
    );
    expect(updatedFailedLoginCount).toEqual(0);
  });

  it('should return without erroring and leave failed login count unchanged if user is and was not locked out', () => {
    const val = {
      lastLoginAt: new Date('01/01/2024'),
      failedLoginAttemptsCount: 2,
    };
    const updatedFailedLoginCount = checkUserLockout(
      val.lastLoginAt,
      val.failedLoginAttemptsCount,
      5,
      10,
    );
    expect(updatedFailedLoginCount).toEqual(2);
  });

  it('should error if user is still in lockout period', () => {
    const val = {
      lastLoginAt: new Date(),
      failedLoginAttemptsCount: 5,
    };
    expect(
      async () =>
        await checkUserLockout(
          val.lastLoginAt,
          val.failedLoginAttemptsCount,
          5,
          10,
        ),
    ).rejects.toThrowError(`Failed login attempts exceeded.`);
  });
});
