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
  const toReturn = [];
  for (let i = 0; i < numberToCreate; i++) {
    toReturn.push({
      percentOfAmi: i,
      householdSize: i,
      income: i,
    });
  }

  return JSON.stringify(toReturn);
};
