import { Prisma } from '@prisma/client';

export const unitAccessibilityPriorityTypeFactory = (
  i: number,
): Prisma.UnitAccessibilityPriorityTypesCreateInput => ({
  ...unitPriorityTypeArray[i % unitPriorityTypeArray.length],
});

const unitPriorityTypeArray = [
  { name: 'Mobility' },
  { name: 'Mobility and Hearing' },
  { name: 'Hearing' },
  { name: 'Visual' },
  { name: 'Hearing and Visual' },
  { name: 'Mobility and Visual' },
  { name: 'Mobility, Hearing and Visual' },
];
