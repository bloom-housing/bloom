import {
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  PrismaClient,
  UserRoleEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { FeatureFlagEnum } from '../../src/enums/feature-flags/feature-flags-enum';
import { ApplicationAccessibilityFeatureEnum } from '../../src/enums/applications/application-accessibility-feature-enum';
import { ValidationMethod } from '../../src/enums/multiselect-questions/validation-method-enum';
import { agencyFactory } from '../seed-helpers/agency-factory';
import { amiChartFactory } from '../seed-helpers/ami-chart-factory';
import {
  applicationFactory,
  applicationFactoryMany,
} from '../seed-helpers/application-factory';
import { householdMemberFactorySingle } from '../seed-helpers/household-member-factory';
import { jurisdictionFactory } from '../seed-helpers/jurisdiction-factory';
import { blueSkyApartments } from '../seed-helpers/listing-data/blue-sky-apartments';
import { districtViewApartments } from '../seed-helpers/listing-data/district-view-apartments';
import { elmVillage } from '../seed-helpers/listing-data/elm-village';
import { littleVillageApartments } from '../seed-helpers/listing-data/little-village-apartments';
import { valleyHeightsSeniorCommunity } from '../seed-helpers/listing-data/valley-heights-senior-community';
import {
  mapLayerFactory,
  redlinedMap,
  simplifiedDCMap,
} from '../seed-helpers/map-layer-factory';
import { multiselectQuestionFactory } from '../seed-helpers/multiselect-question-factory';
import { reservedCommunityTypeFactoryAll } from '../seed-helpers/reserved-community-type-factory';
import {
  defaultListingFeatureConfiguration,
  defaultRaceEthnicityConfiguration,
  seedListings,
} from './seed-staging-helpers';

export const createBloomingtonJurisdiction = async (
  prismaClient: PrismaClient,
  {
    jurisdictionName,
    publicSiteBaseURL,
    unitTypes,
    partnerUser,
    msqV2,
  }: {
    jurisdictionName: string;
    publicSiteBaseURL: string;
    unitTypes: { id: string }[];
    partnerUser: { id: string };
    msqV2: boolean;
  },
) => {
  const optionalV2MSQ = msqV2 ? [FeatureFlagEnum.enableV2MSQ] : [];
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
      publicSiteBaseURL,
      listingApprovalPermissions: [UserRoleEnum.admin],
      featureFlags: [
        ...optionalV2MSQ,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableCompanyWebsite,
        FeatureFlagEnum.enableCustomListingNotifications,
        FeatureFlagEnum.enableFaq,
        FeatureFlagEnum.enableGenderQuestion,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableHousingBasics,
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
        FeatureFlagEnum.enableReceivedAtAndByFields,
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
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
        ApplicationAccessibilityFeatureEnum.other,
      ],
    }),
  });

  await agencyFactory(jurisdiction.id, prismaClient, 5, 'Bloomington');

  const expiredApplicationDate = process.env.APPLICATION_DAYS_TILL_EXPIRY
    ? dayjs(new Date()).subtract(10, 'days').toDate()
    : undefined;

  const amiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id, null, jurisdiction.name),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id, 2, jurisdiction.name),
  });

  await prismaClient.mapLayers.create({
    data: mapLayerFactory(jurisdiction.id, 'Redlined Districts', redlinedMap),
  });
  const mapLayer = await prismaClient.mapLayers.create({
    data: mapLayerFactory(jurisdiction.id, 'Washington DC', simplifiedDCMap),
  });

  const cityEmployeeMsqData = msqV2
    ? {
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        description: 'Employees of the local city.',
        multiselectOptions: {
          createMany: {
            data: [
              {
                name: 'At least one member of my household is a city employee',
                shouldCollectAddress: false,
                ordinal: 1,
              },
            ],
          },
        },
        name: 'City Employees',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        description: 'Employees of the local city.',
        options: [
          {
            text: 'At least one member of my household is a city employee',
            collectAddress: false,
            ordinal: 0,
          },
        ],
        text: 'City Employees',
      };
  const cityEmployeeQuestion = await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(
      jurisdiction.id,
      { multiselectQuestion: cityEmployeeMsqData },
      msqV2,
    ),
  });

  const workInCityMsqData = msqV2
    ? {
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        description: 'Workers in the local city.',
        multiselectOptions: {
          createMany: {
            data: [
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
              },
            ],
          },
        },
        name: 'Work in the city',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        description: 'Workers in the local city.',
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
        text: 'Work in the city',
      };
  const workInCityQuestion = await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(
      jurisdiction.id,
      { optOut: true, multiselectQuestion: workInCityMsqData },
      msqV2,
    ),
  });

  const veteranProgramMsqData = msqV2
    ? {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Have you or anyone in your household served in the US military?',
        isExclusive: true,
        multiselectOptions: {
          createMany: {
            data: [
              { name: 'Yes', ordinal: 1 },
              { name: 'No', ordinal: 2 },
              { isOptOut: true, name: 'Prefer not to say', ordinal: 3 },
            ],
          },
        },
        name: 'Veterans',
        status: MultiselectQuestionsStatusEnum.active,
      }
    : {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description:
          'Have you or anyone in your household served in the US military?',
        optOutText: 'Prefer not to say',
        options: [
          { text: 'Yes', exclusive: true, ordinal: 0 },
          { text: 'No', exclusive: true, ordinal: 1 },
        ],
        text: 'Veterans',
      };
  const veteransProgramQuestion =
    await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(
        jurisdiction.id,
        { multiselectQuestion: veteranProgramMsqData },
        msqV2,
      ),
    });

  await reservedCommunityTypeFactoryAll(jurisdiction.id, prismaClient);

  const defaultUnit = {
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
    unitTypes: { connect: { id: unitTypes[1].id } },
  };

  const listingsToCreate = [
    {
      listing: districtViewApartments,
      numberOfUnits: 0,
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
          unitTypes: { connect: { id: unitTypes[2].id } },
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
          unitTypes: { connect: { id: unitTypes[2].id } },
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
          unitTypes: { connect: { id: unitTypes[2].id } },
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
    {
      listing: blueSkyApartments,
      numberOfUnits: 0,
      units: [defaultUnit],
      userAccounts: [{ id: partnerUser.id }],
      enableListingFeaturesAndUtilities: true,
    },
    {
      listing: valleyHeightsSeniorCommunity,
      numberOfUnits: 4,
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
    {
      listing: littleVillageApartments,
      numberOfUnits: 5,
      multiselectQuestions: [workInCityQuestion],
      userAccounts: [{ id: partnerUser.id }],
      enableListingFeaturesAndUtilities: true,
    },
    {
      listing: elmVillage,
      numberOfUnits: 0,
      applications: [
        await applicationFactory({
          enableV2MSQ: msqV2,
          multiselectQuestions: [workInCityQuestion, cityEmployeeQuestion],
        }),
        await applicationFactory({
          enableV2MSQ: msqV2,
          multiselectQuestions: [
            cityEmployeeQuestion,
            workInCityQuestion,
            veteransProgramQuestion,
          ],
        }),
        await applicationFactory({
          enableV2MSQ: msqV2,
          multiselectQuestions: [workInCityQuestion, cityEmployeeQuestion],
        }),
        ...(await applicationFactoryMany(2, {
          enableV2MSQ: msqV2,
          multiselectQuestions: [workInCityQuestion],
        })),
        await applicationFactory(),
      ],
      multiselectQuestions: [
        workInCityQuestion,
        cityEmployeeQuestion,
        veteransProgramQuestion,
      ],
      units: [
        {
          ...defaultUnit,
          numBedrooms: 0,
          unitTypes: { connect: { id: unitTypes[0].id } },
        },
        {
          ...defaultUnit,
          numBedrooms: 0,
          unitTypes: { connect: { id: unitTypes[5].id } },
        },
        { ...defaultUnit },
        {
          ...defaultUnit,
          numBedrooms: 2,
          sqFeet: '1050.00',
          unitTypes: { connect: { id: unitTypes[2].id } },
        },
        {
          ...defaultUnit,
          numBathrooms: 2,
          numBedrooms: 3,
          sqFeet: '1250.00',
          unitTypes: { connect: { id: unitTypes[3].id } },
        },
        {
          ...defaultUnit,
          numBathrooms: 3,
          numBedrooms: 4,
          sqFeet: '1750.00',
          unitTypes: { connect: { id: unitTypes[4].id } },
        },
      ],
      userAccounts: [{ id: partnerUser.id }],
      enableListingFeaturesAndUtilities: true,
    },
  ];

  await seedListings(prismaClient, jurisdiction.id, listingsToCreate, amiChart);

  return jurisdiction;
};
