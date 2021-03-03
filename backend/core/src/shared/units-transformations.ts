import {
  MinMax,
  MinMaxCurrency,
  Unit,
  UnitsSummarized,
  UnitSummary,
} from "../units/entities/unit.entity"

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
    householdSize: bmrProgramChart ? "Unit Type" : "household_size",
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
      hmiHeaders[`ami${percent}`] = `${percent}% AMI Units`
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
    hmiHeaders["maxIncomeMonth"] = "max_income_month"
    hmiHeaders["maxIncomeYear"] = "max_income_year"

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

        summary.occupancyRange = minMaxValue(
          summary.occupancyRange,
          unit.minOccupancy,
          unit.maxOccupancy
        )
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
        if (unit.status == "available") {
          summary.totalAvailable += 1
        }

        return summary
      }, summary)

      if (finalSummary.minIncomeRange) {
        finalSummary.minIncomeRange = minMaxInCurrency(finalSummary.minIncomeRange)
      }
      if (finalSummary.rentRange) {
        finalSummary.rentRange = minMaxInCurrency(finalSummary.rentRange)
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
  data.byUnitType = summarizeUnits(units, data.unitTypes)
  data.byNonReservedUnitType = summarizeUnits(nonReservedUnits, data.unitTypes)
  data.byReservedType = summarizeReservedTypes(units, data.reservedTypes, data.unitTypes)
  data.byAMI = summarizeByAmi(units, data.amiPercentages, data.reservedTypes, data.unitTypes)
  data.hmi = hmiData(units, data.byUnitType, data.amiPercentages)
  return data
}
