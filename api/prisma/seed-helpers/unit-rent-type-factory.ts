import {
  Prisma,
  PrismaClient,
  UnitRentTypeEnum,
  UnitRentTypes,
} from '@prisma/client';
import { randomInt } from 'crypto';

export const unitRentTypeFactory = (
  type?: UnitRentTypeEnum,
): Prisma.UnitRentTypesCreateInput => ({
  name: type || unitRentTypeArray[randomInt(unitRentTypeArray.length)],
});

export const unitRentTypeArray = Object.values(UnitRentTypeEnum);

export const unitRentTypeFactorySingle = async (
  prismaClient: PrismaClient,
  type: UnitRentTypeEnum,
): Promise<UnitRentTypes> => {
  const unitRentType = await prismaClient.unitRentTypes.findFirst({
    where: {
      name: {
        equals: type,
      },
    },
  });
  if (!unitRentType) {
    console.warn(
      `Unit rent type ${unitRentType} was not created, run unitRentTypeFactoryAll`,
    );
  }
  return unitRentType;
};

// All unit rent types should only be created once. This function checks if they have been created
// before putting all types in the database
export const unitRentTypeFactoryAll = async (
  prismaClient: PrismaClient,
): Promise<UnitRentTypes[]> => {
  const all = await prismaClient.unitRentTypes.findMany({});
  const unitRentTypes = Object.values(unitRentTypeArray);
  if (all.length !== unitRentTypes.length) {
    await prismaClient.unitRentTypes.createMany({
      data: Object.values(unitRentTypeArray).map((value) => ({
        name: value,
      })),
    });
  }
  return await prismaClient.unitRentTypes.findMany({});
};
