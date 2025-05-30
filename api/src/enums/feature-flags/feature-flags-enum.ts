// List of feature flags
// Note, these are just used to keep backend and frontend in sync. We store feature flags as strings so this list might not include every flag
export enum FeatureFlagEnum {
  example = 'example', // sample feature flag for testing purposes
  enableHomeType = 'enableHomeType',
  enableAccessibilityFeatures = 'enableAccessibilityFeatures',
  enableUtilitiesIncluded = 'enableUtilitiesIncluded',
  enableIsVerified = 'enableIsVerified',
  enableNeighborhoodAmenities = 'enableNeighborhoodAmenities',
  hideCloseListingButton = 'hideCloseListingButton',
  enableMarketingStatus = 'enableMarketingStatus',
  enableRegions = 'enableRegions',
  enableSection8Question = 'enableSection8Question',
  enableUnitGroups = 'enableUnitGroups',
  enableListingsPagination = 'enableListingPagination',
  enableSingleUseCode = 'enableSingleUseCode',
  enableGeocodingPreferences = 'enableGeocodingPreferences',
  enableGeocodingRadiusMethod = 'enableGeocodingRadiusMethod',
  enableListingOpportunity = 'enableListingOpportunity',
  enablePartnerDemographics = 'enablePartnerDemographics',
  enablePartnerSettings = 'enablePartnerSettings',
  disableJurisdictionalAdmin = 'disableJurisdictionalAdmin',
  enableListingFavoriting = 'enableListingFavoriting',
}

// List of all of existing flags and their descriptions.
// This should be the source of all feature flags in our system
export const featureFlagMap: { name: string; description: string }[] = [
  {
    name: FeatureFlagEnum.enableHomeType,
    description: 'When true, home type feature is turned on',
  },
  {
    name: FeatureFlagEnum.enableAccessibilityFeatures,
    description:
      "When true, the 'accessibility features' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableUtilitiesIncluded,
    description:
      "When true, the 'utilities included' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableIsVerified,
    description:
      'When true, the listing can ba have its contents manually verified by a user',
  },
  {
    name: FeatureFlagEnum.enableNeighborhoodAmenities,
    description:
      "When true, the 'neighborhood amenities' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.hideCloseListingButton,
    description: 'When true, close button is hidden on the listing edit form',
  },
  {
    name: FeatureFlagEnum.enableMarketingStatus,
    description:
      "When true, the 'marketing status' sub-section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableRegions,
    description:
      'When true, the region can be defined for the building address',
  },
  {
    name: FeatureFlagEnum.enableSection8Question,
    description: 'When true, the Section 8 listing data will be visible',
  },
  {
    name: FeatureFlagEnum.enableUnitGroups,
    description: 'When true, uses unit groups instead of units',
  },
  {
    name: FeatureFlagEnum.enableSingleUseCode,
    description:
      'When true, the backend allows for logging into this jurisdiction using the single use code flow',
  },
  {
    name: FeatureFlagEnum.enableGeocodingPreferences,
    description:
      'When true, preferences can be created with geocoding functionality and when an application is created/updated on a listing that is geocoding then the application gets geocoded',
  },
  {
    name: FeatureFlagEnum.enableGeocodingRadiusMethod,
    description:
      'When true, preferences can be created with geocoding functionality that verifies via a mile radius',
  },
  {
    name: FeatureFlagEnum.enableListingOpportunity,
    description:
      "When true, any newly published listing will send a gov delivery email to everyone that has signed up for the 'listing alerts'",
  },
  {
    name: FeatureFlagEnum.enablePartnerDemographics,
    description:
      'When true, demographics data is included in application or lottery exports for partners',
  },
  {
    name: FeatureFlagEnum.enablePartnerSettings,
    description: "When true, the 'settings' tab in the partner site is visible",
  },
  {
    name: FeatureFlagEnum.enableListingsPagination,
    description:
      'When true listings browser will display pagination controls section',
  },
  {
    name: FeatureFlagEnum.enableListingFavoriting,
    description:
      'When true, a Favorite button is shown for public listings and users can view their favorited listings',
  },
  {
    name: FeatureFlagEnum.disableJurisdictionalAdmin,
    description: 'When true, jurisdictional admins cannot be created',
  },
];
