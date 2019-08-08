import * as React from 'react'

export const unitSummariesTable = (listing): Array<Object> => {
  const unitSummaries = listing.unit_summaries.general.map(unitSummary => {
    return {
      unit_type: <strong>{unitSummary.unit_type}</strong>,
      minimum_income: <><strong>${parseInt(unitSummary.min_income_range.min, 10)}</strong>/month</>,
      rent: <><strong>${parseInt(unitSummary.rent_range.min, 10)}</strong>/month</>,
      availability: <><strong>1</strong> unit</>
    }
  })

  return unitSummaries
}