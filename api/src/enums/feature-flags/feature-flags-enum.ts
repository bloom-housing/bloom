// List of feature flags
// Note, these are just used to keep backend and frontend in sync. We store feature flags as strings so this list might not include every flag.
// Keep alphabetized for readability.
export enum FeatureFlagEnum {
  disableCommonApplication = 'disableCommonApplication',
  disableJurisdictionalAdmin = 'disableJurisdictionalAdmin',
  disableListingPreferences = 'disableListingPreferences',
  disableWorkInRegion = 'disableWorkInRegion',
  enableAccessibilityFeatures = 'enableAccessibilityFeatures',
  enableAdaOtherOption = 'enableAdaOtherOption',
  enableAdditionalResources = 'enableAdditionalResources',
  enableCompanyWebsite = 'enableCompanyWebsite',
  enableFullTimeStudentQuestion = 'enableFullTimeStudentQuestion',
  enableGeocodingPreferences = 'enableGeocodingPreferences',
  enableGeocodingRadiusMethod = 'enableGeocodingRadiusMethod',
  enableHomeType = 'enableHomeType',
  enableHousingDeveloperOwner = 'enableHousingDeveloperOwner',
  enableIsVerified = 'enableIsVerified',
  enableLimitedHowDidYouHear = 'enableLimitedHowDidYouHear',
  enableListingFavoriting = 'enableListingFavoriting',
  enableListingFiltering = 'enableListingFiltering',
  enableListingOpportunity = 'enableListingOpportunity',
  enableListingPagination = 'enableListingPagination',
  enableListingUpdatedAt = 'enableListingUpdatedAt',
  enableMarketingStatus = 'enableMarketingStatus',
  enableNeighborhoodAmenities = 'enableNeighborhoodAmenities',
  enableNeighborhoodAmenitiesDropdown = 'enableNeighborhoodAmenitiesDropdown',
  enableNonRegulatedListings = 'enableNonRegulatedListings',
  enablePartnerDemographics = 'enablePartnerDemographics',
  enablePartnerSettings = 'enablePartnerSettings',
  enableRegions = 'enableRegions',
  enableSection8Question = 'enableSection8Question',
  enableSingleUseCode = 'enableSingleUseCode',
  enableSupportAdmin = 'enableSupportAdmin',
  enableUnderConstructionHome = 'enableUnderConstructionHome',
  enableUnitGroups = 'enableUnitGroups',
  enableUtilitiesIncluded = 'enableUtilitiesIncluded',
  enableWaitlistAdditionalFields = 'enableWaitlistAdditionalFields',
  enableWaitlistLottery = 'enableWaitlistLottery',
  enableWhatToExpectAdditionalField = 'enableWhatToExpectAdditionalField',
  enableV2MSQ = 'enableV2MSQ',
  example = 'example', // sample feature flag for testing purposes
  hideCloseListingButton = 'hideCloseListingButton',
  swapCommunityTypeWithPrograms = 'swapCommunityTypeWithPrograms',
}

// List of all of existing flags and their descriptions.
// This should be the source of all feature flags in our system.
// Keep alphabetized for readability.
export const featureFlagMap: { name: string; description: string }[] = [
  {
    name: FeatureFlagEnum.disableCommonApplication,
    description:
      'When true, the digital common application is not an option for listings',
  },
  {
    name: FeatureFlagEnum.disableJurisdictionalAdmin,
    description: 'When true, jurisdictional admins cannot be created',
  },
  {
    name: FeatureFlagEnum.disableListingPreferences,
    description:
      'When true listings will no longer support preferences section',
  },
  {
    name: FeatureFlagEnum.disableWorkInRegion,
    description:
      'When true the "Work in Region" question will be removed from the application process',
  },
  {
    name: FeatureFlagEnum.enableAccessibilityFeatures,
    description:
      "When true, the 'accessibility features' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableAdaOtherOption,
    description:
      "When true, the ADA impairment options will include 'For Other Impairments'",
  },
  {
    name: FeatureFlagEnum.enableAdditionalResources,
    description:
      "When true, the 'learn more' section is displayed on the home page",
  },
  {
    name: FeatureFlagEnum.enableCompanyWebsite,
    description:
      'When true, allows partners to add company website information',
  },
  {
    name: FeatureFlagEnum.enableFullTimeStudentQuestion,
    description:
      'When true, the full time student question is displayed in the application form',
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
    name: FeatureFlagEnum.enableHomeType,
    description: 'When true, home type feature is turned on',
  },
  {
    name: FeatureFlagEnum.enableHousingDeveloperOwner,
    description:
      "When true, the 'Housing developer' field label becomes 'Housing developer / owner'",
  },
  {
    name: FeatureFlagEnum.enableIsVerified,
    description:
      'When true, the listing can ba have its contents manually verified by a user',
  },
  {
    name: FeatureFlagEnum.enableLimitedHowDidYouHear,
    description:
      'When true, the Radio Ad and Bus Ad options are removed from the how did you hear section.',
  },
  {
    name: FeatureFlagEnum.enableListingFavoriting,
    description:
      'When true, a Favorite button is shown for public listings and users can view their favorited listings',
  },
  {
    name: FeatureFlagEnum.enableListingFiltering,
    description:
      'When true, a filter button is shown on listings browse and users can filter with the options in the drawer',
  },
  {
    name: FeatureFlagEnum.enableListingOpportunity,
    description:
      "When true, any newly published listing will send a gov delivery email to everyone that has signed up for the 'listing alerts'",
  },
  {
    name: FeatureFlagEnum.enableListingPagination,
    description:
      'When true listings browser will display pagination controls section',
  },
  {
    name: FeatureFlagEnum.enableListingUpdatedAt,
    description: 'When true, listings detail will display an updated at date',
  },
  {
    name: FeatureFlagEnum.enableMarketingStatus,
    description:
      "When true, the 'marketing status' sub-section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableNeighborhoodAmenities,
    description:
      "When true, the 'neighborhood amenities' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown,
    description:
      'When true, neighborhood amenities inputs render as dropdowns with distance options instead of textareas',
  },
  {
    name: FeatureFlagEnum.enableNonRegulatedListings,
    description:
      'When true, non-regulated listings are displayed in listing creation/edit and public listing view',
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
    name: FeatureFlagEnum.enableRegions,
    description:
      'When true, the region can be defined for the building address',
  },
  {
    name: FeatureFlagEnum.enableSection8Question,
    description: 'When true, the Section 8 listing data will be visible',
  },
  {
    name: FeatureFlagEnum.enableSingleUseCode,
    description:
      'When true, the backend allows for logging into this jurisdiction using the single use code flow',
  },
  {
    name: FeatureFlagEnum.enableSupportAdmin,
    description: 'When true, support admins can be created',
  },
  {
    name: FeatureFlagEnum.enableUnderConstructionHome,
    description:
      "When true, the 'under construction' section is displayed on the home page",
  },
  {
    name: FeatureFlagEnum.enableUnitGroups,
    description: 'When true, uses unit groups instead of units',
  },
  {
    name: FeatureFlagEnum.enableUtilitiesIncluded,
    description:
      "When true, the 'utilities included' section is displayed in listing creation/edit and the public listing view",
  },
  {
    name: FeatureFlagEnum.enableWaitlistAdditionalFields,
    description:
      'When true, the waitlist additional fields are displayed in the waitlist section of the listing form',
  },
  {
    name: FeatureFlagEnum.enableWaitlistLottery,
    description:
      'When true, jurisdiction supports lotteries for waitlist opportunities',
  },
  {
    name: FeatureFlagEnum.enableWhatToExpectAdditionalField,
    description:
      'When true, the what to expect additional field is displayed in listing creation/edit form on the partner site',
  },
  {
    name: FeatureFlagEnum.enableV2MSQ,
    description: 'When true, the new mutliselect question logic will be used.',
  },
  {
    name: FeatureFlagEnum.hideCloseListingButton,
    description: 'When true, close button is hidden on the listing edit form',
  },
  {
    name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
    description:
      'When true, the programs section on the frontend is displayed as community types.',
  },
];
