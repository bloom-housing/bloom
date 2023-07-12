import { Prisma, UnitRentTypeEnum } from '@prisma/client';
import { randomInt } from 'crypto';

export const unitRentTypeFactory = (
  type?: UnitRentTypeEnum,
): Prisma.UnitRentTypesCreateInput => ({
  name: type || unitRentTypeArray[randomInt(unitRentTypeArray.length)],
});

export const unitRentTypeArray = Object.values(UnitRentTypeEnum);
