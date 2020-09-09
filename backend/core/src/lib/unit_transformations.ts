import {
  UnitsSummarized,
  UnitSummary,
  MinMax,
  MinMaxCurrency,
  AmiChartItem,
} from "@bloom-housing/core"
import { Unit } from "../entity/unit.entity"

type AnyDict = { [key: string]: any }
type Units = Unit[]

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

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

const minMaxInCurrency = (minMax: MinMax): MinMaxCurrency => {
  return { min: usd.format(minMax.min), max: usd.format(minMax.max) }
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
    householdSize: "Household Size",
  } as AnyDict
  const amiValues = amiPercentages
    .map((percent) => {
      const percentInt = parseInt(percent, 10)
      return percentInt
    })
    .sort()
  let maxHousehold = 0
  maxHousehold = byUnitType.reduce((maxHousehold, summary) => {
    return Math.max(maxHousehold, summary.occupancyRange.max)
  }, maxHousehold)

  const hmiRows = [] as AnyDict[]

  // There are two versions of this table:
  // 1. If there is only one AMI level, it shows max income per month and per
  //    year for each household size.
  // 2. If there are multiple AMI levels, it shows each level (max income per
  //    year) per household size.
  if (amiValues.length > 1) {
    amiValues.forEach((percent) => {
      hmiHeaders["ami" + percent] = `${percent}% AMI Units`
    })

    new Array(maxHousehold).fill(maxHousehold).forEach((item, i) => {
      const columns = {
        householdSize: i + 1,
      }
      let pushRow = false // row is valid if at least one column is filled
      amiValues.forEach((percent) => {
        const amiInfo = amiChart.find((item) => {
          return item.householdSize == columns.householdSize && item.percentOfAmi == percent
        })
        if (amiInfo) {
          columns["ami" + percent] = usd.format(amiInfo.income)
          pushRow = true
        } else {
          columns["ami" + percent] = ""
        }
      })

      if (pushRow) {
        hmiRows.push(columns)
      }
    })
  } else {
    hmiHeaders["maxIncomeMonth"] = "Maximum Income/Month"
    hmiHeaders["maxIncomeYear"] = "Maximum Income/Year"

    new Array(maxHousehold).fill(maxHousehold).forEach((item, i) => {
      const columns = {
        householdSize: i + 1,
      }

      const amiInfo = amiChart.find((item) => {
        return item.householdSize == columns.householdSize && item.percentOfAmi == amiValues[0]
      })

      if (amiInfo) {
        columns["maxIncomeMonth"] = usd.format(amiInfo.income / 12)
        columns["maxIncomeYear"] = usd.format(amiInfo.income)
        hmiRows.push(columns)
      }
    })
  }

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
      const finalSummary = Array.from(unitsByType).reduce((summary, unit) => {
        summary.unitType = unitType
        if (!summary.totalAvailable) {
          summary.totalAvailable = 0
        }
        summary.minIncomeRange = minMaxValue(
          summary.minIncomeRange as MinMax,
          unit.monthlyIncomeMin
        )

        summary.occupancyRange = minMaxValue(
          summary.occupancyRange,
          unit.minOccupancy,
          unit.maxOccupancy
        )
        summary.rentAsPercentIncomeRange = minMaxValue(
          summary.rentAsPercentIncomeRange,
          unit.monthlyRentAsPercentOfIncome
        )
        summary.rentRange = minMaxValue(summary.rentRange as MinMax, unit.monthlyRent)
        if (unit.floor) {
          summary.floorRange = minMaxValue(summary.floorRange, unit.floor)
        }
        summary.areaRange = minMaxValue(summary.areaRange, unit.sqFeet)
        if (unit.status == "available") {
          summary.totalAvailable += 1
        }

        return summary
      }, summary)

      if (finalSummary.minIncomeRange) {
        finalSummary.minIncomeRange = minMaxInCurrency(finalSummary.minIncomeRange as MinMax)
      }
      if (finalSummary.rentRange) {
        finalSummary.rentRange = minMaxInCurrency(finalSummary.rentRange as MinMax)
      }

      return finalSummary
    }
  )

  return summaries.filter((item) => Object.keys(item).length > 0)
}

const summarizeReservedTypes = (units: Units, reservedTypes: string[], unitTypes: string[]) => {
  return reservedTypes
    .map((reservedType: string) => {
      const unitsByReservedType = units.filter((unit: Unit) => unit.reservedType == reservedType)
      return {
        reservedType: reservedType,
        byUnitType: summarizeUnits(unitsByReservedType, unitTypes),
      }
    })
    .filter((item) => item.byUnitType.length > 0)
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
      byReservedType: summarizeReservedTypes(unitsByAmiPercentage, reservedTypes, unitTypes),
    }
  })
}

export const transformUnits = (units: Unit[], amiCharts: any): UnitsSummarized => {
  const data = {} as UnitsSummarized
  data.unitTypes = Array.from(
    new Set(units.map((unit) => unit.unitType).filter((item) => item != null))
  )
  data.reservedTypes = Array.from(
    new Set(units.map((unit) => unit.reservedType).filter((item) => item != null))
  )
  data.priorityTypes = Array.from(
    new Set(units.map((unit) => unit.priorityType).filter((item) => item != null))
  )
  data.amiPercentages = Array.from(
    new Set(units.map((unit) => unit.amiPercentage).filter((item) => item != null))
  )
  const nonReservedUnits = units.filter((unit: Unit) => unit.reservedType == null)
  data.byUnitType = summarizeUnits(units, data.unitTypes)
  data.byNonReservedUnitType = summarizeUnits(nonReservedUnits, data.unitTypes)
  data.byReservedType = summarizeReservedTypes(units, data.reservedTypes, data.unitTypes)
  data.byAMI = summarizeByAmi(units, data.amiPercentages, data.reservedTypes, data.unitTypes)
  data.hmi = hmiData(units, data.byUnitType, amiCharts, data.amiPercentages)
  return data
}
