import Formatter from "./Formatter"
import { stringToBoolean, stringToNumber } from "../helpers"

export default class UnitGroupsFormatter extends Formatter {
  /** Format the values within the units array */
  process() {
    this.data.disableUnitsAccordion = stringToBoolean(this.data.disableUnitsAccordion)

    this.data.unitGroups = this.metadata.unitGroups.map((unitGroupValue) => {
      const unitGroup = { ...unitGroupValue } // make a copy of the unit before transformation

      unitGroup.maxOccupancy = stringToNumber(unitGroup.maxOccupancy)
      unitGroup.minOccupancy = stringToNumber(unitGroup.minOccupancy)
      unitGroup.floorMin = stringToNumber(unitGroup.floorMin)
      unitGroup.floorMax = stringToNumber(unitGroup.floorMax)
      unitGroup.bathroomMin = stringToNumber(unitGroup.bathroomMin)
      unitGroup.bathroomMax = stringToNumber(unitGroup.bathroomMax)
      unitGroup.flatRentValueFrom = stringToNumber(unitGroup.flatRentValueFrom)
      unitGroup.flatRentValueTo = stringToNumber(unitGroup.flatRentValueTo)
      unitGroup.monthlyRent = stringToNumber(unitGroup.monthlyRent)
      unitGroup.sqFeetMin = stringToNumber(unitGroup.sqFeetMin)
      unitGroup.sqFeetMax = stringToNumber(unitGroup.sqFeetMax)
      unitGroup.totalCount = stringToNumber(unitGroup.totalCount)
      unitGroup.totalAvailable = stringToNumber(unitGroup.totalAvailable)
      unitGroup.openWaitlist = stringToBoolean(unitGroup.openWaitlist)

      unitGroup.unitGroupAmiLevels = unitGroup.unitGroupAmiLevels.map((amiEntry) => ({
        ...amiEntry,
        amiPercentage: stringToNumber(amiEntry.amiPercentage),
        flatRentValue: stringToNumber(amiEntry.flatRentValue),
        percentageOfIncomeValue: stringToNumber(amiEntry.percentageOfIncomeValue),
      }))

      delete unitGroup.tempId

      return unitGroup
    })
  }
}
