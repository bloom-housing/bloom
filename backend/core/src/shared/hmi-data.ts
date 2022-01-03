import { Unit } from "../units/entities/unit.entity"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { AmiChartItem } from "../ami-charts/entities/ami-chart-item.entity"
import { UnitAmiChartOverride } from "../units/entities/unit-ami-chart-override.entity"
import { MinMaxCurrency } from "../units/types/min-max-currency"
import { minMaxCurrency, usd, yearlyCurrencyStringToMonthly } from "./utils/currency"

type ChartAndPercentage = {
  percentage: number
  chart: AmiChart
}

const findAmiValueInChart = (
  amiChart: AmiChartItem[],
  householdSize: number,
  percentOfAmi: number
) => {
  return amiChart.find((item) => {
    return item.householdSize === householdSize && item.percentOfAmi === percentOfAmi
  })?.income
}

const getAmiChartItemUniqueKey = (amiChartItem: AmiChartItem) => {
  return amiChartItem.householdSize.toString() + "-" + amiChartItem.percentOfAmi.toString()
}

// All unique AMI percentages across all units
const amiPercentagesAcrossUnits = (units: Unit[]) => {
  return [
    ...new Set(
      units.filter((item) => item != null).map((unit) => parseInt(unit.amiPercentage, 10))
    ),
  ].sort(function (a, b) {
    return a - b
  })
}

const setupHmiHeaders = (showUnitType: boolean, allPercentages: number[]) => {
  const hmiHeaders = {
    sizeColumn: showUnitType ? "t.unitType" : "listings.householdSize",
  } as Record<string, unknown>

  // 1. If there are multiple AMI levels, show each AMI level (max income per
  //    year only) for each size (number of cols = the size col + # ami levels)
  // 2. If there is only one AMI level, show max income per month and per
  //    year for each size (number of cols = the size col + 2 for each income style)
  if (allPercentages.length > 1) {
    allPercentages.forEach((percent) => {
      // Pass translation with its respective argument with format `key*argumentName:argumentValue`
      hmiHeaders[`ami${percent}`] = `listings.percentAMIUnit*percent:${percent}`
    })
  } else {
    hmiHeaders["maxIncomeMonth"] = "listings.maxIncomeMonth"
    hmiHeaders["maxIncomeYear"] = "listings.maxIncomeYear"
  }

  return hmiHeaders
}

export const mergeAmiChartWithOverrides = (amiChart: AmiChart, override: UnitAmiChartOverride) => {
  const householdAmiPercentageOverrideMap: Map<string, AmiChartItem> = override.items.reduce(
    (acc, amiChartItem) => {
      acc.set(getAmiChartItemUniqueKey(amiChartItem), amiChartItem)
      return acc
    },
    new Map()
  )

  for (const amiChartItem of amiChart.items) {
    const amiChartItemOverride = householdAmiPercentageOverrideMap.get(
      getAmiChartItemUniqueKey(amiChartItem)
    )
    if (amiChartItemOverride) {
      amiChartItem.income = amiChartItemOverride.income
    }
  }
  return amiChart
}

// Creates data used to display a table of household size/unit size by maximum income per the AMI charts on the units
// Unit sets can have multiple AMI charts used, in which case the table displays ranges
export const hmiData = (units: Unit[], maxHouseholdSize: number, amiCharts: AmiChart[]) => {
  // Currently, BMR chart is just toggling whether or not the first column shows Household Size or Unit Type
  if (!units || units.length === 0) {
    return null
  }
  const showUnitType = units[0].bmrProgramChart

  const allPercentages = amiPercentagesAcrossUnits(units)

  const amiChartMap: Record<string, AmiChart> = amiCharts.reduce((acc, amiChart) => {
    acc[amiChart.id] = amiChart
    return acc
  }, {})

  // All unique combinations of an AMI percentage and an AMI chart across all units
  const uniquePercentageChartSet: ChartAndPercentage[] = [
    ...new Set(
      units
        .filter((unit) => amiChartMap[unit.amiChartId])
        .map((unit) => {
          let amiChart = amiChartMap[unit.amiChartId]
          if (unit.amiChartOverride) {
            amiChart = mergeAmiChartWithOverrides(amiChart, unit.amiChartOverride)
          }
          return JSON.stringify({
            percentage: parseInt(unit.amiPercentage, 10),
            chart: amiChart,
          })
        })
    ),
  ].map((uniqueSetString) => JSON.parse(uniqueSetString))

  let bmrHeaders = [
    "listings.unitTypes.SRO",
    "listings.unitTypes.studio",
    "listings.unitTypes.oneBdrm",
    "listings.unitTypes.twoBdrm",
    "listings.unitTypes.threeBdrm",
    "listings.unitTypes.fourBdrm",
  ]

  // this is to map currentHouseholdSize to a units max occupancy
  const unitOccupancy = []
  if (showUnitType) {
    // the unit types used by the listing
    const selectedUnitTypes = units.reduce((obj, unit) => {
      if (unit.unitType) {
        obj[unit.unitType.name] = {
          rooms: unit.unitType.numBedrooms,
          maxOccupancy: unit.maxOccupancy,
        }
      }
      return obj
    }, {})
    const sortedUnitTypeNames = Object.keys(selectedUnitTypes).sort((a, b) =>
      selectedUnitTypes[a].rooms < selectedUnitTypes[b].rooms
        ? -1
        : selectedUnitTypes[a].rooms > selectedUnitTypes[b].rooms
        ? 1
        : 0
    )
    // setbmrHeaders based on the actual units
    bmrHeaders = sortedUnitTypeNames.map((type) => `listings.unitTypes.${type}`)

    // set unitOccupancy based off of a units max occupancy
    sortedUnitTypeNames.forEach((name) => {
      unitOccupancy.push(selectedUnitTypes[name].maxOccupancy)
    })

    // if showUnitType, we want to set the maxHouseholdSize to the largest unit.maxOccupancy
    const largestBedroom = Math.max(...units.map((unit) => unit.unitType?.numBedrooms || 0))
    maxHouseholdSize = largestBedroom + 1
  }

  const hmiHeaders = setupHmiHeaders(showUnitType, allPercentages)

  const hmiRows = [] as Record<string, unknown>[]

  // Build row data by household size
  new Array(maxHouseholdSize).fill(maxHouseholdSize).forEach((_, index) => {
    const currentHouseholdSize = showUnitType ? unitOccupancy[index] : index + 1
    const rowData = {
      sizeColumn: showUnitType ? bmrHeaders[index] : currentHouseholdSize,
    }

    let rowHasData = false // Row is valid if at least one column is filled, otherwise don't push the row
    allPercentages.forEach((currentAmiPercent) => {
      // Get all the charts that we're using with this percentage and size
      const uniquePercentCharts = uniquePercentageChartSet.filter((uniqueChartAndPercentage) => {
        return uniqueChartAndPercentage.percentage === currentAmiPercent
      })
      // If we don't have data for this AMI percentage and household size, this cell is empty
      if (uniquePercentCharts.length === 0) {
        if (allPercentages.length === 1) {
          rowData["maxIncomeMonth"] = ""
          rowData["maxIncomeYear"] = ""
        } else {
          rowData[`ami${currentAmiPercent}`] = ""
        }
      } else {
        if (!uniquePercentCharts[0].chart) {
          return
        }
        // If we have chart data, create a max income range string
        const firstChartValue = findAmiValueInChart(
          uniquePercentCharts[0].chart.items,
          currentHouseholdSize,
          currentAmiPercent
        )
        if (!firstChartValue) {
          return
        }
        const maxIncomeRange = uniquePercentCharts.reduce(
          (incomeRange, uniqueSet) => {
            return minMaxCurrency(
              incomeRange,
              findAmiValueInChart(uniqueSet.chart.items, currentHouseholdSize, currentAmiPercent)
            )
          },
          { min: usd.format(firstChartValue), max: usd.format(firstChartValue) } as MinMaxCurrency
        )
        if (allPercentages.length === 1) {
          rowData[
            "maxIncomeMonth"
          ] = `listings.monthlyIncome*income:${yearlyCurrencyStringToMonthly(maxIncomeRange.max)}`
          rowData["maxIncomeYear"] = `listings.annualIncome*income:${maxIncomeRange.max}`
        } else {
          rowData[`ami${currentAmiPercent}`] = `listings.annualIncome*income:${maxIncomeRange.max}`
        }
        rowHasData = true
      }
    })
    if (rowHasData) {
      hmiRows.push(rowData)
    }
  })

  return { columns: hmiHeaders, rows: hmiRows }
}
