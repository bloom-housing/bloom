import { UnitStatus } from "../src/units/types/unit-status-enum"

export function createUnitsArray(type: string, number: number) {
  const units = []
  for (let unit_index = 0; unit_index < number; unit_index++) {
    units.push({
      unitType: type,
      status: UnitStatus.unknown,
    })
  }
  return units
}
