import {
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  MonthlyRentDeterminationTypeEnum,
  MultiselectQuestions,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  PrismaClient,
  UserRoleEnum,
} from '@prisma/client';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { userFactory } from './seed-helpers/user-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { unitAccessibilityPriorityTypeFactoryAll } from './seed-helpers/unit-accessibility-priority-type-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import { applicationFactory } from './seed-helpers/application-factory';
import { translationFactory } from './seed-helpers/translation-factory';
import { reservedCommunityTypeFactoryAll } from './seed-helpers/reserved-community-type-factory';
import {
  mapLayerFactory,
  redlinedMap,
  simplifiedDCMap,
} from './seed-helpers/map-layer-factory';
import { ValidationMethod } from '../src/enums/multiselect-questions/validation-method-enum';
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
) => {
  // Seed feature flags
  await createAllFeatureFlags(prismaClient);
  // create main jurisdiction with as many feature flags turned on as possible
  const mainJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
      listingApprovalPermissions: [UserRoleEnum.admin],
      featureFlags: [
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableCompanyWebsite,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableIsVerified,
        FeatureFlagEnum.enableListingFavoriting,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableSection8Question,
        FeatureFlagEnum.enableSingleUseCode,
        FeatureFlagEnum.enableUtilitiesIncluded,
        FeatureFlagEnum.enableWaitlistLottery,
        FeatureFlagEnum.enableWhatToExpectAdditionalField,
      ],
      languages: Object.values(LanguagesEnum),
      requiredListingFields: [
        'listingsBuildingAddress',
        'name',
        'developer',
        'listingImages',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'jurisdictions',
        'units',
        'digitalApplication',
        'paperApplication',
        'referralOpportunity',
        'rentalAssistance',
      ],
    }),
  });
  // jurisdiction with unit groups enabled
  const lakeviewJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Lakeview', {
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
    }),
  });
  // Basic configuration jurisdiction
  const bridgeBayJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Bridge Bay', {
      featureFlags: [
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
      ],
      languages: [LanguagesEnum.en, LanguagesEnum.es, LanguagesEnum.vi],
    }),
  });
  // Jurisdiction with no feature flags enabled
  const nadaHill = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Nada Hill', {
      featureFlags: [],
      requiredListingFields: ['name'],
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
      ],
      acceptedTerms: true,
    }),
  });
  // add jurisdiction specific translations and default ones
  await prismaClient.translations.create({
    data: translationFactory(mainJurisdiction.id, mainJurisdiction.name),
  });
  await prismaClient.translations.create({
    data: translationFactory(
      mainJurisdiction.id,
      mainJurisdiction.name,
      LanguagesEnum.es,
    ),
  });
  await prismaClient.translations.create({
    data: translationFactory(),
  });
  // build ami charts
  const amiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, mainJurisdiction.id),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(10, mainJurisdiction.id, 2),
  });
  const lakeviewAmiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(8, lakeviewJurisdiction.id),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(8, lakeviewJurisdiction.id, 2),
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
  const cityEmployeeQuestion = await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(mainJurisdiction.id, {
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
    }),
  });
  const workInCityQuestion = await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(mainJurisdiction.id, {
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
    }),
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
  await unitAccessibilityPriorityTypeFactoryAll(prismaClient);
  await reservedCommunityTypeFactoryAll(mainJurisdiction.id, prismaClient);
  // list of predefined listings WARNING: images only work if image setup is cloudinary on exygy account
  [
    {
      jurisdictionId: mainJurisdiction.id,
      listing: hollywoodHillsHeights,
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
      multiselectQuestions: [
        cityEmployeeQuestion,
        workInCityQuestion,
        multiselectQuestionPrograms,
      ],
      applications: [await applicationFactory(), await applicationFactory()],
      userAccounts: [{ id: partnerUser.id }],
    },
    {
      jurisdictionId: mainJurisdiction.id,
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
    {
      jurisdictionId: mainJurisdiction.id,
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
    {
      jurisdictionId: mainJurisdiction.id,
      listing: valleyHeightsSeniorCommunity,
      userAccounts: [{ id: partnerUser.id }],
    },
    {
      jurisdictionId: mainJurisdiction.id,
      listing: littleVillageApartments,
      multiselectQuestions: [workInCityQuestion],
      userAccounts: [{ id: partnerUser.id }],
    },
    {
      jurisdictionId: mainJurisdiction.id,
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
    {
      jurisdictionId: lakeviewJurisdiction.id,
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
    {
      jurisdictionId: lakeviewJurisdiction.id,
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
  ].map(
    async (
      value: {
        jurisdictionId: string;
        listing: Prisma.ListingsCreateInput;
        units?: Prisma.UnitsCreateWithoutListingsInput[];
        unitGroups?: Prisma.UnitGroupCreateWithoutListingsInput[];
        multiselectQuestions?: MultiselectQuestions[];
        applications?: Prisma.ApplicationsCreateInput[];
        userAccounts?: Prisma.UserAccountsWhereUniqueInput[];
      },
      index,
    ) => {
      console.log(`Adding listing - ${value.listing?.name}`);
      const listing = await listingFactory(value.jurisdictionId, prismaClient, {
        amiChart: amiChart,
        numberOfUnits: (!value.unitGroups && index) || 0,
        listing: value.listing,
        units: value.units,
        unitGroups: value.unitGroups,
        multiselectQuestions: value.multiselectQuestions,
        applications: value.applications,
        afsLastRunSetInPast: true,
        userAccounts: value.userAccounts,
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
    },
  );
};
