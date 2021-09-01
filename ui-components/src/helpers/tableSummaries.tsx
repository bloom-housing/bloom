import * as React from "react"
import { t } from "./translator"
import { UnitSummary, UnitsSummary } from "@bloom-housing/backend-core/types"
import { GroupedTableGroup } from "../tables/GroupedTable"

export const getSummaryRow = (
  totalAvailable: number,
  totalCount: number,
  minIncomeRangeMin?: string,
  minIncomeRangeMax?: string,
  rentRangeMin?: string,
  rentRangeMax?: string,
  rentAsPercentIncomeRangeMin?: string,
  rentAsPercentIncomeRangeMax?: string,
  unitTypeName?: string
) => {
  let minIncome = <></>
  if (minIncomeRangeMin == undefined && minIncomeRangeMax == undefined) {
    //TODO(#345): figure out what to display when there's no data
    minIncome = <strong>{t("t.call")}</strong>
  } else if (minIncomeRangeMin == minIncomeRangeMax || minIncomeRangeMax == undefined) {
    minIncome = (
      <>
        <strong>{minIncomeRangeMin}</strong>
        {t("t.perMonth")}
      </>
    )
  } else if (minIncomeRangeMin == undefined) {
    minIncome = (
      <>
        <strong>{minIncomeRangeMax}</strong>
        {t("t.perMonth")}
      </>
    )
  } else {
    minIncome = (
      <>
        <strong>{minIncomeRangeMin}</strong> {t("t.to")} <strong>{minIncomeRangeMax}</strong>
        {t("t.perMonth")}
      </>
    )
  }

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
    minimumIncome: <>{minIncome}</>,
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
    totalCount: (
      <>
        <strong>{totalCount}</strong> {totalCount == 1 ? t("t.unit") : t("t.units")}
      </>
    ),
  }
}

export const getSummariesTableFromUnitSummary = (summaries: UnitSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.totalAvailable ? unitSummary.totalAvailable : 0,
        unitSummary.totalCount ? unitSummary.totalCount : 0,
        unitSummary.minIncomeRange.min,
        unitSummary.minIncomeRange.max,
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
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}

export const getSummariesTableFromUnitsSummary = (summaries: UnitsSummary[]) => {
  let groupedUnits = [] as Array<GroupedTableGroup>

  if (summaries?.length > 0) {
    const unitSummaries = summaries.map((unitSummary) => {
      return getSummaryRow(
        unitSummary.totalAvailable ? unitSummary.totalAvailable : 0,
        unitSummary.totalCount ? unitSummary.totalCount : 0,
        unitSummary.minimumIncomeMin,
        unitSummary.minimumIncomeMax,
        unitSummary.monthlyRentMin?.toString(),
        unitSummary.monthlyRentMax?.toString(),
        unitSummary.monthlyRentAsPercentOfIncome,
        unitSummary.monthlyRentAsPercentOfIncome,
        unitSummary.unitType.name
      )
    })
    groupedUnits = [
      {
        data: unitSummaries,
      },
    ]
  }
  return groupedUnits
}
