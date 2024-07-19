import { Prisma } from '@prisma/client';
import { randomAdjective, randomNoun } from './word-generator';
import { passwordToHash } from '../../src/utilities/password-helpers';

export const userFactory = async (optionalParams?: {
  roles?: Prisma.UserRolesUncheckedCreateWithoutUserAccountsInput;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  singleUseCode?: string;
  mfaEnabled?: boolean;
  confirmedAt?: Date;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  jurisdictionIds?: string[];
  listings?: string[];
  acceptedTerms?: boolean;
  password?: string;
}): Promise<Prisma.UserAccountsCreateInput> => ({
  email:
    optionalParams?.email?.toLocaleLowerCase() ||
    `${randomNoun().toLowerCase()}${randomNoun().toLowerCase()}@${randomAdjective().toLowerCase()}.com`,
  firstName: optionalParams?.firstName || 'First',
  middleName: optionalParams?.middleName || 'Middle',
  lastName: optionalParams?.lastName || 'Last',
  passwordHash: optionalParams?.password
    ? await passwordToHash(optionalParams?.password)
    : await passwordToHash('Abcdef12345!'),
  userRoles: optionalParams?.roles
    ? {
        create: {
          isAdmin: optionalParams?.roles?.isAdmin || false,
          isJurisdictionalAdmin:
            optionalParams?.roles?.isJurisdictionalAdmin || false,
          isLimitedJurisdictionalAdmin:
            optionalParams?.roles?.isLimitedJurisdictionalAdmin || false,
          isPartner: optionalParams?.roles?.isPartner || false,
        },
      }
    : undefined,
  singleUseCode: optionalParams?.singleUseCode || null,
  mfaEnabled: optionalParams?.mfaEnabled || false,
  confirmedAt: optionalParams?.confirmedAt || null,
  singleUseCodeUpdatedAt: optionalParams?.mfaEnabled ? new Date() : undefined,
  phoneNumber: optionalParams?.phoneNumber || null,
  phoneNumberVerified: optionalParams?.phoneNumberVerified || null,
  agreedToTermsOfService: optionalParams?.acceptedTerms || false,
  listings: optionalParams?.listings
    ? {
        connect: optionalParams.listings.map((listing) => {
          return { id: listing };
        }),
      }
    : undefined,
  jurisdictions: optionalParams?.jurisdictionIds
    ? {
        connect: optionalParams?.jurisdictionIds.map((jurisdiction) => {
          return {
            id: jurisdiction,
          };
        }),
      }
    : undefined,
});
