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
import { seedListings } from './seed-staging-helpers';

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
    unitRentTypes,
    unitTypes,
    partnerUser,
    msqV2,
    jurisdictionName = 'Angelopolis',
  }: {
    publicSiteBaseURL: string;
    unitRentTypes: { id: string }[];
    unitTypes: { id: string; name?: string }[];
    partnerUser: { id: string };
    msqV2: boolean;
    jurisdictionName?: string;
  },
) => {
  const optionalV2MSQ = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];

  const jurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
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
        FeatureFlagEnum.enableAutoOpenDate,
        FeatureFlagEnum.enableAutopublish,
        FeatureFlagEnum.enableConfigurableRegions,
        FeatureFlagEnum.enableCreditScreeningFee,
        FeatureFlagEnum.enableCustomListingNotifications,
        FeatureFlagEnum.enableFaq,
        FeatureFlagEnum.enableHousingAdvocate,
        FeatureFlagEnum.enableHousingDeveloperOwner,
        FeatureFlagEnum.enableLandUse,
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

  await agencyFactory(jurisdiction.id, prismaClient, 5, jurisdictionName);

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
  const angelopolisFullAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id, 2, jurisdiction.name),
  });
  // Same 10% - 100% levels as the chart above, but shifted incomes, so a listing
  // using both charts renders "$min - $max" ranges in the household income table
  const angelopolisSecondFullAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id, 7, jurisdiction.name),
  });

  // Irregular AMI levels (not the usual 10% steps) with a pair of charts used by one
  // listing. The two charts agree on the incomes for some levels and disagree on
  // others, so the public site's household income table mixes single values with
  // "$min - $max" ranges. 73% only disagrees for household sizes 1 - 4, so a single
  // column shows both shapes.
  const irregularAmiLevels = [10, 15, 32, 45, 58, 73, 96];
  const rangedAmiLevels = [15, 45, 96];
  const partiallyRangedAmiLevel = 73;
  // Household sizes left out of BOTH charts, so those cells render empty. 15%, 45%,
  // 73% and 96% cover every household size, so rows 1 - 8 all still exist.
  const missingHouseholdSizesByAmiLevel: Record<number, number[]> = {
    10: [5, 6, 7, 8],
    32: [7, 8],
    58: [1, 2],
  };
  const irregularAmiChartItems = (incomeOffset: number) =>
    irregularAmiLevels.flatMap((percentOfAmi) =>
      [...Array(8)]
        .map((_, index) => {
          const householdSize = index + 1;
          const isRanged =
            rangedAmiLevels.includes(percentOfAmi) ||
            (percentOfAmi === partiallyRangedAmiLevel && householdSize <= 4);
          return {
            percentOfAmi,
            householdSize,
            income:
              12_000 +
              percentOfAmi * 400 +
              index * 6_000 +
              (isRanged ? incomeOffset : 0),
          };
        })
        .filter(
          (item) =>
            !missingHouseholdSizesByAmiLevel[percentOfAmi]?.includes(
              item.householdSize,
            ),
        ),
    );
  const angelopolisIrregularAmiChart = await prismaClient.amiChart.create({
    data: {
      name: `Irregular AMI Levels A - ${jurisdiction.name}`,
      items: irregularAmiChartItems(0),
      jurisdictions: { connect: { id: jurisdiction.id } },
    },
  });
  const angelopolisSecondIrregularAmiChart = await prismaClient.amiChart.create(
    {
      data: {
        name: `Irregular AMI Levels B - ${jurisdiction.name}`,
        items: irregularAmiChartItems(9_500),
        jurisdictions: { connect: { id: jurisdiction.id } },
      },
    },
  );

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

  // Widest-case matrix for QA of the Rent / Household maximum income tables:
  // every unit type (studio through 7BR) at every AMI level (10% - 100%).
  const unitTypesByBedrooms = [
    'studio',
    'oneBdrm',
    'twoBdrm',
    'threeBdrm',
    'fourBdrm',
    'fiveBdrm',
    'sixBdrm',
    'sevenBdrm',
  ]
    .map((name) => unitTypes.find((unitType) => unitType.name === name))
    .filter(Boolean);
  const allAmiLevels = [...Array(10)].map((_, index) => (index + 1) * 10);
  const wideUnitMatrix = (amiChartId: string, rentOffset = 0) =>
    unitTypesByBedrooms.flatMap((unitType, bedrooms) =>
      allAmiLevels.map((amiPercentage) => ({
        amiPercentage: `${amiPercentage}`,
        monthlyIncomeMin: `${2000 + amiPercentage * 10 + rentOffset * 3}`,
        floor: 1,
        maxOccupancy: Math.min(bedrooms + 2, 8),
        minOccupancy: 1,
        monthlyRent: `${
          1200 + bedrooms * 250 + amiPercentage * 5 + rentOffset
        }`,
        numBathrooms: 1,
        numBedrooms: bedrooms,
        number: `${bedrooms}${amiPercentage}${rentOffset ? 'b' : 'a'}`,
        sqFeet: `${500 + bedrooms * 150}.00`,
        amiChart: { connect: { id: amiChartId } },
        unitTypes: { connect: { id: unitType.id } },
        unitRentTypes: { connect: { id: unitRentTypes[0].id } },
      })),
    );

  // Sparse, non-contiguous bedroom counts at irregular AMI levels, so the public
  // tables have to render gappy rows instead of studio-through-7BR. 7BR ("Seven+")
  // is the largest unit type available, so it stands in for the 8 bedroom case.
  const sparseBedroomCounts = [
    { name: 'twoBdrm', bedrooms: 2 },
    { name: 'fiveBdrm', bedrooms: 5 },
    { name: 'sixBdrm', bedrooms: 6 },
    { name: 'sevenBdrm', bedrooms: 7 },
  ];
  const sparseUnitMatrix = (
    amiChartId: string,
    numberSuffix: string,
    rentOffset = 0,
  ) =>
    sparseBedroomCounts.flatMap(({ name, bedrooms }) => {
      const unitType = unitTypes.find((type) => type.name === name);
      if (!unitType) return [];
      return irregularAmiLevels.map((amiPercentage) => {
        // Only shift the rent where the charts also disagree, so the rent column
        // shows a single value for the levels the income column does too
        const offset = rangedAmiLevels.includes(amiPercentage) ? rentOffset : 0;
        return {
          amiPercentage: `${amiPercentage}`,
          monthlyIncomeMin: `${2000 + amiPercentage * 12 + offset * 3}`,
          floor: 1,
          maxOccupancy: Math.min(bedrooms + 2, 8),
          minOccupancy: 1,
          monthlyRent: `${1300 + bedrooms * 275 + amiPercentage * 6 + offset}`,
          numBathrooms: bedrooms > 4 ? 2 : 1,
          numBedrooms: bedrooms,
          number: `${bedrooms}-${amiPercentage}${numberSuffix}`,
          sqFeet: `${600 + bedrooms * 175}.00`,
          amiChart: { connect: { id: amiChartId } },
          unitTypes: { connect: { id: unitType.id } },
          unitRentTypes: { connect: { id: unitRentTypes[0].id } },
        };
      });
    });

  const listingsToCreate = [
    {
      listing: hollywoodHillsHeights,
      propertyId: angelopolisProperty1.id,
      units: wideUnitMatrix(angelopolisFullAmiChart.id),
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
      listing: {
        ...hollywoodHillsHeights,
        name: 'Hollywood Hills Heights - Multiple AMI Charts',
      },
      propertyId: angelopolisProperty1.id,
      units: [
        ...wideUnitMatrix(angelopolisFullAmiChart.id),
        ...wideUnitMatrix(angelopolisSecondFullAmiChart.id, 175),
      ],
      multiselectQuestions: [
        hearingVisionAccessibilityNeedsProgramQuestion,
        housingSituationProgramQuestion,
        mobilityAccessibilityNeedsProgramQuestion,
      ],
      applications: [
        await applicationFactory({
          raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
        }),
      ],
      userAccounts: [{ id: partnerUser.id }],
      optionalFeatures: { carpetInUnit: true },
      enableListingFeaturesAndUtilities: true,
    },
    {
      listing: {
        ...hollywoodHillsHeights,
        name: 'Hollywood Hills Heights - Irregular AMI Charts',
      },
      propertyId: angelopolisProperty1.id,
      units: [
        ...sparseUnitMatrix(angelopolisIrregularAmiChart.id, 'a'),
        ...sparseUnitMatrix(angelopolisSecondIrregularAmiChart.id, 'b', 225),
      ],
      multiselectQuestions: [
        hearingVisionAccessibilityNeedsProgramQuestion,
        housingSituationProgramQuestion,
      ],
      applications: [
        await applicationFactory({
          raceEthnicityConfiguration: angelopolisRaceEthnicityConfiguration,
        }),
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
        monthlyRent: '1200',
        numBathrooms: 1,
        numBedrooms: 1,
        number: `${i}`,
        sqFeet: `${i}`,
        amiChart: { connect: { id: angelopolisAmiChart.id } },
        unitTypes: { connect: { id: unitTypes[1].id } },
        unitRentTypes: { connect: { id: unitRentTypes[0].id } },
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
