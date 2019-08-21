import * as React from "react"
import { BasicTable } from "@dahlia/ui-components/src/tables/basic_table"

const unitTypeLabel = unitType => {
  const unitTypeLabels = {
    studio: "Studio",
    one_bdrm: "1 BR",
    two_bdrm: "2 BR",
    three_bdrm: "3 BR",
    four_bdrm: "4 BR"
  }
  return unitTypeLabels[unitType]
}

const unitAreaRange = (units: any) => {
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

const ordinalize = num => {
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

const unitFloorRange = (units: any) => {
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

const toggleTable = event => {
  event.currentTarget.parentElement.querySelector(".unit-table").classList.toggle("hidden")
}

const UnitTables = (props: any) => {
  const units = props.units

  const unitsHeaders = {
    number: "Unit #",
    sq_ft_label: "Area",
    num_bathrooms: "Baths",
    floor: "Floor"
  }

  let groupedByType = {}
  units.forEach(item => {
    if (!groupedByType[item.unit_type]) {
      groupedByType[item.unit_type] = []
    }

    const unit = Object.assign({}, item) // duplicate hash
    unit.sq_ft_label = `${unit.sq_ft} sqft`

    groupedByType[item.unit_type].push(unit)
  })

  return (
    <>
      {Object.entries(groupedByType).map(unitsGroup => (
        <div>
          <button onClick={toggleTable} style={{ width: "100%", textAlign: "left" }}>
            <h3 className="bg-blue-100 p-4 border-0 border-b border-blue-600">
              <strong>{unitTypeLabel(unitsGroup[0])}</strong>: {unitsGroup[1].length} unit
              {unitsGroup[1].length > 1 ? "s" : ""}, {unitAreaRange(unitsGroup[1])},
              {" " + unitFloorRange(unitsGroup[1])}
            </h3>
          </button>
          <div className="unit-table hidden">
            <BasicTable headers={unitsHeaders} data={unitsGroup[1]} />
          </div>
        </div>
      ))}
    </>
  )
}

export default UnitTables
