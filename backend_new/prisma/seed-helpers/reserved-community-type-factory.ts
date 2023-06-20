import { Prisma } from '@prisma/client';

export const reservedCommunityTypeFactory = (
  i: number,
  jurisdictionId: string,
): Prisma.ReservedCommunityTypesCreateInput => ({
  name: `name: ${i}`,
  description: `description: ${i}`,
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});
