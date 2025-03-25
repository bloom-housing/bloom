import * as React from "react"
import {
  StandardTable,
  StandardTableData,
  t,
  getTranslationWithArguments,
  StackedTableRow,
} from "@bloom-housing/ui-components"
import { ContentAccordion } from "@bloom-housing/doorway-ui-components"
import { MinMax, ReviewOrderTypeEnum, Unit, UnitSummary } from "../types/backend-swagger"
import { numberOrdinal } from "../utilities/numberOrdinal"

const getTranslationFromCurrencyString = (value: string) => {
  if (value.startsWith("t.")) return getTranslationWithArguments(value)
  return value
}

export const unitsHeaders = {
  number: "t.unit",
  sqFeet: "t.area",
  numBathrooms: "listings.bath",
  floor: "t.floor",
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

export const getStackedUnitSummaryDetailsTable = (
  summaries: UnitSummary[],
  listingReviewOrder: ReviewOrderTypeEnum
) => {
  let rentNotAvailable = false
  const unitSummaries = summaries?.map((unitSummary) => {
    const unitPluralization =
      unitSummary.totalAvailable === 1 ? t("listings.vacantUnit") : t("listings.vacantUnits")
    const minIncome =
      unitSummary.minIncomeRange.min === unitSummary.minIncomeRange.max
        ? getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)
        : `${getTranslationFromCurrencyString(unitSummary.minIncomeRange.min)} ${t(
            "t.to"
          )} ${getTranslationFromCurrencyString(unitSummary.minIncomeRange.max)}`

    const getRent = (rentMin: string, rentMax: string, percent = false) => {
      const unit = percent ? t("t.ofIncome") : ""
      if (rentMin === "t.n/a") rentNotAvailable = true
      return rentMin === rentMax
        ? `${getTranslationFromCurrencyString(rentMin)}${rentMin !== "t.n/a" ? unit : ""}`
        : `${getTranslationFromCurrencyString(rentMin)}
          ${` ${t("t.to")} `}
          ${getTranslationFromCurrencyString(rentMax)}
          ${unit}`
    }

    // Use rent as percent income if available, otherwise use exact rent
    const rent = unitSummary.rentAsPercentIncomeRange.min
      ? getRent(
          unitSummary.rentAsPercentIncomeRange.min.toString(),
          unitSummary.rentAsPercentIncomeRange.max.toString(),
          true
        )
      : getRent(unitSummary.rentRange.min, unitSummary.rentRange.max)

    let availability = ""
    if (listingReviewOrder !== ReviewOrderTypeEnum.waitlist) {
      availability =
        unitSummary.totalAvailable > 0
          ? `${unitSummary.totalAvailable} ${unitPluralization}`
          : t("listings.waitlist.open")
    } else if (listingReviewOrder === ReviewOrderTypeEnum.waitlist) {
      availability = t("listings.waitlist.open")
    }

    return {
      unitType: {
        cellText: t(`listings.unitTypes.${unitSummary.unitTypes?.name}`),
      },
      minimumIncome: {
        cellText: minIncome,
        cellSubText: unitSummary.minIncomeRange.min !== "t.n/a" ? t("t.perMonth") : "",
      },
      rent: {
        cellText: rent,
        cellSubText: rentNotAvailable ? "" : t("t.perMonth"),
      },
      availability: {
        cellText: availability,
      },
    }
  })

  return unitSummaries
}

type StackedSummary = {
  minDollarRent: number | null
  maxDollarRent: number | null
  minPercentageRent: number | null
  maxPercentageRent: number | null
  minIncome: number | null
  maxIncome: number | null
  minUnitType: number | null
  maxUnitType: number | null
  minUnitName: string | null
  maxUnitName: string | null
}

// Replace an old value with a new one if the new one exceeds the defined limit (either less or more) and is valid
export const replaceIfExceeds = (less: boolean, current: number | null, updated: number | null) => {
  const isValid = (test: number | null) => {
    return test !== null && !isNaN(test)
  }
  if (!isValid(current) && isValid(updated)) {
    return updated
  }
  if (!isValid(updated) && isValid(current)) {
    return current
  }
  if (isValid(current) && isValid(updated) && current !== null && updated !== null) {
    if (less) {
      return updated < current ? updated : current
    } else {
      return updated > current ? updated : current
    }
  }
  return null
}

// Massage the data in an array of unit summaries to calculate the min and max values of each data point across the full set
// This is essentially a new type of unit summary. We should move this to the backend when we rewrite summaries.
export const mergeSummaryRows = (summaries: UnitSummary[]): StackedSummary => {
  return summaries
    .sort((summaryA, summaryB) => summaryA.unitTypes.numBedrooms - summaryB.unitTypes.numBedrooms)
    .reduce(
      (acc, curr) => {
        const updatedMinUnitType = replaceIfExceeds(
          true,
          acc.minUnitType,
          curr.unitTypes.numBedrooms
        )
        const updatedMaxUnitType = replaceIfExceeds(
          false,
          acc.maxUnitType,
          curr.unitTypes.numBedrooms
        )

        return {
          minDollarRent: replaceIfExceeds(
            true,
            acc.minDollarRent,
            parseInt(curr.rentRange.min?.replace(/[$,]+/g, ""))
          ),
          maxDollarRent: replaceIfExceeds(
            false,
            acc.maxDollarRent,
            parseInt(curr.rentRange.max?.replace(/[$,]+/g, ""))
          ),
          minPercentageRent: replaceIfExceeds(
            true,
            acc.minPercentageRent,
            curr.rentAsPercentIncomeRange.min
          ),
          maxPercentageRent: replaceIfExceeds(
            false,
            acc.maxPercentageRent,
            curr.rentAsPercentIncomeRange.max
          ),
          minIncome: replaceIfExceeds(
            true,
            acc.minIncome,
            parseInt(curr.minIncomeRange.min?.replace(/[$,]+/g, ""))
          ),
          maxIncome: replaceIfExceeds(
            false,
            acc.maxIncome,
            parseInt(curr.minIncomeRange.max?.replace(/[$,]+/g, ""))
          ),
          minUnitType: replaceIfExceeds(true, acc.minUnitType, curr.unitTypes.numBedrooms),
          maxUnitType: replaceIfExceeds(false, acc.maxUnitType, curr.unitTypes.numBedrooms),
          minUnitName:
            updatedMinUnitType !== acc.minUnitType ? curr.unitTypes.name : acc.minUnitName,
          maxUnitName:
            updatedMaxUnitType !== acc.maxUnitType ? curr.unitTypes.name : acc.maxUnitName,
        }
      },
      {
        minDollarRent: null,
        maxDollarRent: null,
        minPercentageRent: null,
        maxPercentageRent: null,
        minIncome: null,
        maxIncome: null,
        minUnitType: null,
        maxUnitType: null,
        minUnitName: null,
        maxUnitName: null,
      }
    )
}

export const stackedUnitSummariesTable = (
  summaries: UnitSummary[]
): Record<string, StackedTableRow>[] => {
  const ranges = mergeSummaryRows(summaries)

  const getUnitText = (ranges: StackedSummary) => {
    if (ranges.minUnitType === ranges.maxUnitType)
      return t(`listings.unitTypes.${ranges.minUnitName}`)
    return `${t(`listings.unitTypes.${ranges.minUnitName}`)} - ${t(
      `listings.unitTypes.${ranges.maxUnitName}`
    )}`
  }
  const getIncomeText = (ranges: StackedSummary) => {
    if (ranges.minIncome === null || ranges.maxIncome === null) return t("t.n/a")
    if (ranges.minIncome === ranges.maxIncome) return `$${ranges.minIncome.toLocaleString()}`
    return `$${ranges.minIncome.toLocaleString()} ${t(
      "t.to"
    )} $${ranges.maxIncome.toLocaleString()}`
  }
  const getRentText = (ranges: StackedSummary) => {
    const hasPercentUnits = ranges.minPercentageRent !== null && ranges.maxPercentageRent !== null
    const hasCurrencyUnits = ranges.minDollarRent !== null && ranges.maxDollarRent !== null

    // If a listing has mixed rent type units, show more generic information
    if (hasPercentUnits && hasCurrencyUnits) {
      return `${t("t.ofIncome")}, ${t("t.orUpTo")} $${ranges.maxDollarRent?.toLocaleString()}`
    }

    // Otherwise show more specific ranges
    if (hasPercentUnits && !hasCurrencyUnits) {
      if (ranges.minPercentageRent === ranges.maxPercentageRent) {
        return t("t.numOfIncome", { num: ranges.minPercentageRent })
      } else {
        return t("t.rangeOfIncome", {
          min: ranges.minPercentageRent,
          max: ranges.maxPercentageRent,
        })
      }
    }

    if (!hasPercentUnits && hasCurrencyUnits) {
      if (ranges.minDollarRent !== null && ranges.maxDollarRent !== null) {
        if (ranges.minDollarRent === ranges.maxDollarRent) {
          return `$${ranges.minDollarRent.toLocaleString()}`
        } else {
          return `$${ranges.minDollarRent.toLocaleString()} ${t(
            "t.to"
          )} $${ranges.maxDollarRent.toLocaleString()}`
        }
      }
    }

    return t("t.n/a")
  }

  const rowData = {
    unitType: {
      cellText: getUnitText(ranges),
      cellSubText: "",
    },
    minimumIncome: {
      cellText: getIncomeText(ranges),
      cellSubText: getIncomeText(ranges) !== t("t.n/a") ? t("t.perMonth") : "",
    },
    rent: {
      cellText: getRentText(ranges),
      cellSubText: getRentText(ranges) !== t("t.n/a") ? t("t.perMonth") : "",
    },
  }

  return [rowData]
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

export const getStackedSummariesTable = (
  summaries: UnitSummary[]
): Record<string, StackedTableRow>[] => {
  let unitSummaries: Record<string, StackedTableRow>[] = []

  if (summaries?.length > 0) {
    unitSummaries = stackedUnitSummariesTable(summaries)
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

export const getUnitTableData = (units: Unit[], unitSummary: UnitSummary) => {
  const availableUnits = units.filter(
    (unit: Unit) => unit.unitTypes?.name == unitSummary.unitTypes.name
  )

  let floorSection: React.ReactNode
  const unitsFormatted = availableUnits.map((unit: Unit) => {
    return {
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
      numBathrooms: {
        content: (
          <strong>
            {unit.numBathrooms === 0 ? t("listings.unit.sharedBathroom") : unit.numBathrooms}
          </strong>
        ),
      },
      floor: { content: <strong>{unit.floor}</strong> },
    }
  })

  let areaRangeSection: React.ReactNode
  if (unitSummary.areaRange?.min || unitSummary.areaRange?.max) {
    areaRangeSection = `, ${formatRange(unitSummary.areaRange)} ${t("t.squareFeet")}`
  }

  if (unitSummary.floorRange && unitSummary.floorRange.min) {
    floorSection = `, ${formatRange(unitSummary.floorRange, true)} 
        ${unitSummary.floorRange.max > unitSummary.floorRange.min ? t("t.floors") : t("t.floor")}`
  }

  const barContent = (
    <div className={"toggle-header-content"}>
      <strong>{t("listings.unitTypes." + unitSummary.unitTypes.name)}</strong>:&nbsp;
      {unitsLabel(availableUnits)}
      {areaRangeSection}
      {floorSection}
    </div>
  )

  return {
    availableUnits,
    areaRangeSection,
    floorSection,
    unitsFormatted,
    barContent,
  }
}

export const getStackedUnitTableData = (units: Unit[], unitSummary: UnitSummary) => {
  const availableUnits = units.filter(
    (unit: Unit) => unit.unitTypes?.name == unitSummary.unitTypes.name
  )

  let floorSection: React.ReactNode
  const unitsFormatted = availableUnits.map((unit: Unit) => {
    return {
      number: { cellText: unit.number ? unit.number : "" },
      sqFeet: {
        cellText: unit.sqFeet ? `${unit.sqFeet} ${t("t.sqFeet")}` : "",
      },
      numBathrooms: {
        cellText:
          unit.numBathrooms === 0
            ? t("listings.unit.sharedBathroom")
            : unit.numBathrooms
            ? unit.numBathrooms.toString()
            : "",
      },
      floor: { cellText: unit.floor ? unit.floor.toString() : "" },
    }
  })

  let areaRangeSection: React.ReactNode
  if (unitSummary.areaRange?.min || unitSummary.areaRange?.max) {
    areaRangeSection = `, ${formatRange(unitSummary.areaRange)} ${t("t.squareFeet")}`
  }

  if (unitSummary.floorRange && unitSummary.floorRange.min) {
    floorSection = `, ${formatRange(unitSummary.floorRange, true)} 
          ${unitSummary.floorRange.max > unitSummary.floorRange.min ? t("t.floors") : t("t.floor")}`
  }

  const barContent = (
    <div className={"toggle-header-content"}>
      <strong>{t("listings.unitTypes." + unitSummary.unitTypes.name)}</strong>:&nbsp;
      {unitsLabel(availableUnits)}
      {areaRangeSection}
      {floorSection}
    </div>
  )

  return {
    availableUnits,
    areaRangeSection,
    floorSection,
    unitsFormatted,
    barContent,
  }
}

export const UnitTables = (props: UnitTablesProps) => {
  const unitSummaries = props.unitSummaries || []

  return (
    <>
      {unitSummaries.map((unitSummary: UnitSummary, index) => {
        // TODO: remove this commented out code
        // <<<<<<< HEAD
        //         const units = props.units.filter(
        //           (unit: Unit) => unit.unitTypes?.name == unitSummary.unitTypes.name
        //         )
        //         const unitsFormatted = [] as StandardTableData
        //         let floorSection: React.ReactNode
        //         units.forEach((unit: Unit) => {
        //           unitsFormatted.push({
        //             number: { content: unit.number },
        //             sqFeet: {
        //               content: (
        //                 <>
        //                   {unit.sqFeet ? (
        //                     <>
        //                       {parseInt(unit.sqFeet)} {t("t.sqFeet")}
        //                     </>
        //                   ) : (
        //                     <></>
        //                   )}
        //                 </>
        //               ),
        //             },
        //             numBathrooms: {
        //               content:
        //                 unit.numBathrooms === 0 ? t("listings.unit.sharedBathroom") : unit.numBathrooms,
        //             },
        //             floor: { content: unit.floor },
        //           })
        //         })

        //         let areaRangeSection: React.ReactNode
        //         if (unitSummary.areaRange?.min || unitSummary.areaRange?.max) {
        //           areaRangeSection = `, ${formatRange(unitSummary.areaRange)} ${t("t.squareFeet")}`
        //         }

        //         if (unitSummary.floorRange && unitSummary.floorRange.min) {
        //           floorSection = `, ${formatRange(unitSummary.floorRange, true)}
        //               ${
        //                 unitSummary.floorRange.max > unitSummary.floorRange.min
        //                   ? t("t.floors")
        //                   : t("t.floor")
        //               }`
        //         }

        //         const getBarContent = () => {
        //           return (
        //             <h3 className={"toggle-header-content"}>
        //               {t("listings.unitTypes." + unitSummary.unitTypes.name)}:&nbsp;
        //               {unitsLabel(units)}
        //               {areaRangeSection}
        //               {floorSection}
        //             </h3>
        //           )
        //         }
        // =======
        const results = getUnitTableData(props.units, unitSummary)

        const getExpandableContent = () => {
          return (
            <div className="unit-table">
              <StandardTable
                className="table-container"
                headers={unitsHeaders}
                data={results.unitsFormatted}
              />
            </div>
          )
        }

        return (
          <ContentAccordion
            customBarContent={results.barContent}
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
