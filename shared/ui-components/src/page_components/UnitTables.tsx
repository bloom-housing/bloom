import * as React from "react"
import { nanoid } from "nanoid"
import { MinMax, UnitSummary, Unit } from "@bloom-housing/core"

import { BasicTable } from "../tables/BasicTable"
import t from "../../src/helpers/translator"
import { numberOrdinal } from "../../src/helpers/numberOrdinal"
import { capitalize } from "../../src/helpers/capitalize"

const formatRange = (range: MinMax, ordinalize?: boolean) => {
  let min: string | number = range.min
  let max: string | number = range.max

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
  disableAccordion?: boolean
}

const UnitTables = (props: UnitTablesProps) => {
  const unitSummaries = props.unitSummaries

  const unitsHeaders = {
    number: capitalize(t("listings.unit") + " #"),
    sqFeet: capitalize(t("t.area")),
    numBathrooms: capitalize(t("listings.bath") + "s"),
    floor: capitalize(t("t.floor")),
  }

  const toggleTable = (event: React.MouseEvent) => {
    if (!props.disableAccordion) {
      event.currentTarget.parentElement?.querySelector(".unit-table")?.classList?.toggle("hidden")
    }
  }

  const buttonClasses = ["w-full", "text-left"]
  if (props.disableAccordion) buttonClasses.push("cursor-default")

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary) => {
        const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
        const units = props.units.filter((unit: Unit) => unit.unitType == unitSummary.unitType)
        const unitsFormatted = [] as Array<Record<string, string | JSX.Element>>
        let floorSection
        units.forEach((unit: Unit) => {
          unitsFormatted.push({
            number: unit.number,
            sqFeet: (
              <>
                <strong>{unit.sqFeet}</strong> {t("t.sqFeet")}
              </>
            ),
            numBathrooms: <strong>{unit.numBathrooms}</strong>,
            floor: <strong>{unit.floor}</strong>,
          })
        })

        if (unitSummary.floorRange) {
          floorSection = (
            <>
              ,&nbsp;{formatRange(unitSummary.floorRange, true)}{" "}
              {unitSummary.floorRange.max > unitSummary.floorRange.min
                ? t("t.floors")
                : t("t.floor")}
            </>
          )
        }

        return (
          <div key={uniqKey} className="mb-4">
            <button onClick={toggleTable} className={buttonClasses.join(" ")}>
              <h3 className="toggle-header">
                <strong>{t("listings.unitTypes." + unitSummary.unitType)}</strong>:&nbsp;
                {unitsLabel(units)},&nbsp;
                {formatRange(unitSummary.areaRange)} {t("listings.squareFeet")}
                {floorSection}
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

export { UnitTables as default, UnitTables }
