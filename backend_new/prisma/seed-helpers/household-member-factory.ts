import { Prisma, YesNoEnum } from '@prisma/client';
import { addressFactory } from './address-factory';
import { randomAdjective, randomNoun } from './word-generator';
import {
  randomBirthDay,
  randomBirthMonth,
  randomBirthYear,
} from './number-generator';

export const householdMemberFactorySingle =
  (): Prisma.HouseholdMemberCreateWithoutApplicationsInput => {
    const firstName = randomNoun();
    const lastName = randomNoun();
    const randomBoolean = Math.random() < 0.5;
    const randomYesNo = randomBoolean === true ? YesNoEnum.yes : YesNoEnum.no;
    return {
      firstName: firstName,
      middleName: randomNoun(),
      lastName: lastName,
      // Question: why are these strings?
      birthMonth: randomBirthMonth().toString(),
      birthDay: randomBirthDay().toString(),
      birthYear: randomBirthYear().toString(),
      emailAddress: `${firstName}.${lastName}@example.com`,
      phoneNumber: '(123) 123-1231',
      // Question: should this be an enum?
      phoneNumberType: 'home',
      sameAddress: randomYesNo,
      // Question: should this be an enum?
      relationship: randomAdjective(),
      workInRegion: randomYesNo,
      householdMemberAddress: randomBoolean
        ? undefined
        : { create: addressFactory() },
      householdMemberWorkAddress: {
        create: addressFactory(),
      },
    };
  };

export const householdMemberFactoryMany = async (
  numberToMake: number,
): Promise<Prisma.HouseholdMemberCreateWithoutApplicationsInput[]> => {
  const createArray: Promise<Prisma.HouseholdMemberCreateWithoutApplicationsInput>[] =
    [...new Array(numberToMake)].map(async () =>
      householdMemberFactorySingle(),
    );
  return await Promise.all(createArray);
};
