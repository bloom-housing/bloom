import {
  ApplicationSubmissionTypeEnum,
  NeighborhoodAmenitiesEnum,
  LanguagesEnum,
  MonthlyRentDeterminationTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
  PrismaClient,
  UserRoleEnum,
  MultiselectQuestionsStatusEnum,
  Prisma,
} from '@prisma/client';
import dayjs from 'dayjs';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { userFactory } from './seed-helpers/user-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import {
  applicationFactory,
  applicationFactoryMany,
} from './seed-helpers/application-factory';
import { translationFactory } from './seed-helpers/translation-factory';
import { propertyFactory } from './seed-helpers/property-factory';
import { reservedCommunityTypeFactoryAll } from './seed-helpers/reserved-community-type-factory';
import {
  mapLayerFactory,
  redlinedMap,
  simplifiedDCMap,
} from './seed-helpers/map-layer-factory';
import { ValidationMethod } from '../src/enums/multiselect-questions/validation-method-enum';
import { UnitAccessibilityPriorityTypeEnum } from '../src/enums/units/accessibility-priority-type-enum';
import { ListingFeaturesConfiguration } from '../src/dtos/jurisdictions/listing-features-config.dto';
import { RaceEthnicityConfiguration } from '../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { householdMemberFactorySingle } from './seed-helpers/household-member-factory';
import { createAllFeatureFlags } from './seed-helpers/feature-flag-factory';
import { FeatureFlagEnum } from '../src/enums/feature-flags/feature-flags-enum';
import { hollywoodHillsHeights } from './seed-helpers/listing-data/hollywood-hills-heights';
import { districtViewApartments } from './seed-helpers/listing-data/district-view-apartments';
import { blueSkyApartments } from './seed-helpers/listing-data/blue-sky-apartments';
import { valleyHeightsSeniorCommunity } from './seed-helpers/listing-data/valley-heights-senior-community';
import { littleVillageApartments } from './seed-helpers/listing-data/little-village-apartments';
import { elmVillage } from './seed-helpers/listing-data/elm-village';
import { lakeviewVilla } from './seed-helpers/listing-data/lakeview-villa';
import { sunshineFlats } from './seed-helpers/listing-data/sunshine-flats';
import { agencyFactory } from './seed-helpers/agency-factory';

export const defaultRaceEthnicityConfiguration: RaceEthnicityConfiguration = {
  options: [
    {
      id: 'americanIndianAlaskanNative',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'asian',
      subOptions: [
        { id: 'asianIndian', allowOtherText: false },
        { id: 'chinese', allowOtherText: false },
        { id: 'filipino', allowOtherText: false },
        { id: 'japanese', allowOtherText: false },
        { id: 'korean', allowOtherText: false },
        { id: 'vietnamese', allowOtherText: false },
        { id: 'otherAsian', allowOtherText: true },
      ],
      allowOtherText: false,
    },
    {
      id: 'blackAfricanAmerican',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'nativeHawaiianOtherPacificIslander',
      subOptions: [
        { id: 'nativeHawaiian', allowOtherText: false },
        { id: 'guamanianOrChamorro', allowOtherText: false },
        { id: 'samoan', allowOtherText: false },
        { id: 'otherPacificIslander', allowOtherText: true },
      ],
      allowOtherText: false,
    },
    {
      id: 'white',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'otherMultiracial',
      subOptions: [],
      allowOtherText: true,
    },
    {
      id: 'declineToRespond',
      subOptions: [],
      allowOtherText: false,
    },
  ],
};

export const stagingSeed = async (
  prismaClient: PrismaClient,
  jurisdictionName: string,
  publicSiteBaseURL: string,
  msqV2: boolean,
) => {
  // Seed feature flags
  await createAllFeatureFlags(prismaClient);
  const optionalMainFlags = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];
  const defaultListingFeatureConfiguration: ListingFeaturesConfiguration = {
    fields: [
      { id: 'wheelchairRamp' },
      { id: 'elevator' },
      { id: 'serviceAnimalsAllowed' },
      { id: 'accessibleParking' },
      { id: 'parkingOnSite' },
      { id: 'inUnitWasherDryer' },
      { id: 'laundryInBuilding' },
      { id: 'barrierFreeEntrance' },
      { id: 'rollInShower' },
      { id: 'grabBars' },
      { id: 'heatingInUnit' },
      { id: 'acInUnit' },
      { id: 'hearing' },
      { id: 'mobility' },
      { id: 'visual' },
      { id: 'barrierFreeUnitEntrance' },
      { id: 'loweredLightSwitch' },
      { id: 'barrierFreeBathroom' },
      { id: 'wideDoorways' },
      { id: 'loweredCabinets' },
    ],
  };

  const angelopolisRaceEthnicityConfiguration: RaceEthnicityConfiguration = {
    options: [
      {
        id: 'americanIndianAlaskanNative',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'asian',
        subOptions: [],
        allowOtherText: true,
      },
      {
        id: 'blackAfricanAmerican',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'hispanicLatino',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'middleEasternNorthAfrican',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'nativeHawaiianOtherPacificIslander',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'white',
        subOptions: [],
        allowOtherText: false,
      },
      {
        id: 'otherMultiracial',
        subOptions: [],
        allowOtherText: true,
      },
    ],
  };
  // create main jurisdiction with as many feature flags turned on as possible
  const mainJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
      publicSiteBaseURL: publicSiteBaseURL,
      listingApprovalPermissions: [UserRoleEnum.admin],
      featureFlags: [
        ...optionalMainFlags,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableCompanyWebsite,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableIsVerified,
        FeatureFlagEnum.enableLeasingAgentAltText,
        FeatureFlagEnum.enableListingFavoriting,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableResources,
        FeatureFlagEnum.enableSection8Question,
        FeatureFlagEnum.enableSingleUseCode,
        FeatureFlagEnum.enableSupportAdmin,
        FeatureFlagEnum.enableUtilitiesIncluded,
        FeatureFlagEnum.enableWaitlistLottery,
        FeatureFlagEnum.enableWhatToExpectAdditionalField,
      ],
      languages: Object.values(LanguagesEnum),
      requiredListingFields: [
        'developer',
        'digitalApplication',
        'jurisdictions',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'listingImages',
        'listingsBuildingAddress',
        'name',
        'paperApplication',
        'referralOpportunity',
        'rentalAssistance',
        'units',
      ],
      listingFeaturesConfiguration: defaultListingFeatureConfiguration,
      raceEthnicityConfiguration: defaultRaceEthnicityConfiguration,
    }),
  });

  // jurisdiction with unit groups enabled
  const lakeviewJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Lakeview', {
      publicSiteBaseURL: publicSiteBaseURL,
      featureFlags: [
        FeatureFlagEnum.disableJurisdictionalAdmin,
        FeatureFlagEnum.disableListingPreferences,
        FeatureFlagEnum.disableWorkInRegion,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableAdaOtherOption,
        FeatureFlagEnum.enableAdditionalResources,
        FeatureFlagEnum.enableCompanyWebsite,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableIsVerified,
        FeatureFlagEnum.enableLimitedHowDidYouHear,
        FeatureFlagEnum.enableLeasingAgentAltText,
        FeatureFlagEnum.enableListingFavoriting,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enableListingUpdatedAt,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enableNonRegulatedListings,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableRegions,
        FeatureFlagEnum.enableResources,
        FeatureFlagEnum.enableSection8Question,
        FeatureFlagEnum.enableSingleUseCode,
        FeatureFlagEnum.enableUnderConstructionHome,
        FeatureFlagEnum.enableUnitGroups,
        FeatureFlagEnum.enableUtilitiesIncluded,
        FeatureFlagEnum.enableWaitlistAdditionalFields,
        FeatureFlagEnum.hideCloseListingButton,
        FeatureFlagEnum.swapCommunityTypeWithPrograms,
        FeatureFlagEnum.enableFullTimeStudentQuestion,
        FeatureFlagEnum.enableWhatToExpectAdditionalField,
      ],
      requiredListingFields: ['name', 'listingsBuildingAddress'],
      languages: [
        LanguagesEnum.en,
        LanguagesEnum.es,
        LanguagesEnum.ar,
        LanguagesEnum.bn,
      ],
      listingFeaturesConfiguration: defaultListingFeatureConfiguration,
      raceEthnicityConfiguration: defaultRaceEthnicityConfiguration,
    }),
  });
  // Basic configuration jurisdiction
  const bridgeBayJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Bridge Bay', {
      publicSiteBaseURL: publicSiteBaseURL,
      featureFlags: [
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableLeasingAgentAltText,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
      ],
      languages: [LanguagesEnum.en, LanguagesEnum.es, LanguagesEnum.vi],
      listingFeaturesConfiguration: defaultListingFeatureConfiguration,
      raceEthnicityConfiguration: defaultRaceEthnicityConfiguration,
    }),
  });
  // Jurisdiction with no feature flags enabled
  const nadaHill = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Nada Hill', {
      publicSiteBaseURL: publicSiteBaseURL,
      featureFlags: [],
      requiredListingFields: ['name'],
    }),
  });
  const angelopolisJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Angelopolis', {
      publicSiteBaseURL: publicSiteBaseURL,
      featureFlags: [
        FeatureFlagEnum.disableBuildingSelectionCriteria,
        FeatureFlagEnum.disableEthnicityQuestion,
        FeatureFlagEnum.disableListingPreferences,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableApplicationStatus,
        FeatureFlagEnum.enableConfigurableRegions,
        FeatureFlagEnum.enableCreditScreeningFee,
        FeatureFlagEnum.enableHousingAdvocate,
        FeatureFlagEnum.enableHousingDeveloperOwner,
        FeatureFlagEnum.enableLeasingAgentAltText,
        FeatureFlagEnum.enableListingFileNumber,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingImageAltText,
        FeatureFlagEnum.enableMarketingFlyer,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableMarketingStatusMonths,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enableNeighborhoodAmenitiesDropdown,
        FeatureFlagEnum.enableParkingFee,
        FeatureFlagEnum.enablePetPolicyCheckbox,
        FeatureFlagEnum.enableProperties,
        FeatureFlagEnum.enableReferralQuestionUnits,
        FeatureFlagEnum.enableResources,
        FeatureFlagEnum.enableSmokingPolicyRadio,
        FeatureFlagEnum.enableParkingType,
        FeatureFlagEnum.enableSpokenLanguage,
      ],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
        NeighborhoodAmenitiesEnum.shoppingVenues,
        NeighborhoodAmenitiesEnum.hospitals,
        NeighborhoodAmenitiesEnum.seniorCenters,
        NeighborhoodAmenitiesEnum.recreationalFacilities,
        NeighborhoodAmenitiesEnum.playgrounds,
        NeighborhoodAmenitiesEnum.busStops,
      ],
      languages: [
        LanguagesEnum.en,
        LanguagesEnum.es,
        LanguagesEnum.ko,
        LanguagesEnum.hy,
        LanguagesEnum.zh,
        LanguagesEnum.tl,
        LanguagesEnum.fa,
        LanguagesEnum.vi,
      ],
      visibleAccessibilityPriorityTypes: [
        UnitAccessibilityPriorityTypeEnum.mobility,
        UnitAccessibilityPriorityTypeEnum.hearingAndVision,
        UnitAccessibilityPriorityTypeEnum.mobilityHearingAndVision,
      ],
      regions: [
        'Metro Area',
        'South Bay',
        'East Valley',
        'West Side',
        'Downtown',
        'Harbor Area',
        'North Bay',
        'Southwest',
      ],
      minimumListingPublishImagesRequired: 3,
      requiredListingFields: [
        'digitalApplication',
        'jurisdictions',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'listingFileNumber',
        'listingImages',
        'listingImages.description',
        'listingsBuildingAddress',
        'name',
        'paperApplication',
        'referralOpportunity',
        'rentalAssistance',
        'units',
        'property',
      ],
      listingFeaturesConfiguration: {
        categories: [
          {
            id: 'mobility',
            fields: [
              { id: 'accessibleParking' },
              { id: 'barrierFreePropertyEntrance' },
              { id: 'barrierFreeUnitEntrance' },
              { id: 'elevator' },
              { id: 'frontControlsDishwasher' },
              { id: 'frontControlsStoveCookTop' },
              { id: 'kitchenCounterLowered' },
              { id: 'leverHandlesOnDoors' },
              { id: 'loweredLightSwitch' },
              { id: 'mobility' },
              { id: 'noEntryStairs' },
              { id: 'noStairsToParkingSpots' },
              { id: 'noStairsWithinUnit' },
              { id: 'refrigeratorWithBottomDoorFreezer' },
              { id: 'streetLevelEntrance' },
              { id: 'wheelchairRamp' },
            ],
          },
          {
            id: 'bathroom',
            fields: [
              { id: 'accessibleHeightToilet' },
              { id: 'barrierFreeBathroom' },
              { id: 'bathGrabBarsOrReinforcements' },
              { id: 'bathroomCounterLowered' },
              { id: 'rollInShower' },
              { id: 'toiletGrabBarsOrReinforcements' },
              { id: 'turningCircleInBathrooms' },
              { id: 'walkInShower' },
              { id: 'wideDoorways' },
            ],
          },
          {
            id: 'flooring',
            fields: [{ id: 'carpetInUnit' }, { id: 'hardFlooringInUnit' }],
            required: true,
          },
          {
            id: 'utility',
            fields: [
              { id: 'acInUnit' },
              { id: 'fireSuppressionSprinklerSystem' },
              { id: 'heatingInUnit' },
              { id: 'inUnitWasherDryer' },
              { id: 'laundryInBuilding' },
              { id: 'leverHandlesOnFaucets' },
            ],
          },
          {
            id: 'hearingVision',
            fields: [
              { id: 'brailleSignageInBuilding' },
              { id: 'carbonMonoxideDetectorWithStrobe' },
              { id: 'extraAudibleCarbonMonoxideDetector' },
              { id: 'extraAudibleSmokeDetector' },
              { id: 'hearingAndVision' },
              { id: 'nonDigitalKitchenAppliances' },
              { id: 'smokeDetectorWithStrobe' },
              { id: 'ttyAmplifiedPhone' },
            ],
          },
        ],
      },
      raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
    }),
  });
  await agencyFactory(
    angelopolisJurisdiction.id,
    prismaClient,
    5,
    'Angelopolis',
  );
  await agencyFactory(mainJurisdiction.id, prismaClient, 5, 'Bloomington');
  // create super admin user
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isSuperAdmin: true, isAdmin: true },
      email: 'superadmin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [
        mainJurisdiction.id,
        lakeviewJurisdiction.id,
        bridgeBayJurisdiction.id,
        nadaHill.id,
        angelopolisJurisdiction.id,
      ],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  // create admin user
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [
        mainJurisdiction.id,
        lakeviewJurisdiction.id,
        bridgeBayJurisdiction.id,
        nadaHill.id,
        angelopolisJurisdiction.id,
      ],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  // create a support admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isSupportAdmin: true },
      email: 'support-admin@example.com',
      confirmedAt: new Date(),
      acceptedTerms: true,
      jurisdictionIds: [
        mainJurisdiction.id,
        lakeviewJurisdiction.id,
        bridgeBayJurisdiction.id,
        nadaHill.id,
        angelopolisJurisdiction.id,
      ],
    }),
  });
  // create a jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isJurisdictionalAdmin: true },
      email: 'jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create a limited jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isLimitedJurisdictionalAdmin: true },
      email: 'limited-jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create a partner
  const partnerUser = await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isPartner: true },
      email: 'partner@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'unverified@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: false,
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'mfauser@bloom.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
      mfaEnabled: true,
      singleUseCode: '12345',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'public-user@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: {
        isAdmin: false,
        isPartner: true,
        isJurisdictionalAdmin: false,
      },
      email: `partner-user@example.com`,
      confirmedAt: new Date(),
      jurisdictionIds: [
        mainJurisdiction.id,
        lakeviewJurisdiction.id,
        bridgeBayJurisdiction.id,
        nadaHill.id,
        angelopolisJurisdiction.id,
      ],
      acceptedTerms: true,
    }),
  });
  const agency = await prismaClient.agency.findFirst({
    where: {
      jurisdictionsId: angelopolisJurisdiction.id,
    },
  });
  const advocate = await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'advocate@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [angelopolisJurisdiction.id],
      isAdvocate: true,
      agencyId: agency.id,
    }),
  });

  // add jurisdiction specific translations and default ones
  await prismaClient.translations.create({
    data: translationFactory({
      jurisdiction: { id: mainJurisdiction.id, name: mainJurisdiction.name },
    }),
  });
  await prismaClient.translations.create({
    data: translationFactory({ language: LanguagesEnum.es }),
  });
  await prismaClient.translations.create({
    data: translationFactory(),
  });
  // build ami charts
  const amiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, mainJurisdiction.id, null, mainJurisdiction.name),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(10, mainJurisdiction.id, 2, mainJurisdiction.name),
  });
  const lakeviewAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(
      8,
      lakeviewJurisdiction.id,
      null,
      lakeviewJurisdiction.name,
    ),
  });
  const angelopolisAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(
      8,
      angelopolisJurisdiction.id,
      null,
      angelopolisJurisdiction.name,
    ),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(
      8,
      lakeviewJurisdiction.id,
      2,
      lakeviewJurisdiction.name,
    ),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(
      10,
      angelopolisJurisdiction.id,
      2,
      angelopolisJurisdiction.name,
    ),
  });
  const angelopolisProperty1 = await prismaClient.properties.create({
    data: propertyFactory(
      angelopolisJurisdiction.name,
      angelopolisJurisdiction.id,
    ),
  });
  await prismaClient.properties.create({
    data: propertyFactory(
      angelopolisJurisdiction.name,
      angelopolisJurisdiction.id,
    ),
  });
  // Create map layers
  await prismaClient.mapLayers.create({
    data: mapLayerFactory(
      mainJurisdiction.id,
      'Redlined Districts',
      redlinedMap,
    ),
  });
  const mapLayer = await prismaClient.mapLayers.create({
    data: mapLayerFactory(
      mainJurisdiction.id,
      'Washington DC',
      simplifiedDCMap,
    ),
  });
  // NOTE: the previous V1 msq factory had a bug where options aren't actually used
  // and random data is generated no matter what. I've only fixed this in V2 seeding.
  let cityEmployeeMsqData: Prisma.MultiselectQuestionsCreateInput;
  if (msqV2) {
    cityEmployeeMsqData = multiselectQuestionFactory(
      mainJurisdiction.id,
      {
        multiselectQuestion: {
          status: MultiselectQuestionsStatusEnum.active,
          name: 'City Employees',
          description: 'Employees of the local city.',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          options: [
            {
              name: 'At least one member of my household is a city employee',
              shouldCollectAddress: false,
              ordinal: 1,
            },
          ],
        },
      },
      true,
    );
  } else {
    cityEmployeeMsqData = multiselectQuestionFactory(mainJurisdiction.id, {
      multiselectQuestion: {
        text: 'City Employees',
        description: 'Employees of the local city.',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        options: [
          {
            text: 'At least one member of my household is a city employee',
            collectAddress: false,
            ordinal: 0,
          },
        ],
      },
    });
  }
  const cityEmployeeQuestion = await prismaClient.multiselectQuestions.create({
    data: cityEmployeeMsqData,
  });
  let workInCityMsqData: Prisma.MultiselectQuestionsCreateInput;
  if (msqV2) {
    workInCityMsqData = multiselectQuestionFactory(
      mainJurisdiction.id,
      {
        optOut: true,
        status: MultiselectQuestionsStatusEnum.active,
        multiselectQuestion: {
          name: 'Work in the city',
          description: 'At least one member of my household works in the city',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          options: [
            {
              name: 'At least one member of my household works in the city',
              ordinal: 1,
              shouldCollectAddress: true,
              shouldCollectName: true,
              shouldCollectRelationship: true,
              mapLayerId: mapLayer.id,
              validationMethod: ValidationMethod.map,
            },
            {
              name: 'All members of the household work in the city',
              ordinal: 2,
              shouldCollectAddress: true,
              validationMethod: ValidationMethod.none,
              shouldCollectName: false,
              shouldCollectRelationship: false,
            },
          ],
        },
      },
      true,
    );
  } else {
    workInCityMsqData = multiselectQuestionFactory(mainJurisdiction.id, {
      optOut: true,
      multiselectQuestion: {
        text: 'Work in the city',
        description: 'At least one member of my household works in the city',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        options: [
          {
            text: 'At least one member of my household works in the city',
            ordinal: 0,
            collectAddress: true,
            collectName: true,
            collectRelationship: true,
            mapLayerId: mapLayer.id,
            validationMethod: ValidationMethod.map,
          },
          {
            text: 'All members of the household work in the city',
            ordinal: 1,
            collectAddress: true,
            ValidationMethod: ValidationMethod.none,
            collectName: false,
            collectRelationship: false,
          },
        ],
      },
    });
  }
  const workInCityQuestion = await prismaClient.multiselectQuestions.create({
    data: workInCityMsqData,
  });
  let veteranProgramMsqData: Prisma.MultiselectQuestionsCreateInput;
  if (msqV2) {
    veteranProgramMsqData = multiselectQuestionFactory(mainJurisdiction.id, {
      multiselectQuestion: {
        status: MultiselectQuestionsStatusEnum.active,
        name: 'Veteran',
        description:
          'Have you or anyone in your household served in the US military?',
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        isExclusive: true,
        optOutText: 'Prefer not to say',
        options: [
          { name: 'Yes', ordinal: 1 },
          { name: 'No', ordinal: 2 },
        ],
      },
    });
  } else {
    veteranProgramMsqData = multiselectQuestionFactory(mainJurisdiction.id, {
      multiselectQuestion: {
        text: 'Veteran',
        description:
          'Have you or anyone in your household served in the US military?',
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        isExclusive: true,
        optOutText: 'Prefer not to say',
        options: [
          { text: 'Yes', exclusive: true, ordinal: 1 },
          { text: 'No', exclusive: true, ordinal: 2 },
        ],
      },
    });
  }
  const veteranProgramQuestion = await prismaClient.multiselectQuestions.create(
    {
      data: veteranProgramMsqData,
    },
  );
  const mobilityAccessibilityNeedsProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(angelopolisJurisdiction.id, {
        multiselectQuestion: {
          text: 'Mobility accessibility needs',
          description:
            'Some units require at least one resident to have a mobility accessibility need',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          optOutText: 'None of the above',
          options: [
            { text: 'Wheelchair', ordinal: 0 },
            { text: 'Walker', ordinal: 1 },
            { text: 'Power chair', ordinal: 2 },
            { text: 'Other mobility device', ordinal: 3 },
          ],
        },
      }),
    });
  const hearingVisionAccessibilityNeedsProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(angelopolisJurisdiction.id, {
        multiselectQuestion: {
          text: 'Hearing/vision accessibility needs',
          description:
            'Some units require at least one resident to have a hearing / vision accessibility need',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          optOutText: 'None of the above',
          options: [
            { text: 'Audible and visual doorbells', ordinal: 0 },
            {
              text: 'Fire and smoke alarms with hard wired strobes',
              ordinal: 1,
            },
            {
              text: 'Documents in screen-reader accessible format',
              ordinal: 2,
            },
            { text: 'Documents in large text or braille', ordinal: 3 },
          ],
        },
      }),
    });

  const multiselectQuestionPrograms =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(mainJurisdiction.id, {
        multiselectQuestion: {
          text: 'Housing Situation',
          description:
            'Thinking about the past 30 days, do either of these describe your housing situation?',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          options: [
            {
              text: 'Not Permanent',
              ordinal: 0,
            },
            {
              text: 'Homeless',
              ordinal: 1,
            },
            {
              text: 'Do Not Consider',
              ordinal: 2,
            },
            {
              text: 'Prefer not to say',
              ordinal: 3,
            },
          ],
        },
      }),
    });
  await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(lakeviewJurisdiction.id, {
      multiselectQuestion: {
        text: 'Seniors 62+',
        description:
          'Are you or anyone in your household 62 years of age or older?',
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        isExclusive: true,
        options: [
          { text: 'Yes', exclusive: true, ordinal: 1 },
          { text: 'No', exclusive: true, ordinal: 2 },
        ],
      },
    }),
  });

  // add extra programs to support filtering by "community type"
  await Promise.all(
    ['Seniors 55+', 'Families', 'Veterans'].map(
      async (text) =>
        await prismaClient.multiselectQuestions.create({
          data: multiselectQuestionFactory(lakeviewJurisdiction.id, {
            multiselectQuestion: {
              applicationSection:
                MultiselectQuestionsApplicationSectionEnum.programs,
              text,
              isExclusive: true,
              options: [
                { text: 'Yes', exclusive: true, ordinal: 1 },
                { text: 'No', exclusive: true, ordinal: 2 },
              ],
            },
          }),
        }),
    ),
  );

  // create pre-determined values
  const unitTypes = await unitTypeFactoryAll(prismaClient);
  await reservedCommunityTypeFactoryAll(mainJurisdiction.id, prismaClient);
  const expiredApplicationDate = process.env.APPLICATION_DAYS_TILL_EXPIRY
    ? dayjs(new Date()).subtract(10, 'days').toDate()
    : undefined;
  // list of predefined listings WARNING: images only work if image setup is cloudinary on exygy account

  const listingsToCreate: Parameters<typeof listingFactory>[] = [
    [
      angelopolisJurisdiction.id,
      prismaClient,
      {
        listing: hollywoodHillsHeights,
        propertyId: angelopolisProperty1.id,
        units: [
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 0,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[0].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
        ],
        multiselectQuestions: [
          cityEmployeeQuestion,
          workInCityQuestion,
          multiselectQuestionPrograms,
          mobilityAccessibilityNeedsProgramQuestion,
          hearingVisionAccessibilityNeedsProgramQuestion,
        ],
        applications: [
          ...(await applicationFactoryMany(2, {
            raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
          })),
          ...(await applicationFactoryMany(20, {
            raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
            userId: advocate.id,
          })),
        ],
        userAccounts: [{ id: partnerUser.id }],
        optionalFeatures: { carpetInUnit: true },
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      angelopolisJurisdiction.id,
      prismaClient,
      {
        listing: { ...hollywoodHillsHeights, name: 'listing with 200 units' },
        propertyId: angelopolisProperty1.id,
        units: [
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '1',
            sqFeet: '1',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '2',
            sqFeet: '2',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '3',
            sqFeet: '3',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '4',
            sqFeet: '4',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '5',
            sqFeet: '5',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '6',
            sqFeet: '6',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '7',
            sqFeet: '7',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '8',
            sqFeet: '8',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '9',
            sqFeet: '9',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '10',
            sqFeet: '10',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '11',
            sqFeet: '11',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '12',
            sqFeet: '12',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '13',
            sqFeet: '13',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '14',
            sqFeet: '14',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '15',
            sqFeet: '15',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '16',
            sqFeet: '16',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '17',
            sqFeet: '17',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '18',
            sqFeet: '18',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '19',
            sqFeet: '19',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '20',
            sqFeet: '20',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '21',
            sqFeet: '21',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '22',
            sqFeet: '22',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '23',
            sqFeet: '23',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '24',
            sqFeet: '24',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '25',
            sqFeet: '25',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '26',
            sqFeet: '26',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '27',
            sqFeet: '27',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '28',
            sqFeet: '28',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '29',
            sqFeet: '29',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '30',
            sqFeet: '30',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '31',
            sqFeet: '31',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '32',
            sqFeet: '32',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '33',
            sqFeet: '33',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '34',
            sqFeet: '34',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '35',
            sqFeet: '35',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '36',
            sqFeet: '36',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '37',
            sqFeet: '37',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '38',
            sqFeet: '38',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '39',
            sqFeet: '39',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '40',
            sqFeet: '40',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '41',
            sqFeet: '41',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '42',
            sqFeet: '42',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '43',
            sqFeet: '43',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '44',
            sqFeet: '44',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '45',
            sqFeet: '45',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '46',
            sqFeet: '46',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '47',
            sqFeet: '47',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '48',
            sqFeet: '48',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '49',
            sqFeet: '49',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '50',
            sqFeet: '50',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '51',
            sqFeet: '51',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '52',
            sqFeet: '52',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '53',
            sqFeet: '53',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '54',
            sqFeet: '54',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '55',
            sqFeet: '55',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '56',
            sqFeet: '56',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '57',
            sqFeet: '57',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '58',
            sqFeet: '58',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '59',
            sqFeet: '59',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '60',
            sqFeet: '60',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '61',
            sqFeet: '61',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '62',
            sqFeet: '62',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '63',
            sqFeet: '63',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '64',
            sqFeet: '64',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '65',
            sqFeet: '65',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '66',
            sqFeet: '66',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '67',
            sqFeet: '67',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '68',
            sqFeet: '68',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '69',
            sqFeet: '69',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '70',
            sqFeet: '70',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '71',
            sqFeet: '71',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '72',
            sqFeet: '72',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '73',
            sqFeet: '73',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '74',
            sqFeet: '74',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '75',
            sqFeet: '75',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '76',
            sqFeet: '76',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '77',
            sqFeet: '77',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '78',
            sqFeet: '78',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '79',
            sqFeet: '79',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '80',
            sqFeet: '80',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '81',
            sqFeet: '81',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '82',
            sqFeet: '82',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '83',
            sqFeet: '83',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '84',
            sqFeet: '84',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '85',
            sqFeet: '85',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '86',
            sqFeet: '86',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '87',
            sqFeet: '87',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '88',
            sqFeet: '88',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '89',
            sqFeet: '89',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '90',
            sqFeet: '90',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '91',
            sqFeet: '91',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '92',
            sqFeet: '92',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '93',
            sqFeet: '93',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '94',
            sqFeet: '94',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '95',
            sqFeet: '95',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '96',
            sqFeet: '96',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '97',
            sqFeet: '97',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '98',
            sqFeet: '98',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '99',
            sqFeet: '99',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '100',
            sqFeet: '100',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '101',
            sqFeet: '101',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '102',
            sqFeet: '102',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '103',
            sqFeet: '103',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '104',
            sqFeet: '104',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '105',
            sqFeet: '105',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '106',
            sqFeet: '106',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '107',
            sqFeet: '107',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '108',
            sqFeet: '108',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '109',
            sqFeet: '109',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '110',
            sqFeet: '110',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '111',
            sqFeet: '111',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '112',
            sqFeet: '112',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '113',
            sqFeet: '113',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '114',
            sqFeet: '114',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '115',
            sqFeet: '115',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '116',
            sqFeet: '116',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '117',
            sqFeet: '117',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '118',
            sqFeet: '118',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '119',
            sqFeet: '119',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '120',
            sqFeet: '120',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '121',
            sqFeet: '121',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '122',
            sqFeet: '122',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '123',
            sqFeet: '123',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '124',
            sqFeet: '124',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '125',
            sqFeet: '125',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '126',
            sqFeet: '126',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '127',
            sqFeet: '127',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '128',
            sqFeet: '128',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '129',
            sqFeet: '129',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '130',
            sqFeet: '130',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '131',
            sqFeet: '131',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '132',
            sqFeet: '132',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '133',
            sqFeet: '133',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '134',
            sqFeet: '134',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '135',
            sqFeet: '135',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '136',
            sqFeet: '136',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '137',
            sqFeet: '137',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '138',
            sqFeet: '138',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '139',
            sqFeet: '139',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '140',
            sqFeet: '140',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '141',
            sqFeet: '141',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '142',
            sqFeet: '142',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '143',
            sqFeet: '143',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '144',
            sqFeet: '144',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '145',
            sqFeet: '145',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '146',
            sqFeet: '146',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '147',
            sqFeet: '147',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '148',
            sqFeet: '148',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '149',
            sqFeet: '149',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '150',
            sqFeet: '150',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '151',
            sqFeet: '151',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '152',
            sqFeet: '152',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '153',
            sqFeet: '153',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '154',
            sqFeet: '154',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '155',
            sqFeet: '155',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '156',
            sqFeet: '156',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '157',
            sqFeet: '157',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '158',
            sqFeet: '158',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '159',
            sqFeet: '159',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '160',
            sqFeet: '160',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '161',
            sqFeet: '161',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '162',
            sqFeet: '162',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '163',
            sqFeet: '163',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '164',
            sqFeet: '164',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '165',
            sqFeet: '165',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '166',
            sqFeet: '166',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '167',
            sqFeet: '167',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '168',
            sqFeet: '168',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '169',
            sqFeet: '169',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '170',
            sqFeet: '170',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '171',
            sqFeet: '171',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '172',
            sqFeet: '172',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '173',
            sqFeet: '173',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '174',
            sqFeet: '174',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '175',
            sqFeet: '175',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '176',
            sqFeet: '176',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '177',
            sqFeet: '177',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '178',
            sqFeet: '178',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '179',
            sqFeet: '179',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '180',
            sqFeet: '180',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '181',
            sqFeet: '181',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '182',
            sqFeet: '182',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '183',
            sqFeet: '183',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '184',
            sqFeet: '184',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '185',
            sqFeet: '185',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '186',
            sqFeet: '186',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '187',
            sqFeet: '187',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '188',
            sqFeet: '188',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '189',
            sqFeet: '189',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '190',
            sqFeet: '190',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '191',
            sqFeet: '191',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '192',
            sqFeet: '192',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '193',
            sqFeet: '193',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '194',
            sqFeet: '194',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '195',
            sqFeet: '195',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '196',
            sqFeet: '196',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '197',
            sqFeet: '197',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '198',
            sqFeet: '198',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            numBathrooms: 1,
            numBedrooms: 1,
            number: '199',
            sqFeet: '199',
            amiChart: { connect: { id: angelopolisAmiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
        ],
        multiselectQuestions: [
          cityEmployeeQuestion,
          workInCityQuestion,
          multiselectQuestionPrograms,
        ],
        applications: [
          await applicationFactory({
            raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
          }),
          await applicationFactory({
            raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
          }),
        ],
        userAccounts: [{ id: partnerUser.id }],
        optionalFeatures: { carpetInUnit: true },
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: districtViewApartments,
        units: [
          {
            amiPercentage: '30',
            annualIncomeMin: null,
            monthlyIncomeMin: '1985',
            floor: 2,
            maxOccupancy: 5,
            minOccupancy: 2,
            monthlyRent: '800',
            numBathrooms: 2,
            numBedrooms: 2,
            number: '',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[2].id,
              },
            },
          },
          {
            amiPercentage: '30',
            annualIncomeMin: null,
            monthlyIncomeMin: '2020',
            floor: 2,
            maxOccupancy: 5,
            minOccupancy: 2,
            monthlyRent: '800',
            numBathrooms: 2,
            numBedrooms: 2,
            number: '',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[2].id,
              },
            },
          },
          {
            amiPercentage: '30',
            annualIncomeMin: null,
            monthlyIncomeMin: '1985',
            floor: 2,
            maxOccupancy: 5,
            minOccupancy: 2,
            monthlyRent: '800',
            numBathrooms: 2,
            numBedrooms: 2,
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[2].id,
              },
            },
          },
        ],
        multiselectQuestions: [cityEmployeeQuestion],
        // has applications that are the same email and also same name/dob
        applications: [
          ...(await applicationFactoryMany(2)),
          await applicationFactory({
            submissionType: ApplicationSubmissionTypeEnum.paper,
          }),
          await applicationFactory({
            applicant: {
              emailAddress: 'user1@example.com',
              firstName: 'first',
              lastName: 'last',
              birthDay: 1,
              birthMonth: 1,
              birthYear: 1970,
            },
          }),
          await applicationFactory({
            applicant: {
              emailAddress: 'user1@example.com',
              firstName: 'first2',
              lastName: 'last2',
              birthDay: 2,
              birthMonth: 2,
              birthYear: 1992,
            },
          }),
          await applicationFactory({
            applicant: {
              emailAddress: 'user5@example.com',
              firstName: 'first2',
              lastName: 'last2',
              birthDay: 2,
              birthMonth: 2,
              birthYear: 1992,
            },
          }),
          await applicationFactory({
            applicant: {
              emailAddress: 'user1@example.com',
              firstName: 'first',
              lastName: 'last',
              birthDay: 1,
              birthMonth: 1,
              birthYear: 1970,
            },
          }),
          ...(await applicationFactoryMany(2, {
            applicant: { emailAddress: 'user2@example.com' },
          })),
          ...(await applicationFactoryMany(2, {
            applicant: {
              emailAddress: 'user3@example.com',
              firstName: 'first3',
              lastName: 'last3',
              birthDay: 1,
              birthMonth: 1,
              birthYear: 1970,
            },
            householdMember: [
              householdMemberFactorySingle(1, {
                firstName: 'householdFirst1',
                lastName: 'householdLast1',
                birthDay: 5,
                birthMonth: 5,
                birthYear: 1950,
              }),
              householdMemberFactorySingle(2, {
                firstName: 'householdFirst2',
                lastName: 'householdLast2',
                birthDay: 8,
                birthMonth: 8,
                birthYear: 1980,
              }),
            ],
          })),
          await applicationFactory({
            applicant: {
              emailAddress: 'user4@example.com',
              firstName: 'first4',
              lastName: 'last4',
              birthDay: 2,
              birthMonth: 2,
              birthYear: 2002,
            },
          }),
          await applicationFactory({
            householdMember: [
              {
                firstName: 'first4',
                lastName: 'last4',
                birthDay: 2,
                birthMonth: 2,
                birthYear: 2002,
              },
            ],
          }),
        ],
        userAccounts: [{ id: partnerUser.id }],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: blueSkyApartments,
        units: [
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 1,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
        ],
        userAccounts: [{ id: partnerUser.id }],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: valleyHeightsSeniorCommunity,
        applications: [
          await applicationFactory({
            isNewest: true,
            expireAfter: expiredApplicationDate,
          }),
          // applications below should have their PII removed via the cron job
          ...(await applicationFactoryMany(2, {
            isNewest: false,
            expireAfter: expiredApplicationDate,
          })),
          await applicationFactory({
            isNewest: false,
            expireAfter: expiredApplicationDate,
            householdMember: [
              householdMemberFactorySingle(1, {}),
              householdMemberFactorySingle(2, {}),
              householdMemberFactorySingle(4, {}),
            ],
          }),
        ],
        userAccounts: [{ id: partnerUser.id }],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: littleVillageApartments,
        multiselectQuestions: [workInCityQuestion],
        userAccounts: [{ id: partnerUser.id }],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: elmVillage,
        applications: [
          await applicationFactory({
            multiselectQuestions: [workInCityQuestion, cityEmployeeQuestion],
          }),
          await applicationFactory({
            multiselectQuestions: [
              cityEmployeeQuestion,
              workInCityQuestion,
              veteranProgramQuestion,
            ],
          }),
          await applicationFactory({
            multiselectQuestions: [workInCityQuestion, cityEmployeeQuestion],
          }),
          ...(await applicationFactoryMany(2, {
            multiselectQuestions: [workInCityQuestion],
          })),
          await applicationFactory(),
        ],
        multiselectQuestions: [
          workInCityQuestion,
          cityEmployeeQuestion,
          veteranProgramQuestion,
        ],
        units: [
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 0,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[0].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 0,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[5].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 1,
            number: '101',
            sqFeet: '750.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 1,
            numBedrooms: 2,
            number: '101',
            sqFeet: '1050.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[2].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 2,
            numBedrooms: 3,
            number: '101',
            sqFeet: '1250.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[3].id,
              },
            },
          },
          {
            amiPercentage: '30',
            monthlyIncomeMin: '2000',
            floor: 1,
            maxOccupancy: 3,
            minOccupancy: 1,
            monthlyRent: '1200',
            numBathrooms: 3,
            numBedrooms: 4,
            number: '101',
            sqFeet: '1750.00',
            amiChart: { connect: { id: amiChart.id } },
            unitTypes: {
              connect: {
                id: unitTypes[4].id,
              },
            },
          },
        ],
        userAccounts: [{ id: partnerUser.id }],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      lakeviewJurisdiction.id,
      prismaClient,
      {
        listing: lakeviewVilla,
        unitGroups: [
          {
            floorMin: 1,
            floorMax: 2,
            maxOccupancy: 3,
            minOccupancy: 1,
            bathroomMin: 1,
            bathroomMax: 1,
            totalCount: 10,
            totalAvailable: 5,
            sqFeetMin: '750.00',
            sqFeetMax: '1000.00',
            unitGroupAmiLevels: {
              create: {
                amiPercentage: 30,
                monthlyRentDeterminationType:
                  MonthlyRentDeterminationTypeEnum.flatRent,
                flatRentValue: 1400.0,
                amiChart: { connect: { id: lakeviewAmiChart.id } },
              },
            },
            unitTypes: {
              connect: {
                id: unitTypes[0].id,
              },
            },
          },
        ],
        enableListingFeaturesAndUtilities: true,
      },
    ],
    [
      lakeviewJurisdiction.id,
      prismaClient,
      {
        listing: sunshineFlats,
        unitGroups: [
          {
            floorMin: 1,
            floorMax: 1,
            maxOccupancy: 6,
            minOccupancy: 1,
            bathroomMin: 1,
            bathroomMax: 2,
            totalCount: 12,
            totalAvailable: 12,
            sqFeetMin: '750.00',
            sqFeetMax: '1600.00',
            unitGroupAmiLevels: {
              create: {
                amiPercentage: 45,
                monthlyRentDeterminationType:
                  MonthlyRentDeterminationTypeEnum.percentageOfIncome,
                percentageOfIncomeValue: 30.0,
                amiChart: { connect: { id: lakeviewAmiChart.id } },
              },
            },
            unitTypes: {
              connect: {
                id: unitTypes[1].id,
              },
            },
          },
          {
            floorMin: 2,
            floorMax: 2,
            maxOccupancy: 6,
            minOccupancy: 3,
            bathroomMin: 2,
            bathroomMax: 2,
            totalCount: 6,
            totalAvailable: 6,
            sqFeetMin: '1200.00',
            sqFeetMax: '1800.00',
            unitGroupAmiLevels: {
              create: {
                amiPercentage: 45,
                monthlyRentDeterminationType:
                  MonthlyRentDeterminationTypeEnum.flatRent,
                flatRentValue: 1800.0,
                amiChart: { connect: { id: lakeviewAmiChart.id } },
              },
            },
            unitTypes: {
              connect: {
                id: unitTypes[3].id,
              },
            },
          },
        ],
        enableListingFeaturesAndUtilities: true,
      },
    ],
  ];

  listingsToCreate.map(async (params, index) => {
    console.log(`Adding listing - ${params[2].listing?.name}`);
    const listingParams = params[2];
    const listing = await listingFactory(params[0], params[1], {
      amiChart: amiChart,
      numberOfUnits: (!listingParams.unitGroups && index) || 0,
      listing: listingParams.listing,
      units: listingParams.units,
      unitGroups: listingParams.unitGroups,
      multiselectQuestions: listingParams.multiselectQuestions,
      applications: listingParams.applications,
      afsLastRunSetInPast: true,
      userAccounts: listingParams.userAccounts,
      optionalFeatures: listingParams.optionalFeatures,
      propertyId: listingParams.propertyId,
    });
    const savedListing = await prismaClient.listings.create({
      data: listing,
    });
    await prismaClient.userAccounts.create({
      data: await userFactory({
        roles: {
          isAdmin: false,
          isPartner: true,
          isJurisdictionalAdmin: false,
        },
        email: `partner-user-${savedListing.name
          .toLowerCase()
          .replaceAll(' ', '-')}@example.com`,
        confirmedAt: new Date(),
        jurisdictionIds: [savedListing.jurisdictionId],
        acceptedTerms: true,
        listings: [savedListing.id],
      }),
    });
  });
};
