import { Unit, UnitType } from "@bloom-housing/backend-core/types"

type GetUnitTypeNamesReturn = {
  id: string
  name: string
}

export const UnitTypeSort = ["studio", "oneBdrm", "twoBdrm", "threeBdrm", "fourBdrm"]

export const sortUnitTypes = (units: UnitType[] | GetUnitTypeNamesReturn[]) => {
  if (!units) return []

  return units.sort((a, b) => UnitTypeSort.indexOf(a.name) - UnitTypeSort.indexOf(b.name))
}

export const getUniqueUnitTypes = (units: Unit[]): GetUnitTypeNamesReturn[] => {
  if (!units) return []

  const unitTypes = units.reduce((acc, curr) => {
    const { id, name } = curr.unitType || {}

    if (!id || !name) return acc

    const unitTypeExists = acc.find((item) => item.id === id)

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

// It creates array of objects with the id property
export const createUnitTypeId = (unitIds: string[]) => unitIds?.map((id) => ({ id } ?? []))
