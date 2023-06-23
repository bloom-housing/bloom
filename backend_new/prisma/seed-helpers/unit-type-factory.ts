import { Prisma, UnitTypeEnum } from '@prisma/client';

export const unitTypeFactory = (i: number): Prisma.UnitTypesCreateInput => ({
  ...unitTypeArray[i % unitTypeArray.length],
});

export const unitTypeArray = [
  { name: UnitTypeEnum.studio, numBedrooms: 0 },
  { name: UnitTypeEnum.oneBdrm, numBedrooms: 1 },
  { name: UnitTypeEnum.twoBdrm, numBedrooms: 2 },
  { name: UnitTypeEnum.threeBdrm, numBedrooms: 3 },
  { name: UnitTypeEnum.fourBdrm, numBedrooms: 4 },
  { name: UnitTypeEnum.SRO, numBedrooms: 0 },
  { name: UnitTypeEnum.fiveBdrm, numBedrooms: 5 },
];
