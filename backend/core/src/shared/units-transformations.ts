import { Unit } from "../units/entities/unit.entity"
import { MinMax } from "../units/types/min-max"
import { MinMaxCurrency } from "../units/types/min-max-currency"
import { UnitSummary } from "../units/types/unit-summary"
import { UnitsSummarized } from "../units/types/units-summarized"

export type AnyDict = { [key: string]: any }
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
  if (baseValue && (baseValue.min || baseValue.min == 0) && baseValue.max) {
    return {
      min: Math.min(baseValue.min, newValue),
      max: Math.max(baseValue.max, newMaxValue),
    }
  } else {
    return { min: newValue, max: newMaxValue }
  }
}

const minMaxInCurrency = (minMax: MinMaxCurrency): MinMaxCurrency => {
  return { min: usd.format(parseFloat(minMax.min)), max: usd.format(parseFloat(minMax.max)) }
}

const bmrHeaders = ["Studio", "1 BR", "2 BR", "3 BR", "4 BR"]

const hmiData = (units: Units, byUnitType: UnitSummary[], amiPercentages: string[]) => {
  const bmrProgramChart = units[0].bmrProgramChart
  // TODO https://github.com/bloom-housing/bloom/issues/872
  const amiChartItems = units[0].amiChart.items
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

const getUnitSummary = (unit: Unit) => {
  const summary = {} as UnitSummary
  summary.unitType = unit.unitType
  if (!summary.totalAvailable) {
    summary.totalAvailable = 0
  }
  const minIncomeRange = minMaxValue(
    {
      min: parseFloat(summary.minIncomeRange?.min),
      max: parseFloat(summary.minIncomeRange?.max),
    },
    parseFloat(unit.monthlyIncomeMin)
  )
  summary.minIncomeRange = {
    min: minIncomeRange.min.toPrecision(2),
    max: minIncomeRange.max.toPrecision(2),
  }

  summary.occupancyRange = minMaxValue(summary.occupancyRange, unit.minOccupancy, unit.maxOccupancy)
  summary.rentAsPercentIncomeRange = minMaxValue(
    summary.rentAsPercentIncomeRange,
    parseFloat(unit.monthlyRentAsPercentOfIncome)
  )
  const rentRange = minMaxValue(
    {
      min: parseFloat(summary.rentRange?.min),
      max: parseFloat(summary.rentRange?.max),
    },
    Number.parseFloat(unit.monthlyRent)
  )
  summary.rentRange = {
    min: rentRange.min.toPrecision(2),
    max: rentRange.max.toPrecision(2),
  }
  if (unit.floor) {
    summary.floorRange = minMaxValue(summary.floorRange, unit.floor)
  }
  summary.areaRange = minMaxValue(summary.areaRange, parseFloat(unit.sqFeet))

  if (summary.minIncomeRange) {
    summary.minIncomeRange = minMaxInCurrency(summary.minIncomeRange)
  }
  if (summary.rentRange) {
    summary.rentRange = minMaxInCurrency(summary.rentRange)
  }
  return summary
}

const summarizeUnits = (units: Units, reservedType?: string): UnitSummary[] => {
  if (!reservedType) {
    reservedType = null
  }
  const summaries: UnitSummary[] = []
  let currentUnitType = units[0].unitType
  let currentUnitRent = units[0].monthlyRent
  let numAvailable = 0

  // Assumes units are listed in groups by unitType and rent type
  // Allows for multiples rows under one unit type if the rent methods differ
  units.forEach((unit, index) => {
    if (unit.unitType !== currentUnitType || unit.monthlyRent !== currentUnitRent) {
      const summary = getUnitSummary(units[index - 1])
      summary.totalAvailable = numAvailable
      summaries.push(summary)
      currentUnitType = unit.unitType
      currentUnitRent = unit.monthlyRent
      numAvailable = 1
    } else {
      numAvailable += 1
    }
    if (index === units.length - 1) {
      const summary = getUnitSummary(unit)
      summary.totalAvailable = numAvailable
      summaries.push(summary)
      return
    }
  })

  return summaries.filter((item) => Object.keys(item).length > 0)
}

const summarizeReservedTypes = (units: Units, reservedTypes: string[]) => {
  return reservedTypes
    .map((reservedType: string) => {
      const unitsByReservedType = units.filter((unit: Unit) => unit.reservedType == reservedType)
      return {
        reservedType: reservedType,
        byUnitType: summarizeUnits(unitsByReservedType),
      }
    })
    .filter((item) => item.byUnitType.length > 0)
}

const summarizeByAmi = (units: Units, amiPercentages: string[], reservedTypes: string[]) => {
  return amiPercentages.map((percent: string) => {
    const unitsByAmiPercentage = units.filter((unit: Unit) => unit.amiPercentage == percent)
    const nonReservedUnitsByAmiPercentage = unitsByAmiPercentage.filter(
      (unit: Unit) => unit.reservedType == null
    )
    return {
      percent: percent,
      byNonReservedUnitType: summarizeUnits(nonReservedUnitsByAmiPercentage),
      byReservedType: summarizeReservedTypes(unitsByAmiPercentage, reservedTypes),
    }
  })
}

export const transformUnits = (units: Unit[]): UnitsSummarized => {
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
  data.byUnitType = summarizeUnits(units)
  data.byNonReservedUnitType = summarizeUnits(nonReservedUnits)
  data.byReservedType = summarizeReservedTypes(units, data.reservedTypes)
  data.byAMI = summarizeByAmi(units, data.amiPercentages, data.reservedTypes)
  data.hmi = hmiData(units, data.byUnitType, data.amiPercentages)
  return data
}
