import { UnitStatus } from "../units/types/unit-status-enum"
import { Unit } from "../units/entities/unit.entity"
import { MinMax } from "../units/types/min-max"
import { MinMaxCurrency } from "../units/types/min-max-currency"
import { UnitSummary } from "../units/types/unit-summary"
import { UnitsSummarized } from "../units/types/units-summarized"
import { UnitTypeDto } from "../unit-types/dto/unit-type.dto"
import { UnitType } from "../unit-types/entities/unit-type.entity"
import { UnitAccessibilityPriorityType } from "../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"

export type AnyDict = { [key: string]: unknown }
type Units = Unit[]

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const minMax = (baseValue: MinMax, newValue: number): MinMax => {
  return {
    min: Math.min(baseValue.min, newValue),
    max: Math.max(baseValue.max, newValue),
  }
}

const minMaxCurrency = (baseValue: MinMaxCurrency, newValue: number): MinMaxCurrency => {
  return {
    min: usd.format(Math.min(parseFloat(baseValue.min.replace(/[^0-9.-]+/g, "")), newValue)),
    max: usd.format(Math.max(parseFloat(baseValue.max.replace(/[^0-9.-]+/g, "")), newValue)),
  }
}

const bmrHeaders = ["Studio", "1 BR", "2 BR", "3 BR", "4 BR"]

const hmiData = (units: Units, byUnitType: UnitSummary[], amiPercentages: string[]) => {
  const bmrProgramChart = units[0].bmrProgramChart
  // TODO https://github.com/bloom-housing/bloom/issues/872
  const amiChartItems = units[0].amiChart?.items || []
  const hmiHeaders = {
    householdSize: bmrProgramChart ? "t.unitType" : "listings.householdSize",
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
      // Pass translation with its respective argument with format `key,argumentName:argumentValue`
      hmiHeaders[`ami${percent}`] = `listings.percentAMIUnit,percent:${percent}`
    })

    new Array(maxHousehold).fill(maxHousehold).forEach((item, i) => {
      const columns = { householdSize: null }
      columns["householdSize"] = i + 1

      let pushRow = false // row is valid if at least one column is filled
      amiValues.forEach((percent) => {
        const amiInfo = amiChartItems.find((item) => {
          return item.householdSize == columns.householdSize && item.percentOfAmi == percent
        })
        if (amiInfo) {
          columns[`ami${percent}`] = usd.format(amiInfo.income)
          pushRow = true
        } else {
          columns[`ami${percent}`] = ""
        }
      })

      if (pushRow) {
        if (bmrProgramChart) {
          columns["householdSize"] = bmrHeaders[i]
        }
        hmiRows.push(columns)
      }
    })
  } else {
    hmiHeaders["maxIncomeMonth"] = "listings.maxIncomeMonth"
    hmiHeaders["maxIncomeYear"] = "listings.maxIncomeYear"

    new Array(maxHousehold).fill(maxHousehold).forEach((item, i) => {
      const columns = { householdSize: null }
      columns["householdSize"] = i + 1

      const amiInfo = amiChartItems.find((item) => {
        return item.householdSize == columns.householdSize && item.percentOfAmi == amiValues[0]
      })

      if (amiInfo) {
        columns["maxIncomeMonth"] = usd.format(amiInfo.income / 12)
        columns["maxIncomeYear"] = usd.format(amiInfo.income)
        if (bmrProgramChart) {
          columns["householdSize"] = bmrHeaders[i]
        }
        hmiRows.push(columns)
      }
    })
  }

  return { columns: hmiHeaders, rows: hmiRows }
}

const getCurrencyString = (initialValue: string) => {
  return usd.format(getRoundedNumber(initialValue))
}

const getRoundedNumber = (initialValue: string) => {
  return parseFloat(parseFloat(initialValue).toFixed(2))
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
    totalCount: 0,
  } as UnitSummary
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

const UnitTypeSort = ["studio", "oneBdrm", "twoBdrm", "threeBdrm", "fourBdrm", "fiveBdrm"]

// Allows for multiples rows under one unit type if the rent methods differ
const summarizeUnitsByTypeAndRent = (units: Units): UnitSummary[] => {
  const summaries: UnitSummary[] = []
  const unitMap: UnitMap = {}

  units.forEach((unit) => {
    const currentUnitType = unit.unitType
    const currentUnitRent = unit.monthlyRentAsPercentOfIncome
    const thisKey = currentUnitType.name.concat(currentUnitRent)
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
    finalSummary.totalCount = unitMap[key].length
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
const summarizeUnitsByType = (units: Units, unitTypes: UnitTypeDto[]): UnitSummary[] => {
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

const summarizeByAmi = (units: Units, amiPercentages: string[]) => {
  return amiPercentages.map((percent: string) => {
    const unitsByAmiPercentage = units.filter((unit: Unit) => unit.amiPercentage == percent)
    return {
      percent: percent,
      byUnitType: summarizeUnitsByTypeAndRent(unitsByAmiPercentage),
    }
  })
}

export const transformUnits = (units: Unit[]): UnitsSummarized => {
  const data = {} as UnitsSummarized

  const unitTypes = new Map<string, UnitType>()
  for (const unitType of units.map((unit) => unit.unitType).filter((item) => item != null)) {
    unitTypes.set(unitType.id, unitType)
  }
  data.unitTypes = Array.from(unitTypes.values())

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
  data.hmi = hmiData(units, data.byUnitType, data.amiPercentages)
  return data
}
