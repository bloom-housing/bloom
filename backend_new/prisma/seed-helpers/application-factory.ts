import {
  Prisma,
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  YesNoEnum,
} from '@prisma/client';
import { randomInt } from 'crypto';
import { generateConfirmationCode } from '../../src/utilities/applications-utilities';
import { addressFactory } from './address-factory';
import { randomNoun } from './word-generator';

export const applicationFactory = (optionalParams?: {
  househouldSize?: number;
  unitTypeId?: string;
  applicant?: Prisma.ApplicantCreateWithoutApplicationsInput;
  overrides?: Prisma.ApplicationsCreateInput;
  listingId?: string;
  householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput;
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
    householdSize: optionalParams?.househouldSize ?? 1,
    income: '40000',
    incomePeriod: IncomePeriodEnum.perYear,
    preferences: [],
    preferredUnitTypes,
    listings: optionalParams?.listingId
      ? {
          connect: {
            id: optionalParams?.listingId,
          },
        }
      : undefined,
    ...optionalParams?.overrides,
    householdMember: optionalParams?.householdMember
      ? {
          create: optionalParams.householdMember,
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
