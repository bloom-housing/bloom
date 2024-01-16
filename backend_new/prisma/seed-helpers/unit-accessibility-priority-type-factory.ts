import { PrismaClient, UnitAccessibilityPriorityTypes } from '@prisma/client';
import { randomInt } from 'crypto';

export const unitAccessibilityPriorityTypeFactorySingle = async (
  prismaClient: PrismaClient,
  type?: string,
): Promise<UnitAccessibilityPriorityTypes> => {
  const chosenType =
    type ||
    unitAccesibilityPriorityTypeAsArray[
      randomInt(unitAccesibilityPriorityTypeAsArray.length)
    ];
  console.log({ unitAccesibilityPriorityTypeAsArray });
  console.log({ chosenType });

  const priorityType =
    await prismaClient.unitAccessibilityPriorityTypes.findFirst({
      where: {
        name: {
          equals: chosenType,
        },
      },
    });
  return priorityType;
};

export const unitAccessibilityPriorityTypeFactoryAll = async (
  prismaClient: PrismaClient,
) => {
  await prismaClient.unitAccessibilityPriorityTypes.createMany({
    data: unitAccesibilityPriorityTypeAsArray.map((value) => ({ name: value })),
  });
};

export const unitAccesibilityPriorityTypeAsArray = [
  'Mobility',
  'Hearing',
  'Visual',
  'Hearing and Visual',
  'Mobility and Hearing',
  'Mobility and Visual',
  'Mobility, Hearing and Visual',
];
