type StringDict = { [key: string]: string }
type AnyDict = { [key: string]: any }
type Units = [AnyDict]
type UnitGroup = [string, Units]
type GroupedUnits = UnitGroup[]
type UnitGroupWithSummary = [string, Units, AnyDict]
type GroupedUnitsWithSummarys = UnitGroupWithSummary[]

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
  let min = units[0].sq_ft
  let max = units[0].sq_ft
  units.forEach(unit => {
    if (unit.sq_ft < min) min = unit.sq_ft
    if (unit.sq_ft > max) max = unit.sq_ft
  })
  let range = `${min} square feet`
  if (min != max) range += ` - ${max} square feet`
  return range
}

const getUnitFloorRange = (units: Units) => {
  let min = units[0].floor
  let max = units[0].floor
  units.forEach(unit => {
    if (unit.floor < min) min = unit.floor
    if (unit.floor > max) max = unit.floor
  })
  let range = `${ordinalize(min)} floor`
  if (min != max) range = `${ordinalize(min)} - ${ordinalize(max)} floors`
  return range
}

export const transformUnitsIntoGroups = (units: Units): GroupedUnitsWithSummarys => {
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
      })
      return newGroup
    }
  )
}
