import { LanguagesEnum, Prisma } from '@prisma/client';

export const jurisdictionFactory = (
  i: number,
): Prisma.JurisdictionsCreateInput => ({
  name: `name: ${i}`,
  notificationsSignUpUrl: `notificationsSignUpUrl: ${i}`,
  languages: [LanguagesEnum.en],
  partnerTerms: `partnerTerms: ${i}`,
  publicUrl: `publicUrl: ${i}`,
  emailFromAddress: `emailFromAddress: ${i}`,
  rentalAssistanceDefault: `rentalAssistanceDefault: ${i}`,
  enablePartnerSettings: true,
  enableAccessibilityFeatures: true,
  enableUtilitiesIncluded: true,
});
