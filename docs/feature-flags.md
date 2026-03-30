# Feature Flags

## How it works

Feature flags are on/off switches that control which features are enabled for each jurisdiction within the Bloom codebase. They are stored in the `feature_flag` table and associated with jurisdictions via the `_FeatureFlagsToJurisdictions` relation table.

Feature flags are boolean only, meaning they are strictly used for toggling features on or off. Any jurisdiction configuration that requires non-boolean values must be handled separately. Each feature flag also has a global `active` field. When `active` is set to false, the flag is effectively disabled across all jurisdictions it is associated with.

The source of truth for all feature flags is [feature-flags-enum.ts](../api/src/enums/feature-flags/feature-flags-enum.ts), which is shared across the API and both the public and partner frontends. Feature flags are not automatically added to the database. To add new flags, include them in the `featureFlagMap` and call the `featureFlags/addAllNew` API endpoint.

### Managing jurisdiction relationship

The easiest way to manage feature flags is through a hidden page on the partner site. If you are logged in as a super admin, navigate to the `/admin` endpoint to access it.

From there you can:

- **Add all feature flags to the database** using the "Add all new feature flags" button
- **Assign feature flags to jurisdictions** using either the "view by jurisdiction" or "view by feature flag" table

Changes to feature flag assignments take effect immediately. However, a redeploy of the public site may be required depending on which page(s) the affected feature flag is used on.

## Feature flag list

The following are all of the feature flags currently available in the Bloom platform.

<!-- TABLE:START -->

| Flag | Description |
|------|-------------|
| [disableAccessibilityFeaturesTag](./feature-flags/disableAccessibilityFeaturesTag.md) | When true, the listing 'accessibility features' tag is hidden on public listing cards and details |
| [disableBuildingSelectionCriteria](./feature-flags/disableBuildingSelectionCriteria.md) | When true, building selection criteria is not displayed in the listing |
| [disableCommonApplication](./feature-flags/disableCommonApplication.md) | When true, the digital common application is not an option for listings |
| [disableEthnicityQuestion](./feature-flags/disableEthnicityQuestion.md) | When true, the ethnicity question is hidden in the application demographics section |
| [disableJurisdictionalAdmin](./feature-flags/disableJurisdictionalAdmin.md) | When true, jurisdictional admins cannot be created |
| [disableListingPreferences](./feature-flags/disableListingPreferences.md) | When true listings will no longer support preferences section |
| [disableWorkInRegion](./feature-flags/disableWorkInRegion.md) | When true the "Work in Region" question will be removed from the application process |
| [enableAccessibilityFeatures](./feature-flags/enableAccessibilityFeatures.md) | When true, the 'accessibility features' section is displayed in listing creation/edit and the public listing view |
| [enableAdaOtherOption](./feature-flags/enableAdaOtherOption.md) | When true, the ADA impairment options will include 'For Other Impairments' |
| [enableAdditionalResources](./feature-flags/enableAdditionalResources.md) | When true, the 'learn more' section is displayed on the home page |
| [enableApplicationStatus](./feature-flags/enableApplicationStatus.md) | When true, the application status and notifications feature is enabled on public and partners |
| [enableCompanyWebsite](./feature-flags/enableCompanyWebsite.md) | When true, allows partners to add company website information |
| [enableConfigurableRegions](./feature-flags/enableConfigurableRegions.md) | When true, allows for configurable regions per jurisdiction enabled on partners and public |
| [enableCreditScreeningFee](./feature-flags/enableCreditScreeningFee.md) | When true, credit screening fee is enabled for listings |
| [enableFaq](./feature-flags/enableFaq.md) | When true, a link to the FAQ page is displayed on the get assistance page |
| [enableFullTimeStudentQuestion](./feature-flags/enableFullTimeStudentQuestion.md) | When true, the full time student question is displayed in the application form |
| [enableGeocodingPreferences](./feature-flags/enableGeocodingPreferences.md) | When true, preferences can be created with geocoding functionality and when an application is created/updated on a listing that is geocoding then the application gets geocoded |
| [enableGeocodingRadiusMethod](./feature-flags/enableGeocodingRadiusMethod.md) | When true, preferences can be created with geocoding functionality that verifies via a mile radius |
| [enableHomeType](./feature-flags/enableHomeType.md) | When true, home type feature is turned on |
| [enableHousingAdvocate](./feature-flags/enableHousingAdvocate.md) | When true, partners can view housing advocate users |
| [enableHousingBasics](./feature-flags/enableHousingBasics.md) | When true, a link to the housing basics page is displayed on the get assistance page |
| [enableHousingDeveloperOwner](./feature-flags/enableHousingDeveloperOwner.md) | When true, the 'Housing developer' field label becomes 'Housing developer / owner' |
| [enableIsVerified](./feature-flags/enableIsVerified.md) | When true, the listing can ba have its contents manually verified by a user |
| [enableLeasingAgentAltText](./feature-flags/enableLeasingAgentAltText.md) | When true, shows alternative text for LA users |
| [enableLimitedHowDidYouHear](./feature-flags/enableLimitedHowDidYouHear.md) | When true, the Radio Ad and Bus Ad options are removed from the how did you hear section. |
| [enableListingFavoriting](./feature-flags/enableListingFavoriting.md) | When true, a Favorite button is shown for public listings and users can view their favorited listings |
| [enableListingFileNumber](./feature-flags/enableListingFileNumber.md) | When true, partners can enter and export a listing file number |
| [enableListingFiltering](./feature-flags/enableListingFiltering.md) | When true, a filter button is shown on listings browse and users can filter with the options in the drawer |
| [enableListingImageAltText](./feature-flags/enableListingImageAltText.md) | When true, allows partners to add alt text to listing images |
| [enableListingOpportunity](./feature-flags/enableListingOpportunity.md) | When true, any newly published listing will send a gov delivery email to everyone that has signed up for the 'listing alerts' |
| [enableListingPagination](./feature-flags/enableListingPagination.md) | When true listings browser will display pagination controls section |
| [enableListingUpdatedAt](./feature-flags/enableListingUpdatedAt.md) | When true, listings detail will display an updated at date |
| [enableMarketingFlyer](./feature-flags/enableMarketingFlyer.md) | When true, the 'marketing flyer' sub-section is displayed in listing creation/edit and the public listing view |
| [enableMarketingStatus](./feature-flags/enableMarketingStatus.md) | When true, the 'marketing status' sub-section is displayed in listing creation/edit and the public listing view |
| [enableMarketingStatusMonths](./feature-flags/enableMarketingStatusMonths.md) | When true, the 'marketing status' sub-section uses months instead of seasons (functions only if enableMarketingStatus is also true) |
| [enableNeighborhoodAmenities](./feature-flags/enableNeighborhoodAmenities.md) | When true, the 'neighborhood amenities' section is displayed in listing creation/edit and the public listing view |
| [enableNeighborhoodAmenitiesDropdown](./feature-flags/enableNeighborhoodAmenitiesDropdown.md) | When true, neighborhood amenities inputs render as dropdowns with distance options instead of textareas |
| [enableNonRegulatedListings](./feature-flags/enableNonRegulatedListings.md) | When true, non-regulated listings are displayed in listing creation/edit and public listing view |
| [enableParkingFee](./feature-flags/enableParkingFee.md) | When true, the parking fee field should be visible |
| [enableParkingType](./feature-flags/enableParkingType.md) | When true, the parking type field is visible in the listing form |
| [enablePartnerDemographics](./feature-flags/enablePartnerDemographics.md) | When true, demographics data is included in application or lottery exports for partners |
| [enablePartnerSettings](./feature-flags/enablePartnerSettings.md) | When true, the 'settings' tab in the partner site is visible |
| [enablePetPolicyCheckbox](./feature-flags/enablePetPolicyCheckbox.md) | When true, the pet policy field in the listing form is displayed as checkboxes instead of a text area |
| [enableProperties](./feature-flags/enableProperties.md) | When true, the properties feature is enabled |
| [enableReferralQuestionUnits](./feature-flags/enableReferralQuestionUnits.md) | when true, updates the the referral details question labels |
| [enableRegions](./feature-flags/enableRegions.md) | When true, the region can be defined for the building address |
| [enableResources](./feature-flags/enableResources.md) | When true, the public site displays links to resources on various pages |
| [enableSection8Question](./feature-flags/enableSection8Question.md) | When true, the Section 8 listing data will be visible |
| [enableSingleUseCode](./feature-flags/enableSingleUseCode.md) | When true, the backend allows for logging into this jurisdiction using the single use code flow |
| [enableSmokingPolicyRadio](./feature-flags/enableSmokingPolicyRadio.md) | When true, the listing 'Smoking policy' field is a radio group |
| [enableSpokenLanguage](./feature-flags/enableSpokenLanguage.md) | When true, the application demographics section displays a spoken language question with options configured on the jurisdiction |
| [enableSupportAdmin](./feature-flags/enableSupportAdmin.md) | When true, support admins can be created |
| [enableUnderConstructionHome](./feature-flags/enableUnderConstructionHome.md) | When true, the 'under construction' section is displayed on the home page |
| [enableUnitAccessibilityTypeTags](./feature-flags/enableUnitAccessibilityTypeTags.md) | When true, unit accessibility type tags (for example, 'Mobility units') are displayed on listing cards and details |
| [enableUnitGroups](./feature-flags/enableUnitGroups.md) | When true, uses unit groups instead of units |
| [enableUtilitiesIncluded](./feature-flags/enableUtilitiesIncluded.md) | When true, the 'utilities included' section is displayed in listing creation/edit and the public listing view |
| [enableV2MSQ](./feature-flags/enableV2MSQ.md) | When true, the new mutliselect question logic will be used. |
| [enableVerifyIncome](./feature-flags/enableVerifyIncome.md) | When true, the income question on the application will be validated against the income limits for the listing and an error message will be shown if income is outside limits |
| [enableWaitlistAdditionalFields](./feature-flags/enableWaitlistAdditionalFields.md) | When true, the waitlist additional fields are displayed in the waitlist section of the listing form |
| [enableWaitlistLottery](./feature-flags/enableWaitlistLottery.md) | When true, jurisdiction supports lotteries for waitlist opportunities |
| [enableWhatToExpectAdditionalField](./feature-flags/enableWhatToExpectAdditionalField.md) | When true, the what to expect additional field is displayed in listing creation/edit form on the partner site |
| [hideCloseListingButton](./feature-flags/hideCloseListingButton.md) | When true, close button is hidden on the listing edit form |
| [swapCommunityTypeWithPrograms](./feature-flags/swapCommunityTypeWithPrograms.md) | When true, the programs section on the frontend is displayed as community types. |

<!-- TABLE:END -->
