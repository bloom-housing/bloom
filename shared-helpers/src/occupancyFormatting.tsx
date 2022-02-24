import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"

export const occupancyTable = (listing: Listing) => {
  let occupancyData = [] as any
  if (listing.unitsSummarized && listing.unitsSummarized.byUnitType) {
    occupancyData = listing.unitsSummarized.byUnitType.map((unitSummary) => {
      let occupancy = ""

      if (unitSummary.occupancyRange.max == null) {
        occupancy = `at least ${unitSummary.occupancyRange.min} ${
          unitSummary.occupancyRange.min == 1 ? t("t.person") : t("t.people")
        }`
      } else if (unitSummary.occupancyRange.max > 1) {
        occupancy = `${unitSummary.occupancyRange.min}-${unitSummary.occupancyRange.max} ${
          unitSummary.occupancyRange.max == 1 ? t("t.person") : t("t.people")
        }`
      } else {
        occupancy = `1 ${t("t.person")}`
      }

      return {
        unitType: <strong>{t("listings.unitTypes." + unitSummary.unitType.name)}</strong>,
        occupancy: occupancy,
      }
    })
  }

  return occupancyData
}

export const getOccupancyDescription = (listing: Listing) => {
  const unitsSummarized = listing.unitsSummarized
  if (
    unitsSummarized &&
    unitsSummarized.unitTypes &&
    unitsSummarized.unitTypes.map((unitType) => unitType.name).includes("SRO")
  ) {
    return unitsSummarized.unitTypes.length == 1
      ? t("listings.occupancyDescriptionAllSro")
      : t("listings.occupancyDescriptionSomeSro")
  } else {
    return t("listings.occupancyDescriptionNoSro")
  }
}
