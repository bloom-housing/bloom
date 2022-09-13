import * as React from "react"
import {
  StandardTable,
  StandardTableData,
  t,
  numberOrdinal,
  ContentAccordion,
  getTranslationWithArguments,
} from "@bloom-housing/ui-components"
import { MinMax, UnitSummary, Unit, ListingAvailability } from "@bloom-housing/backend-core/types"

const getTranslationFromCurrencyString = (value: string) => {
  if (value.startsWith("t.")) return getTranslationWithArguments(value)
  return value
}

export const unitSummariesTable = (
  summaries: UnitSummary[],
  listingAvailability: ListingAvailability
): StandardTableData => {
  const unitSummaries = summaries?.map((unitSummary) => {
    const unitPluralization = unitSummary.totalAvailable == 1 ? t("t.unit") : t("t.units")
    const minIncome =
      unitSummary.minIncomeRange.min == unitSummary.minIncomeRange.max ? (
        <>
          <strong>{getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)}</strong>
          {unitSummary.minIncomeRange.min !== "t.n/a" && ` ${t("t.perMonth")}`}
        </>
      ) : (
        <>
          <strong>{getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)}</strong>
          {` ${t("t.to")} `}
          <strong>{getTranslationFromCurrencyString(unitSummary.minIncomeRange.max)}</strong>
          {` ${t("t.perMonth")}`}
        </>
      )

    const getRent = (rentMin: string, rentMax: string, percent = false) => {
      const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
      return rentMin == rentMax ? (
        <>
          <strong>{getTranslationFromCurrencyString(rentMin)}</strong>
          {rentMin !== "t.n/a" && unit}
        </>
      ) : (
        <>
          <strong>{getTranslationFromCurrencyString(rentMin)}</strong>
          {` ${t("t.to")} `}
          <strong>{getTranslationFromCurrencyString(rentMax)}</strong>
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
    if (listingAvailability === ListingAvailability.availableUnits) {
      availability = (
        <span>
          {unitSummary.totalAvailable > 0 ? (
            <>
              <strong>{unitSummary.totalAvailable}</strong> {unitPluralization}
            </>
          ) : (
            <span>
              <strong>{t("listings.waitlist.open")}</strong>
            </span>
          )}
        </span>
      )
    } else if (listingAvailability === ListingAvailability.openWaitlist) {
      availability = (
        <span>
          <strong>{t("listings.waitlist.open")}</strong>
        </span>
      )
    }

    return {
      unitType: {
        content: <strong>{t(`listings.unitTypes.${unitSummary.unitType?.name}`)}</strong>,
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
  listingAvailability: ListingAvailability
): StandardTableData => {
  let unitSummaries: StandardTableData = []

  if (summaries?.length > 0) {
    unitSummaries = unitSummariesTable(summaries, listingAvailability)
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
          (unit: Unit) => unit.unitType?.name == unitSummary.unitType.name
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
                      <strong>{parseInt(unit.sqFeet)}</strong> {t("t.sqFeet")}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
            numBathrooms: { content: <strong>{unit.numBathrooms}</strong> },
            floor: { content: <strong>{unit.floor}</strong> },
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
              <strong>{t("listings.unitTypes." + unitSummary.unitType.name)}</strong>:&nbsp;
              {unitsLabel(units)}
              {areaRangeSection}
              {floorSection}
            </h3>
          )
        }

        const getExpandableContent = () => {
          return (
            <div className="unit-table">
              <StandardTable headers={unitsHeaders} data={unitsFormatted} />
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
