import { HttpException, HttpStatus } from '@nestjs/common';

/**
 *
 * @param lastLoginAt the last time the user logged in (stored in db)
 * @param failedLoginAttemptsCount the number of times the user failed to log in (stored in db)
 * @param maxAttempts the maximum number of attempts before user is considered locked out (env variable)
 *
 * @returns throws error if user is already locked out
 */
export function isUserLockedOut(
  lastLoginAt: Date,
  failedLoginAttemptsCount: number,
  maxAttempts: number,
  cooldown: number,
): void {
  if (lastLoginAt && failedLoginAttemptsCount >= maxAttempts) {
    // if a user has logged in, but has since gone over their max failed login attempts
    const retryAfter = new Date(lastLoginAt.getTime() + cooldown);
    if (retryAfter <= new Date()) {
      // if we have passed the login lock TTL, reset login lock countdown
      failedLoginAttemptsCount = 0;
    } else {
      // if the login lock is still a valid lock, error
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Failed login attempts exceeded.',
          retryAfter,
        },
        429,
      );
    }
  }
}

/**
 *
 * @param incomingSingleUseCode single use code that was sent as part of the request
 * @param storedSingleUseCode single use code that is stored in the db for this user
 * @param singleUseCodeUpdatedAt last time a single use code was set for a user (stord in db)
 * @returns true if all params are present
 */
export function singleUseCodePresent(
  incomingSingleUseCode: string,
  storedSingleUseCode: string,
  singleUseCodeUpdatedAt: Date,
) {
  return incomingSingleUseCode && storedSingleUseCode && singleUseCodeUpdatedAt;
}

/**
 *
 * @param singleUseCodeUpdatedAt last time a single use code was set for a user (stored in db)
 * @param ttl how long the single use code should stay active (env variable)
 * @param incomingSingleUseCode single use code passed in as part of the request
 * @param storedSingleUseCode single use code stored on the user
 * @returns
 */
export function singleUseCodeInvalid(
  singleUseCodeUpdatedAt: Date,
  ttl: number,
  incomingSingleUseCode: string,
  storedSingleUseCode: string,
): boolean {
  return (
    new Date(singleUseCodeUpdatedAt.getTime() + ttl) < new Date() ||
    storedSingleUseCode !== incomingSingleUseCode
  );
}
