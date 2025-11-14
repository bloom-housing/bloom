import {
  LanguagesEnum,
  NeighborhoodAmenitiesEnum,
  Prisma,
  UserRoleEnum,
} from '@prisma/client';
import { randomName } from './word-generator';

export const jurisdictionFactory = (
  jurisdictionName = randomName(),
  optionalFields?: {
    listingApprovalPermissions?: UserRoleEnum[];
    duplicateListingPermissions?: UserRoleEnum[];
    featureFlags?: string[];
    requiredListingFields?: string[];
    languages?: LanguagesEnum[];
    visibleNeighborhoodAmenities?: NeighborhoodAmenitiesEnum[];
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
  whatToExpect:
    '<p>If you are interested in applying for this property, please get in touch in one of these ways:</p><ul><li><p>Phone</p></li><li><p>Email</p></li><li><p>In-person</p></li><li><p>In some instances, the property has a link directly to an application</p></li></ul><p>Once you contact a property, ask if they have any available units if you are looking to move in immediately.</p><p><strong>Waitlists</strong>:</p><p>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</p>',
  whatToExpectAdditionalText:
    "<ul><li><p>Property staff should walk you through the process to get on their waitlist.</p></li><li><p>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</p></li><li><p>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</p></li><li><p>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</p></li></ul>",
  whatToExpectUnderConstruction:
    'This property is still under construction by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.',
  enablePartnerSettings: true,
  enablePartnerDemographics: true,
  enableGeocodingPreferences: true,
  enableListingOpportunity: false,
  enableGeocodingRadiusMethod: false,
  listingApprovalPermissions: optionalFields?.listingApprovalPermissions || [],
  duplicateListingPermissions: optionalFields?.duplicateListingPermissions || [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
    UserRoleEnum.limitedJurisdictionAdmin,
    UserRoleEnum.supportAdmin,
  ],
  featureFlags: optionalFields?.featureFlags
    ? {
        connect: optionalFields.featureFlags.map((flag) => {
          return { name: flag };
        }),
      }
    : undefined,
  requiredListingFields: optionalFields?.requiredListingFields || [],
  visibleNeighborhoodAmenities: optionalFields?.visibleNeighborhoodAmenities,
});
