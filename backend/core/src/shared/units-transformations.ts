import { UnitSummary } from "../units/types/unit-summary"
import { HMI } from "../units/types/hmi"
import { UnitsSummarized } from "../units/types/units-summarized"

import { AmiChart } from "../ami-charts/entities/ami-chart.entity"

import { UnitsSummary } from "../units-summary/entities/units-summary.entity"

const getUnitSummary = () => {}

// One row for every unit group with occupancy / sq ft / floor range averaged across all unit types
// Used to display the occupancy table, unit type accordions
export const getUnitTypeSummary = (unitGroups: UnitsSummary[]): UnitSummary[] => {
  return []
}

// One row for every unit group, with rent and ami ranges across all ami levels
// Used to display the main pricing table
export const getUnitGroupSummary = (unitGroups: UnitsSummary[]): UnitSummary[] => {
  return []
}

// One row for every household size, with max income ranged pulled from all ami charts
// Used to display the maximum income table
export const getHouseholdMaxIncomeSummary = (): HMI => {
  return {} as HMI
}

export const summarizeUnits = (units: UnitsSummary[], amiCharts: AmiChart[]): UnitsSummarized => {
  const data = {} as UnitsSummarized

  if (!units || (units && units.length === 0)) {
    return data
  }

  data.byUnitType = getUnitTypeSummary(units)
  data.byUnitTypeAndRent = getUnitGroupSummary(units)
  data.hmi = getHouseholdMaxIncomeSummary()
  return data
}
