import { Prisma } from '@prisma/client';
import { randomAdjective, randomNoun } from './word-generator';
import { passwordToHash } from '../../src/utilities/password-helpers';

export const userFactory = async (optionalParams?: {
  roles?: Prisma.UserRolesUncheckedCreateWithoutUserAccountsInput;
  firstName?: string;
  lastName?: string;
  email?: string;
  mfaCode?: string;
  mfaEnabled?: boolean;
  confirmedAt?: Date;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  jurisdictionId?: string;
  listings?: string[];
}): Promise<Prisma.UserAccountsCreateInput> => ({
  email:
    optionalParams?.email?.toLocaleLowerCase() ||
    `${randomNoun().toLowerCase()}@${randomAdjective().toLowerCase()}.com`,
  firstName: optionalParams?.firstName || 'First',
  lastName: optionalParams?.lastName || 'Last',
  passwordHash: await passwordToHash('abcdef'),
  userRoles: {
    create: {
      isAdmin: optionalParams?.roles?.isAdmin || false,
      isJurisdictionalAdmin:
        optionalParams?.roles?.isJurisdictionalAdmin || false,
      isPartner: optionalParams?.roles?.isPartner || false,
    },
  },
  mfaCode: optionalParams?.mfaCode || null,
  mfaEnabled: optionalParams?.mfaEnabled || false,
  confirmedAt: optionalParams?.confirmedAt || null,
  mfaCodeUpdatedAt: optionalParams?.mfaEnabled ? new Date() : undefined,
  phoneNumber: optionalParams?.phoneNumber || null,
  phoneNumberVerified: optionalParams?.phoneNumberVerified || null,
  listings: optionalParams?.listings
    ? {
        connect: optionalParams.listings.map((listing) => {
          return { id: listing };
        }),
      }
    : undefined,
  jurisdictions: optionalParams?.jurisdictionId
    ? { connect: { id: optionalParams?.jurisdictionId } }
    : undefined,
});