import { Prisma, UnitRentTypeEnum } from '@prisma/client';

export const unitRentTypeFactory = (
  i: number,
): Prisma.UnitRentTypesCreateInput => ({
  ...unitRentTypeArray[i % unitRentTypeArray.length],
});

export const unitRentTypeArray = [
  { name: UnitRentTypeEnum.fixed },
  { name: UnitRentTypeEnum.percentageOfIncome },
];
