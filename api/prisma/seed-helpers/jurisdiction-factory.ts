import {
  LanguagesEnum,
  NeighborhoodAmenitiesEnum,
  Prisma,
  UserRoleEnum,
} from '@prisma/client';
import { randomName } from './word-generator';
import { ListingFeaturesConfiguration } from '../../src/dtos/jurisdictions/listing-features-config.dto';
import { UnitAccessibilityPriorityTypeEnum } from '../../src/enums/units/accessibility-priority-type-enum';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';

export const jurisdictionFactory = (
  jurisdictionName = randomName(),
  optionalFields?: {
    listingApprovalPermissions?: UserRoleEnum[];
    duplicateListingPermissions?: UserRoleEnum[];
    featureFlags?: string[];
    requiredListingFields?: string[];
    languages?: LanguagesEnum[];
    visibleNeighborhoodAmenities?: NeighborhoodAmenitiesEnum[];
    visibleAccessibilityPriorityTypes?: UnitAccessibilityPriorityTypeEnum[];
    regions?: string[];
    minimumListingPublishImagesRequired?: number;
    publicSiteBaseURL?: string;
    listingFeaturesConfiguration?: ListingFeaturesConfiguration;
    raceEthnicityConfiguration?: RaceEthnicityConfiguration;
  },
): Prisma.JurisdictionsCreateInput => ({
  name: jurisdictionName,
  notificationsSignUpUrl: 'https://www.exygy.com',
  languages: optionalFields?.languages || [LanguagesEnum.en, LanguagesEnum.es],
  partnerTerms:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel condimentum nunc. Donec cursus risus mi, nec euismod libero scelerisque vitae. Nam hendrerit, nisi sed ornare dapibus, tellus ante fermentum nulla, sit amet tincidunt ante erat at ligula. Aenean pharetra, mi et viverra dignissim, lectus turpis congue purus, sed auctor enim felis non nisi. Quisque ultricies porta semper. Praesent quis sapien nisi. Aenean nec vehicula nulla. Curabitur sit amet bibendum nibh. Quisque tristique ex mollis, interdum odio eu, cursus mi. Proin varius nulla a faucibus dapibus. Quisque a turpis nisl. Proin tellus ligula, elementum nec velit sed, sollicitudin cursus neque. Ut sodales luctus porttitor. Nunc sollicitudin odio vitae nibh feugiat ornare. Pellentesque nec eros justo. Aenean sit amet iaculis dolor. Aliquam porta tincidunt lectus, non egestas ipsum consectetur blandit. Vivamus nec neque ut risus interdum vehicula. Aenean ultrices posuere ante sit amet lacinia. Etiam tincidunt orci non purus consequat tincidunt. Aliquam diam arcu, placerat et venenatis ac, tristique a ex. Proin at molestie tortor, et gravida dui. In hac habitasse platea dictumst.',
  publicUrl: optionalFields?.publicSiteBaseURL
    ? optionalFields.publicSiteBaseURL
    : 'http://localhost:3000',
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
  enableGeocodingPreferences: true,
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
  visibleAccessibilityPriorityTypes:
    optionalFields?.visibleAccessibilityPriorityTypes ||
    Object.values(UnitAccessibilityPriorityTypeEnum),
  regions: optionalFields?.regions,
  minimumListingPublishImagesRequired:
    optionalFields?.minimumListingPublishImagesRequired,
  listingFeaturesConfiguration: optionalFields?.listingFeaturesConfiguration
    ? (optionalFields.listingFeaturesConfiguration as unknown as Prisma.JsonArray)
    : undefined,
  raceEthnicityConfiguration: optionalFields?.raceEthnicityConfiguration
    ? (optionalFields.raceEthnicityConfiguration as unknown as Prisma.JsonArray)
    : undefined,
});
