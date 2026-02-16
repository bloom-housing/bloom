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
import { applicationFactory } from './seed-helpers/application-factory';
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
  const defaultRaceEthnicityConfiguration: RaceEthnicityConfiguration = {
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
      raceEthnicityConfiguration: {
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
      },
    }),
  });
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
  const veteranProgramQuestion = await prismaClient.multiselectQuestions.create(
    {
      data: multiselectQuestionFactory(mainJurisdiction.id, {
        multiselectQuestion: {
          text: 'Veteran',
          description:
            'Have you or anyone in your household served in the US military?',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          isExclusive: true,
          optOutText: 'Prefer not to say',
          options: [
            { text: 'Yes', exclusive: true, ordinal: 1 },
            { text: 'No', exclusive: true, ordinal: 2 },
          ],
        },
      }),
    },
  );
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
        ],
        applications: [await applicationFactory(), await applicationFactory()],
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
          await applicationFactory(),
          await applicationFactory(),
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
          await applicationFactory({
            applicant: { emailAddress: 'user2@example.com' },
          }),
          await applicationFactory({
            applicant: { emailAddress: 'user2@example.com' },
          }),
          await applicationFactory({
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
          }),
          await applicationFactory({
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
          }),
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
            expireAfter: process.env.APPLICATION_DAYS_TILL_EXPIRY
              ? dayjs(new Date()).subtract(10, 'days').toDate()
              : undefined,
          }),
          // applications below should have their PII removed via the cron job
          await applicationFactory({
            isNewest: false,
            expireAfter: process.env.APPLICATION_DAYS_TILL_EXPIRY
              ? dayjs(new Date()).subtract(10, 'days').toDate()
              : undefined,
          }),
          await applicationFactory({
            isNewest: false,
            expireAfter: process.env.APPLICATION_DAYS_TILL_EXPIRY
              ? dayjs(new Date()).subtract(10, 'days').toDate()
              : undefined,
          }),
          await applicationFactory({
            isNewest: false,
            expireAfter: process.env.APPLICATION_DAYS_TILL_EXPIRY
              ? dayjs(new Date()).subtract(10, 'days').toDate()
              : undefined,
            householdMember: [
              householdMemberFactorySingle(1, {}),
              householdMemberFactorySingle(2, {}),
              householdMemberFactorySingle(4, {}),
            ],
          }),
        ],
        userAccounts: [{ id: partnerUser.id }],
      },
    ],
    [
      mainJurisdiction.id,
      prismaClient,
      {
        listing: littleVillageApartments,
        multiselectQuestions: [workInCityQuestion],
        userAccounts: [{ id: partnerUser.id }],
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
          await applicationFactory({
            multiselectQuestions: [workInCityQuestion],
          }),
          await applicationFactory({
            multiselectQuestions: [workInCityQuestion],
          }),
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
