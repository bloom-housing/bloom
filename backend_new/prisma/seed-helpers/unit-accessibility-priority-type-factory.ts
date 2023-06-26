import { Prisma, UnitAccessibilityPriorityTypeEnum } from '@prisma/client';

export const unitAccessibilityPriorityTypeFactory = (
  i: number,
): Prisma.UnitAccessibilityPriorityTypesCreateInput => ({
  ...unitPriorityTypeArray[i % unitPriorityTypeArray.length],
});

export const unitPriorityTypeArray = [
  { name: UnitAccessibilityPriorityTypeEnum.mobility },
  { name: UnitAccessibilityPriorityTypeEnum.mobilityAndHearing },
  { name: UnitAccessibilityPriorityTypeEnum.hearing },
  { name: UnitAccessibilityPriorityTypeEnum.visual },
  { name: UnitAccessibilityPriorityTypeEnum.hearingAndVisual },
  { name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual },
  { name: UnitAccessibilityPriorityTypeEnum.mobilityHearingAndVisual },
];
