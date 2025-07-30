import {
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  ListingsStatusEnum,
  MultiselectQuestions,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  PrismaClient,
  UserRoleEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { randomInt } from 'node:crypto';
import { ValidationMethod } from '../src/enums/multiselect-questions/validation-method-enum';
import {
  realBayAreaPlaces,
  stagingRealisticAddresses,
} from './seed-helpers/address-factory';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { applicationFactory } from './seed-helpers/application-factory';
import { randomBoolean } from './seed-helpers/boolean-generator';
import { householdMemberFactorySingle } from './seed-helpers/household-member-factory';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { userFactory } from './seed-helpers/user-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { unitAccessibilityPriorityTypeFactoryAll } from './seed-helpers/unit-accessibility-priority-type-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import { translationFactory } from './seed-helpers/translation-factory';
import { reservedCommunityTypeFactoryAll } from './seed-helpers/reserved-community-type-factory';
import {
  mapLayerFactory,
  redlinedMap,
  simplifiedDCMap,
} from './seed-helpers/map-layer-factory';
import { createAllFeatureFlags } from './seed-helpers/feature-flag-factory';
import { FeatureFlagEnum } from '../src/enums/feature-flags/feature-flags-enum';
import { hollywoodHillsHeights } from './seed-helpers/listing-data/hollywood-hills-heights';
import { districtViewApartments } from './seed-helpers/listing-data/district-view-apartments';
import { blueSkyApartments } from './seed-helpers/listing-data/blue-sky-apartments';
import { valleyHeightsSeniorCommunity } from './seed-helpers/listing-data/valley-heights-senior-community';
import { littleVillageApartments } from './seed-helpers/listing-data/little-village-apartments';
import { elmVillage } from './seed-helpers/listing-data/elm-village';

export const stagingSeed = async (
  prismaClient: PrismaClient,
  jurisdictionName: string,
  largeSeed?: boolean,
) => {
  // Seed feature flags
  await createAllFeatureFlags(prismaClient);
  //doorway-specific settings
  const listingApprovalPermissions = [UserRoleEnum.admin];
  const duplicateListingPermissions = [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
    UserRoleEnum.limitedJurisdictionAdmin,
    UserRoleEnum.partner,
  ];
  const featureFlags = [
    FeatureFlagEnum.disableWorkInRegion,
    FeatureFlagEnum.enableGeocodingPreferences,
    FeatureFlagEnum.enableListingOpportunity,
    FeatureFlagEnum.enablePartnerDemographics,
    FeatureFlagEnum.enablePartnerSettings,
  ];
  const languages = Object.values(LanguagesEnum);
  const requiredListingFields = [
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
    'applicationDueDate',
  ];
  const doorwaySpecificSettings = {
    listingApprovalPermissions,
    duplicateListingPermissions,
    featureFlags,
    languages,
    requiredListingFields,
  };
  // create main jurisdiction
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: {
      ...jurisdictionFactory(jurisdictionName || 'Bay Area', {
        ...doorwaySpecificSettings,
      }),
      allowSingleUseCodeLogin: true,
    },
  });
  // add other jurisdictions
  const alamedaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Alameda', {
      ...doorwaySpecificSettings,
    }),
  });
  const contraCostaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Contra Costa', {
      ...doorwaySpecificSettings,
    }),
  });
  const marinCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Marin', {
      ...doorwaySpecificSettings,
    }),
  });
  const napaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Napa', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const sanFranciscoCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('San Francisco', {
      ...doorwaySpecificSettings,
    }),
  });
  const sanMateoCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('San Mateo', {
      ...doorwaySpecificSettings,
    }),
  });
  const santaClaraCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Santa Clara', {
      ...doorwaySpecificSettings,
    }),
  });
  const solanaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Solano', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const sonomaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Sonoma', {
      ...doorwaySpecificSettings,
    }),
  });
  const jurisdictionNameMap = {
    Alameda: alamedaCounty.id,
    'Contra Costa': contraCostaCounty.id,
    Marin: marinCounty.id,
    Napa: napaCounty.id,
    'San Francisco': sanFranciscoCounty.id,
    'San Mateo': sanMateoCounty.id,
    'Santa Clara': santaClaraCounty.id,
    Solano: solanaCounty.id,
    Sonoma: sonomaCounty.id,
  };
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
        FeatureFlagEnum.enableListingFavoriting,
        FeatureFlagEnum.enableListingFiltering,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enableListingPagination,
        FeatureFlagEnum.enableListingUpdatedAt,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableNeighborhoodAmenities,
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
      ],
      requiredListingFields: ['name', 'listingsBuildingAddress'],
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
        jurisdiction.id,
        alamedaCounty.id,
        contraCostaCounty.id,
        marinCounty.id,
        napaCounty.id,
        sanFranciscoCounty.id,
        sanMateoCounty.id,
        santaClaraCounty.id,
        solanaCounty.id,
        sonomaCounty.id,
      ],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  // create a jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isJurisdictionalAdmin: true },
      email: 'jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create a limited jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isLimitedJurisdictionalAdmin: true },
      email: 'limited-jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create a partner
  const partnerUser = await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isPartner: true },
      email: 'partner@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'unverified@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: false,
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'mfauser@bloom.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      mfaEnabled: true,
      singleUseCode: '12345',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'public-user@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
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
    data: translationFactory(jurisdiction.id, jurisdiction.name),
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
    data: amiChartFactory(10, jurisdiction.id),
  });
  const NUM_AMI_CHARTS = 5;
  for (let index = 0; index < NUM_AMI_CHARTS; index++) {
    await prismaClient.amiChart.create({
      data: amiChartFactory(8, contraCostaCounty.id),
    });
  }
  await prismaClient.amiChart.create({
    data: amiChartFactory(10, mainJurisdiction.id, 2),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(8, lakeviewJurisdiction.id),
  });
  await prismaClient.amiChart.create({
    data: amiChartFactory(8, lakeviewJurisdiction.id, 2),
  });
  // Create map layers
  await prismaClient.mapLayers.create({
    data: mapLayerFactory(jurisdiction.id, 'Redlined Districts', redlinedMap),
  });
  const mapLayer = await prismaClient.mapLayers.create({
    data: mapLayerFactory(jurisdiction.id, 'Washington DC', simplifiedDCMap),
  });
  const cityEmployeeQuestion = await prismaClient.multiselectQuestions.create({
    data: multiselectQuestionFactory(jurisdiction.id, {
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
    data: multiselectQuestionFactory(jurisdiction.id, {
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
      data: multiselectQuestionFactory(jurisdiction.id, {
        multiselectQuestion: {
          text: 'Veteran',
          description:
            'Have you or anyone in your household served in the US military?',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
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
      data: multiselectQuestionFactory(jurisdiction.id, {
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
        optOutText: 'Prefer not to say',
        options: [
          { text: 'Yes', exclusive: true, ordinal: 1 },
          { text: 'No', exclusive: true, ordinal: 2 },
        ],
      },
    }),
  });

  // add extra programs to support filtering by "community type"
  await Promise.all(
    [...new Array(3)].map(
      async () =>
        await prismaClient.multiselectQuestions.create({
          data: multiselectQuestionFactory(lakeviewJurisdiction.id, {
            multiselectQuestion: {
              applicationSection:
                MultiselectQuestionsApplicationSectionEnum.programs,
            },
          }),
        }),
    ),
  );

  // create pre-determined values
  const unitTypes = await unitTypeFactoryAll(prismaClient);
  await unitAccessibilityPriorityTypeFactoryAll(prismaClient);
  await reservedCommunityTypeFactoryAll(jurisdiction.id, prismaClient);
  // list of predefined listings WARNING: images only work if image setup is cloudinary on exygy account
  [
    {
      jurisdictionId: jurisdiction.id,
      listing: hollywoodHillsHeights,
      units: [
        {
          amiPercentage: '30',
          monthlyIncomeMin: '2000',
          floor: 1,
          maxOccupancy: 3,
          minOccupancy: 1,
          monthlyRent: '1200.00',
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
      jurisdictionId: jurisdiction.id,
      listing: districtViewApartments,
      units: [
        {
          amiPercentage: '30',
          annualIncomeMin: null,
          monthlyIncomeMin: '1985',
          floor: 2,
          maxOccupancy: 5,
          minOccupancy: 2,
          monthlyRent: '800.00',
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
          monthlyRent: '800.0',
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
      jurisdictionId: jurisdiction.id,
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
      jurisdictionId: jurisdiction.id,
      listing: valleyHeightsSeniorCommunity,
      userAccounts: [{ id: partnerUser.id }],
    },
    {
      jurisdictionId: jurisdiction.id,
      listing: littleVillageApartments,
      multiselectQuestions: [workInCityQuestion],
      userAccounts: [{ id: partnerUser.id }],
    },
    {
      jurisdictionId: jurisdiction.id,
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
          monthlyRent: '1200.00',
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
          monthlyRent: '1200.0',
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
          monthlyRent: '1200.0',
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
    // lakeview listings shouldn't be in Doorway, but keeping here for keeping the same as Core
    // {
    //   jurisdictionId: lakeviewJurisdiction.id,
    //   listing: lakeviewVilla,
    //   unitGroups: [
    //     {
    //       floorMin: 1,
    //       floorMax: 2,
    //       maxOccupancy: 3,
    //       minOccupancy: 1,
    //       bathroomMin: 1,
    //       bathroomMax: 1,
    //       totalCount: 10,
    //       totalAvailable: 5,
    //       sqFeetMin: '750.00',
    //       sqFeetMax: '1000.00',
    //       unitGroupAmiLevels: {
    //         create: {
    //           amiPercentage: 30,
    //           monthlyRentDeterminationType:
    //             MonthlyRentDeterminationTypeEnum.flatRent,
    //           flatRentValue: 1400.0,
    //           amiChart: { connect: { id: amiChart.id } },
    //         },
    //       },
    //       unitTypes: {
    //         connect: {
    //           id: unitTypes[0].id,
    //         },
    //       },
    //     },
    //   ],
    // },
    // {
    //   jurisdictionId: lakeviewJurisdiction.id,
    //   listing: sunshineFlats,
    //   unitGroups: [
    //     {
    //       floorMin: 1,
    //       floorMax: 1,
    //       maxOccupancy: 6,
    //       minOccupancy: 1,
    //       bathroomMin: 1,
    //       bathroomMax: 2,
    //       totalCount: 12,
    //       totalAvailable: 12,
    //       sqFeetMin: '750.00',
    //       sqFeetMax: '1600.00',
    //       unitGroupAmiLevels: {
    //         create: {
    //           amiPercentage: 45,
    //           monthlyRentDeterminationType:
    //             MonthlyRentDeterminationTypeEnum.percentageOfIncome,
    //           percentageOfIncomeValue: 30.0,
    //           amiChart: { connect: { id: amiChart.id } },
    //         },
    //       },
    //       unitTypes: {
    //         connect: {
    //           id: unitTypes[1].id,
    //         },
    //       },
    //     },
    //     {
    //       floorMin: 2,
    //       floorMax: 2,
    //       maxOccupancy: 6,
    //       minOccupancy: 3,
    //       bathroomMin: 2,
    //       bathroomMax: 2,
    //       totalCount: 6,
    //       totalAvailable: 6,
    //       sqFeetMin: '1200.00',
    //       sqFeetMax: '1800.00',
    //       unitGroupAmiLevels: {
    //         create: {
    //           amiPercentage: 45,
    //           monthlyRentDeterminationType:
    //             MonthlyRentDeterminationTypeEnum.flatRent,
    //           flatRentValue: 1800.0,
    //           amiChart: { connect: { id: amiChart.id } },
    //         },
    //       },
    //       unitTypes: {
    //         connect: {
    //           id: unitTypes[3].id,
    //         },
    //       },
    //     },
    //   ],
    // },
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
        address: stagingRealisticAddresses[index + 4],
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
  // Creating a bunch of admin accounts if the environment variable is set to do load testing
  const adminAccounts: number =
    process.env.ADMIN_ACCOUNTS != undefined
      ? Number(process.env.ADMIN_ACCOUNTS)
      : 1;
  for (let i = 0; i < adminAccounts; i++) {
    await prismaClient.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        email: `admin${i}@example.com`,
        confirmedAt: new Date(),
        jurisdictionIds: [jurisdiction.id],
        acceptedTerms: true,
        password: 'abcdef',
      }),
    });
  }
  if (largeSeed) {
    Object.values(stagingRealisticAddresses).forEach(async (addr, index) => {
      const listing = await listingFactory(
        jurisdictionNameMap[addr.county],
        prismaClient,
        {
          amiChart: amiChart,
          // most listings are under 10 units but there are some that get up to 175. This simulates that spread
          numberOfUnits:
            Math.random() < 0.9 ? randomInt(1, 10) : randomInt(10, 200),
          digitalApp: !!(index % 2),
          status: ListingsStatusEnum.active,
          address: addr,
          publishedAt: dayjs(new Date()).subtract(5, 'days').toDate(),
        },
      );
      await prismaClient.listings.create({
        data: listing,
      });
    });

    // Add closed and pending listings
    Object.values(realBayAreaPlaces).forEach(async (addr, index) => {
      const listing = await listingFactory(
        jurisdictionNameMap[addr.county],
        prismaClient,
        {
          amiChart: amiChart,
          // most listings are under 10 units but there are some that get up to 175. This simulates that spread
          numberOfUnits:
            Math.random() < 0.9 ? randomInt(1, 10) : randomInt(10, 200),
          digitalApp: !!(index % 2),
          status: randomBoolean()
            ? ListingsStatusEnum.pending
            : ListingsStatusEnum.closed,
          address: addr,
        },
      );
      await prismaClient.listings.create({
        data: listing,
      });
    });
  }
};
