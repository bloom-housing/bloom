import * as React from "react"
import t from "./translator"
import { Listing } from "@bloom-housing/core"

export const occupancyTable = (listing: Listing) => {
  let occupancyData = [] as any

  if (listing.unitsSummarized) {
    occupancyData = listing.unitsSummarized.byUnitType.map((unitSummary) => {
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
        occupancy: occupancy,
      }
    })
  }

  return occupancyData
}

export const getOccupancyDescription = (listing: Listing) => {
  const unitsSummarized = listing.unitsSummarized
  if (unitsSummarized && unitsSummarized.unitTypes.includes("SRO")) {
    return unitsSummarized.unitTypes.length == 1
      ? t("listings.occupancyDescriptionAllSro")
      : t("listings.occupancyDescriptionSomeSro")
  } else {
    return t("listings.occupancyDescriptionNoSro")
  }
}
