import { UnitStatus } from "../units/types/unit-status-enum"
import { Unit } from "../units/entities/unit.entity"
import { MinMax } from "../units/types/min-max"
import { UnitSummary } from "../units/types/unit-summary"
import { UnitsSummarized } from "../units/types/units-summarized"
import { UnitTypeDto } from "../unit-types/dto/unit-type.dto"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { getCurrencyString, getRoundedNumber, minMaxCurrency } from "./utils/currency"
import { hmiData } from "./hmi-data"

export type AnyDict = { [key: string]: unknown }

const minMax = (baseValue: MinMax, newValue: number): MinMax => {
  return {
    min: Math.min(baseValue.min, newValue),
    max: Math.max(baseValue.max, newValue),
  }
}

const getDefaultSummaryRanges = (unit: Unit) => {
  return {
    areaRange: { min: parseFloat(unit.sqFeet), max: parseFloat(unit.sqFeet) },
    minIncomeRange: {
      min: getCurrencyString(unit.monthlyIncomeMin),
      max: getCurrencyString(unit.monthlyIncomeMin),
    },
    occupancyRange: { min: unit.minOccupancy, max: unit.maxOccupancy },
    rentRange: {
      min: getCurrencyString(unit.monthlyRent),
      max: getCurrencyString(unit.monthlyRent),
    },
    rentAsPercentIncomeRange: {
      min: parseFloat(unit.monthlyRentAsPercentOfIncome),
      max: parseFloat(unit.monthlyRentAsPercentOfIncome),
    },
    floorRange: {
      min: unit.floor,
      max: unit.floor,
    },
    unitType: unit.unitType,
    totalAvailable: 0,
  }
}

const getUnitsSummary = (unit: Unit, existingSummary?: UnitSummary) => {
  if (!existingSummary) {
    return getDefaultSummaryRanges(unit)
  }
  const summary = existingSummary

  // Income Range
  summary.minIncomeRange = minMaxCurrency(
    summary.minIncomeRange,
    getRoundedNumber(unit.monthlyIncomeMin)
  )

  // Occupancy Range
  summary.occupancyRange = minMax(summary.occupancyRange, unit.minOccupancy)
  summary.occupancyRange = minMax(summary.occupancyRange, unit.maxOccupancy)

  // Rent Ranges
  summary.rentAsPercentIncomeRange = minMax(
    summary.rentAsPercentIncomeRange,
    parseFloat(unit.monthlyRentAsPercentOfIncome)
  )
  summary.rentRange = minMaxCurrency(summary.rentRange, getRoundedNumber(unit.monthlyRent))

  // Floor Range
  if (unit.floor) {
    summary.floorRange = minMax(summary.floorRange, unit.floor)
  }

  // Area Range
  summary.areaRange = minMax(summary.areaRange, parseFloat(unit.sqFeet))

  return summary
}

type UnitMap = {
  [key: string]: Unit[]
}

const UnitTypeSort = ["SRO", "studio", "oneBdrm", "twoBdrm", "threeBdrm"]

// Allows for multiples rows under one unit type if the rent methods differ
export const summarizeUnitsByTypeAndRent = (units: Unit[]): UnitSummary[] => {
  const summaries: UnitSummary[] = []
  const unitMap: UnitMap = {}

  units.forEach((unit) => {
    const currentUnitType = unit.unitType
    const currentUnitRent = unit.monthlyRentAsPercentOfIncome
    const thisKey = currentUnitType?.name.concat(currentUnitRent)
    if (!(thisKey in unitMap)) unitMap[thisKey] = []
    unitMap[thisKey].push(unit)
  })

  for (const key in unitMap) {
    const finalSummary = unitMap[key].reduce((summary, unit, index) => {
      return getUnitsSummary(unit, index === 0 ? null : summary)
    }, {} as UnitSummary)
    finalSummary.totalAvailable = unitMap[key].filter(
      (unit) => unit.status === UnitStatus.available
    ).length
    summaries.push(finalSummary)
  }

  return summaries.sort((a, b) => {
    return (
      UnitTypeSort.indexOf(a.unitType.name) - UnitTypeSort.indexOf(b.unitType.name) ||
      Number(a.minIncomeRange.min) - Number(b.minIncomeRange.min)
    )
  })
}

// One row per unit type
export const summarizeUnitsByType = (units: Unit[], unitTypes: UnitTypeDto[]): UnitSummary[] => {
  const summaries = unitTypes.map(
    (unitType: UnitTypeDto): UnitSummary => {
      const summary = {} as UnitSummary
      const unitsByType = units.filter((unit: Unit) => unit.unitType.name == unitType.name)
      const finalSummary = Array.from(unitsByType).reduce((summary, unit, index) => {
        return getUnitsSummary(unit, index === 0 ? null : summary)
      }, summary)
      return finalSummary
    }
  )
  return summaries.sort((a, b) => {
    return (
      UnitTypeSort.indexOf(a.unitType.name) - UnitTypeSort.indexOf(b.unitType.name) ||
      Number(a.minIncomeRange.min) - Number(b.minIncomeRange.min)
    )
  })
}

const summarizeByAmi = (units: Unit[], amiPercentages: string[]) => {
  return amiPercentages.map((percent: string) => {
    const unitsByAmiPercentage = units.filter((unit: Unit) => unit.amiPercentage == percent)
    return {
      percent: percent,
      byUnitType: summarizeUnitsByTypeAndRent(unitsByAmiPercentage),
    }
  })
}

export const getUnitTypes = (units: Unit[]): UnitType[] => {
  const unitTypes = new Map<string, UnitType>()
  for (const unitType of units.map((unit) => unit.unitType).filter((item) => item != null)) {
    unitTypes.set(unitType.id, unitType)
  }

  return Array.from(unitTypes.values())
}

export const summarizeUnits = (units: Unit[], amiCharts: AmiChart[]): UnitsSummarized => {
  const data = {} as UnitsSummarized

  if (!units || (units && units.length === 0)) {
    return data
  }

  const unitTypes = new Map<string, UnitType>()
  for (const unitType of units.map((unit) => unit.unitType).filter((item) => item != null)) {
    unitTypes.set(unitType.id, unitType)
  }
  data.unitTypes = getUnitTypes(units)

  const priorityTypes = new Map<string, UnitAccessibilityPriorityType>()
  for (const priorityType of units
    .map((unit) => unit.priorityType)
    .filter((item) => item != null)) {
    priorityTypes.set(priorityType.id, priorityType)
  }
  data.priorityTypes = Array.from(priorityTypes.values())

  data.amiPercentages = Array.from(
    new Set(units.map((unit) => unit.amiPercentage).filter((item) => item != null))
  )
  data.byUnitTypeAndRent = summarizeUnitsByTypeAndRent(units)
  data.byUnitType = summarizeUnitsByType(units, data.unitTypes)
  data.byAMI = summarizeByAmi(units, data.amiPercentages)
  data.hmi = hmiData(
    units,
    data.byUnitType.reduce((maxHousehold, summary) => {
      return Math.max(maxHousehold, summary.occupancyRange.max)
    }, 0),
    amiCharts
  )
  return data
}
