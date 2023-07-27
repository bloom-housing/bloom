import {
  Prisma,
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  ApplicationReviewStatusEnum,
  YesNoEnum,
} from '@prisma/client';
import { randomInt } from 'crypto';
import { generateConfirmationCode } from '../../src/utilities/applications-utilities';
import { addressFactory } from './address-factory';
import { randomNoun } from './word-generator';

export const applicationFactory = (optionalParams?: {
  househouldSize?: number;
  unitTypeId?: string;
}): Prisma.ApplicationsCreateInput => {
  let preferredUnitTypes;
  if (optionalParams?.unitTypeId) {
    preferredUnitTypes = {
      connect: [
        {
          id: optionalParams.unitTypeId,
        },
      ],
    };
  }
  return {
    confirmationCode: generateConfirmationCode(),
    applicant: { create: applicantFactory() },
    appUrl: 'http://localhost:3000/', // can this be dynamic?
    status: ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    householdSize: optionalParams?.househouldSize ?? 1,
    preferences: {},
    preferredUnitTypes,
  };
};

export const applicantFactory = (
  overrides?: Prisma.ApplicantCreateWithoutApplicationsInput,
): Prisma.ApplicantCreateWithoutApplicationsInput => {
  const firstName = randomNoun();
  const lastName = randomNoun();
  return {
    firstName: firstName,
    lastName: lastName,
    emailAddress: `${firstName}.${lastName}@example.com`,
    noEmail: false,
    phoneNumber: '(123) 123-1231',
    phoneNumberType: 'home',
    noPhone: false,
    workInRegion: YesNoEnum.no,
    birthDay: `${randomInt(31) + 1}`, // no zeros
    birthMonth: `${randomInt(12) + 1}`, // no zeros
    birthYear: `${randomInt(80) + 1930}`,
    applicantAddress: {
      create: addressFactory(),
    },
    applicantWorkAddress: {
      create: addressFactory(),
    },
    ...overrides,
  };
};

export const applicationFactory2 = (i: number, unitTypeId: string) => ({
  // appUrl: `appUrl ${i}`,
  additionalPhone: true,
  additionalPhoneNumber: `additionalPhoneNumber ${i}`,
  additionalPhoneNumberType: `additionalPhoneNumberType ${i}`,
  householdSize: i,
  housingStatus: `housingStatus ${i}`,
  sendMailToMailingAddress: true,
  householdExpectingChanges: true,
  householdStudent: true,
  incomeVouchers: true,
  income: `income ${i}`,
  incomePeriod: IncomePeriodEnum.perMonth,
  preferences: {},
  status: ApplicationStatusEnum.submitted,
  submissionType: ApplicationSubmissionTypeEnum.electronical,
  acceptedTerms: true,
  submissionDate: new Date(),
  markedAsDuplicate: false,
  // confirmationCode: `confirmationCode ${i}`,
  reviewStatus: ApplicationReviewStatusEnum.valid,
  // applicant: {
  //   create: {
  //     // firstName: `application ${i} firstName`,
  //     // middleName: `application ${i} middleName`,
  //     // lastName: `application ${i} lastName`,
  //     // birthMonth: `application ${i} birthMonth`,
  //     // birthDay: `application ${i} birthDay`,
  //     // birthYear: `application ${i} birthYear`,
  //     // emailAddress: `application ${i} emailAddress`,
  //     // noEmail: false,
  //     // phoneNumber: `application ${i} phoneNumber`,
  //     // phoneNumberType: `application ${i} phoneNumberType`,
  //     // noPhone: false,
  //     // workInRegion: YesNoEnum.yes,
  //     // applicantWorkAddress: {
  //     //   create: {
  //     //     placeName: `application ${i} applicantWorkAddress placeName`,
  //     //     city: `application ${i} applicantWorkAddress city`,
  //     //     county: `application ${i} applicantWorkAddress county`,
  //     //     state: `application ${i} applicantWorkAddress state`,
  //     //     street: `application ${i} applicantWorkAddress street`,
  //     //     street2: `application ${i} applicantWorkAddress street2`,
  //     //     zipCode: `application ${i} applicantWorkAddress zipCode`,
  //     //     latitude: `${i}`,
  //     //     longitude: `${i}`,
  //     //   },
  //     // },
  //     // applicantAddress: {
  //     //   create: {
  //     //     placeName: `application ${i} applicantAddress placeName`,
  //     //     city: `application ${i} applicantAddress city`,
  //     //     county: `application ${i} applicantAddress county`,
  //     //     state: `application ${i} applicantAddress state`,
  //     //     street: `application ${i} applicantAddress street`,
  //     //     street2: `application ${i} applicantAddress street2`,
  //     //     zipCode: `application ${i} applicantAddress zipCode`,
  //     //     latitude: `${i}`,
  //     //     longitude: `${i}`,
  //     //   },
  //     // },
  //   },
  // },
  accessibility: {
    create: {
      mobility: true,
      vision: true,
      hearing: true,
    },
  },
  alternateContact: {
    create: {
      type: `application ${i} alternateContact type`,
      otherType: `application ${i} alternateContact otherType`,
      firstName: `application ${i} alternateContact firstName`,
      lastName: `application ${i} alternateContact lastName`,
      agency: `application ${i} alternateContact agency`,
      phoneNumber: `application ${i} alternateContact phoneNumber`,
      emailAddress: `application ${i} alternateContact emailAddress`,
      address: {
        create: {
          placeName: `application ${i} alternateContact placeName`,
          city: `application ${i} alternateContact city`,
          county: `application ${i} alternateContact county`,
          state: `application ${i} alternateContact state`,
          street: `application ${i} alternateContact street`,
          street2: `application ${i} alternateContact street2`,
          zipCode: `application ${i} alternateContact zipCode`,
          latitude: `${i}`,
          longitude: `${i}`,
        },
      },
    },
  },
  applicationsAlternateAddress: {
    create: {
      placeName: `application ${i} applicationsAlternateAddress placeName`,
      city: `application ${i} applicationsAlternateAddress city`,
      county: `application ${i} applicationsAlternateAddress county`,
      state: `application ${i} applicationsAlternateAddress state`,
      street: `application ${i} applicationsAlternateAddress street`,
      street2: `application ${i} applicationsAlternateAddress street2`,
      zipCode: `application ${i} applicationsAlternateAddress zipCode`,
      latitude: `${i}`,
      longitude: `${i}`,
    },
  },
  applicationsMailingAddress: {
    create: {
      placeName: `application ${i} applicationsMailingAddress placeName`,
      city: `application ${i} applicationsMailingAddress city`,
      county: `application ${i} applicationsMailingAddress county`,
      state: `application ${i} applicationsMailingAddress state`,
      street: `application ${i} applicationsMailingAddress street`,
      street2: `application ${i} applicationsMailingAddress street2`,
      zipCode: `application ${i} applicationsMailingAddress zipCode`,
      latitude: `${i}`,
      longitude: `${i}`,
    },
  },
  demographics: {
    create: {
      ethnicity: `application ${i} ethnicity`,
      gender: `application ${i} gender`,
      sexualOrientation: `application ${i} sexualOrientation`,
      howDidYouHear: [`application ${i} howDidYouHear`],
      race: [`application ${i} race`],
    },
  },
  preferredUnitTypes: {
    connect: [
      {
        id: unitTypeId,
      },
    ],
  },
  householdMember: {
    create: [
      {
        orderId: i,
        firstName: `application ${i} householdMember firstName`,
        middleName: `application ${i} householdMember middleName`,
        lastName: `application ${i} householdMember lastName`,
        birthMonth: `application ${i} householdMember birthMonth`,
        birthDay: `application ${i} householdMember birthDay`,
        birthYear: `application ${i} householdMember birthYear`,
        emailAddress: `application ${i} householdMember emailAddress`,
        phoneNumber: `application ${i} householdMember phoneNumber`,
        phoneNumberType: `application ${i} householdMember phoneNumberType`,
        noPhone: false,
        sameAddress: YesNoEnum.no,
        relationship: `application ${i} householdMember relationship`,
        workInRegion: YesNoEnum.yes,
        householdMemberAddress: {
          create: {
            placeName: `application ${i} householdMemberAddress placeName`,
            city: `application ${i} householdMemberAddress city`,
            county: `application ${i} householdMemberAddress county`,
            state: `application ${i} householdMemberAddress state`,
            street: `application ${i} householdMemberAddress street`,
            street2: `application ${i} householdMemberAddress street2`,
            zipCode: `application ${i} householdMemberAddress zipCode`,
            latitude: `${i}`,
            longitude: `${i}`,
          },
        },
        householdMemberWorkAddress: {
          create: {
            placeName: `application ${i} householdMemberWorkAddress placeName`,
            city: `application ${i} householdMemberWorkAddress city`,
            county: `application ${i} householdMemberWorkAddress county`,
            state: `application ${i} householdMemberWorkAddress state`,
            street: `application ${i} householdMemberWorkAddress street`,
            street2: `application ${i} householdMemberWorkAddress street2`,
            zipCode: `application ${i} householdMemberWorkAddress zipCode`,
            latitude: `${i}`,
            longitude: `${i}`,
          },
        },
      },
    ],
  },
});
