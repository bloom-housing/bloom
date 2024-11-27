import {
  AmiChart,
  Prisma,
  PrismaClient,
  UnitTypeEnum,
  UnitTypes,
} from '@prisma/client';
import { unitTypeFactorySingle } from './unit-type-factory';
import { unitAccessibilityPriorityTypeFactorySingle } from './unit-accessibility-priority-type-factory';
import { unitRentTypeFactory } from './unit-rent-type-factory';
import { randomInt } from 'crypto';

const unitTypes = Object.values(UnitTypeEnum);

export const unitFactorySingle = (
  unitType: UnitTypes,
  optionalParams?: {
    amiChart?: AmiChart;
    unitRentTypeId?: string;
    otherFields?: Prisma.UnitsCreateWithoutListingsInput;
  },
): Prisma.UnitsCreateWithoutListingsInput => {
  const bedrooms = unitType.numBedrooms || randomInt(6);
  return {
    amiChart: optionalParams?.amiChart
      ? { connect: { id: optionalParams.amiChart.id } }
      : undefined,
    unitTypes: {
      connect: {
        id: unitType.id,
      },
    },
    amiPercentage: optionalParams?.amiChart
      ? (Math.ceil((Math.random() * 100) / 10) * 10).toString() // get an integer divisible by 10
      : undefined,
    numBathrooms: randomInt(4),
    floor: randomInt(3),
    numBedrooms: bedrooms,
    minOccupancy: bedrooms,
    maxOccupancy: bedrooms + 2,
    monthlyIncomeMin: randomInt(3500).toString(),
    monthlyRent: ((Math.random() * 100 + 2500) * (bedrooms || 1)).toFixed(2),
    unitRentTypes: optionalParams?.unitRentTypeId
      ? { connect: { id: optionalParams?.unitRentTypeId } }
      : {
          create: unitRentTypeFactory(),
        },
    ...optionalParams?.otherFields,
  };
};

export const unitFactoryMany = async (
  numberToMake: number,
  prismaClient: PrismaClient,
  optionalParams?: {
    randomizePriorityType?: boolean;
    amiChart?: AmiChart;
    unitAccessibilityPriorityTypeId?: string;
  },
): Promise<Prisma.UnitsCreateWithoutListingsInput[]> => {
  const createArray: Promise<Prisma.UnitsCreateWithoutListingsInput>[] = [
    ...new Array(numberToMake),
  ].map(async (_, index) => {
    const unitType = await unitTypeFactorySingle(
      prismaClient,
      unitTypes[randomInt(unitTypes.length) - 1],
    );

    // create a random priority type with roughly half being null
    const unitAccessibilityPriorityTypes =
      optionalParams?.randomizePriorityType && Math.random() > 0.5
        ? await unitAccessibilityPriorityTypeFactorySingle(prismaClient)
        : undefined;

    return unitFactorySingle(unitType, {
      ...optionalParams,
      otherFields: {
        unitAccessibilityPriorityTypes: unitAccessibilityPriorityTypes
          ? {
              connect: {
                id: unitAccessibilityPriorityTypes.id,
              },
            }
          : undefined,
        numBathrooms: index,
      },
    });
  });
  return await Promise.all(createArray);
};
