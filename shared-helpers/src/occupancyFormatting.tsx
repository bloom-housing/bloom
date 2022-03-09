import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { Listing, UnitType } from "@bloom-housing/backend-core/types"

export const occupancyTable = (listing: Listing) => {
  const getOccupancyString = (min?: number, max?: number) => {
    if (!max && min) return min === 1 ? t("t.minPerson") : t("t.minPeople", { num: min })
    if (!min && max) return max === 1 ? t("t.maxPerson") : t("t.maxPeople", { num: max })
    if (min === max) return max === 1 ? t("t.onePerson") : t("t.numPeople", { num: max })
    return t("t.peopleRange", { min, max })
  }

  const getUnitTypeNameString = (unitType: UnitType) => {
    return t("listings.unitTypes." + unitType.name)
  }

  const getUnitTypeString = (unitTypes: UnitType[]) => {
    const unitTypesString = unitTypes.reduce((acc, curr, index) => {
      return index > 0 ? `${acc}, ${getUnitTypeNameString(curr)}` : getUnitTypeNameString(curr)
    }, "")

    return <strong>{unitTypesString}</strong>
  }

  const sortedUnitGroups = listing.unitGroups
    ?.sort(
      (a, b) =>
        a.unitType.sort((c, d) => c.numBedrooms - d.numBedrooms)[0].numBedrooms -
        b.unitType.sort((e, f) => e.numBedrooms - f.numBedrooms)[0].numBedrooms
    )
    .filter((unitGroup) => unitGroup.maxOccupancy || unitGroup.minOccupancy)

  return sortedUnitGroups?.map((unitGroup) => {
    const unitTypeString = getUnitTypeString(unitGroup.unitType)
    const occupancyString = getOccupancyString(unitGroup.minOccupancy, unitGroup.maxOccupancy)
    if (occupancyString) {
      return {
        unitType: unitTypeString,
        occupancy: occupancyString,
      }
    }
    return null
  })
}
