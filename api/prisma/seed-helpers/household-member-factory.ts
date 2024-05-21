import { Prisma, YesNoEnum } from '@prisma/client';
import { randomInt } from 'crypto';
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
): Prisma.HouseholdMemberCreateWithoutApplicationsInput => {
  const firstName = randomNoun();
  const lastName = randomNoun();
  const sameAddress = randomBoolean() === true ? YesNoEnum.yes : YesNoEnum.no;
  const workInRegion = randomBoolean() === true ? YesNoEnum.yes : YesNoEnum.no;

  // TODO: Make this a backend enum
  const relationshipKeys = [
    'spouse',
    'registeredDomesticPartner',
    'parent',
    'child',
    'sibling',
    'cousin',
    'aunt',
    'uncle',
    'nephew',
    'niece',
    'grandparent',
    'greatGrandparent',
    'inLaw',
    'friend',
    'other',
  ];

  return {
    firstName: firstName,
    middleName: randomNoun(),
    lastName: lastName,
    // Question: why are these strings?
    birthMonth: randomBirthMonth(),
    birthDay: randomBirthDay(),
    birthYear: randomBirthYear(),
    sameAddress: sameAddress,
    relationship: relationshipKeys[randomInt(relationshipKeys.length)],
    workInRegion: workInRegion,
    householdMemberAddress:
      sameAddress === YesNoEnum.no ? { create: addressFactory() } : undefined,
    householdMemberWorkAddress:
      workInRegion === YesNoEnum.yes
        ? {
            create: addressFactory(),
          }
        : undefined,
    orderId: index,
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
