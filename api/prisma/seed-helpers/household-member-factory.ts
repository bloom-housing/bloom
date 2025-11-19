import { Prisma, YesNoEnum } from '@prisma/client';
import { randomInt } from 'crypto';
import { HouseholdMemberRelationship } from '../../src/enums/applications/household-member-relationship-enum';
import { addressFactory } from './address-factory';
import { randomNoun } from './word-generator';
import {
  randomBirthDay,
  randomBirthMonth,
  randomBirthYear,
} from './number-generator';
import { randomBoolean } from './boolean-generator';

export const householdMemberFactorySingle = (
  index: number,
  overrides?: Prisma.HouseholdMemberCreateWithoutApplicationsInput,
): Prisma.HouseholdMemberCreateWithoutApplicationsInput => {
  const firstName = randomNoun();
  const lastName = randomNoun();

  const relationshipKeys = Object.values(HouseholdMemberRelationship);
  const sameAddress = randomBoolean();
  const workInRegion = randomBoolean();

  return {
    firstName: firstName,
    middleName: randomNoun(),
    lastName: lastName,
    birthMonth: randomBirthMonth(),
    birthDay: randomBirthDay(),
    birthYear: randomBirthYear(),
    sameAddress: sameAddress ? YesNoEnum.yes : YesNoEnum.no,
    relationship: relationshipKeys[randomInt(relationshipKeys.length)],
    workInRegion: workInRegion ? YesNoEnum.yes : YesNoEnum.no,
    householdMemberAddress: sameAddress
      ? undefined
      : { create: addressFactory() },
    householdMemberWorkAddress: workInRegion
      ? {
          create: addressFactory(),
        }
      : undefined,
    orderId: index,
    ...overrides,
  };
};

export const householdMemberFactoryMany = async (
  numberToMake: number,
): Promise<Prisma.HouseholdMemberCreateWithoutApplicationsInput[]> => {
  const createArray: Promise<Prisma.HouseholdMemberCreateWithoutApplicationsInput>[] =
    [...new Array(numberToMake)].map(async (index) =>
      householdMemberFactorySingle(index),
    );
  return await Promise.all(createArray);
};
