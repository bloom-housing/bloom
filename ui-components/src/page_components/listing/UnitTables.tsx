import * as React from "react"
import { nanoid } from "nanoid"
import { MinMax, UnitGroupSummary, Unit } from "@bloom-housing/backend-core/types"

import { StandardTable } from "../../tables/StandardTable"
import { t } from "../../helpers/translator"
import { numberOrdinal } from "../../helpers/numberOrdinal"

const formatRange = (range: MinMax, ordinalize?: boolean) => {
  let min: string | number = range.min
  let max: string | number = range.max

  if (ordinalize) {
    min = numberOrdinal(min)
    max = numberOrdinal(max)
  }

  if (min == max) {
    return min
  } else {
    return `${min} - ${max}`
  }
}

const unitsLabel = (units: Unit[]): string => {
  const label = units.length > 1 ? t("t.units") : t("t.unit")
  return `${units.length} ${label}`
}

interface UnitTablesProps {
  units: Unit[]
  unitSummaries: UnitGroupSummary[]
  disableAccordion?: boolean
}

const UnitTables = (props: UnitTablesProps) => {
  /* const unitSummaries = props.unitSummaries || []

  const unitsHeaders = {
    number: "t.unit",
    sqFeet: "t.area",
    numBathrooms: "listings.bath",
    floor: "t.floor",
  }

  const toggleTable = (event: React.MouseEvent) => {
    if (!props.disableAccordion) {
      event.currentTarget.parentElement?.querySelector(".unit-table")?.classList?.toggle("hidden")
    }
  } */

  const buttonClasses = ["w-full", "text-left"]
  if (props.disableAccordion) buttonClasses.push("cursor-default")
  return null
  /* return (
    <>
      {unitSummaries.map((group: UnitGroupSummary) => {
        const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
        const units = group.unitTypes || []

        const formatted: Record<string, React.ReactNode> = {
          sqFeet: (
            <>
              <strong>{group.}</strong> {t("t.sqFeet")}
            </>
          ),
          numBathrooms: <strong>{unit.numBathrooms}</strong>,
          floor: <strong>{unit.floor}</strong>,
        }
        let floorSection
        units.forEach((unit: string) => {
          unitsFormatted.push({
            sqFeet: (
              <>
                <strong>{unit.sqFeet}</strong> {t("t.sqFeet")}
              </>
            ),
            numBathrooms: <strong>{unit.numBathrooms}</strong>,
            floor: <strong>{unit.floor}</strong>,
          })
        })

        let areaRangeSection
        if (unitSummary.rentRange) {
          areaRangeSection = `, ${unitSummary.rentRange} ${t("t.squareFeet")}`
        }

        // if (unitSummary.floorRange && unitSummary.floorRange.min) {
        //   floorSection = `, ${formatRange(unitSummary.floorRange, true)}
        //       ${
        //         unitSummary.floorRange.max > unitSummary.floorRange.min
        //           ? t("t.floors")
        //           : t("t.floor")
        //       }`
        // }

        return (
          <div key={uniqKey} className="mb-4">
            <button onClick={toggleTable} className={buttonClasses.join(" ")}>
              <h3 className="toggle-header">
                {<strong>{t("listings.unitTypes." + unitSummary.unitType.name)}</strong>:&nbsp;}
                {unitsLabel(units)}
                {areaRangeSection}
                {floorSection}
              </h3>
            </button>
            <div className="unit-table hidden">
              <StandardTable headers={unitsHeaders} data={unitsFormatted} />
            </div>
          </div>
        )
      })}
    </>
  ) */
}

export { UnitTables as default, UnitTables }