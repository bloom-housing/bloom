import * as React from "react"
import { GroupedUnitsWithSummaries, UnitGroupWithSummary } from "@dahlia/ui-components/src/types"
import { BasicTable } from "@dahlia/ui-components/src/tables/basic_table"

const toggleTable = (event: any) => {
  event.currentTarget.parentElement.querySelector(".unit-table").classList.toggle("hidden")
}

interface UnitTablesProps {
  groupedUnits: GroupedUnitsWithSummaries
}

const UnitTables = (props: UnitTablesProps) => {
  const groupedUnits = props.groupedUnits

  const unitsHeaders = {
    number: "Unit #",
    sq_ft_label: "Area",
    num_bathrooms: "Baths",
    floor: "Floor"
  }

  return (
    <>
      {groupedUnits.map((unitsGroup: UnitGroupWithSummary) => (
        <div>
          <button onClick={toggleTable} style={{ width: "100%", textAlign: "left" }}>
            <h3 className="bg-blue-100 p-4 border-0 border-b border-blue-600">
              <strong>{unitsGroup[2].unit_type_label}</strong>: {unitsGroup[1].length} unit
              {unitsGroup[1].length > 1 ? "s" : ""}, {unitsGroup[2].area_range},
              {" " + unitsGroup[2].floor_range}
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
