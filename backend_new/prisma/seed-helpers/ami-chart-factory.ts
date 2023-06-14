import { Prisma } from '@prisma/client';

export const amiChartFactory = (
  i: number,
  jurisdictionId: string,
): Prisma.AmiChartCreateInput => ({
  name: `name: ${i}`,
  items: amiChartItemsFactory(i),
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});

const amiChartItemsFactory = (numberToCreate: number): Prisma.JsonArray =>
  [...Array(numberToCreate)].map((_, index) => ({
    percentOfAmi: index,
    householdSize: index,
    income: index,
  }));
