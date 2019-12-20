import * as React from "react"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import { Listing } from "@bloom-housing/core/src/listings"
import { UnitSummary } from "@bloom-housing/core/src/units"

export const unitSummariesTable = (summaries: UnitSummary[]) => {
  const unitSummaries = summaries.map(unitSummary => {
    const unitPluralization =
      unitSummary.totalAvailable == 1 ? t("listings.unit") : t("listings.units")
    return {
      unitType: <strong>{t("listings.unitTypes." + unitSummary.unitType)}</strong>,
      minimumIncome: (
        <>
          <strong>{unitSummary.minIncomeRange.min}</strong>/month
        </>
      ),
      rent: (
        <>
          <strong>{unitSummary.rentRange.min}</strong>/month
        </>
      ),
      availability: (
        <>
          {unitSummary.totalAvailable > 0 ? (
            <>
              <strong>{unitSummary.totalAvailable}</strong> {unitPluralization}
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
  const occupancyData = listing.unitsSummarized.byUnitType.map(unitSummary => {
    let occupancy = ""

    if (unitSummary.occupancyRange.max == null) {
      occupancy = `at least ${unitSummary.occupancyRange.min} ${
        unitSummary.occupancyRange.min == 1 ? t("listings.person") : t("listings.people")
      }`
    } else if (unitSummary.occupancyRange.max > 1) {
      occupancy = `${unitSummary.occupancyRange.min}-${unitSummary.occupancyRange.max} ${
        unitSummary.occupancyRange.max == 1 ? t("listings.person") : t("listings.people")
      }`
    } else {
      occupancy = `1 ${t("listings.person")}`
    }

    return {
      unitType: <strong>{t("listings.unitTypes." + unitSummary.unitType)}</strong>,
      occupancy: occupancy
    }
  })

  return occupancyData
}
