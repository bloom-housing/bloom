import Formatter from "./Formatter"
import { stringToBoolean, stringToNumber } from "../helpers"

export default class UnitsFormatter extends Formatter {
  /** Format the values within the units array */
  process() {
    this.data.disableUnitsAccordion = stringToBoolean(this.data.disableUnitsAccordion)

    this.data.units = this.metadata.units.map((unitValue) => {
      const unit = { ...unitValue } // make a copy of the unit before transformation

      switch (unit.unitTypes?.name) {
        case "sevenBdrm":
          unit.numBedrooms = 7
          break
        case "sixBdrm":
          unit.numBedrooms = 6
          break
        case "fiveBdrm":
          unit.numBedrooms = 5
          break
        case "fourBdrm":
          unit.numBedrooms = 4
          break
        case "threeBdrm":
          unit.numBedrooms = 3
          break
        case "twoBdrm":
          unit.numBedrooms = 2
          break
        case "oneBdrm":
          unit.numBedrooms = 1
          break
        default:
          unit.numBedrooms = 0
      }

      const percentOfAmi = parseInt(unit.amiPercentage)
      const overrideItems = []

      Object.keys(unit).forEach((key) => {
        if (key.indexOf("maxIncomeHouseholdSize") >= 0) {
          const householdSize = parseInt(key[key.length - 1])
          const overrideIncome = parseInt(unit[key])

          if (overrideIncome) {
            overrideItems.push({
              percentOfAmi,
              householdSize,
              income: overrideIncome,
            })
          } else if (
            unit.amiChart?.items?.some(
              (item) => item.householdSize === householdSize && item.percentOfAmi === percentOfAmi
            )
          ) {
            overrideItems.push({
              percentOfAmi,
              householdSize,
              income: null,
            })
          }
        }
      })

      unit.unitAmiChartOverrides = overrideItems.length
        ? {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            items: overrideItems,
          }
        : undefined

      unit.floor = stringToNumber(unit.floor)
      unit.maxOccupancy = stringToNumber(unit.maxOccupancy)
      unit.minOccupancy = stringToNumber(unit.minOccupancy)
      unit.numBathrooms = stringToNumber(unit.numBathrooms)

      if (!unit.sqFeet) {
        delete unit.sqFeet
      }

      delete unit.tempId

      // remove unnecessary ami chart fields for listing editing
      if (unit.amiChart) {
        delete unit.amiChart.items
        delete unit.amiChart.jurisdictions
        delete unit.createdAt
        delete unit.updatedAt
      }

      return unit
    })
  }
}
