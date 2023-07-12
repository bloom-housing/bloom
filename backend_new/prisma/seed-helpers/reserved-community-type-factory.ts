import { Prisma, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const reservedCommunityTypeOptions = [
  'specialNeeds',
  'senior',
  'senior62',
  'developmentalDisability',
  'veteran',
];

export const reservedCommunityTypeFactory = (
  jurisdictionId: string,
  name?: string,
): Prisma.ReservedCommunityTypesCreateWithoutListingsInput => {
  // if name is not given pick one randomly from the above list
  const chosenName =
    name ||
    reservedCommunityTypeOptions[
      randomInt(reservedCommunityTypeOptions.length)
    ];
  return {
    name: chosenName,
    description: `reservedCommunityTypes of ${chosenName}`,
    jurisdictions: {
      connect: {
        id: jurisdictionId,
      },
    },
  };
};

export const reservedCommunityTypeFactoryAll = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
) => {
  await prismaClient.reservedCommunityTypes.createMany({
    data: reservedCommunityTypeOptions.map((value) => ({
      name: value,
      jurisdictionId: jurisdictionId,
    })),
  });
};
