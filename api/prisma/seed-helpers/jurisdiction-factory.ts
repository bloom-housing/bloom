import { LanguagesEnum, Prisma, UserRoleEnum } from '@prisma/client';
import { randomName } from './word-generator';

export const jurisdictionFactory = (
  jurisdictionName = randomName(),
  optionalFields?: {
    listingApprovalPermissions?: UserRoleEnum[];
    duplicateListingPermissions?: UserRoleEnum[];
    featureFlags?: string[];
    requiredListingFields?: string[];
    languages?: LanguagesEnum[];
  },
): Prisma.JurisdictionsCreateInput => ({
  name: jurisdictionName,
  notificationsSignUpUrl: 'https://www.exygy.com',
  languages: optionalFields?.languages || [LanguagesEnum.en, LanguagesEnum.es],
  partnerTerms: 'Example Terms',
  publicUrl: 'http://localhost:3000',
  emailFromAddress: 'Bloom <bloom-no-reply@exygy.dev>',
  rentalAssistanceDefault:
    'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
  enablePartnerSettings: true,
  enablePartnerDemographics: true,
  enableGeocodingPreferences: true,
  enableListingOpportunity: false,
  enableGeocodingRadiusMethod: false,
  listingApprovalPermissions: optionalFields?.listingApprovalPermissions || [],
  duplicateListingPermissions: optionalFields?.duplicateListingPermissions || [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
  ],
  featureFlags: optionalFields?.featureFlags
    ? {
        connect: optionalFields.featureFlags.map((flag) => {
          return { name: flag };
        }),
      }
    : undefined,
  requiredListingFields: optionalFields?.requiredListingFields || [],
});
