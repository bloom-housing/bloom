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

const amiChartItemsFactory = (numberToCreate: number) => {
  return JSON.stringify(
    new Array(numberToCreate).map((_, index) => {
      return { percentOfAmi: index, householdSize: index, income: index };
    }),
  );
};
