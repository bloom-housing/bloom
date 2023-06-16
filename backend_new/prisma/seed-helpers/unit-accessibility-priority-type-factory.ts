import {
  Prisma,
  PrismaClient,
  UnitAccessibilityPriorityTypeEnum,
} from '@prisma/client';
import { randomInt } from 'crypto';

export const unitAccessibilityPriorityTypeFactorySingle = (
  type?: UnitAccessibilityPriorityTypeEnum,
): Prisma.UnitAccessibilityPriorityTypesCreateInput => {
  const chosenType =
    type ||
    unitAccesibilityPriorityTypeAsArray[
      randomInt(unitAccesibilityPriorityTypeAsArray.length)
    ];
  return { name: chosenType };
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
