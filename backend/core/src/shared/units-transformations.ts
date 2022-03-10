import { UnitGroupSummary } from "../units/types/unit-group-summary"
import { UnitTypeSummary } from "../units/types/unit-type-summary"

import { HouseholdMaxIncomeSummary } from "../units/types/household-max-income-summary"
import { UnitSummaries } from "../units/types/unit-summaries"

import { AmiChart } from "../ami-charts/entities/ami-chart.entity"

import { UnitGroup } from "../units-summary/entities/unit-group.entity"
import { MinMax } from "../units/types/min-max"
import { MonthlyRentDeterminationType } from "../units-summary/types/monthly-rent-determination.enum"
import { HUDMSHDA2021 } from "../seeder/seeds/ami-charts/HUD-MSHDA2021"
import { setMinMax } from "./unit-transformation-helpers"

// One row for every unit group with occupancy / sq ft / floor range averaged across all unit types
// Used to display the occupancy table, unit type accordions
export const getUnitTypeSummary = (unitGroups: UnitGroup[]): UnitTypeSummary[] => {
  return []
}

// One row for every unit group, with rent and ami ranges across all ami levels
// Used to display the main pricing table
export const getUnitGroupSummary = (unitGroups: UnitGroup[] = []): UnitGroupSummary[] => {
  const summary: UnitGroupSummary[] = []

  const sortedUnitGroups = unitGroups?.sort(
    (a, b) =>
      a.unitType.sort((c, d) => c.numBedrooms - d.numBedrooms)[0].numBedrooms -
      b.unitType.sort((e, f) => e.numBedrooms - f.numBedrooms)[0].numBedrooms
  )

  sortedUnitGroups.forEach((group) => {
    let rentAsPercentIncomeRange: MinMax, rentRange: MinMax, amiPercentageRange: MinMax
    group.amiLevels.forEach((level) => {
      if (level.monthlyRentDeterminationType === MonthlyRentDeterminationType.flatRent) {
        rentRange = setMinMax(rentRange, Number(level.flatRentValue))
      } else {
        rentAsPercentIncomeRange = setMinMax(
          rentAsPercentIncomeRange,
          level.percentageOfIncomeValue
        )
      }

      amiPercentageRange = setMinMax(amiPercentageRange, level.amiPercentage)
    })
    const groupSummary: UnitGroupSummary = {
      unitTypes: group.unitType
        .sort((a, b) => (a.numBedrooms < b.numBedrooms ? -1 : 1))
        .map((type) => type.name),
      rentAsPercentIncomeRange,
      rentRange: rentRange && {
        min: `$${rentRange.min}`,
        max: `$${rentRange.max}`,
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
    }
    summary.push(groupSummary)
  })

  return summary
}

// One row for every household size, with max income ranged pulled from all ami charts
// Used to display the maximum income table
export const getHouseholdMaxIncomeSummary = (
  unitGroups: UnitGroup[] = [],
  amiCharts: AmiChart[]
): HouseholdMaxIncomeSummary => {
  const columns = {
    householdSize: "householdSize",
  }
  const rows = []

  if (!amiCharts || (amiCharts && amiCharts.length === 0)) {
    return {
      columns,
      rows,
    }
  }

  // if there are two amiCharts (Detroit only has two), then we can use HUD-MSHDA2021, which is a merge of the two, with the max values of both (HUD had higher values for 30 and 80%)
  const amiChartItems = amiCharts.length === 2 ? HUDMSHDA2021.items : amiCharts[0].items

  let occupancyRange: MinMax
  const amiPercentages = new Set<number>()
  // aggregate household sizes across all groups based off of the occupancy range
  unitGroups.forEach((group) => {
    if (occupancyRange === undefined) {
      occupancyRange = {
        min: group.minOccupancy,
        max: group.maxOccupancy,
      }
    } else {
      occupancyRange.min = Math.min(occupancyRange.min, group.minOccupancy)
      occupancyRange.max = Math.max(occupancyRange.max, group.maxOccupancy)
    }

    group.amiLevels.forEach((level) => {
      amiPercentages.add(level.amiPercentage)
    })
  })

  Array.from(amiPercentages)
    .filter((percentage) => percentage !== null)
    .sort()
    .forEach((percentage) => {
      // preface with percentage to keep insertion order
      columns[`percentage${percentage}`] = percentage
    })

  const hmiMap = {}

  // for the occupancy range, get the max income per percentage of AMI across the AMI charts
  amiChartItems.forEach((item) => {
    if (
      item.householdSize >= occupancyRange.min &&
      item.householdSize <= occupancyRange.max &&
      amiPercentages.has(item.percentOfAmi)
    ) {
      if (hmiMap[item.householdSize] === undefined) {
        hmiMap[item.householdSize] = {}
      }

      hmiMap[item.householdSize][item.percentOfAmi] = item.income
    }
  })

  // set rows from hmiMap
  for (const householdSize in hmiMap) {
    const obj = {
      householdSize,
    }
    for (const ami in hmiMap[householdSize]) {
      obj[`percentage${ami}`] = hmiMap[householdSize][ami]
    }
    rows.push(obj)
  }

  return {
    columns,
    rows,
  }
}

export const summarizeUnits = (units: UnitGroup[], amiCharts: AmiChart[]): UnitSummaries => {
  const data = {} as UnitSummaries

  if (!units || (units && units.length === 0)) {
    return data
  }

  data.unitTypeSummary = getUnitTypeSummary(units)
  data.unitGroupSummary = getUnitGroupSummary(units)
  data.householdMaxIncomeSummary = getHouseholdMaxIncomeSummary(units, amiCharts)
  return data
}
