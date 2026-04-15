import {
  LanguagesEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  NeighborhoodAmenitiesEnum,
  PrismaClient,
  UserRoleEnum,
} from '@prisma/client';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';
import { amiChartFactory } from '../seed-helpers/ami-chart-factory';
import { multiselectQuestionFactory } from '../seed-helpers/multiselect-question-factory';
import { propertyFactory } from '../seed-helpers/property-factory';
import { agencyFactory } from '../seed-helpers/agency-factory';
import { userFactory } from '../seed-helpers/user-factory';
import {
  applicationFactory,
  applicationFactoryMany,
} from '../seed-helpers/application-factory';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { ApplicationAccessibilityFeatureEnum } from '../../src/enums/applications/application-accessibility-feature-enum';
import { UnitAccessibilityPriorityTypeEnum } from '../../src/enums/units/accessibility-priority-type-enum';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { hollywoodHillsHeights } from '../seed-helpers/listing-data/hollywood-hills-heights';
import { seedListings } from './seed-listings';

export const angelopolisRaceEthnicityConfiguration: RaceEthnicityConfiguration =
  {
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

export const createAngelopolisJurisdiction = async (
  prismaClient: PrismaClient,
  {
    publicSiteBaseURL,
    unitTypes,
    partnerUser,
    msqV2,
  }: {
    publicSiteBaseURL: string;
    unitTypes: { id: string }[];
    partnerUser: { id: string };
    msqV2: boolean;
  },
) => {
  const optionalV2MSQ = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];

  const jurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Angelopolis', {
      publicSiteBaseURL,
      listingApprovalPermissions: [UserRoleEnum.admin],
      featureFlags: [
        ...optionalV2MSQ,
        FeatureFlagEnum.disableAccessibilityFeaturesTag,
        FeatureFlagEnum.disableBuildingSelectionCriteria,
        FeatureFlagEnum.disableEthnicityQuestion,
        FeatureFlagEnum.disableListingPreferences,
        FeatureFlagEnum.disablePartnerPublicListingEdits,
        FeatureFlagEnum.disableReservedCommunityTypeEdit,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableApplicationStatus,
        FeatureFlagEnum.enableAutopublish,
        FeatureFlagEnum.enableConfigurableRegions,
        FeatureFlagEnum.enableCreditScreeningFee,
        FeatureFlagEnum.enableCustomListingNotifications,
        FeatureFlagEnum.enableFaq,
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
        FeatureFlagEnum.enableParkingType,
        FeatureFlagEnum.enablePetPolicyCheckbox,
        FeatureFlagEnum.enableProperties,
        FeatureFlagEnum.enableReasonableAccommodations,
        FeatureFlagEnum.enableReferralQuestionUnits,
        FeatureFlagEnum.enableResources,
        FeatureFlagEnum.enableSmokingPolicyRadio,
        FeatureFlagEnum.enableSpokenLanguage,
        FeatureFlagEnum.enableUnitAccessibilityTypeTags,
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
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearingAndVision,
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

  await agencyFactory(jurisdiction.id, prismaClient, 5, 'Angelopolis');

  const agency = await prismaClient.agency.findFirst({
    where: {
      jurisdictionsId: jurisdiction.id,
    },
  });
  const advocate = await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'advocate@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      isAdvocate: true,
      agencyId: agency.id,
    }),
  });
  const angelopolisAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(8, jurisdiction.id, null, jurisdiction.name),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id, 2, jurisdiction.name),
  });

  const angelopolisProperty1 = await prismaClient.properties.create({
    data: propertyFactory(jurisdiction.name, jurisdiction.id),
  });
  await prismaClient.properties.create({
    data: propertyFactory(jurisdiction.name, jurisdiction.id),
  });

  const mobilityAccessibilityNeedsProgramMsqData = msqV2
    ? {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Some units require at least one resident to have a mobility accessibility need',
        isExclusive: false,
        multiselectOptions: {
          createMany: {
            data: [
              { name: 'Wheelchair', ordinal: 1 },
              { name: 'Walker', ordinal: 2 },
              { name: 'Power chair', ordinal: 3 },
              { name: 'Other mobility device', ordinal: 4 },
              { isOptOut: true, name: 'None of the above', ordinal: 5 },
            ],
          },
        },
        name: 'Mobility accessibility needs',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Some units require at least one resident to have a mobility accessibility need',
        optOutText: 'None of the above',
        options: [
          { text: 'Wheelchair', ordinal: 0 },
          { text: 'Walker', ordinal: 1 },
          { text: 'Power chair', ordinal: 2 },
          { text: 'Other mobility device', ordinal: 3 },
        ],
        text: 'Mobility accessibility needs',
      };
  const mobilityAccessibilityNeedsProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(
        jurisdiction.id,
        { multiselectQuestion: mobilityAccessibilityNeedsProgramMsqData },
        msqV2,
      ),
    });

  const hearingVisionAccessibilityNeedsProgramMsqData = msqV2
    ? {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Some units require at least one resident to have a hearing / vision accessibility need',
        isExclusive: false,
        multiselectOptions: {
          createMany: {
            data: [
              { name: 'Audible and visual doorbells', ordinal: 1 },
              {
                name: 'Fire and smoke alarms with hard wired strobes',
                ordinal: 2,
              },
              {
                name: 'Documents in screen-reader accessible format',
                ordinal: 3,
              },
              { name: 'Documents in large text or braille', ordinal: 4 },
              { isOptOut: true, name: 'None of the above', ordinal: 5 },
            ],
          },
        },
        name: 'Hearing/vision accessibility needs',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Some units require at least one resident to have a hearing / vision accessibility need',
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
        text: 'Hearing/vision accessibility needs',
      };
  const hearingVisionAccessibilityNeedsProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(
        jurisdiction.id,
        {
          multiselectQuestion: hearingVisionAccessibilityNeedsProgramMsqData,
        },
        msqV2,
      ),
    });

  const housingSituationProgramMsqData = msqV2
    ? {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Thinking about the past 30 days, do either of these describe your housing situation?',
        isExclusive: false,
        multiselectOptions: {
          createMany: {
            data: [
              { name: 'Not Permanent', ordinal: 1 },
              { name: 'Homeless', ordinal: 2 },
              { name: 'Do Not Consider', ordinal: 3 },
              { name: 'Prefer not to say', ordinal: 4 },
            ],
          },
        },
        name: 'Housing Situation',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Thinking about the past 30 days, do either of these describe your housing situation?',
        options: [
          { text: 'Not Permanent', ordinal: 0 },
          { text: 'Homeless', ordinal: 1 },
          { text: 'Do Not Consider', ordinal: 2 },
          { text: 'Prefer not to say', ordinal: 3 },
        ],
        text: 'Housing Situation',
      };
  const housingSituationProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(
        jurisdiction.id,
        { multiselectQuestion: housingSituationProgramMsqData },
        msqV2,
      ),
    });

  const listingsToCreate = [
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
          unitTypes: { connect: { id: unitTypes[0].id } },
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
          unitTypes: { connect: { id: unitTypes[1].id } },
        },
      ],
      multiselectQuestions: [
        hearingVisionAccessibilityNeedsProgramQuestion,
        housingSituationProgramQuestion,
        mobilityAccessibilityNeedsProgramQuestion,
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
    {
      listing: { ...hollywoodHillsHeights, name: '200 Acre Woods' },
      propertyId: angelopolisProperty1.id,
      units: Array.from({ length: 200 }, (_, i) => ({
        amiPercentage: '30',
        monthlyIncomeMin: '2000',
        floor: 1,
        maxOccupancy: 3,
        minOccupancy: 1,
        numBathrooms: 1,
        numBedrooms: 1,
        number: `${i}`,
        sqFeet: `${i}`,
        amiChart: { connect: { id: angelopolisAmiChart.id } },
        unitTypes: { connect: { id: unitTypes[1].id } },
      })),
      multiselectQuestions: [housingSituationProgramQuestion],
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
      enableListingFeaturesAndUtilities: true,
    },
  ];

  await seedListings(
    prismaClient,
    jurisdiction.id,
    listingsToCreate,
    angelopolisAmiChart,
  );

  return jurisdiction;
};
