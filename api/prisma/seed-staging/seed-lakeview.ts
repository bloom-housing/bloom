import {
  LanguagesEnum,
  MonthlyRentDeterminationTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  PrismaClient,
} from '@prisma/client';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { amiChartFactory } from '../seed-helpers/ami-chart-factory';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';
import { lakeviewVilla } from '../seed-helpers/listing-data/lakeview-villa';
import { sunshineFlats } from '../seed-helpers/listing-data/sunshine-flats';
import { multiselectQuestionFactory } from '../seed-helpers/multiselect-question-factory';
import {
  defaultListingFeatureConfiguration,
  defaultRaceEthnicityConfiguration,
} from '../seed-staging';
import { seedListings } from './seed-listings';

export const createLakeviewJurisdiction = async (
  prismaClient: PrismaClient,
  {
    publicSiteBaseURL,
    unitTypes,
    msqV2,
  }: {
    publicSiteBaseURL: string;
    unitTypes: { id: string }[];
    msqV2: boolean;
  },
) => {
  const optionalV2MSQ = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Lakeview', {
      publicSiteBaseURL,
      featureFlags: [
        ...optionalV2MSQ,
        FeatureFlagEnum.disableJurisdictionalAdmin,
        FeatureFlagEnum.disableListingPreferences,
        FeatureFlagEnum.disableWorkInRegion,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableAdaOtherOption,
        FeatureFlagEnum.enableAdditionalResources,
        FeatureFlagEnum.enableCompanyWebsite,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableHousingBasics,
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

  const lakeviewAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(8, jurisdiction.id, null, jurisdiction.name),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(8, jurisdiction.id, 2, jurisdiction.name),
  });

  const senior62PlusProgramMsqData = msqV2
    ? {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Are you or anyone in your household 62 years of age or older?',
        isExclusive: true,
        multiselectOptions: {
          createMany: {
            data: [
              { name: 'Yes', ordinal: 1 },
              { name: 'No', ordinal: 2 },
            ],
          },
        },
        name: 'Seniors 62+',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Are you or anyone in your household 62 years of age or older?',
        options: [
          { text: 'Yes', exclusive: true, ordinal: 0 },
          { text: 'No', exclusive: true, ordinal: 1 },
        ],
        text: 'Seniors 62+',
      };
  await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(jurisdiction.id, {
      multiselectQuestion: senior62PlusProgramMsqData,
    }),
  });

  // add extra programs to support filtering by "community type"
  await Promise.all(
    ['Seniors 55+', 'Families', 'Veterans'].map(
      async (text) =>
        await prismaClient.multiselectQuestions.create({
          data: multiselectQuestionFactory(jurisdiction.id, {
            multiselectQuestion: msqV2
              ? {
                  applicationSection:
                    MultiselectQuestionsApplicationSectionEnum.programs,
                  isExclusive: true,
                  multiselectOptions: {
                    createMany: {
                      data: [
                        { name: 'Yes', ordinal: 1 },
                        { name: 'No', ordinal: 2 },
                      ],
                    },
                  },
                  name: text,
                  status: MultiselectQuestionsStatusEnum.active,
                }
              : {
                  applicationSection:
                    MultiselectQuestionsApplicationSectionEnum.programs,
                  options: [
                    { text: 'Yes', exclusive: true, ordinal: 0 },
                    { text: 'No', exclusive: true, ordinal: 1 },
                  ],
                  text,
                },
          }),
        }),
    ),
  );

  const listingsToCreate = [
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
          unitTypes: { connect: { id: unitTypes[0].id } },
        },
      ],
    },
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
          unitTypes: { connect: { id: unitTypes[1].id } },
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
          unitTypes: { connect: { id: unitTypes[3].id } },
        },
      ],
    },
  ];

  await seedListings(
    prismaClient,
    jurisdiction.id,
    listingsToCreate,
    lakeviewAmiChart,
  );
  return jurisdiction;
};
