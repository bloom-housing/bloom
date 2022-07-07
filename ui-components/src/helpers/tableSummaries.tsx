/* import * as React from "react"
import { t } from "./translator"
import { UnitSummary } from "@bloom-housing/backend-core/types"
import { StandardTableData } from "../tables/StandardTable"

export const unitSummariesTable = (summaries: UnitSummary[]): StandardTableData => {
  const unitSummaries = summaries?.map((unitSummary) => {
    const unitPluralization = unitSummary.totalAvailable == 1 ? t("t.unit") : t("t.units")
    const minIncome =
      unitSummary.minIncomeRange.min == unitSummary.minIncomeRange.max ? (
        <strong>{unitSummary.minIncomeRange.min}</strong>
      ) : (
        <>
          <strong>{unitSummary.minIncomeRange.min}</strong>
          {` ${t("t.to")} `}
          <strong>{unitSummary.minIncomeRange.max}</strong>
        </>
      )

    const getRent = (rentMin: string, rentMax: string, percent = false) => {
      const unit = percent ? `% ${t("t.income")}` : ` ${t("t.perMonth")}`
      return rentMin == rentMax ? (
        <>
          <strong>{rentMin}</strong>
          {unit}
        </>
      ) : (
        <>
          <strong>{rentMin}</strong>
          {` ${t("t.to")} `}
          <strong>{rentMax}</strong>
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

    return {
      unitType: {
        content: <strong>{t(`listings.unitTypes.${unitSummary.unitType?.name}`)}</strong>,
      },
      minimumIncome: {
        content: (
          <span>
            {minIncome}
            {` ${t("t.perMonth")}`}
          </span>
        ),
      },
      rent: { content: <span>{rent}</span> },
      availability: {
        content: (
          <span>
            {unitSummary.totalAvailable > 0 ? (
              <>
                <strong>{unitSummary.totalAvailable}</strong> {unitPluralization}
              </>
            ) : (
              <span className="uppercase">{t("listings.waitlist.label")}</span>
            )}
          </span>
        ),
      },
    }
  })

  return unitSummaries
}

export const getSummariesTable = (summaries: UnitSummary[]): StandardTableData => {
  let unitSummaries: StandardTableData = []

  if (summaries?.length > 0) {
    unitSummaries = unitSummariesTable(summaries)
  }
  return unitSummaries
}
 */

export {}
