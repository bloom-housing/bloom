import { Unit, UnitGroup, UnitsSummarized, UnitSummary } from "@bloom-housing/core/src/units"
import { MinMax } from "@bloom-housing/core/src/general"
type AnyDict = { [key: string]: any }
type Units = [Unit]

const minMaxValue = (baseValue: MinMax, newValue: number, newMaxValue?: number): MinMax => {
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
      summary.reservedTypes = [unit.unitType]
    } else {
      if (!summary.reservedTypes.includes(unit.unitType)) {
        summary.reservedTypes.push(unit.unitType)
      }
    }
    summary.minIncomeRange = minMaxValue(summary.minIncomeRange, unit.monthlyIncomeMin)
    summary.occupancyRange = minMaxValue(
      summary.occupancyRange,
      unit.minOccupancy,
      unit.maxOccupancy
    )
    summary.rentAsPercentIncomeRange = minMaxValue(
      summary.rentAsPercentIncomeRange,
      unit.monthlyRentAsPercentOfIncome
    )
    summary.rentRange = minMaxValue(summary.rentRange, unit.monthlyRent)
    summary.floorRange = minMaxValue(summary.floorRange, unit.floor)
    summary.areaRange = minMaxValue(summary.areaRange, unit.sqFeet)
    summary.totalAvailable += 1

    return summary
  }, summary)

  return summary
}

const groupUnits = (units: Units, type: keyof Unit = "unitType"): UnitGroup[] => {
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
  data.reserved = groupUnits(units, "reservedType")
  data.priority = groupUnits(units, "priorityType")
  data.unitTypes = data.grouped.map(group => group.type)
  data.unitSummary = summarizeUnits(units)
  return data
}
