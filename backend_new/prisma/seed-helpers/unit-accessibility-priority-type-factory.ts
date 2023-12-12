import {
  PrismaClient,
  UnitAccessibilityPriorityTypeEnum,
  UnitAccessibilityPriorityTypes,
} from '@prisma/client';
import { randomInt } from 'crypto';

export const unitAccessibilityPriorityTypeFactorySingle = async (
  prismaClient: PrismaClient,
  type?: UnitAccessibilityPriorityTypeEnum,
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
  prismaClient: PrismaClient,
) => {
  await prismaClient.unitAccessibilityPriorityTypes.createMany({
    data: unitAccesibilityPriorityTypeAsArray.map((value) => ({ name: value })),
  });
};

export const unitAccesibilityPriorityTypeAsArray = Object.values(
  UnitAccessibilityPriorityTypeEnum,
);
