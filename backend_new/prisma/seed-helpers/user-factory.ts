import { Prisma } from '@prisma/client';
import { randomAdjective, randomNoun } from './word-generator';
import { passwordToHash } from '../../src/utilities/password-helpers';

export const userFactory = async (optionalParams?: {
  roles?: Prisma.UserRolesUncheckedCreateWithoutUserAccountsInput;
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<Prisma.UserAccountsCreateInput> => ({
  email:
    optionalParams?.email?.toLocaleLowerCase() ||
    `${randomNoun().toLowerCase()}@${randomAdjective().toLowerCase()}.com`,
  firstName: optionalParams?.firstName || 'First',
  lastName: optionalParams?.lastName || 'Last',
  // TODO: update with passwordService hashing when that is completed
  passwordHash: await passwordToHash('abcdef'),
  userRoles: {
    create: {
      isAdmin: optionalParams?.roles?.isAdmin || false,
      isJurisdictionalAdmin:
        optionalParams?.roles?.isJurisdictionalAdmin || false,
      isPartner: optionalParams?.roles?.isAdmin || false,
    },
  },
});
