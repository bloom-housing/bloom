import * as React from "react"
import {
  StandardTable,
  StandardTableData,
  t,
  getTranslationWithArguments,
} from "@bloom-housing/ui-components"
import { ContentAccordion } from "@bloom-housing/doorway-ui-components"
import { MinMax, ReviewOrderTypeEnum, Unit, UnitSummary } from "../types/backend-swagger"
import { numberOrdinal } from "../utilities/numberOrdinal"

const getTranslationFromCurrencyString = (value: string) => {
  if (value.startsWith("t.")) return getTranslationWithArguments(value)
  return value
}

export const unitSummariesTable = (
  summaries: UnitSummary[],
  listingReviewOrder: ReviewOrderTypeEnum,
  includeRentandMinimumIncome = true
): StandardTableData => {
  const unitSummaries = summaries?.map((unitSummary) => {
    const unitPluralization =
      unitSummary.totalAvailable == 1 ? t("listings.vacantUnit") : t("listings.vacantUnits")
    let minIncome = null
    if (includeRentandMinimumIncome) {
      minIncome =
        unitSummary.minIncomeRange.min == unitSummary.minIncomeRange.max ? (
          <>
            {getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)}
            {unitSummary.minIncomeRange.min !== "t.n/a" && ` ${t("t.perMonth")}`}
          </>
        ) : (
          <>
            {getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)}
            {` ${t("t.to")} `}
            {getTranslationFromCurrencyString(unitSummary.minIncomeRange.max)}
            {` ${t("t.perMonth")}`}
          </>
        )
    }
    const getRent = (rentMin: string, rentMax: string, percent = false) => {
      const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
      return rentMin == rentMax ? (
        <>
          {getTranslationFromCurrencyString(rentMin)}
          {rentMin !== "t.n/a" && unit}
        </>
      ) : (
        <>
          {getTranslationFromCurrencyString(rentMin)}
          {` ${t("t.to")} `}
          {getTranslationFromCurrencyString(rentMax)}
          {unit}
        </>
      )
    }

    // Use rent as percent income if available, otherwise use exact rent
    const rent = unitSummary.rentAsPercentIncomeRange.min
      ? getRent(
          unitSummary.rentAsPercentIncomeRange.min.toString(),
          unitSummary.rentAsPercentIncomeRange.max.toString(),
          true
        )
      : getRent(unitSummary.rentRange.min, unitSummary.rentRange.max)

    let availability = null
    if (includeRentandMinimumIncome) {
      if (listingReviewOrder !== ReviewOrderTypeEnum.waitlist) {
        availability = (
          <span>
            {unitSummary.totalAvailable > 0 ? (
              <>
                {unitSummary.totalAvailable} {unitPluralization}
              </>
            ) : (
              <span>{t("listings.waitlist.open")}</span>
            )}
          </span>
        )
      } else if (listingReviewOrder === ReviewOrderTypeEnum.waitlist) {
        availability = <span>{t("listings.waitlist.open")}</span>
      }
    }
    return {
      unitType: {
        content: t(`listings.unitTypes.${unitSummary.unitTypes?.name}`),
      },
      minimumIncome: {
        content: <span>{minIncome}</span>,
      },
      rent: { content: <span>{rent}</span> },
      availability: {
        content: availability,
      },
    }
  })

  return unitSummaries
}

export const getSummariesTable = (
  summaries: UnitSummary[],
  listingReviewOrder: ReviewOrderTypeEnum,
  includeRentandMinimumIncome = true
): StandardTableData => {
  let unitSummaries: StandardTableData = []

  if (summaries?.length > 0) {
    unitSummaries = unitSummariesTable(summaries, listingReviewOrder, includeRentandMinimumIncome)
  }
  return unitSummaries
}

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

export const UnitTables = (props: UnitTablesProps) => {
  const unitSummaries = props.unitSummaries || []

  const unitsHeaders = {
    number: "t.unit",
    sqFeet: "t.area",
    numBathrooms: "listings.bath",
    floor: "t.floor",
  }

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary, index) => {
        const units = props.units.filter(
          (unit: Unit) => unit.unitTypes?.name == unitSummary.unitTypes.name
        )
        const unitsFormatted = [] as StandardTableData
        let floorSection: React.ReactNode
        units.forEach((unit: Unit) => {
          unitsFormatted.push({
            number: { content: unit.number },
            sqFeet: {
              content: (
                <>
                  {unit.sqFeet ? (
                    <>
                      {parseInt(unit.sqFeet)} {t("t.sqFeet")}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
            numBathrooms: {
              content:
                unit.numBathrooms === 0 ? t("listings.unit.sharedBathroom") : unit.numBathrooms,
            },
            floor: { content: unit.floor },
          })
        })

        let areaRangeSection: React.ReactNode
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

        const getBarContent = () => {
          return (
            <h3 className={"toggle-header-content"}>
              {t("listings.unitTypes." + unitSummary.unitTypes.name)}:&nbsp;
              {unitsLabel(units)}
              {areaRangeSection}
              {floorSection}
            </h3>
          )
        }

        const getExpandableContent = () => {
          return (
            <div className="unit-table">
              <StandardTable
                className="table-container"
                headers={unitsHeaders}
                data={unitsFormatted}
              />
            </div>
          )
        }

        return (
          <ContentAccordion
            customBarContent={getBarContent()}
            customExpandedContent={getExpandableContent()}
            disableAccordion={props.disableAccordion}
            accordionTheme={"blue"}
            key={index}
          />
        )
      })}
    </>
  )
}
