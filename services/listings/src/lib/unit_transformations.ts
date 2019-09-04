import {
  Unit,
  UnitGroup,
  GroupedUnits,
  UnitGroupSummary,
  UnitGroupWithSummary,
  GroupedUnitsWithSummaries
} from "@dahlia/ui-components/src/types"
type StringDict = { [key: string]: string }
type AnyDict = { [key: string]: any }
type Units = [Unit]

const ordinalize = (num: number): string => {
  const standardSuffix = "th"
  const oneToThreeSuffixes = ["st", "nd", "rd"]

  const numStr = num.toString()
  const lastTwoDigits = parseInt(numStr.slice(-2), 10)
  const lastDigit = parseInt(numStr.slice(-1), 10)

  let suffix = ""
  if (lastDigit >= 1 && lastDigit <= 3 && !(lastTwoDigits >= 11 && lastTwoDigits <= 13)) {
    suffix = oneToThreeSuffixes[lastDigit - 1]
  } else {
    suffix = standardSuffix
  }

  return `${num}${suffix}`
}

const getUnitTypeLabel = (unitType: string): string => {
  const unitTypeLabels: StringDict = {
    studio: "Studio",
    one_bdrm: "1 BR",
    two_bdrm: "2 BR",
    three_bdrm: "3 BR",
    four_bdrm: "4 BR"
  }
  return unitTypeLabels[unitType]
}

const getUnitAreaRange = (units: Units) => {
  const sq_fts = units.map(unit => unit.sq_ft)
  const [min, max] = [Math.min(...sq_fts), Math.max(...sq_fts)]
  return min != max ? `${min} square feet - ${max} square feet` : `${min} square feet`
}

const getUnitFloorRange = (units: Units) => {
  const floors = units.map(unit => unit.floor)
  const [min, max] = [Math.min(...floors), Math.max(...floors)]
  return min != max ? `${ordinalize(min)} - ${ordinalize(max)} floors` : `${ordinalize(min)} floor`
}

export const transformUnitsIntoGroups = (units: Units): GroupedUnitsWithSummaries => {
  let groupedByType = {} as AnyDict
  units.forEach(item => {
    if (!groupedByType[item.unit_type]) {
      groupedByType[item.unit_type] = []
    }

    const unit = Object.assign({}, item) // duplicate hash
    unit.sq_ft_label = `${unit.sq_ft} sqft`

    groupedByType[item.unit_type].push(unit)
  })

  const groupedUnits = Object.entries(groupedByType) as GroupedUnits
  return groupedUnits.map(
    (group: UnitGroup): UnitGroupWithSummary => {
      let newGroup = Array.from(group) as UnitGroupWithSummary
      newGroup.push({
        unit_type_label: getUnitTypeLabel(group[0]),
        area_range: getUnitAreaRange(group[1]),
        floor_range: getUnitFloorRange(group[1])
      } as UnitGroupSummary)
      return newGroup
    }
  )
}
