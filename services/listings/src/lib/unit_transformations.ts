import { Unit, UnitGroup, UnitsSummarized, UnitSummary } from "@bloom/core/src/units"
import { MinMax } from "@bloom/core/src/general"
type AnyDict = { [key: string]: any }
type Units = [Unit]

const minMaxValue = (baseValue: MinMax, newValue: number, newMaxValue: any = null): MinMax => {
  if (!newMaxValue) {
    newMaxValue = newValue
  }
  if (baseValue && baseValue.min && baseValue.max) {
    return { min: Math.min(baseValue.min, newValue), max: Math.max(baseValue.max, newMaxValue) }
  } else {
    return { min: newValue, max: newMaxValue }
  }
}

const summarizeUnits = (units: Units): UnitSummary => {
  const summary = {} as UnitSummary
  Array.from(units).reduce((summary, unit) => {
    if (!summary.totalAvailable) {
      summary.totalAvailable = 0
    }
    if (!summary.reservedTypes) {
      summary.reservedTypes = [unit.unit_type]
    } else {
      if (!summary.reservedTypes.includes(unit.unit_type)) {
        summary.reservedTypes.push(unit.unit_type)
      }
    }
    summary.minIncomeRange = minMaxValue(summary.minIncomeRange, unit.monthly_income_min)
    summary.occupancyRange = minMaxValue(
      summary.occupancyRange,
      unit.min_occupancy,
      unit.max_occupancy
    )
    summary.rentAsPercentIncomeRange = minMaxValue(
      summary.rentAsPercentIncomeRange,
      unit.monthly_rent_as_percent_of_income
    )
    summary.rentRange = minMaxValue(summary.rentRange, unit.monthly_rent)
    summary.floorRange = minMaxValue(summary.floorRange, unit.floor)
    summary.areaRange = minMaxValue(summary.areaRange, unit.sqFeet)
    summary.totalAvailable += 1

    return summary
  }, summary)

  return summary
}

const groupUnits = (units: Units, type: keyof Unit = "unit_type"): UnitGroup[] => {
  const groupedByType = {} as AnyDict
  units.forEach(unit => {
    const groupKey = unit[type] as keyof Record<string, any>
    if (!groupedByType[groupKey]) {
      groupedByType[groupKey] = {} as UnitGroup
      groupedByType[groupKey].type = groupKey
      groupedByType[groupKey].units = []
    }

    groupedByType[groupKey].units.push(unit)
  })
  const grouped = Object.values(groupedByType)
  grouped.forEach(group => {
    group.unitSummary = summarizeUnits(group.units)
  })

  return grouped
}

export const transformUnits = (units: Units): UnitsSummarized => {
  const data = {} as UnitsSummarized
  data.grouped = groupUnits(units)
  data.reserved = groupUnits(units, "reserved_type")
  data.priority = groupUnits(units, "priority_type")
  data.unitTypes = data.grouped.map(group => group.type)
  data.unitSummary = summarizeUnits(units)
  return data
}
