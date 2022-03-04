import { UnitGroupSummary } from "../units/types/unit-group-summary"
import { UnitTypeSummary } from "../units/types/unit-type-summary"

import { HouseholdMaxIncomeSummary } from "../units/types/household-max-income-summary"
import { UnitSummaries } from "../units/types/unit-summaries"

import { AmiChart } from "../ami-charts/entities/ami-chart.entity"

import { UnitGroup } from "../units-summary/entities/unit-group.entity"

// One row for every unit group with occupancy / sq ft / floor range averaged across all unit types
// Used to display the occupancy table, unit type accordions
export const getUnitTypeSummary = (unitGroups: UnitGroup[]): UnitTypeSummary[] => {
  return []
}

// One row for every unit group, with rent and ami ranges across all ami levels
// Used to display the main pricing table
export const getUnitGroupSummary = (unitGroups: UnitGroup[]): UnitGroupSummary[] => {
  return []
}

// One row for every household size, with max income ranged pulled from all ami charts
// Used to display the maximum income table
export const getHouseholdMaxIncomeSummary = (): HouseholdMaxIncomeSummary => {
  return {} as HouseholdMaxIncomeSummary
}

export const summarizeUnits = (units: UnitGroup[], amiCharts: AmiChart[]): UnitSummaries => {
  const data = {} as UnitSummaries

  if (!units || (units && units.length === 0)) {
    return data
  }

  data.unitTypeSummary = getUnitTypeSummary(units)
  data.unitGroupSummary = getUnitGroupSummary(units)
  data.householdMaxIncomeSummary = getHouseholdMaxIncomeSummary()
  return data
}
