import * as React from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/ui-components/src/types"

export const unitSummariesTable = (listing: Listing) => {
  const unitSummaries = listing.unit_summaries.map(unitSummary => {
    const unitPluralization =
      unitSummary.total_available == 1 ? t("listings.unit") : t("listings.units")
    return {
      unitType: <strong>{unitSummary.unit_type}</strong>,
      minimumIncome: (
        <>
          <strong>${parseInt(unitSummary.min_income_range.min as string, 10)}</strong>/month
        </>
      ),
      rent: (
        <>
          <strong>${parseInt(unitSummary.rent_range.min as string, 10)}</strong>/month
        </>
      ),
      availability: (
        <>
          {unitSummary.total_available > 0 ? (
            <>
              <strong>{unitSummary.total_available}</strong> {unitPluralization}
            </>
          ) : (
            <>{t("listings.waitlist")}</>
          )}
        </>
      )
    }
  })

  return unitSummaries
}

export const occupancyTable = (listing: Listing) => {
  const occupancyData = listing.unit_summaries.map(unitSummary => {
    let occupancy = ""

    if (unitSummary.occupancy_range.max == null) {
      occupancy = `at least ${unitSummary.occupancy_range.min} ${
        unitSummary.occupancy_range.min == 1 ? t("listings.person") : t("listings.people")
      }`
    } else if (unitSummary.occupancy_range.max > 1) {
      occupancy = `${unitSummary.occupancy_range.min}-${unitSummary.occupancy_range.max} ${
        unitSummary.occupancy_range.max == 1 ? t("listings.person") : t("listings.people")
      }`
    } else {
      occupancy = `1 ${t("listings.person")}`
    }

    return {
      unitType: <strong>{unitSummary.unit_type}</strong>,
      occupancy: occupancy
    }
  })

  return occupancyData
}
