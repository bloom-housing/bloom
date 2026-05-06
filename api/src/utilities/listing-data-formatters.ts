import Unit from '../dtos/units/unit.dto';
import { Address } from '../dtos/addresses/address.dto';
import { unitTypeMapping } from 'prisma/seed-helpers/unit-type-factory';

export const oneLineAddress = (address: Address) => {
  if (!address) return '';
  return `${address.street}${address.street2 ? `, ${address.street2}` : ''}, ${
    address.city
  }, ${address.state} ${address.zipCode}`;
};

type MinMax = {
  min: number;
  max: number;
};

type UnitTypeSummary = {
  count: number;
  baths: MinMax | undefined;
  sqft: MinMax | undefined;
};

type ListingUnitsSummary = {
  units: { [key: string]: UnitTypeSummary };
  rent: MinMax | undefined;
  minIncome: MinMax | undefined;
  maxIncome: MinMax | undefined;
};

export function minMaxFinder(
  value: number | undefined,
  range: MinMax | undefined,
): MinMax {
  if (!value) {
    return undefined;
  }

  if (range === undefined) {
    return {
      min: value,
      max: value,
    };
  } else {
    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);

    return range;
  }
}

export const summarizeListingUnitsByType = (
  units: Unit[],
): ListingUnitsSummary => {
  let minimumIncomeRange: MinMax = undefined;
  let maximumIncomeRange: MinMax = undefined;
  let rentRange: MinMax = undefined;

  const groupedUnits = units?.reduce(
    (summaries, unit): { [key: string]: UnitTypeSummary } => {
      if (unit.monthlyIncomeMin) {
        minimumIncomeRange = minMaxFinder(
          Number(unit.monthlyIncomeMin),
          minimumIncomeRange,
        );
      }

      if (unit.annualIncomeMax) {
        const monthlyMaxIncome = Number.parseFloat(unit.annualIncomeMax) / 12.0;
        maximumIncomeRange = minMaxFinder(
          Number(monthlyMaxIncome),
          maximumIncomeRange,
        );
      }

      if (unit.monthlyRent) {
        rentRange = minMaxFinder(Number(unit.monthlyRent), rentRange);
      }

      const thisBedroomInfo: UnitTypeSummary | undefined =
        summaries[unit.unitTypes?.name];

      summaries[unit.unitTypes?.name] = {
        count: thisBedroomInfo ? thisBedroomInfo.count + 1 : 1,
        baths: minMaxFinder(unit.numBathrooms, thisBedroomInfo?.baths),
        sqft: minMaxFinder(Number(unit.sqFeet), thisBedroomInfo?.sqft),
      };

      return summaries;
    },
    {},
  );

  return {
    units: groupedUnits,
    maxIncome: maximumIncomeRange,
    minIncome: minimumIncomeRange,
    rent: rentRange,
  };
};
