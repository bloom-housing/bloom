import { PrismaClient, UnitTypeEnum, UnitTypes } from '@prisma/client';

export const unitTypeFactorySingle = async (
  prismaClient: PrismaClient,
  type: UnitTypeEnum,
): Promise<UnitTypes> => {
  const unitType = await prismaClient.unitTypes.findFirst({
    where: {
      name: {
        equals: type,
      },
    },
  });
  if (!unitType) {
    console.warn(`Unit type ${type} was not created, run unitTypeFactoryAll`);
  }
  return unitType;
};

export const unitTypeFactoryAll = async (prismaClient: PrismaClient) => {
  return Promise.all(
    Object.values(UnitTypeEnum).map(async (value) => {
      return await prismaClient.unitTypes.create({
        data: {
          name: value,
          numBedrooms: unitTypeMapping[value],
        },
      });
    }),
  );
};

export const unitTypeMapping = {
  [UnitTypeEnum.studio]: 0,
  [UnitTypeEnum.SRO]: 0,
  [UnitTypeEnum.oneBdrm]: 1,
  [UnitTypeEnum.twoBdrm]: 2,
  [UnitTypeEnum.threeBdrm]: 3,
  [UnitTypeEnum.fourBdrm]: 4,
  [UnitTypeEnum.fiveBdrm]: 5,
};
