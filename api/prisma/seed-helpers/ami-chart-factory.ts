import { Prisma } from '@prisma/client';
import { randomName } from './word-generator';

export const amiChartFactory = (
  numberToCreate: number,
  jurisdictionId: string,
  offset?: number,
  jurisdictionName?: string,
): Prisma.AmiChartCreateInput => ({
  name: `${randomName()}${jurisdictionName ? ` - ${jurisdictionName}` : ''}`,
  items: amiChartItemsFactory(numberToCreate, offset),
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});

const amiChartItemsFactory = (
  numberToCreate: number,
  offset = 0,
): Prisma.JsonArray =>
  [...Array(numberToCreate)].flatMap((_, index) => {
    const baseValue = index + 1;
    return [...Array(8)].map((_, index2) => {
      return {
        percentOfAmi: baseValue * 10,
        householdSize: index2 + 1,
        income: (baseValue + index2 + offset) * 12_000,
      };
    });
  });
