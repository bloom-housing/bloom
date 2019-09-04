import * as React from "react"

export const unitSummariesTable = (listing: Record<string, any>) => {
  const unitSummaries = listing.unit_summaries.general.map(unitSummary => {
    return {
      unitType: <strong>{unitSummary.unit_type}</strong>,
      minimumIncome: (
        <>
          <strong>${parseInt(unitSummary.min_income_range.min, 10)}</strong>/month
        </>
      ),
      rent: (
        <>
          <strong>${parseInt(unitSummary.rent_range.min, 10)}</strong>/month
        </>
      ),
      availability: (
        <>
          <strong>1</strong> unit
        </>
      )
    }
  })

  return unitSummaries
}
