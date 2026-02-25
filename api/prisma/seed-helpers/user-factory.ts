import { LanguagesEnum, Prisma } from '@prisma/client';
import { randomAdjective, randomNoun } from './word-generator';
import { passwordToHash } from '../../src/utilities/password-helpers';

export const userFactory = async (optionalParams?: {
  acceptedTerms?: boolean;
  confirmedAt?: Date;
  email?: string;
  favoriteListings?: string[];
  firstName?: string;
  jurisdictionIds?: string[];
  lastName?: string;
  listings?: string[];
  mfaEnabled?: boolean;
  middleName?: string;
  password?: string;
  isApproved?: boolean;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  roles?: Prisma.UserRolesUncheckedCreateWithoutUserAccountsInput;
  singleUseCode?: string;
  lastLoginAt?: Date;
  wasWarnedOfDeletion?: boolean;
  language?: LanguagesEnum;
  isAdvocate?: boolean;
  agencyId?: string;
}): Promise<Prisma.UserAccountsCreateInput> => ({
  agreedToTermsOfService: optionalParams?.acceptedTerms || false,
  confirmedAt: optionalParams?.confirmedAt || null,
  lastLoginAt: optionalParams?.lastLoginAt || new Date(),
  wasWarnedOfDeletion: optionalParams?.wasWarnedOfDeletion || false,
  email:
    optionalParams?.email?.toLocaleLowerCase() ||
    `${randomNoun().toLowerCase()}${randomNoun().toLowerCase()}@${randomAdjective().toLowerCase()}.com`,
  firstName: optionalParams?.firstName || 'First',
  lastName: optionalParams?.lastName || 'Last',
  middleName: optionalParams?.middleName || 'Middle',
  mfaEnabled: optionalParams?.mfaEnabled || false,
  passwordHash: optionalParams?.password
    ? await passwordToHash(optionalParams?.password)
    : await passwordToHash('Abcdef12345!'),
  phoneNumber:
    optionalParams?.phoneNumber ||
    (optionalParams?.isAdvocate ? '(415) 555-1212' : undefined),
  phoneNumberVerified: optionalParams?.phoneNumberVerified || null,
  singleUseCode: optionalParams?.singleUseCode || null,
  singleUseCodeUpdatedAt: optionalParams?.mfaEnabled ? new Date() : undefined,
  language: optionalParams?.language || undefined,
  isAdvocate: optionalParams?.isAdvocate || undefined,
  isApproved: optionalParams?.isApproved || undefined,
  favoriteListings: optionalParams?.favoriteListings
    ? {
        connect: optionalParams.favoriteListings.map((listing) => {
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
  listings: optionalParams?.listings
    ? {
        connect: optionalParams.listings.map((listing) => {
          return { id: listing };
        }),
      }
    : undefined,
  userRoles: optionalParams?.roles
    ? {
        create: {
          isAdmin: optionalParams?.roles?.isAdmin || false,
          isJurisdictionalAdmin:
            optionalParams?.roles?.isJurisdictionalAdmin || false,
          isLimitedJurisdictionalAdmin:
            optionalParams?.roles?.isLimitedJurisdictionalAdmin || false,
          isPartner: optionalParams?.roles?.isPartner || false,
          isSuperAdmin: optionalParams?.roles?.isSuperAdmin || false,
          isSupportAdmin: optionalParams?.roles?.isSupportAdmin || false,
        },
      }
    : undefined,
  agency: optionalParams?.agencyId
    ? {
        connect: {
          id: optionalParams.agencyId,
        },
      }
    : undefined,
  address: optionalParams?.isAdvocate
    ? {
        create: {
          street: '123 Main St',
          city: 'Oakland',
          state: 'CA',
          zipCode: '94612',
        },
      }
    : undefined,
});
