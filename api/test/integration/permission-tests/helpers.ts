import { randomUUID } from 'crypto';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { PrismaService } from '../../../src/services/prisma.service';
import { jurisdictionFactory } from '../../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../../prisma/seed-helpers/listing-factory';
import { amiChartFactory } from '../../../prisma/seed-helpers/ami-chart-factory';
import { AmiChartCreate } from '../../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../../../src/dtos/ami-charts/ami-chart-update.dto';
import { IdDTO } from '../../../src/dtos/shared/id.dto';
import {
  unitTypeFactoryAll,
  unitTypeFactorySingle,
} from '../../../prisma/seed-helpers/unit-type-factory';
import { applicationFactory } from '../../../prisma/seed-helpers/application-factory';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { AddressCreate } from '../../../src/dtos/addresses/address-create.dto';
import { ApplicationCreate } from '../../../src/dtos/applications/application-create.dto';
import { ApplicationUpdate } from '../../../src/dtos/applications/application-update.dto';
import { JurisdictionCreate } from '../../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-update.dto';
import {
  reservedCommunityTypeFactoryAll,
  reservedCommunityTypeFactoryGet,
} from '../../../prisma/seed-helpers/reserved-community-type-factory';
import { ReservedCommunityTypeCreate } from '../../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../../../src/dtos/reserved-community-types/reserved-community-type-update.dto';
import { unitRentTypeFactory } from '../../../prisma/seed-helpers/unit-rent-type-factory';
import { unitAccessibilityPriorityTypeFactorySingle } from '../../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { multiselectQuestionFactory } from '../../../prisma/seed-helpers/multiselect-question-factory';
import { ListingCreate } from '../../../src/dtos/listings/listing-create.dto';
import { ListingUpdate } from '../../../src/dtos/listings/listing-update.dto';
import { MultiselectQuestionCreate } from '../../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { UserCreate } from '../../../src/dtos/users/user-create.dto';
import { UserInvite } from '../../../src/dtos/users/user-invite.dto';
import { AlternateContactRelationship } from '../../../src/enums/applications/alternate-contact-relationship-enum';
import { HouseholdMemberRelationship } from '../../../src/enums/applications/household-member-relationship-enum';

export const generateJurisdiction = async (
  prisma: PrismaService,
  jurisName: string,
): Promise<string> => {
  const jurisdictionA = await prisma.jurisdictions.create({
    data: jurisdictionFactory(jurisName),
  });
  return jurisdictionA.id;
};

export const buildAmiChartCreateMock = (jurisId: string): AmiChartCreate => {
  return {
    name: 'name: 10',
    items: [
      {
        percentOfAmi: 80,
        householdSize: 2,
        income: 5000,
      },
    ],
    jurisdictions: {
      id: jurisId,
    },
  };
};

export const buildAmiChartUpdateMock = (id: string): AmiChartUpdate => {
  return {
    id,
    name: 'updated name',
    items: [
      {
        percentOfAmi: 80,
        householdSize: 2,
        income: 5000,
      },
    ],
  };
};

export const buildPresignedEndpointMock = () => {
  return { parametersToSign: { publicId: randomUUID(), eager: 'eager' } };
};

export const buildJurisdictionCreateMock = (
  name: string,
): JurisdictionCreate => {
  return {
    name,
    notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
    languages: [LanguagesEnum.en],
    partnerTerms: `partnerTerms: 10`,
    publicUrl: `publicUrl: 10`,
    emailFromAddress: `emailFromAddress: 10`,
    rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
    enablePartnerSettings: true,
    allowSingleUseCodeLogin: true,
    listingApprovalPermissions: [],
    duplicateListingPermissions: [],
    requiredListingFields: [],
  };
};

export const buildJurisdictionUpdateMock = (
  id: string,
  name: string,
): JurisdictionUpdate => {
  return {
    id,
    name,
    notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
    languages: [LanguagesEnum.en],
    partnerTerms: `partnerTerms: 10`,
    publicUrl: `updated publicUrl: 10`,
    emailFromAddress: `emailFromAddress: 10`,
    rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
    enablePartnerSettings: true,
    allowSingleUseCodeLogin: true,
    listingApprovalPermissions: [],
    duplicateListingPermissions: [],
    requiredListingFields: [],
  };
};

export const buildReservedCommunityTypeCreateMock = (
  jurisId: string,
): ReservedCommunityTypeCreate => {
  return {
    name: 'name: 10',
    description: 'description: 10',
    jurisdictions: {
      id: jurisId,
    },
  };
};

export const buildReservedCommunityTypeUpdateMock = (
  id: string,
): ReservedCommunityTypeUpdate => {
  return {
    id,
    name: 'name: 11',
    description: 'description: 11',
  };
};

export const buildMultiselectQuestionCreateMock = (
  jurisId: string,
): MultiselectQuestionCreate => {
  return {
    text: 'example text',
    subText: 'example subText',
    description: 'example description',
    links: [
      {
        title: 'title 1',
        url: 'https://title-1.com',
      },
      {
        title: 'title 2',
        url: 'https://title-2.com',
      },
    ],
    jurisdictions: [{ id: jurisId }],
    options: [
      {
        text: 'example option text 1',
        ordinal: 1,
        description: 'example option description 1',
        links: [
          {
            title: 'title 3',
            url: 'https://title-3.com',
          },
        ],
        collectAddress: true,
        exclusive: false,
      },
      {
        text: 'example option text 2',
        ordinal: 2,
        description: 'example option description 2',
        links: [
          {
            title: 'title 4',
            url: 'https://title-4.com',
          },
        ],
        collectAddress: true,
        exclusive: false,
      },
    ],
    optOutText: 'example optOutText',
    hideFromListing: false,
    applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
  };
};

export const buildMultiselectQuestionUpdateMock = (
  jurisId: string,
  id: string,
): MultiselectQuestionUpdate => {
  return {
    id,
    text: 'example text',
    subText: 'example subText',
    description: 'example description',
    links: [
      {
        title: 'title 1',
        url: 'https://title-1.com',
      },
      {
        title: 'title 2',
        url: 'https://title-2.com',
      },
    ],
    jurisdictions: [{ id: jurisId }],
    options: [
      {
        text: 'example option text 1',
        ordinal: 1,
        description: 'example option description 1',
        links: [
          {
            title: 'title 3',
            url: 'https://title-3.com',
          },
        ],
        collectAddress: true,
        exclusive: false,
      },
      {
        text: 'example option text 2',
        ordinal: 2,
        description: 'example option description 2',
        links: [
          {
            title: 'title 4',
            url: 'https://title-4.com',
          },
        ],
        collectAddress: true,
        exclusive: false,
      },
    ],
    optOutText: 'example optOutText',
    hideFromListing: false,
    applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
  };
};

export const buildUserCreateMock = (
  jurisId: string,
  email: string,
): UserCreate => {
  return {
    firstName: 'Public User firstName',
    lastName: 'Public User lastName',
    password: 'Abcdef12345!',
    email,
    jurisdictions: [{ id: jurisId }],
  } as unknown as UserCreate;
};

export const buildUserInviteMock = (
  jurisId: string,
  email: string,
): UserInvite => {
  return {
    firstName: 'Partner User firstName',
    lastName: 'Partner User lastName',
    password: 'Abcdef12345!',
    email,
    jurisdictions: [{ id: jurisId }],
    agreedToTermsOfService: true,
    userRoles: {
      isAdmin: true,
    },
  } as unknown as UserInvite;
};

export const buildApplicationCreateMock = (
  exampleAddress: AddressCreate,
  listingId: string,
  unitTypeId: string,
  submissionDate: Date,
): ApplicationCreate => {
  return {
    contactPreferences: ['example contact preference'],
    preferences: [],
    status: ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    applicant: {
      firstName: 'applicant first name',
      middleName: 'applicant middle name',
      lastName: 'applicant last name',
      birthMonth: '12',
      birthDay: '17',
      birthYear: '1993',
      emailAddress: 'example@email.com',
      noEmail: false,
      phoneNumber: '111-111-1111',
      phoneNumberType: 'Cell',
      noPhone: false,
      workInRegion: YesNoEnum.yes,
      applicantWorkAddress: exampleAddress,
      applicantAddress: exampleAddress,
    },
    accessibility: {
      mobility: false,
      vision: false,
      hearing: false,
    },
    alternateContact: {
      type: AlternateContactRelationship.friend,
      otherType: 'example other type',
      firstName: 'example first name',
      lastName: 'example last name',
      agency: 'example agency',
      phoneNumber: '111-111-1111',
      emailAddress: 'example@email.com',
      address: exampleAddress,
    },
    applicationsAlternateAddress: exampleAddress,
    applicationsMailingAddress: exampleAddress,
    listings: {
      id: listingId,
    },
    demographics: {
      ethnicity: '',
      gender: 'example gender',
      sexualOrientation: 'example sexual orientation',
      howDidYouHear: ['example how did you hear'],
      race: ['example race'],
      spokenLanguage: 'example language',
    },
    preferredUnitTypes: [
      {
        id: unitTypeId,
      },
    ],
    householdMember: [
      {
        orderId: 0,
        firstName: 'example first name',
        middleName: 'example middle name',
        lastName: 'example last name',
        birthMonth: '12',
        birthDay: '17',
        birthYear: '1993',
        sameAddress: YesNoEnum.yes,
        relationship: HouseholdMemberRelationship.friend,
        workInRegion: YesNoEnum.yes,
        householdMemberWorkAddress: exampleAddress,
        householdMemberAddress: exampleAddress,
      },
    ],
    appUrl: 'http://www.example.com',
    additionalPhone: true,
    additionalPhoneNumber: '111-111-1111',
    additionalPhoneNumberType: 'example type',
    householdSize: 2,
    housingStatus: 'example status',
    sendMailToMailingAddress: true,
    householdExpectingChanges: false,
    householdStudent: false,
    incomeVouchers: [],
    income: '36000',
    incomePeriod: IncomePeriodEnum.perYear,
    language: LanguagesEnum.en,
    acceptedTerms: true,
    submissionDate: submissionDate,
    reviewStatus: ApplicationReviewStatusEnum.valid,
    programs: [],
  };
};

export const buildApplicationUpdateMock = (
  id: string,
  exampleAddress: AddressCreate,
  listingId: string,
  unitTypeId: string,
  submissionDate: Date,
): ApplicationUpdate => {
  return {
    id: id,
    contactPreferences: ['example contact preference'],
    preferences: [],
    status: ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    applicant: {
      firstName: 'applicant first name',
      middleName: 'applicant middle name',
      lastName: 'applicant last name',
      birthMonth: '12',
      birthDay: '17',
      birthYear: '1993',
      emailAddress: 'example@email.com',
      noEmail: false,
      phoneNumber: '111-111-1111',
      phoneNumberType: 'Cell',
      noPhone: false,
      workInRegion: YesNoEnum.yes,
      applicantWorkAddress: exampleAddress,
      applicantAddress: exampleAddress,
    },
    accessibility: {
      mobility: false,
      vision: false,
      hearing: false,
    },
    alternateContact: {
      type: AlternateContactRelationship.friend,
      otherType: 'example other type',
      firstName: 'example first name',
      lastName: 'example last name',
      agency: 'example agency',
      phoneNumber: '111-111-1111',
      emailAddress: 'example@email.com',
      address: exampleAddress,
    },
    applicationsAlternateAddress: exampleAddress,
    applicationsMailingAddress: exampleAddress,
    listings: {
      id: listingId,
    },
    demographics: {
      ethnicity: '',
      gender: 'example gender',
      sexualOrientation: 'example sexual orientation',
      howDidYouHear: ['example how did you hear'],
      race: ['example race'],
      spokenLanguage: 'example language',
    },
    preferredUnitTypes: [
      {
        id: unitTypeId,
      },
    ],
    householdMember: [
      {
        orderId: 0,
        firstName: 'example first name',
        middleName: 'example middle name',
        lastName: 'example last name',
        birthMonth: '12',
        birthDay: '17',
        birthYear: '1993',
        sameAddress: YesNoEnum.yes,
        relationship: HouseholdMemberRelationship.friend,
        workInRegion: YesNoEnum.yes,
        householdMemberWorkAddress: exampleAddress,
        householdMemberAddress: exampleAddress,
      },
    ],
    appUrl: 'http://www.example.com',
    additionalPhone: true,
    additionalPhoneNumber: '111-111-1111',
    additionalPhoneNumberType: 'example type',
    householdSize: 2,
    housingStatus: 'example status',
    sendMailToMailingAddress: true,
    householdExpectingChanges: false,
    householdStudent: false,
    incomeVouchers: [],
    income: '36000',
    incomePeriod: IncomePeriodEnum.perYear,
    language: LanguagesEnum.en,
    acceptedTerms: true,
    submissionDate: submissionDate,
    reviewStatus: ApplicationReviewStatusEnum.valid,
    programs: [],
  };
};

export const constructFullListingData = async (
  prisma: PrismaService,
  listingId?: string,
  jurisdictionId?: string,
): Promise<ListingCreate | ListingUpdate> => {
  let jurisdictionA: IdDTO = { id: '' };

  if (jurisdictionId) {
    jurisdictionA.id = jurisdictionId;
  } else {
    jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(randomUUID()),
    });
    await reservedCommunityTypeFactoryAll(jurisdictionA.id, prisma);
  }

  await unitTypeFactoryAll(prisma);
  const unitType = await unitTypeFactorySingle(prisma, UnitTypeEnum.SRO);
  const amiChart = await prisma.amiChart.create({
    data: amiChartFactory(10, jurisdictionA.id),
  });
  const unitAccessibilityPriorityType =
    await unitAccessibilityPriorityTypeFactorySingle(prisma);
  const rentType = await prisma.unitRentTypes.create({
    data: unitRentTypeFactory(),
  });
  const multiselectQuestion = await prisma.multiselectQuestions.create({
    data: multiselectQuestionFactory(jurisdictionA.id),
  });
  const reservedCommunityType = await reservedCommunityTypeFactoryGet(
    prisma,
    jurisdictionA.id,
  );

  const exampleAddress = addressFactory() as AddressCreate;

  const exampleAsset = {
    fileId: randomUUID(),
    label: 'example asset label',
  };

  return {
    id: listingId ?? undefined,
    assets: [exampleAsset],
    listingsBuildingAddress: exampleAddress,
    depositMin: '1000',
    depositMax: '5000',
    developer: 'example developer',
    digitalApplication: true,
    listingImages: [
      {
        ordinal: 0,
        assets: exampleAsset,
      },
    ],
    leasingAgentEmail: 'leasingAgent@exygy.com',
    leasingAgentName: 'Leasing Agent',
    leasingAgentPhone: '520-750-8811',
    name: 'example listing',
    paperApplication: false,
    referralOpportunity: false,
    rentalAssistance: 'rental assistance',
    reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
    units: [
      {
        amiPercentage: '1',
        annualIncomeMin: '2',
        monthlyIncomeMin: '3',
        floor: 4,
        annualIncomeMax: '5',
        maxOccupancy: 6,
        minOccupancy: 7,
        monthlyRent: '8',
        numBathrooms: 9,
        numBedrooms: 10,
        number: '11',
        sqFeet: '12',
        monthlyRentAsPercentOfIncome: '13',
        bmrProgramChart: true,
        unitTypes: {
          id: unitType.id,
        },
        amiChart: {
          id: amiChart.id,
        },
        unitAccessibilityPriorityTypes: {
          id: unitAccessibilityPriorityType.id,
        },
        unitRentTypes: {
          id: rentType.id,
        },
      },
    ],
    unitGroups: [],
    listingMultiselectQuestions: [
      {
        id: multiselectQuestion.id,
        ordinal: 0,
      },
    ],
    applicationMethods: [
      {
        type: ApplicationMethodsTypeEnum.Internal,
        label: 'example label',
        externalReference: 'example reference',
        acceptsPostmarkedApplications: false,
        phoneNumber: '520-750-8811',
        paperApplications: [
          {
            language: LanguagesEnum.en,
            assets: exampleAsset,
          },
        ],
      },
    ],
    unitsSummary: [
      {
        unitTypes: {
          id: unitType.id,
        },
        monthlyRentMin: 1,
        monthlyRentMax: 2,
        monthlyRentAsPercentOfIncome: '3',
        amiPercentage: 4,
        minimumIncomeMin: '5',
        minimumIncomeMax: '6',
        maxOccupancy: 7,
        minOccupancy: 8,
        floorMin: 9,
        floorMax: 10,
        sqFeetMin: '11',
        sqFeetMax: '12',
        unitAccessibilityPriorityTypes: {
          id: unitAccessibilityPriorityType.id,
        },
        totalCount: 13,
        totalAvailable: 14,
      },
    ],
    listingsApplicationPickUpAddress: exampleAddress,
    listingsApplicationMailingAddress: exampleAddress,
    listingsApplicationDropOffAddress: exampleAddress,
    listingsLeasingAgentAddress: exampleAddress,
    listingsBuildingSelectionCriteriaFile: exampleAsset,
    listingsResult: exampleAsset,
    listingEvents: [
      {
        type: ListingEventsTypeEnum.openHouse,
        startDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        url: 'https://www.google.com',
        note: 'example note',
        label: 'example label',
        assets: exampleAsset,
      },
    ],
    additionalApplicationSubmissionNotes: 'app submission notes',
    commonDigitalApplication: true,
    accessibility: 'accessibility string',
    amenities: 'amenities string',
    buildingTotalUnits: 5,
    householdSizeMax: 9,
    householdSizeMin: 1,
    neighborhood: 'neighborhood string',
    petPolicy: 'we love pets',
    smokingPolicy: 'smokeing policy string',
    unitsAvailable: 15,
    unitAmenities: 'unit amenity string',
    servicesOffered: 'services offered string',
    yearBuilt: 2023,
    applicationDueDate: new Date(),
    applicationOpenDate: new Date(),
    applicationFee: 'application fee string',
    applicationOrganization: 'app organization string',
    applicationPickUpAddressOfficeHours: 'pick up office hours string',
    applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
    applicationDropOffAddressOfficeHours: 'drop off office hours string',
    applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
    applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
    buildingSelectionCriteria: 'https://selection-criteria.com',
    costsNotIncluded: 'all costs included',
    creditHistory: 'credit history',
    criminalBackground: 'criminal background',
    depositHelperText: 'deposit helper text',
    disableUnitsAccordion: false,
    leasingAgentOfficeHours: 'leasing agent office hours',
    leasingAgentTitle: 'leasing agent title',
    postmarkedApplicationsReceivedByDate: new Date(),
    programRules: 'program rules',
    rentalHistory: 'rental history',
    requiredDocuments: 'required docs',
    specialNotes: 'special notes',
    waitlistCurrentSize: 0,
    waitlistMaxSize: 100,
    whatToExpect: 'what to expect',
    status: ListingsStatusEnum.active,
    displayWaitlistSize: true,
    reservedCommunityDescription: 'reserved community description',
    reservedCommunityMinAge: 66,
    resultLink: 'result link',
    isWaitlistOpen: true,
    waitlistOpenSpots: 100,
    customMapPin: false,
    jurisdictions: {
      id: jurisdictionA.id,
    },
    reservedCommunityTypes: {
      id: reservedCommunityType.id,
    },
    listingFeatures: {
      elevator: true,
      wheelchairRamp: false,
      serviceAnimalsAllowed: true,
      accessibleParking: false,
      parkingOnSite: true,
      inUnitWasherDryer: false,
      laundryInBuilding: true,
      barrierFreeEntrance: false,
      rollInShower: true,
      grabBars: false,
      heatingInUnit: true,
      acInUnit: false,
      hearing: true,
      visual: false,
      mobility: true,
      barrierFreeUnitEntrance: false,
      loweredLightSwitch: true,
      barrierFreeBathroom: false,
      wideDoorways: true,
      loweredCabinets: false,
    },
    listingUtilities: {
      water: false,
      gas: true,
      trash: false,
      sewer: true,
      electricity: false,
      cable: true,
      phone: false,
      internet: true,
    },
  };
};

export const createSimpleApplication = async (
  prisma: PrismaService,
): Promise<string> => {
  const res = await prisma.applications.create({
    data: await applicationFactory(),
    include: {
      applicant: true,
    },
  });

  return res.id;
};

export const createSimpleListing = async (
  prisma: PrismaService,
  jurisId?: string,
): Promise<string> => {
  let jurisdictionId = '';
  if (jurisId) {
    jurisdictionId = jurisId;
  } else {
    const jurisData = jurisdictionFactory();
    const jurisdiction = await prisma.jurisdictions.create({
      data: {
        ...jurisData,
        name: `${jurisData.name} ${Math.floor(Math.random() * 100)}`,
      },
    });
    jurisdictionId = jurisdiction.id;
    await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
  }

  const listing1 = await listingFactory(jurisdictionId, prisma, {
    status: ListingsStatusEnum.closed,
  });
  const listing1Created = await prisma.listings.create({
    data: listing1,
  });

  return listing1Created.id;
};

export const createListing = async (
  prisma: PrismaService,
  jurisId?: string,
): Promise<string> => {
  let jurisdictionId = '';
  if (jurisId) {
    jurisdictionId = jurisId;
  } else {
    const jurisData = jurisdictionFactory();
    const jurisdiction = await prisma.jurisdictions.create({
      data: {
        ...jurisData,
        name: `${jurisData.name} ${Math.floor(Math.random() * 100)}`,
      },
    });
    jurisdictionId = jurisdiction.id;
    await reservedCommunityTypeFactoryAll(jurisdictionId, prisma);
  }
  const listing1 = await listingFactory(jurisdictionId, prisma, {
    status: ListingsStatusEnum.closed,
  });
  const listing1Created = await prisma.listings.create({
    data: listing1,
  });

  return listing1Created.id;
};

export const createComplexApplication = async (
  prisma: PrismaService,
  emailIndicator: string,
  nameAndDOBIndicator: number,
  listing: string,
  householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput,
) => {
  return await prisma.applications.create({
    data: await applicationFactory({
      applicant: {
        emailAddress: `${listing}-email${emailIndicator}@email.com`,
        firstName: `${listing}-firstName${nameAndDOBIndicator}`,
        lastName: `${listing}-lastName${nameAndDOBIndicator}`,
        birthDay: nameAndDOBIndicator,
        birthMonth: nameAndDOBIndicator,
        birthYear: nameAndDOBIndicator,
      },
      listingId: listing,
      householdMember: [householdMember],
    }),
    include: {
      applicant: true,
    },
  });
};
