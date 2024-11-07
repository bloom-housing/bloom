import { LanguagesEnum, Prisma, UserRoleEnum } from '@prisma/client';
import { randomName } from './word-generator';

export const jurisdictionFactory = (
  jurisdictionName = randomName(),
  listingApprovalPermissions?: UserRoleEnum[],
  duplicateListingPermissions?: UserRoleEnum[],
): Prisma.JurisdictionsCreateInput => ({
  name: jurisdictionName,
  notificationsSignUpUrl: 'https://www.exygy.com',
  languages: [LanguagesEnum.en],
  partnerTerms: 'Example Terms',
  publicUrl: 'http://localhost:3000',
  emailFromAddress: 'Bloom <bloom-no-reply@exygy.dev>',
  rentalAssistanceDefault:
    'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
  enablePartnerSettings: true,
  enablePartnerDemographics: true,
  enableAccessibilityFeatures: true,
  enableUtilitiesIncluded: true,
  enableGeocodingPreferences: true,
  enableListingOpportunity: false,
  enableGeocodingRadiusMethod: false,
  listingApprovalPermissions: listingApprovalPermissions || [],
  duplicateListingPermissions: duplicateListingPermissions || [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
  ],
});
