import { Prisma } from '@prisma/client';
import { randomName } from './word-generator';

export const amiChartFactory = (
  numberToCreate: number,
  jurisdictionId: string,
): Prisma.AmiChartCreateInput => ({
  name: randomName(),
  items: amiChartItemsFactory(numberToCreate),
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});

const amiChartItemsFactory = (numberToCreate: number): Prisma.JsonArray =>
  [...Array(numberToCreate)].map((_, index) => {
    const baseValue = index + 1;
    return {
      percentOfAmi: baseValue * 10,
      householdSize: baseValue,
      income: baseValue * 12_000,
    };
  });
