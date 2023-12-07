import { randomInt } from 'crypto';
import {
  Prisma,
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { generateConfirmationCode } from '../../src/utilities/applications-utilities';
import { addressFactory } from './address-factory';
import { randomNoun } from './word-generator';
import {
  randomBirthDay,
  randomBirthMonth,
  randomBirthYear,
} from './number-generator';
import { preferenceFactoryMany } from './application-preference-factory';

export const applicationFactory = (optionalParams?: {
  householdSize?: number;
  unitTypeId?: string;
  applicant?: Prisma.ApplicantCreateWithoutApplicationsInput;
  overrides?: Prisma.ApplicationsCreateInput;
  listingId?: string;
  householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput[];
  demographics?: Prisma.DemographicsCreateWithoutApplicationsInput;
}): Prisma.ApplicationsCreateInput => {
  let preferredUnitTypes: Prisma.UnitTypesCreateNestedManyWithoutApplicationsInput;
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
    applicant: { create: applicantFactory(optionalParams?.applicant) },
    appUrl: '',
    status: ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    submissionDate: new Date(),
    householdSize: optionalParams?.householdSize ?? 1,
    income: '40000',
    incomePeriod: IncomePeriodEnum.perYear,
    preferences: preferenceFactoryMany(randomInt(6)),
    programs: preferenceFactoryMany(randomInt(2)),
    preferredUnitTypes,
    sendMailToMailingAddress: true,
    applicationsMailingAddress: {
      create: addressFactory(),
    },
    listings: optionalParams?.listingId
      ? {
          connect: {
            id: optionalParams?.listingId,
          },
        }
      : undefined,
    ...optionalParams?.overrides,
    // Question: should householdMember be plural?
    householdMember: optionalParams?.householdMember
      ? {
          create: optionalParams.householdMember,
        }
      : undefined,
    demographics: optionalParams?.demographics
      ? {
          create: optionalParams.demographics,
        }
      : undefined,
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
    birthDay: `${randomBirthDay()}`, // no zeros
    birthMonth: `${randomBirthMonth}`, // no zeros
    birthYear: `${randomBirthYear()}`,
    applicantAddress: {
      create: addressFactory(),
    },
    applicantWorkAddress: {
      create: addressFactory(),
    },
    ...overrides,
  };
};
