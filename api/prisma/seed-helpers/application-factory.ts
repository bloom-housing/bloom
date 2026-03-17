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
import { addressFactory } from './address-factory';
import { alternateContactFactory } from './alternate-contact-factory';
import { preferenceFactory } from './application-preference-factory';
import { randomBoolean } from './boolean-generator';
import { demographicsFactory } from './demographic-factory';
import {
  randomBirthDay,
  randomBirthMonth,
  randomBirthYear,
} from './number-generator';
import { randomNoun } from './word-generator';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { generateConfirmationCode } from '../../src/utilities/applications-utilities';

// TODO: Needs to handle V2MSQ
export const applicationFactory = async (optionalParams?: {
  additionalPhone?: string;
  applicant?: Prisma.ApplicantCreateWithoutApplicationsInput;
  createdAt?: Date;
  demographics?: Prisma.DemographicsCreateWithoutApplicationsInput;
  expireAfter?: Date;
  householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput[];
  isNewest?: boolean;
  listingId?: string;
  multiselectQuestions?: Partial<MultiselectQuestions>[];
  raceEthnicityConfiguration?: RaceEthnicityConfiguration;
  submissionType?: ApplicationSubmissionTypeEnum;
  unitTypeId?: string;
  userId?: string;
  wasPIICleared?: boolean;
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

export const applicationFactoryMany = async (
  count: number,
  optionalParams?:
    | Parameters<typeof applicationFactory>[0]
    | ((
        index: number,
      ) =>
        | Parameters<typeof applicationFactory>[0]
        | Promise<Parameters<typeof applicationFactory>[0]>),
): Promise<Prisma.ApplicationsCreateInput[]> => {
  return Promise.all(
    Array.from({ length: count }, async (_, index) =>
      applicationFactory(
        typeof optionalParams === 'function'
          ? await optionalParams(index)
          : optionalParams,
      ),
    ),
  );
};
