import * as React from "react"
import nanoid from "nanoid"
import { UnitGroup, MinMax } from "@bloom/ui-components/src/types"
import { BasicTable } from "@bloom/ui-components/src/tables/basic_table"
import t from "@bloom/ui-components/src/helpers/translator"

const toggleTable = (event: any) => {
  event.currentTarget.parentElement.querySelector(".unit-table").classList.toggle("hidden")
}

const formatRange = (range: MinMax): string => {
  if (range.min == range.max) {
    return range.min.toString()
  } else {
    return "${range.min} - ${range.max}"
  }
}

interface UnitTablesProps {
  groupedUnits: UnitGroup[]
}

const UnitTables = (props: UnitTablesProps) => {
  const groupedUnits = props.groupedUnits

  const unitsHeaders = {
    number: "Unit #",
    sqFtLabel: "Area",
    numBathrooms: "Baths",
    floor: "Floor"
  }

  return (
    <>
      {groupedUnits.map((unitsGroup: UnitGroup) => {
        const uniqKey = nanoid()
        return (
          <div key={uniqKey}>
            <button onClick={toggleTable} style={{ width: "100%", textAlign: "left" }}>
              <h3 className="bg-blue-100 p-4 border-0 border-b border-blue-600">
                <strong>{t("listings.unitTypes." + unitsGroup.type)}</strong>:
                {unitsGroup.units.length} unit
                {unitsGroup.units.length > 1 ? "s" : ""},
                {formatRange(unitsGroup.unitSummary.areaRange)} square feet,
                {" " + formatRange(unitsGroup.unitSummary.floorRange)} floors
              </h3>
            </button>
            <div className="unit-table hidden">
              <BasicTable headers={unitsHeaders} data={unitsGroup.units} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default UnitTables
