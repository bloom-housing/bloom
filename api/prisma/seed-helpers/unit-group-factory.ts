import {
  AmiChart,
  MonthlyRentDeterminationTypeEnum,
  Prisma,
  PrismaClient,
  UnitTypeEnum,
  UnitTypes,
} from '@prisma/client';
import { randomInt } from 'crypto';
import { unitAccessibilityPriorityTypeFactorySingle } from './unit-accessibility-priority-type-factory';
import { unitTypeFactorySingle } from './unit-type-factory';

const unitTypes = Object.values(UnitTypeEnum);

export const unitGroupFactorySingle = (
  unitType: UnitTypes,
  optionalParams?: {
    amiChart?: AmiChart;
    openWaitlist?: boolean;
    otherFields?: Prisma.UnitGroupCreateWithoutListingsInput;
    unitGroupAmiLevelsFlatRentValue?: number;
  },
): Prisma.UnitGroupCreateWithoutListingsInput => {
  const bedrooms = unitType.numBedrooms || randomInt(6);
  const minBathrooms = randomInt(1, 4);
  const minFloor = randomInt(1, 4);
  const minSqFeet = randomInt(100, 1000);
  const totalAvailable = randomInt(1, 10);
  return {
    bathroomMax: minBathrooms + 2,
    bathroomMin: minBathrooms,
    floorMax: minFloor + 2,
    floorMin: minFloor,
    maxOccupancy: bedrooms + 2,
    minOccupancy: bedrooms,
    openWaitlist: optionalParams?.openWaitlist ?? true,
    sqFeetMax: minSqFeet + 2,
    sqFeetMin: minSqFeet,
    totalAvailable: totalAvailable,
    totalCount: totalAvailable + 10,
    unitGroupAmiLevels: {
      create: [
        {
          amiPercentage: 10,
          monthlyRentDeterminationType:
            optionalParams?.unitGroupAmiLevelsFlatRentValue
              ? MonthlyRentDeterminationTypeEnum.flatRent
              : MonthlyRentDeterminationTypeEnum.percentageOfIncome,
          percentageOfIncomeValue:
            optionalParams?.unitGroupAmiLevelsFlatRentValue ? undefined : 10,
          flatRentValue: optionalParams?.unitGroupAmiLevelsFlatRentValue
            ? optionalParams.unitGroupAmiLevelsFlatRentValue
            : undefined,
          amiChart: optionalParams?.amiChart
            ? { connect: { id: optionalParams.amiChart.id } }
            : undefined,
        },
      ],
    },
    unitTypes: {
      connect: {
        id: unitType.id,
      },
    },
    ...optionalParams?.otherFields,
  };
};

export const unitGroupFactoryMany = async (
  numberToMake: number,
  prismaClient: PrismaClient,
  optionalParams?: {
    randomizePriorityType?: boolean;
    amiChart?: AmiChart;
    unitAccessibilityPriorityTypeId?: string;
  },
): Promise<Prisma.UnitGroupCreateWithoutListingsInput[]> => {
  const createArray: Promise<Prisma.UnitGroupCreateWithoutListingsInput>[] = [
    ...new Array(numberToMake),
  ].map(async (_, index) => {
    const unitType = await unitTypeFactorySingle(
      prismaClient,
      unitTypes[randomInt(unitTypes.length)],
    );

    // create a random priority type with roughly half being null
    const unitAccessibilityPriorityTypes =
      optionalParams?.randomizePriorityType && Math.random() > 0.5
        ? await unitAccessibilityPriorityTypeFactorySingle(prismaClient)
        : undefined;

    return unitGroupFactorySingle(unitType, {
      ...optionalParams,
      otherFields: {
        unitAccessibilityPriorityTypes: unitAccessibilityPriorityTypes
          ? {
              connect: {
                id: unitAccessibilityPriorityTypes.id,
              },
            }
          : undefined,
      },
    });
  });
  return await Promise.all(createArray);
};
