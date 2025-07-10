import * as React from "react"
import { StackedTableRow, StandardTableData, t } from "@bloom-housing/ui-components"
import { Listing, UnitGroup, UnitType, UnitTypeEnum } from "../types/backend-swagger"

export const getOccupancy = (minOcc?: number | null, maxOcc?: number | null) => {
  if (minOcc && maxOcc && minOcc < maxOcc) {
    return `${minOcc}-${maxOcc} ${t("t.people")}`
  }
  if (minOcc && maxOcc && minOcc === maxOcc) {
    return `${minOcc} ${minOcc === 1 ? t("t.person") : t("t.people")}`
  }
  if (!minOcc && maxOcc) {
    return t("t.noMoreThan", {
      amount: `${maxOcc} ${maxOcc === 1 ? t("t.person") : t("t.people")}`,
    })
  }
  if (minOcc && !maxOcc) {
    return t("t.atLeast", {
      amount: `${minOcc} ${minOcc === 1 ? t("t.person") : t("t.people")}`,
    })
  }
  return t("t.n/a")
}

export const occupancyTable = (listing: Listing): StandardTableData => {
  let occupancyData: StandardTableData = []
  if (listing.unitsSummarized && listing.unitsSummarized.byUnitType) {
    occupancyData = listing.unitsSummarized.byUnitType.map((unitSummary) => {
      const occupancy = getOccupancy(unitSummary.occupancyRange.min, unitSummary.occupancyRange.max)

      return {
        unitType: {
          content: <strong>{t("listings.unitTypes." + unitSummary.unitTypes.name)}</strong>,
        },
        occupancy: { content: occupancy },
      }
    })
  }

  return occupancyData
}

export const stackedOccupancyTable = (listing: Listing) => {
  if (listing.unitsSummarized && listing.unitsSummarized.byUnitType) {
    return listing.unitsSummarized.byUnitType.map((unitSummary) => {
      const occupancy = getOccupancy(unitSummary.occupancyRange.min, unitSummary.occupancyRange.max)

      return {
        unitType: {
          cellText: t("listings.unitTypes." + unitSummary.unitTypes.name),
        },
        occupancy: { cellText: occupancy },
      }
    })
  } else return []
}

export const stackedUnitGroupsOccupancyTable = (listing: Listing) => {
  const getUnitTypeString = (unitTypes: UnitType[]) => {
    return unitTypes.reduce((acc, curr, index) => {
      return index > 0
        ? `${acc}, ${t("listings.unitTypes." + curr.name)}`
        : t("listings.unitTypes." + curr.name)
    }, "")
  }

  const mappedUnits = Object.values(
    listing.unitGroups?.reduce((acc, unitGroup) => {
      const key =
        unitGroup.unitTypes
          ?.map((unitType) => unitType.name)
          .sort()
          .join("") || ""

      if (!key) {
        return acc
      }

      const current = acc[key]
      acc[key] = current
        ? {
            ...current,
            minOccupancy: Math.min(
              current.minOccupancy ?? Infinity,
              unitGroup.minOccupancy ?? Infinity
            ),
            maxOccupancy: Math.max(
              current.maxOccupancy ?? -Infinity,
              unitGroup.maxOccupancy ?? -Infinity
            ),
          }
        : unitGroup

      return acc
    }, {} as Record<string, UnitGroup>) ?? {}
  )

  const sortedUnitGroups = mappedUnits
    ?.sort((a, b) => {
      if (a.unitTypes && b.unitTypes) {
        return (
          a.unitTypes.sort((c, d) => c.numBedrooms - d.numBedrooms)[0].numBedrooms -
          b.unitTypes.sort((e, f) => e.numBedrooms - f.numBedrooms)[0].numBedrooms
        )
      }
      return 0
    })
    .filter((unitGroup) => unitGroup.maxOccupancy || unitGroup.minOccupancy)

  const tableRows = sortedUnitGroups?.reduce<Record<string, StackedTableRow>[]>((acc, curr) => {
    const unitTypeString = getUnitTypeString(curr?.unitTypes || [])
    const occupancyString = getOccupancy(curr.minOccupancy, curr.maxOccupancy)
    if (occupancyString) {
      acc.push({
        unitType: {
          cellText: unitTypeString,
        },
        occupancy: { cellText: occupancyString },
      })
    }
    return acc
  }, [])
  return tableRows
}

export const getOccupancyDescription = (listing: Listing, enableUnitGroups?: boolean) => {
  if (enableUnitGroups) {
    const hasSRO = listing.unitGroups?.some((unitGroup) =>
      unitGroup.unitTypes?.some((unitType) => unitType.name === UnitTypeEnum.SRO)
    )
    const unitTypes = listing.unitGroups?.map((unitGroup) => unitGroup.unitTypes)
    if (hasSRO) {
      return unitTypes?.length === 1
        ? t("listings.occupancyDescriptionAllSro")
        : t("listings.occupancyDescriptionSomeSro")
    } else {
      return t("listings.occupancyDescriptionNoSro")
    }
  } else {
    const unitsSummarized = listing.unitsSummarized
    if (
      unitsSummarized &&
      unitsSummarized.unitTypes &&
      unitsSummarized.unitTypes.map((unitType) => unitType.name).includes(UnitTypeEnum.SRO)
    ) {
      return unitsSummarized.unitTypes.length === 1
        ? t("listings.occupancyDescriptionAllSro")
        : t("listings.occupancyDescriptionSomeSro")
    } else {
      return t("listings.occupancyDescriptionNoSro")
    }
  }
}
