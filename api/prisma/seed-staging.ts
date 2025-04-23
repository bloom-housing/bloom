import {
  ApplicationSubmissionTypeEnum,
  LanguagesEnum,
  ListingsStatusEnum,
  MonthlyRentDeterminationTypeEnum,
  MultiselectQuestions,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  PrismaClient,
  ReviewOrderTypeEnum,
  UserRoleEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { ValidationMethod } from '../src/enums/multiselect-questions/validation-method-enum';
import { stagingRealisticAddresses } from './seed-helpers/address-factory';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { applicationFactory } from './seed-helpers/application-factory';
import { householdMemberFactorySingle } from './seed-helpers/household-member-factory';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { userFactory } from './seed-helpers/user-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { unitAccessibilityPriorityTypeFactoryAll } from './seed-helpers/unit-accessibility-priority-type-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import { yellowstoneAddress } from './seed-helpers/address-factory';
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
  //doorway-specific permissions
  const listingApprovalPermissions = [UserRoleEnum.admin];
  const duplicateListingPermissions = [
    UserRoleEnum.admin,
    UserRoleEnum.jurisdictionAdmin,
    UserRoleEnum.limitedJurisdictionAdmin,
    UserRoleEnum.partner,
  ];
  // create main jurisdiction
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: {
      ...jurisdictionFactory(jurisdictionName || 'Bay Area', {
        listingApprovalPermissions,
        duplicateListingPermissions,
      }),
      allowSingleUseCodeLogin: true,
    },
  });
  // add another jurisdiction
  const additionalJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Contra Costa', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const alamedaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Alameda', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const marinCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Marin', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const napaCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Napa', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const sanMateoCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('San Mateo', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const santaClaraCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Santa Clara', {
      listingApprovalPermissions,
      duplicateListingPermissions,
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
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const sanFranciscoCounty = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('San Francisco', {
      listingApprovalPermissions,
      duplicateListingPermissions,
    }),
  });
  const jurisdictionNameMap = {
    Alameda: alamedaCounty.id,
    'Contra Costa': additionalJurisdiction.id,
    Marin: marinCounty.id,
    'San Mateo': sanMateoCounty.id,
    Napa: napaCounty.id,
    'Santa Clara': santaClaraCounty.id,
    Solano: solanaCounty.id,
    Sonoma: sonomaCounty.id,
    'San Francisco': sanFranciscoCounty.id,
  };
  // create main jurisdiction with as many feature flags turned on as possible
  const mainJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(jurisdictionName, {
      listingApprovalPermissions: [UserRoleEnum.admin],
      featureFlags: [
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableUtilitiesIncluded,
        FeatureFlagEnum.enableIsVerified,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableSection8Question,
        FeatureFlagEnum.enableSingleUseCode,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableListingsPagination,
        FeatureFlagEnum.enableListingFavoriting,
      ],
    }),
  });
  // jurisdiction with unit groups enabled
  const lakeviewJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Lakeview', {
      featureFlags: [
        FeatureFlagEnum.enableUnitGroups,
        FeatureFlagEnum.hideCloseListingButton,
        FeatureFlagEnum.enableHomeType,
        FeatureFlagEnum.enableAccessibilityFeatures,
        FeatureFlagEnum.enableUtilitiesIncluded,
        FeatureFlagEnum.enableIsVerified,
        FeatureFlagEnum.enableNeighborhoodAmenities,
        FeatureFlagEnum.enableMarketingStatus,
        FeatureFlagEnum.enableRegions,
        FeatureFlagEnum.enableSection8Question,
        FeatureFlagEnum.enableSingleUseCode,
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableListingsPagination,
        FeatureFlagEnum.disableJurisdictionalAdmin,
        FeatureFlagEnum.enableListingFavoriting,
      ],
    }),
  });
  // Basic configuration jurisdiction
  const bridgeBayJurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Bridge Bay', {
      featureFlags: [
        FeatureFlagEnum.enableGeocodingPreferences,
        FeatureFlagEnum.enableGeocodingRadiusMethod,
        FeatureFlagEnum.enableListingOpportunity,
        FeatureFlagEnum.enablePartnerDemographics,
        FeatureFlagEnum.enablePartnerSettings,
        FeatureFlagEnum.enableListingsPagination,
      ],
    }),
  });
  // Jurisdiction with no feature flags enabled
  const nadaHill = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory('Nada Hill', {
      featureFlags: [],
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
        additionalJurisdiction.id,
        marinCounty.id,
        napaCounty.id,
        sanMateoCounty.id,
        santaClaraCounty.id,
        solanaCounty.id,
        sonomaCounty.id,
        sanFranciscoCounty.id,
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
  await prismaClient.userAccounts.create({
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
    data: translationFactory(undefined, undefined, LanguagesEnum.es),
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
      data: amiChartFactory(8, additionalJurisdiction.id),
    });
  }
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
    },
    {
      jurisdictionId: jurisdiction.id,
      listing: valleyHeightsSeniorCommunity,
    },
    {
      jurisdictionId: jurisdiction.id,
      listing: littleVillageApartments,
      multiselectQuestions: [workInCityQuestion],
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
    },
    {
      jurisdictionId: lakeviewJurisdiction.id,
      listing: {
        additionalApplicationSubmissionNotes: null,
        digitalApplication: true,
        commonDigitalApplication: true,
        paperApplication: false,
        referralOpportunity: false,
        assets: [],
        accessibility: null,
        amenities: null,
        buildingTotalUnits: 0,
        developer: 'Bloom',
        householdSizeMax: 0,
        householdSizeMin: 0,
        neighborhood: 'Hollywood',
        petPolicy: null,
        smokingPolicy: null,
        unitAmenities: null,
        servicesOffered: null,
        yearBuilt: null,
        applicationDueDate: null,
        applicationOpenDate: dayjs(new Date()).subtract(70, 'days').toDate(),
        applicationFee: null,
        applicationOrganization: null,
        applicationPickUpAddressOfficeHours: null,
        applicationPickUpAddressType: null,
        applicationDropOffAddressOfficeHours: null,
        applicationDropOffAddressType: null,
        applicationMailingAddressType: null,
        buildingSelectionCriteria: null,
        costsNotIncluded: null,
        creditHistory: null,
        criminalBackground: null,
        depositMin: '0',
        depositMax: '0',
        depositHelperText:
          "or one month's rent may be higher for lower credit scores",
        disableUnitsAccordion: false,
        leasingAgentEmail: 'bloom@exygy.com',
        leasingAgentName: 'Bloom Bloomington',
        leasingAgentOfficeHours: null,
        leasingAgentPhone: '(555) 555-5555',
        leasingAgentTitle: null,
        name: 'Lakeview Villa',
        postmarkedApplicationsReceivedByDate: null,
        programRules: null,
        rentalAssistance:
          'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
        rentalHistory: null,
        requiredDocuments: null,
        specialNotes: null,
        waitlistCurrentSize: null,
        waitlistMaxSize: null,
        whatToExpect:
          'Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
        status: ListingsStatusEnum.active,
        reviewOrderType: ReviewOrderTypeEnum.waitlist,
        unitsAvailable: 0,
        displayWaitlistSize: false,
        reservedCommunityDescription: null,
        reservedCommunityMinAge: null,
        resultLink: null,
        isWaitlistOpen: false,
        waitlistOpenSpots: null,
        customMapPin: false,
        contentUpdatedAt: new Date(),
        publishedAt: new Date(),
        listingsBuildingAddress: {
          create: yellowstoneAddress,
        },
        listingsApplicationPickUpAddress: undefined,
        listingsLeasingAgentAddress: undefined,
        listingsApplicationDropOffAddress: undefined,
        listingsApplicationMailingAddress: undefined,
        reservedCommunityTypes: undefined,
        listingImages: {
          create: {
            ordinal: 0,
            assets: {
              create: {
                label: 'cloudinaryBuilding',
                fileId: 'dev/apartment_building_2_b7ujdd',
              },
            },
          },
        },
        listingNeighborhoodAmenities: {
          create: {
            groceryStores: 'There are grocery stores',
            pharmacies: 'There are pharmacies',
            healthCareResources: 'There is health care',
            parksAndCommunityCenters: 'There are parks',
            schools: 'There are schools',
            publicTransportation: 'There is public transportation',
          },
        },
      },
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
              amiChart: { connect: { id: amiChart.id } },
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
  ].map(
    async (
      value: {
        jurisdictionId: string;
        listing: Prisma.ListingsCreateInput;
        units?: Prisma.UnitsCreateWithoutListingsInput[];
        unitGroups?: Prisma.UnitGroupCreateWithoutListingsInput[];
        multiselectQuestions?: MultiselectQuestions[];
        applications?: Prisma.ApplicationsCreateInput[];
      },
      index,
    ) => {
      // <<<<<<< HEAD
      //       const jurisdictionId =
      //         index > 2 ? additionalJurisdiction.id : jurisdiction.id;
      //       const listing = await listingFactory(jurisdictionId, prismaClient, {
      // =======
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
            .replace(' ', '')}@example.com`,
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
          numberOfUnits: 4,
          digitalApp: !!(index % 2),
          address: addr,
          publishedAt: dayjs(new Date()).subtract(5, 'days').toDate(),
        },
      );
      await prismaClient.listings.create({
        data: listing,
      });
    });
  }
};
