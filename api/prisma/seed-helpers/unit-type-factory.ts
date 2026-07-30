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

// All unit types should only be created once. This function checks if they have been created
// before putting all types in the database
export const unitTypeFactoryAll = async (
  prismaClient: PrismaClient,
): Promise<UnitTypes[]> => {
  const unitTypes = Object.values(UnitTypeEnum);
  const all = await prismaClient.unitTypes.findMany({});
  if (all.length !== unitTypes.length) {
    await prismaClient.unitTypes.createMany({
      data: unitTypes.map((value) => ({
        name: value,
        numBedrooms: unitTypeMapping[value],
      })),
    });
  }
  const created = await prismaClient.unitTypes.findMany({});
  return unitTypes.map((value) =>
    created.find((unitType) => unitType.name === value),
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
  [UnitTypeEnum.sixBdrm]: 6,
  [UnitTypeEnum.sevenBdrm]: 7,
};
