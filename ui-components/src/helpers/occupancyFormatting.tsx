import * as React from "react"
import { t } from "./translator"
import { Listing } from "@bloom-housing/backend-core/types"

type OccupancyData = {
  max: number
  min: number
  unitType: string
}

export const occupancyTable = (listing: Listing) => {
  let occupancyData = [] as any
  if (listing.property.unitsSummarized) {
    const uniqueOccupancyArray: OccupancyData[] = []
    // Massage multiple unit rows into one occupany row with an encompassing range
    listing.property.unitsSummarized.byUnitType.forEach((data) => {
      const thisEntry = {
        max: data.occupancyRange.max,
        min: data.occupancyRange.min,
        unitType: data.unitType,
      }
      const lastEntry =
        uniqueOccupancyArray.length >= 1
          ? uniqueOccupancyArray[uniqueOccupancyArray.length - 1]
          : null
      if (lastEntry && lastEntry.unitType === thisEntry.unitType) {
        if (lastEntry.max < thisEntry.max) {
          lastEntry.max = thisEntry.max
        }
        if (lastEntry.min < thisEntry.min) {
          lastEntry.min = thisEntry.min
        }
      } else {
        uniqueOccupancyArray.push(thisEntry)
      }
    })

    occupancyData = uniqueOccupancyArray.map((unitSummary) => {
      let occupancy = ""

      if (unitSummary.max == null) {
        occupancy = `at least ${unitSummary.min} ${
          unitSummary.min == 1 ? t("t.person") : t("t.people")
        }`
      } else if (unitSummary.max > 1) {
        occupancy = `${unitSummary.min}-${unitSummary.max} ${
          unitSummary.max == 1 ? t("t.person") : t("t.people")
        }`
      } else {
        occupancy = `1 ${t("t.person")}`
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
  const unitsSummarized = listing.property.unitsSummarized
  if (unitsSummarized && unitsSummarized.unitTypes.includes("SRO")) {
    return unitsSummarized.unitTypes.length == 1
      ? t("listings.occupancyDescriptionAllSro")
      : t("listings.occupancyDescriptionSomeSro")
  } else {
    return t("listings.occupancyDescriptionNoSro")
  }
}
