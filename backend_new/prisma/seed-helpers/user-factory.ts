import { Prisma } from '@prisma/client';

export const userFactory = (
  roles?: Prisma.UserRolesUncheckedCreateWithoutUserAccountsInput,
): Prisma.UserAccountsCreateInput => ({
  email: 'admin@example.com',
  firstName: 'First',
  lastName: 'Last',
  // TODO: update with passwordService hashing when that is completed
  passwordHash:
    'a921d45de2db97818a124126706a1bf52310d231be04e1764d4eedffaccadcea3af70fa1d806b8527b2ebb98a2dd48ab3f07238bb9d39d4bcd2de4c207b67d4e#c870c8c0dbc08b27f4fc1dab32266cfde4aef8f2c606dab1162f9e71763f1fd11f28b2b81e05e7aeefd08b745d636624b623f505d47a54213fb9822c366bbbfe',
  userRoles: {
    create: {
      isAdmin: roles?.isAdmin || false,
      isJurisdictionalAdmin: roles?.isJurisdictionalAdmin || false,
      isPartner: roles?.isAdmin || false,
    },
  },
});
