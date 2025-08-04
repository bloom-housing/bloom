import { Unit, UnitGroup, UnitType, UnitTypeEnum } from "../types/backend-swagger"

type GetUnitTypeNamesReturn = {
  id: string
  name: string
}

export const UnitTypeSort: string[] = [
  UnitTypeEnum.SRO,
  UnitTypeEnum.studio,
  UnitTypeEnum.oneBdrm,
  UnitTypeEnum.twoBdrm,
  UnitTypeEnum.threeBdrm,
  UnitTypeEnum.fourBdrm,
  UnitTypeEnum.fiveBdrm,
]

export const UnitGroupTypeSort: string[] = [
  UnitTypeEnum.studio,
  UnitTypeEnum.oneBdrm,
  UnitTypeEnum.twoBdrm,
  UnitTypeEnum.threeBdrm,
  UnitTypeEnum.fourBdrm,
]

export const sortUnitTypes = (units: UnitType[] | GetUnitTypeNamesReturn[]) => {
  if (!units) return []

  return units.sort((a, b) => UnitTypeSort.indexOf(a.name) - UnitTypeSort.indexOf(b.name))
}

export const getUniqueUnitTypes = (units: Unit[]): GetUnitTypeNamesReturn[] => {
  if (!units) return []

  const unitTypes = units.reduce((acc, curr) => {
    const { id, name } = curr.unitTypes || {}

    if (!id || !name) return acc

    const unitTypeExists = acc.some((item) => item.id === id)

    if (!unitTypeExists) {
      acc.push({
        id,
        name,
      })
    }

    return acc
  }, [] as GetUnitTypeNamesReturn[])

  const sorted = sortUnitTypes(unitTypes)

  return sorted
}

export const getUniqueUnitGroupUnitTypes = (unitGroups: UnitGroup[]): GetUnitTypeNamesReturn[] => {
  if (!unitGroups) return []

  const unitTypes = unitGroups.reduce((acc, group) => {
    const groupUnitTypes = group.unitTypes || []
    if (!group.openWaitlist) return acc

    groupUnitTypes.forEach((unitType: UnitType) => {
      const { id, name } = unitType || {}

      if (!id || !name) return

      const unitTypeExists = acc.some((item: GetUnitTypeNamesReturn) => item.id === id)

      if (!unitTypeExists) {
        acc.push({
          id,
          name,
        })
      }
    })

    return acc
  }, [] as GetUnitTypeNamesReturn[])

  const sorted = sortUnitTypes(unitTypes)

  return sorted
}

// It creates array of objects with the id property
export const createUnitTypeId = (unitIds: string[]) => unitIds?.map((id) => ({ id })) || []
