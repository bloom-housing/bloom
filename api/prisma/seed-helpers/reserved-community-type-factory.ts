import { Prisma, PrismaClient, ReservedCommunityTypes } from '@prisma/client';
import { randomInt } from 'crypto';

const reservedCommunityTypeOptions: { name: string; description?: string }[] = [
  { name: 'specialNeeds' },
  {
    name: 'senior',
  },
  { name: 'senior55' },
  {
    name: 'senior62',
    description:
      'This property is reserved for seniors aged 62 and older. Applicants must meet the age requirement to be eligible.',
  },
  { name: 'specialNeeds' },
  { name: 'developmentalDisability' },
  { name: 'tay' },
  { name: 'veteran' },
  { name: 'schoolEmployee' },
  { name: 'farmworkerHousing' },
  { name: 'housingVoucher' },
  { name: 'referralOnly' },
];

export const reservedCommunityTypeFactory = (
  jurisdictionId: string,
  name: string,
): Prisma.ReservedCommunityTypesCreateWithoutListingsInput => {
  return {
    name: name,
    description: `reservedCommunityTypes of ${name}`,
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
  for (const { name, description } of reservedCommunityTypeOptions) {
    const exists = await prismaClient.reservedCommunityTypes.findFirst({
      select: {
        id: true,
      },
      where: {
        name,
        description,
        jurisdictionId,
      },
    });
    if (!exists?.id) {
      await prismaClient.reservedCommunityTypes.create({
        data: {
          name,
          description,
          jurisdictionId,
        },
      });
    }
  }
};

export const reservedCommunityTypeFactoryGet = async (
  prismaClient: PrismaClient,
  jurisdictionId?: string,
  name?: string,
): Promise<ReservedCommunityTypes> => {
  // if name is not given pick one randomly from the above list
  const chosenName =
    name ||
    reservedCommunityTypeOptions[randomInt(reservedCommunityTypeOptions.length)]
      .name;
  const reservedCommunityType =
    await prismaClient.reservedCommunityTypes.findFirst({
      where: {
        name: {
          equals: chosenName,
        },
        jurisdictionId: jurisdictionId
          ? {
              equals: jurisdictionId,
            }
          : undefined,
      },
    });

  if (!reservedCommunityType) {
    console.warn(
      `reserved community type ${chosenName} was not created, run reservedCommunityTypeFactoryAll first`,
    );
  }
  return reservedCommunityType;
};

export const reservedCommunityTypesFindOrCreate = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
): Promise<ReservedCommunityTypes> => {
  const reservedCommunityType = await reservedCommunityTypeFactoryGet(
    prismaClient,
  );
  if (reservedCommunityType) {
    return reservedCommunityType;
  }

  await reservedCommunityTypeFactoryAll(jurisdictionId, prismaClient);
  return await reservedCommunityTypeFactoryGet(prismaClient);
};
