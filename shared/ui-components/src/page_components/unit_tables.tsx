import * as React from "react"
import nanoid from "nanoid"
import { MinMax } from "@bloom-housing/core/src/general"
import { UnitSummary, Unit } from "@bloom-housing/core/src/units"
import { BasicTable } from "../../src/tables/basic_table"
import t from "../../src/helpers/translator"

const toggleTable = (event: any) => {
  event.currentTarget.parentElement.querySelector(".unit-table").classList.toggle("hidden")
}

const formatRange = (range: MinMax): string => {
  if (range.min == range.max) {
    return "${range.min}"
  } else {
    return "${range.min} - ${range.max}"
  }
}

const unitsLabel = (units: Unit[]): string => {
  const label = units.length > 1 ? t("listings.units") : t("listings.unit")
  return `${units.length} ${label}`
}

interface UnitTablesProps {
  units: Unit[]
  unitSummaries: UnitSummary[]
}

const UnitTables = (props: UnitTablesProps) => {
  const unitSummaries = props.unitSummaries

  const unitsHeaders = {
    number: "Unit #",
    sqFeet: "Area",
    numBathrooms: "Baths",
    floor: "Floor"
  }

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary) => {
        const uniqKey = nanoid()
        const units = props.units.filter((unit: Unit) => unit.unitType == unitSummary.unitType)

        return (
          <div key={uniqKey} className="mb-4">
            <button onClick={toggleTable} style={{ width: "100%", textAlign: "left" }}>
              <h3 className="button-tiny-bg-light">
                <strong>{t("listings.unitTypes." + unitSummary.unitType)}</strong>:&nbsp;
                {unitsLabel(units)},&nbsp;
                {formatRange(unitSummary.areaRange)} {t("listings.squareFeet")}
              </h3>
            </button>
            <div className="unit-table hidden">
              <BasicTable headers={unitsHeaders} data={units} unit={t("t.sqFeet")} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default UnitTables
