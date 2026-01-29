import { UnitAccessibilityPriorityTypes } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from '../../src/services/prisma.service';

export const unitAccessibilityPriorityTypeFactorySingle = async (
  prismaClient: PrismaService,
  type?: string,
): Promise<UnitAccessibilityPriorityTypes> => {
  const chosenType =
    type ||
    unitAccesibilityPriorityTypeAsArray[
      randomInt(unitAccesibilityPriorityTypeAsArray.length)
    ];

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
  prismaClient: PrismaService,
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
