import { ForbiddenException } from '@nestjs/common';
import { assertSuperAdmin } from '../../../src/utilities/assert-super-admin';
import { User } from '../../../src/dtos/users/user.dto';

const userWith = (userRoles?: User['userRoles']) => ({ userRoles } as User);

describe('assertSuperAdmin', () => {
  it('allows a superadmin', () => {
    expect(() =>
      assertSuperAdmin(userWith({ isAdmin: true, isSuperAdmin: true })),
    ).not.toThrow();
  });

  it.each([
    ['an anonymous request', undefined],
    ['a user with no roles', userWith(undefined)],
    ['an admin who is not a superadmin', userWith({ isAdmin: true })],
    [
      'a user whose superadmin flag is false',
      userWith({ isAdmin: true, isSuperAdmin: false }),
    ],
  ])('forbids %s', (_label, user) => {
    expect(() => assertSuperAdmin(user)).toThrow(ForbiddenException);
  });
});
