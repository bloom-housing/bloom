/* import * as React from "react"
import { t } from "./translator"
import { UnitSummary, UnitsSummary } from "@bloom-housing/backend-core/types"

const getSummaryRow = (
  totalAvailable: number,
  rentRangeMin?: string,
  rentRangeMax?: string,
  rentAsPercentIncomeRangeMin?: string,
  rentAsPercentIncomeRangeMax?: string,
  unitTypeName?: string
) => {
  const getRent = (rentMin?: string, rentMax?: string, percent = false) => {
    const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
    if (rentMin == undefined && rentMax == undefined) {
      //TODO(#345): figure out what to display when there's no data
      return <strong>{t("t.call")}</strong>
    } else if (rentMin == rentMax || rentMax == undefined) {
      return (
        <>
          <strong>{`$${rentMin}`}</strong>
          {unit}
        </>
      )
    } else if (rentMin == undefined) {
      return (
        <>
          <strong>{`$${rentMax}`}</strong>
          {unit}
        </>
      )
    } else {
      return (
        <>
          <strong>{`$${rentMin}`}</strong> {t("t.to")} <strong>{`$${rentMax}`}</strong>
          {unit}
        </>
      )
    }
  }

  // Use rent as percent income if available, otherwise use exact rent
  const rent = rentAsPercentIncomeRangeMin
    ? getRent(rentAsPercentIncomeRangeMin, rentAsPercentIncomeRangeMax, true)
    : getRent(rentRangeMin, rentRangeMax)

  return {
    unitType: <strong>{t(`listings.unitTypes.${unitTypeName}`)}</strong>,
    rent: <>{rent}</>,
    availability: (
      <>
        {totalAvailable > 0 ? (
          <>
            <strong>{totalAvailable}</strong> {totalAvailable == 1 ? t("t.unit") : t("t.units")}
          </>
        ) : (
          <span className="uppercase">{t("listings.waitlist.label")}</span>
        )}
      </>
    ),
  }
}

export const getSummariesTableFromUnitSummary = (summaries: UnitSummary[]) => {
  let unitSummaries = [] as Record<string, React.ReactNode>[]

  if (summaries?.length > 0) {
    unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.totalAvailable ? unitSummary.totalAvailable : 0,
        unitSummary.rentRange.min,
        unitSummary.rentRange.max,
        unitSummary.rentAsPercentIncomeRange.min
          ? unitSummary.rentAsPercentIncomeRange.min.toString()
          : "",
        unitSummary.rentAsPercentIncomeRange.max
          ? unitSummary.rentAsPercentIncomeRange.max.toString()
          : "",
        unitSummary.unitType.name
      )
    })
  }
  return unitSummaries
}

export const getSummariesTableFromUnitsSummary = (summaries: UnitsSummary[]) => {
  let unitSummaries = [] as Record<string, React.ReactNode>[]

  if (summaries?.length > 0) {
    unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.totalAvailable ? unitSummary.totalAvailable : 0,
        unitSummary.monthlyRentMin?.toString(),
        unitSummary.monthlyRentMax?.toString(),
        unitSummary.monthlyRentAsPercentOfIncome,
        unitSummary.monthlyRentAsPercentOfIncome,
        unitSummary.unitType.name
      )
    })
  }
  return unitSummaries
}
 */

export {}
