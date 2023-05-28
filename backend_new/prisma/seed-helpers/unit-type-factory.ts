import { Prisma } from '@prisma/client';

export const unitTypeFactory = (i: number): Prisma.UnitTypesCreateInput => ({
  ...unitTypeArray[i % unitTypeArray.length],
});

const unitTypeArray = [
  { name: 'studio', numBedrooms: 0 },
  { name: 'oneBdrm', numBedrooms: 1 },
  { name: 'twoBdrm', numBedrooms: 2 },
  { name: 'threeBdrm', numBedrooms: 3 },
  { name: 'fourBdrm', numBedrooms: 4 },
  { name: 'SRO', numBedrooms: 0 },
  { name: 'fiveBdrm', numBedrooms: 5 },
];
