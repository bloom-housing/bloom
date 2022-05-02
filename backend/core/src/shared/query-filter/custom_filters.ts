import { WhereExpression } from "typeorm"
import { ListingMarketingTypeEnum } from "../../../types"

export function addAvailabilityQuery(qb: WhereExpression, filterValue: string) {
  const val = filterValue?.split(",")
  const whereClause = []
  const inputArgs: Record<string, number | boolean | ListingMarketingTypeEnum> = {}
  val.forEach((option) => {
    switch (option) {
      case "vacantUnits":
        whereClause.push("unitgroups.total_available >= :vacantUnits")
        inputArgs.vacantUnits = 1
        return
      case "openWaitlist":
        whereClause.push("coalesce(unitgroups.open_waitlist, false) = :openWaitlist")
        inputArgs.openWaitlist = true
        return
      case "closedWaitlist":
        whereClause.push("coalesce(unitgroups.open_waitlist, false) = :closedWaitlist")
        inputArgs.closedWaitlist = false
        return
      case "comingSoon":
        whereClause.push("listings.marketing_type = :marketing_type")
        inputArgs.marketing_type = ListingMarketingTypeEnum.comingSoon
        return
      default:
        return
    }
  })
  qb.andWhere(`(${whereClause.join(" OR ")})`, { ...inputArgs })
}

export function addBedroomsQuery(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("unitTypes.name IN (:...unitTypes) ", {
      unitTypes: val,
    })
  }
  return
}

export function addMinAmiPercentageFilter(
  qb: WhereExpression,
  filterValue: number,
  includeNulls?: boolean
) {
  const whereParameterName = "amiPercentage_unitGroups"
  const whereParameterName2 = "amiPercentage_listings"

  // Check the listing.ami_percentage field iff the field is not set on the Unit Groups table.
  qb.andWhere(
    `(("unitGroupsAmiLevels"."ami_percentage" IS NOT NULL AND "unitGroupsAmiLevels"."ami_percentage" >= :${whereParameterName}) ` +
      `OR ("unitGroupsAmiLevels"."ami_percentage" IS NULL AND listings.ami_percentage_max >= :${whereParameterName2})
      ${
        includeNulls
          ? `OR "unitGroupsAmiLevels"."ami_percentage" is NULL AND listings.ami_percentage_max is NULL`
          : ""
      })`,
    {
      [whereParameterName]: filterValue,
      [whereParameterName2]: filterValue,
    }
  )
  return
}

export function addFavoritedFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("listings.id IN (:...favoritedListings) ", {
      favoritedListings: val,
    })
  }
  return
}

export function addProgramFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("programs.id IN (:...communityPrograms) ", {
      communityPrograms: val,
    })
  }
  return
}

export function addRegionFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("property.region IN (:...region) ", {
      region: val,
    })
  }
  return
}

export function addAccessibilityFilter(qb: WhereExpression, filterValue: string) {
  let val = filterValue.split(",").filter((elem) => !!elem)
  const whereClause = val
    .map((key) => {
      return `listing_features.${key} = true`
    })
    .join(" OR ")
  qb.andWhere(`(${whereClause})`)
  return
}
