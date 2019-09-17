import * as React from "react"
import t from "@bloom/ui-components/src/helpers/translator"

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

export const occupancyTable = (listing: Record<string, any>) => {
  const occupancyData = listing.unit_summaries.general.map(unitSummary => {
    let occupancy = ""
    if (unitSummary.occupancy_range.max == 1) {
      occupancy = "1"
    } else if (unitSummary.occupancy_range.max == null) {
      occupancy = `at least ${unitSummary.occupancy_range.min}`
    } else {
      occupancy = `${unitSummary.occupancy_range.min}-${unitSummary.occupancy_range.max}`
    }

    const numberOfPeople = unitSummary.occupancy_range.max || unitSummary.occupancy_range.min
    if (numberOfPeople == 1) {
      occupancy += " " + t("listings.person")
    } else {
      occupancy += " " + t("listings.people")
    }

    return {
      unitType: <strong>{unitSummary.unit_type}</strong>,
      occupancy: occupancy
    }
  })

  return occupancyData
}
