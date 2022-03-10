import Formatter from "./Formatter"
import { stringToBoolean, toNumberOrNull } from "../../../../lib/helpers"

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

      unit.amiLevels =
        unit.amiLevels?.map((ami) => ({
          ...ami,
          amiPercentage: toNumberOrNull(ami.amiPercentage),
          flatRentValue: toNumberOrNull(ami.flatRentValue),
          percentageOfIncomeValue: toNumberOrNull(ami.percentageOfIncomeValue),
          amiChartId: ami.amiChartId ?? "",
        })) || []

      unit.openWaitlist = stringToBoolean(unit.openWaitlist)
      unit.maxOccupancy = toNumberOrNull(unit.maxOccupancy)
      unit.minOccupancy = toNumberOrNull(unit.minOccupancy)
      unit.bathroomMin = toNumberOrNull(unit.bathroomMin)
      unit.bathroomMax = toNumberOrNull(unit.bathroomMax)
      unit.totalAvailable = toNumberOrNull(unit.totalAvailable)
      unit.totalCount = toNumberOrNull(unit.totalCount)
      unit.floorMin = toNumberOrNull(unit.floorMin)
      unit.floorMax = toNumberOrNull(unit.floorMax)
      unit.sqFeetMin = toNumberOrNull(unit.sqFeetMin)
      unit.sqFeetMax = toNumberOrNull(unit.sqFeetMax)

      return unit
    })
  }
}
