import * as React from "react"
import nanoid from "nanoid"
import { MinMax } from "@bloom-housing/core/src/general"
import { UnitSummary, Unit } from "@bloom-housing/core/src/units"
import { BasicTable } from "../../src/tables/basic_table"
import t from "../../src/helpers/translator"
import numberOrdinal from "../../src/helpers/numberOrdinal"
import capitalize from "../../src/helpers/capitalize"

const toggleTable = (event: any) => {
  event.currentTarget.parentElement.querySelector(".unit-table").classList.toggle("hidden")
}

const formatRange = (range: MinMax, ordinalize?: boolean) => {
  let min = range.min as any
  let max = range.max as any

  if (ordinalize) {
    min = numberOrdinal(min)
    max = numberOrdinal(max)
  }

  if (min == max) {
    return <>{min}</>
  } else {
    return (
      <>
        {min} - {max}
      </>
    )
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
    number: capitalize(t("listings.unit") + " #"),
    sqFeet: capitalize(t("t.area")),
    numBathrooms: capitalize(t("listings.bath") + "s"),
    floor: capitalize(t("t.floor"))
  }

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary) => {
        const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
        const units = props.units.filter((unit: Unit) => unit.unitType == unitSummary.unitType)
        const unitsFormatted = [] as any
        units.forEach((unit: Unit) => {
          unitsFormatted.push({
            number: unit.number,
            sqFeet: (
              <>
                <strong>{unit.sqFeet}</strong> {t("t.sqFeet")}
              </>
            ),
            numBathrooms: <strong>{unit.numBathrooms}</strong>,
            floor: <strong>{unit.floor}</strong>
          })
        })

        return (
          <div key={uniqKey} className="mb-4">
            <button onClick={toggleTable} style={{ width: "100%", textAlign: "left" }}>
              <h3 className="button-tiny-bg-light">
                <strong>{t("listings.unitTypes." + unitSummary.unitType)}</strong>:&nbsp;
                {unitsLabel(units)},&nbsp;
                {formatRange(unitSummary.areaRange)} {t("listings.squareFeet")},&nbsp;
                {formatRange(unitSummary.floorRange, true)}{" "}
                {unitSummary.floorRange.max > unitSummary.floorRange.min
                  ? t("t.floors")
                  : t("t.floor")}
              </h3>
            </button>
            <div className="unit-table hidden">
              <BasicTable headers={unitsHeaders} data={unitsFormatted} />
            </div>
          </div>
        )
      })}
    </>
  )
}

export default UnitTables
