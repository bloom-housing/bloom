import { Unit, UnitsSummarized, UnitSummary } from "@bloom-housing/core/src/units"
import { MinMax } from "@bloom-housing/core/src/general"
import { AmiChartItem } from "@bloom-housing/core/src/ami_charts"
type AnyDict = { [key: string]: any }
type Units = Unit[]

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

const hmiData = (
  units: Units,
  byUnitType: UnitSummary[],
  amiCharts: any,
  amiPercentages: string[]
) => {
  const amiChartId = units[0].amiChartId
  const amiChart = amiCharts[amiChartId] as AmiChartItem[]
  const hmiHeaders = {
    householdSize: "Household Size"
  } as AnyDict
  const amiValues = amiPercentages
    .map(percent => {
      const percentInt = parseInt(percent, 10)
      return percentInt
    })
    .sort()
  amiValues.forEach(percent => {
    hmiHeaders["ami" + percent] = `${percent}% AMI Units`
  })
  let maxHousehold = 0
  maxHousehold = byUnitType.reduce((maxHousehold, summary) => {
    return maxHousehold + summary.occupancyRange.max
  }, maxHousehold)
  const hmiRows = [] as AnyDict[]
  new Array(maxHousehold).fill(maxHousehold).forEach((item, i) => {
    const columns = {
      householdSize: i + 1
    }
    amiValues.forEach(percent => {
      const amiInfo = amiChart.find(item => {
        return item.householdSize == columns.householdSize && item.percentOfAmi == percent
      })
      if (amiInfo) {
        columns["ami" + percent] = "$" + amiInfo.income
      } else {
        columns["ami" + percent] = "$" + "…"
      }
    })
    hmiRows.push(columns)
  })

  return { columns: hmiHeaders, rows: hmiRows }
}

const summarizeUnits = (
  units: Units,
  unitTypes: string[],
  reservedType?: string
): UnitSummary[] => {
  if (!reservedType) {
    reservedType = null
  }
  const summaries = unitTypes.map(
    (unitType: string): UnitSummary => {
      const summary = {} as UnitSummary
      const unitsByType = units.filter((unit: Unit) => unit.unitType == unitType)
      return Array.from(unitsByType).reduce((summary, unit) => {
        summary.unitType = unitType
        if (!summary.totalAvailable) {
          summary.totalAvailable = 0
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
    }
  )

  return summaries
}

const summarizeReservedTypes = (units: Units, reservedTypes: string[], unitTypes: string[]) => {
  return reservedTypes.map((reservedType: string) => {
    const unitsByReservedType = units.filter((unit: Unit) => unit.reservedType == reservedType)
    return {
      reservedType: reservedType,
      byUnitType: summarizeUnits(unitsByReservedType, unitTypes)
    }
  })
}

const summarizeByAmi = (
  units: Units,
  amiPercentages: string[],
  reservedTypes: string[],
  unitTypes: string[]
) => {
  return amiPercentages.map((percent: string) => {
    const unitsByAmiPercentage = units.filter((unit: Unit) => unit.amiPercentage == percent)
    const nonReservedUnitsByAmiPercentage = unitsByAmiPercentage.filter(
      (unit: Unit) => unit.reservedType == null
    )
    return {
      percent: percent,
      byNonReservedUnitType: summarizeUnits(nonReservedUnitsByAmiPercentage, unitTypes),
      byReservedType: summarizeReservedTypes(unitsByAmiPercentage, reservedTypes, unitTypes)
    }
  })
}

export const transformUnits = (units: Units, amiCharts: any): UnitsSummarized => {
  const data = {} as UnitsSummarized
  data.unitTypes = Array.from(
    new Set(units.map(unit => unit.unitType).filter(item => item != null))
  )
  data.reservedTypes = Array.from(
    new Set(units.map(unit => unit.reservedType).filter(item => item != null))
  )
  data.priorityTypes = Array.from(
    new Set(units.map(unit => unit.priorityType).filter(item => item != null))
  )
  data.amiPercentages = Array.from(
    new Set(units.map(unit => unit.amiPercentage).filter(item => item != null))
  )
  const nonReservedUnits = units.filter((unit: Unit) => unit.reservedType == null)
  data.byUnitType = summarizeUnits(units, data.unitTypes)
  data.byNonReservedUnitType = summarizeUnits(nonReservedUnits, data.unitTypes)
  data.byReservedType = summarizeReservedTypes(units, data.reservedTypes, data.unitTypes)
  data.byAMI = summarizeByAmi(units, data.amiPercentages, data.reservedTypes, data.unitTypes)
  data.hmi = hmiData(units, data.byUnitType, amiCharts, data.amiPercentages)
  return data
}
