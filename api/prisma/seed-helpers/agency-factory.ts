import { PrismaClient } from '@prisma/client';
import { randomName } from './word-generator';

export const agencyFactory = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
  numberToCreate = 3,
  jurisdictionName?: string,
) => {
  await prismaClient.agency.createMany({
    data: [...Array(numberToCreate)].map(() => {
      console.log('item');
      return {
        name: `${randomName()}${
          jurisdictionName ? ` - ${jurisdictionName}` : ''
        }`,
        jurisdictionsId: jurisdictionId,
      };
    }),
  });
};
