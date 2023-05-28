import { Prisma } from '@prisma/client';

export const unitRentTypeFactory = (
  i: number,
): Prisma.UnitRentTypesCreateInput => ({
  ...unitRentTypeArray[i % unitRentTypeArray.length],
});

const unitRentTypeArray = [{ name: 'fixed' }, { name: 'percentageOfIncome' }];
