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

export const householdMemberFactorySingle = (
  index: number,
  overrides?: Prisma.HouseholdMemberCreateWithoutApplicationsInput,
): Prisma.HouseholdMemberCreateWithoutApplicationsInput => {
  const firstName = randomNoun();
  const lastName = randomNoun();

  const relationshipKeys = Object.values(HouseholdMemberRelationship);

  return {
    firstName: firstName,
    middleName: randomNoun(),
    lastName: lastName,
    // Question: why are these strings?
    birthMonth: randomBirthMonth(),
    birthDay: randomBirthDay(),
    birthYear: randomBirthYear(),
    sameAddress: YesNoEnum.yes,
    relationship: relationshipKeys[randomInt(relationshipKeys.length)],
    workInRegion: YesNoEnum.yes,
    householdMemberAddress: { create: addressFactory() },
    householdMemberWorkAddress: {
      create: addressFactory(),
    },
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
