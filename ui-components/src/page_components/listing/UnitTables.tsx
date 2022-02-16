import React, { useState } from "react"
import { nanoid } from "nanoid"
import { MinMax, UnitSummary, Unit } from "@bloom-housing/backend-core/types"

import { StandardTable } from "../../tables/StandardTable"
import { t } from "../../helpers/translator"
import { numberOrdinal } from "../../helpers/numberOrdinal"
import { Icon, IconFillColors } from "../../icons/Icon"

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
  unitSummaries: UnitSummary[]
  disableAccordion?: boolean
}

const UnitTables = (props: UnitTablesProps) => {
  const [accordionOpen, setAccordionOpen] = useState(false)
  const unitSummaries = props.unitSummaries || []

  const unitsHeaders = {
    number: "t.unit",
    sqFeet: "t.area",
    numBathrooms: "listings.bath",
    floor: "t.floor",
  }

  const toggleTable = () => {
    if (!props.disableAccordion) {
      setAccordionOpen(!accordionOpen)
    }
  }

  const buttonClasses = ["w-full", "text-left"]
  if (props.disableAccordion) buttonClasses.push("cursor-default")

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary) => {
        const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
        const units = props.units.filter(
          (unit: Unit) => unit.unitType?.name == unitSummary.unitType.name
        )
        const unitsFormatted = [] as Array<Record<string, React.ReactNode>>
        let floorSection
        units.forEach((unit: Unit) => {
          unitsFormatted.push({
            number: unit.number,
            sqFeet: (
              <>
                {unit.sqFeet ? (
                  <>
                    <strong>{parseInt(unit.sqFeet)}</strong> {t("t.sqFeet")}
                  </>
                ) : (
                  <></>
                )}
              </>
            ),
            numBathrooms: <strong>{unit.numBathrooms}</strong>,
            floor: <strong>{unit.floor}</strong>,
          })
        })

        let areaRangeSection
        if (unitSummary.areaRange?.min || unitSummary.areaRange?.max) {
          areaRangeSection = `, ${formatRange(unitSummary.areaRange)} ${t("t.squareFeet")}`
        }

        if (unitSummary.floorRange && unitSummary.floorRange.min) {
          floorSection = `, ${formatRange(unitSummary.floorRange, true)} 
              ${
                unitSummary.floorRange.max > unitSummary.floorRange.min
                  ? t("t.floors")
                  : t("t.floor")
              }`
        }

        return (
          <div key={uniqKey} className="mb-4">
            <button onClick={toggleTable} className={buttonClasses.join(" ")}>
              <div className={`toggle-header ${!props.disableAccordion && "pb-3"}`}>
                <h3 className={"toggle-header-content"}>
                  <strong>{t("listings.unitTypes." + unitSummary.unitType.name)}</strong>:&nbsp;
                  {unitsLabel(units)}
                  {areaRangeSection}
                  {floorSection}
                </h3>
                {!props.disableAccordion && (
                  <>
                    {accordionOpen ? (
                      <Icon
                        symbol={"closeSmall"}
                        size={"base"}
                        fill={IconFillColors.primary}
                        dataTestId={"unit-table-accordion-close"}
                      />
                    ) : (
                      <Icon
                        symbol={"arrowDown"}
                        size={"base"}
                        fill={IconFillColors.primary}
                        dataTestId={"unit-table-accordion-open"}
                      />
                    )}
                  </>
                )}
              </div>
            </button>
            {accordionOpen && (
              <div className="unit-table">
                <StandardTable headers={unitsHeaders} data={unitsFormatted} />
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export { UnitTables as default, UnitTables }
