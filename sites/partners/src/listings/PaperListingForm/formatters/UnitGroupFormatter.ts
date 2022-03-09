import Formatter from "./Formatter"
import { stringToBoolean, stringToNumberOrOne } from "../../../../lib/helpers"

export default class UnitGroupFormatter extends Formatter {
  /** Format the values within the units array */
  process() {
    this.data.unitGroups = this.metadata.unitGroups.map((unitGroup) => {
      const unit = { ...unitGroup }

      unit.unitType = unit.unitType.map((type) => ({
        id: type.id ?? type.toString(),
        createdAt: undefined,
        updatedAt: undefined,
        name: "",
        numBedrooms: 0,
      }))

      unit.amiLevels = unit.amiLevels?.map((ami) => ({
        ...ami,
        amiPercentage: stringToNumberOrOne(ami.amiPercentage),
        flatRentValue: stringToNumberOrOne(ami.flatRentValue),
        amiChartId: ami.amiChartId ?? "",
      }))

      console.log("(25) unit.amiLevels:", unit.amiLevels)

      unit.openWaitlist = stringToBoolean(unit.openWaitlist)
      unit.maxOccupancy = stringToNumberOrOne(unit.maxOccupancy)
      unit.minOccupancy = stringToNumberOrOne(unit.minOccupancy)
      unit.bathroomMin = stringToNumberOrOne(unit.bathroomMin)
      unit.bathroomMax = stringToNumberOrOne(unit.bathroomMax)
      unit.totalAvailable = stringToNumberOrOne(unit.totalAvailable)
      unit.totalCount = stringToNumberOrOne(unit.totalCount)
      unit.floorMin = stringToNumberOrOne(unit.floorMin)
      unit.floorMax = stringToNumberOrOne(unit.floorMax)
      return unit
    })
  }
}
