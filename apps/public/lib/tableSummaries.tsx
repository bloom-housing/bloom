import * as React from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/core/src/listings"

export const unitSummariesTable = (listing: Listing) => {
  const unitSummaries = listing.unitsSummarized.grouped.map(group => {
    const unitPluralization =
      group.unitSummary.totalAvailable == 1 ? t("listings.unit") : t("listings.units")
    return {
      unitType: <strong>{t("listings.unitTypes." + group.type)}</strong>,
      minimumIncome: (
        <>
          <strong>${group.unitSummary.minIncomeRange.min}</strong>/month
        </>
      ),
      rent: (
        <>
          <strong>${group.unitSummary.rentRange.min}</strong>/month
        </>
      ),
      availability: (
        <>
          {group.unitSummary.totalAvailable > 0 ? (
            <>
              <strong>{group.unitSummary.totalAvailable}</strong> {unitPluralization}
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
  const occupancyData = listing.unitsSummarized.grouped.map(group => {
    let occupancy = ""

    if (group.unitSummary.occupancyRange.max == null) {
      occupancy = `at least ${group.unitSummary.occupancyRange.min} ${
        group.unitSummary.occupancyRange.min == 1 ? t("listings.person") : t("listings.people")
      }`
    } else if (group.unitSummary.occupancyRange.max > 1) {
      occupancy = `${group.unitSummary.occupancyRange.min}-${
        group.unitSummary.occupancyRange.max
      } ${group.unitSummary.occupancyRange.max == 1 ? t("listings.person") : t("listings.people")}`
    } else {
      occupancy = `1 ${t("listings.person")}`
    }

    return {
      unitType: <strong>{t("listings.unitTypes." + group.type)}</strong>,
      occupancy: occupancy
    }
  })

  return occupancyData
}
