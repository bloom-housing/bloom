import {
  Prisma,
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  MultiselectQuestions,
  YesNoEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { randomInt } from 'crypto';
import { generateConfirmationCode } from '../../src/utilities/applications-utilities';
import { addressFactory } from './address-factory';
import { randomNoun } from './word-generator';
import {
  randomBirthDay,
  randomBirthMonth,
  randomBirthYear,
} from './number-generator';
import { preferenceFactory } from './application-preference-factory';
import { demographicsFactory } from './demographic-factory';
import { alternateContactFactory } from './alternate-contact-factory';
import { randomBoolean } from './boolean-generator';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';

export const applicationFactory = async (optionalParams?: {
  createdAt?: Date;
  unitTypeId?: string;
  applicant?: Prisma.ApplicantCreateWithoutApplicationsInput;
  listingId?: string;
  householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput[];
  demographics?: Prisma.DemographicsCreateWithoutApplicationsInput;
  multiselectQuestions?: Partial<MultiselectQuestions>[];
  userId?: string;
  submissionType?: ApplicationSubmissionTypeEnum;
  isNewest?: boolean;
  expireAfter?: Date;
  wasPIICleared?: boolean;
  additionalPhone?: string;
  raceEthnicityConfiguration?: RaceEthnicityConfiguration;
}): Promise<Prisma.ApplicationsCreateInput> => {
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
  const demographics = await demographicsFactory(
    optionalParams?.raceEthnicityConfiguration,
  );
  const includeAdditionalPhone =
    !!optionalParams?.additionalPhone || randomBoolean();
  let householdSize = 1;
  if (optionalParams?.householdMember) {
    householdSize = optionalParams.householdMember.length + 1;
  }
  const createdAtDate =
    optionalParams?.createdAt ||
    // Created at date sometime in the last 2 months
    dayjs(new Date()).subtract(randomInt(87_600), 'minutes').toDate();
  return {
    createdAt: createdAtDate,
    confirmationCode: generateConfirmationCode(),
    applicant: { create: applicantFactory(optionalParams?.applicant) },
    appUrl: '',
    status: ApplicationStatusEnum.submitted,
    submissionType:
      optionalParams?.submissionType ??
      ApplicationSubmissionTypeEnum.electronical,
    submissionDate:
      optionalParams?.submissionType !== ApplicationSubmissionTypeEnum.paper
        ? createdAtDate
        : dayjs(createdAtDate).add(2, 'days').toDate(),
    householdSize: householdSize,
    income: '40000',
    incomePeriod: randomBoolean()
      ? IncomePeriodEnum.perYear
      : IncomePeriodEnum.perMonth,
    preferences: preferenceFactory(
      optionalParams?.multiselectQuestions
        ? optionalParams.multiselectQuestions.filter(
            (question) =>
              question.applicationSection ===
              MultiselectQuestionsApplicationSectionEnum.preferences,
          )
        : [],
    ),
    programs: preferenceFactory(
      optionalParams?.multiselectQuestions
        ? optionalParams.multiselectQuestions.filter(
            (question) =>
              question.applicationSection ===
              MultiselectQuestionsApplicationSectionEnum.programs,
          )
        : [],
    ),
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
    householdMember: optionalParams?.householdMember
      ? {
          create: optionalParams.householdMember,
        }
      : undefined,
    demographics: {
      create: demographics,
    },
    alternateContact: { create: alternateContactFactory() },
    userAccounts: optionalParams?.userId
      ? {
          connect: {
            id: optionalParams.userId,
          },
        }
      : undefined,
    incomeVouchers: randomBoolean(),
    additionalPhoneNumber: includeAdditionalPhone
      ? optionalParams?.additionalPhone || '(456) 456-4564'
      : undefined,
    additionalPhone: includeAdditionalPhone,
    additionalPhoneNumberType: includeAdditionalPhone ? 'cell' : undefined,
    isNewest: optionalParams?.isNewest || false,
    expireAfter: optionalParams?.expireAfter,
    wasPIICleared: optionalParams?.wasPIICleared || false,
  };
};

export const applicantFactory = (
  overrides?: Prisma.ApplicantCreateWithoutApplicationsInput,
): Prisma.ApplicantCreateWithoutApplicationsInput => {
  const firstName = randomNoun();
  const lastName = randomNoun();
  return {
    firstName: firstName,
    middleName: randomBoolean() ? randomNoun() : undefined,
    lastName: lastName,
    emailAddress: `${firstName}.${lastName}@example.com`,
    noEmail: false,
    phoneNumber: '(123) 123-1231',
    phoneNumberType: 'home',
    noPhone: false,
    workInRegion: YesNoEnum.no,
    birthDay: randomBirthDay(), // no zeros
    birthMonth: randomBirthMonth(), // no zeros
    birthYear: randomBirthYear(),
    applicantAddress: {
      create: addressFactory(),
    },
    applicantWorkAddress: {
      create: addressFactory(),
    },
    ...overrides,
  };
};
