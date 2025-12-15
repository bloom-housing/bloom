import { UnitGroupSummary } from '../dtos/unit-groups/unit-group-summary.dto';
import { HouseholdMaxIncomeSummary } from '../dtos/unit-groups/household-max-income-summary.dto';
import { UnitGroupsSummarized } from '../dtos/unit-groups/unit-groups-summarized.dto';
import { AmiChart } from '../dtos/ami-charts/ami-chart.dto';
import { UnitGroup } from '../dtos/unit-groups/unit-group.dto';
import { MinMax } from '../dtos/shared/min-max.dto';
import { MonthlyRentDeterminationTypeEnum } from '@prisma/client';
import { AmiChartItem } from '../dtos/units/ami-chart-item.dto';
import Listing from '../dtos/listings/listing.dto';
import { usd } from './unit-utilities';

// Helper function to set min and max values
export const setMinMax = (range: MinMax, value: number): MinMax => {
  if (!range) {
    return {
      min: value,
      max: value,
    };
  }
  return {
    min: Math.min(range.min, value),
    max: Math.max(range.max, value),
  };
};

// One row for every unit group, with rent and ami ranges across all ami levels
// Used to display the main pricing table
export const getUnitGroupSummary = (
  unitGroups: UnitGroup[] = [],
): UnitGroupSummary[] => {
  const summary: UnitGroupSummary[] = [];

  const sortedUnitGroups = unitGroups?.sort((a, b) => {
    const unitTypeComparison =
      a.unitTypes.sort((c, d) => c.numBedrooms - d.numBedrooms)[0].numBedrooms -
      b.unitTypes.sort((e, f) => e.numBedrooms - f.numBedrooms)[0].numBedrooms;

    if (unitTypeComparison === 0) {
      return (
        a.unitGroupAmiLevels.reduce(
          (acc, curr) => (acc > curr.amiPercentage ? acc : curr.amiPercentage),
          -Infinity,
        ) -
        b.unitGroupAmiLevels.reduce(
          (acc, curr) => (acc > curr.amiPercentage ? acc : curr.amiPercentage),
          -Infinity,
        )
      );
    }

    return unitTypeComparison;
  });

  sortedUnitGroups?.forEach((group) => {
    let rentAsPercentIncomeRange: MinMax,
      rentRange: MinMax,
      amiPercentageRange: MinMax;
    group.unitGroupAmiLevels.forEach((level) => {
      if (
        level.monthlyRentDeterminationType ===
        MonthlyRentDeterminationTypeEnum.flatRent
      ) {
        rentRange = setMinMax(rentRange, level.flatRentValue);
      } else {
        rentAsPercentIncomeRange = setMinMax(
          rentAsPercentIncomeRange,
          level.percentageOfIncomeValue,
        );
      }

      amiPercentageRange = setMinMax(amiPercentageRange, level.amiPercentage);
    });
    const groupSummary: UnitGroupSummary = {
      unitTypes: group.unitTypes.sort((a, b) =>
        a.numBedrooms < b.numBedrooms ? -1 : 1,
      ),
      rentAsPercentIncomeRange,
      rentRange: rentRange && {
        min: rentRange.min ? `$${rentRange.min}` : '',
        max: rentRange.max ? `$${rentRange.max}` : '',
      },
      amiPercentageRange,
      openWaitlist: group.openWaitlist,
      unitVacancies: group.totalAvailable,
      bathroomRange: {
        min: group.bathroomMin,
        max: group.bathroomMax,
      },
      floorRange: {
        min: group.floorMin,
        max: group.floorMax,
      },
      sqFeetRange: {
        min: group.sqFeetMin,
        max: group.sqFeetMax,
      },
    };
    summary.push(groupSummary);
  });

  return summary;
};

export type MinMaxIncomeAmiChartItem = AmiChartItem & { incomeString?: string };

export const getMinMaxIncomeAmiChartItems = (
  amiCharts: AmiChart[] = [],
): MinMaxIncomeAmiChartItem[] => {
  if (!amiCharts || amiCharts.length === 0) {
    return [];
  }

  if (amiCharts.length === 1) {
    return amiCharts[0]?.items || [];
  }

  const allItems: MinMaxIncomeAmiChartItem[] = amiCharts.flatMap(
    (chart) => chart?.items || [],
  );

  return allItems.reduce((result: MinMaxIncomeAmiChartItem[], currentItem) => {
    const existingItemIndex = result.findIndex(
      (item) =>
        item.percentOfAmi === currentItem.percentOfAmi &&
        item.householdSize === currentItem.householdSize,
    );

    const income = currentItem.income;

    if (existingItemIndex === -1) {
      currentItem.incomeString = usd.format(income);
      result.push(currentItem);
    } else {
      const newIncome = result[existingItemIndex].income;

      if (income > newIncome) {
        currentItem.incomeString = `${usd.format(newIncome)} - ${usd.format(
          income,
        )}`;
      }
      if (income < newIncome) {
        currentItem.incomeString = `${usd.format(income)} - ${usd.format(
          newIncome,
        )}`;
      }
      result[existingItemIndex] = currentItem;
    }

    return result;
  }, []);
};

// One row for every household size, with max income ranged pulled from all ami charts
// Used to display the maximum income table
export const getHouseholdMaxIncomeSummary = (
  unitGroups: UnitGroup[] = [],
  amiCharts: AmiChart[],
): HouseholdMaxIncomeSummary => {
  const columns = {
    householdSize: 'householdSize',
  };
  const rows = [];

  let occupancyRange: MinMax;
  const amiPercentages = new Set<number>();

  unitGroups.forEach((group) => {
    if (occupancyRange === undefined) {
      occupancyRange = {
        min: group.minOccupancy,
        max: group.maxOccupancy,
      };
    } else {
      occupancyRange.min = Math.min(occupancyRange.min, group.minOccupancy);
      occupancyRange.max = Math.max(occupancyRange.max, group.maxOccupancy);
    }
    group.unitGroupAmiLevels.forEach((level) => {
      if (level.amiPercentage) {
        amiPercentages.add(level.amiPercentage);
      }
    });
  });

  if (
    !amiCharts ||
    (amiCharts && amiCharts.length === 0) ||
    !occupancyRange ||
    (occupancyRange.min === null && occupancyRange.max === null)
  ) {
    return {
      columns,
      rows,
    };
  }

  const amiChartItems = getMinMaxIncomeAmiChartItems(amiCharts);

  Array.from(amiPercentages)
    .filter((percentage) => percentage !== null)
    .sort()
    .forEach((percentage) => {
      // preface with percentage to keep insertion order
      columns[`percentage${percentage}`] = percentage;
    });

  const hmiMap = {};

  // for the occupancy range, get the max income per percentage of AMI across the AMI charts
  amiChartItems.forEach((item) => {
    if (
      item.householdSize >= (occupancyRange?.min || item.householdSize) &&
      item.householdSize <= (occupancyRange?.max || item.householdSize) &&
      amiPercentages.has(item.percentOfAmi)
    ) {
      if (hmiMap[item.householdSize] === undefined) {
        hmiMap[item.householdSize] = {};
      }

      hmiMap[item.householdSize][item.percentOfAmi] =
        item.incomeString ?? usd.format(item.income);
    }
  });

  // set rows from hmiMap
  for (const householdSize in hmiMap) {
    const obj = {
      householdSize,
    };
    for (const ami in hmiMap[householdSize]) {
      obj[`percentage${ami}`] = hmiMap[householdSize][ami];
    }
    rows.push(obj);
  }

  return {
    columns,
    rows,
  };
};

export const summarizeUnitGroups = (
  unitGroups: UnitGroup[] = [],
  amiCharts: AmiChart[] = [],
): UnitGroupsSummarized => {
  const data = {} as UnitGroupsSummarized;

  if (!unitGroups || (unitGroups && unitGroups.length === 0)) {
    return data;
  }

  data.unitGroupSummary = getUnitGroupSummary(unitGroups);
  data.householdMaxIncomeSummary = getHouseholdMaxIncomeSummary(
    unitGroups,
    amiCharts,
  );
  return data;
};

const extractAmiChartsFromUnitGroups = (
  unitGroups: UnitGroup[],
): AmiChart[] => {
  return unitGroups.reduce((charts: AmiChart[], unitGroup) => {
    if (unitGroup.unitGroupAmiLevels) {
      unitGroup.unitGroupAmiLevels.forEach((level) => {
        if (
          level.amiChart &&
          !charts.some((chart) => chart.id === level.amiChart.id)
        ) {
          charts.push(level.amiChart);
        }
      });
    }
    return charts;
  }, []);
};

// Add unit group summaries to a single listing or multiple listings
export const addUnitGroupsSummarized = (
  listingOrListings: Listing | Listing[],
): Listing | Listing[] => {
  // Handle single listing case
  if (!Array.isArray(listingOrListings)) {
    const listing = listingOrListings;
    if (listing.unitGroups?.length > 0) {
      const amiCharts = extractAmiChartsFromUnitGroups(listing.unitGroups);
      listing.unitGroupsSummarized = summarizeUnitGroups(
        listing.unitGroups,
        amiCharts,
      );
    }
    return listing;
  }

  // Handle multiple listings case
  const listings = listingOrListings;
  if (!listings || listings.length === 0) {
    return listings;
  }

  listings.forEach((listing) => {
    if (listing.unitGroups?.length > 0) {
      const amiCharts = extractAmiChartsFromUnitGroups(listing.unitGroups);
      listing.unitGroupsSummarized = summarizeUnitGroups(
        listing.unitGroups,
        amiCharts,
      );
    }
  });

  return listings;
};
