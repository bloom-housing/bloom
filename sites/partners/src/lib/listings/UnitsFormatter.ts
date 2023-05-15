import Formatter from "./Formatter"
import { stringToBoolean, stringToNumber } from "../helpers"

export default class UnitsFormatter extends Formatter {
  /** Format the values within the units array */
  process() {
    this.data.disableUnitsAccordion = stringToBoolean(this.data.disableUnitsAccordion)

    this.data.units = this.metadata.units.map((unitValue) => {
      const unit = { ...unitValue } // make a copy of the unit before transformation

      switch (unit.unitType?.name) {
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
          unit.numBedrooms = null
      }

      Object.keys(unit).forEach((key) => {
        if (key.indexOf("maxIncomeHouseholdSize") >= 0) {
          if (parseInt(unit[key])) {
            if (!unit.amiChartOverride) {
              unit.amiChartOverride = {
                id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
                items: [],
              }
            }
            unit.amiChartOverride.items.push({
              percentOfAmi: parseInt(unit.amiPercentage),
              householdSize: parseInt(key[key.length - 1]),
              income: parseInt(unit[key]),
            })
          }
        }
      })

      unit.floor = stringToNumber(unit.floor)
      unit.maxOccupancy = stringToNumber(unit.maxOccupancy)
      unit.minOccupancy = stringToNumber(unit.minOccupancy)
      unit.numBathrooms = unit.numBathrooms ? stringToNumber(unit.numBathrooms) : null

      if (!unit.sqFeet) {
        delete unit.sqFeet
      }

      delete unit.tempId

      return unit
    })
  }
}
